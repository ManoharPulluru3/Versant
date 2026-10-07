const MODEL = 'openai/gpt-oss-120b'
const LETTERS = ['A', 'B', 'C', 'D']

function fail(message) {
  const error = new Error(message)
  error.status = 422
  throw error
}

function parseJson(text) {
  const cleaned = String(text ?? '')
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    fail('The writing service returned something that could not be used. Try again.')
  }
}

async function groqJson(messages, { temperature = 0.5, maxTokens = 1800 } = {}) {
  const key = process.env.GROQ_API_KEY
  if (!key) fail('AI writing is not configured')

  let response
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        messages,
      }),
      signal: AbortSignal.timeout(90000),
    })
  } catch (cause) {
    const error = new Error('AI writing timed out. Try again.')
    error.status = 422
    error.cause = cause
    throw error
  }

  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    console.error('Groq writing failed', response.status, JSON.stringify(body).slice(0, 500))
    fail('Could not write that just now. Try again.')
  }
  const content = body.choices?.[0]?.message?.content
  if (!content || !String(content).trim()) fail('The writing service returned an empty result. Try again.')
  return parseJson(content)
}

export function normalizeScript(value) {
  const script = String(value ?? '').replace(/\r\n/g, '\n').trim()
  if (script.length < 40) fail('The script was too short. Try a clearer topic.')
  return script.slice(0, 4000)
}

function optionText(option) {
  return String(option?.text ?? option?.label ?? option ?? '').replace(/\s+/g, ' ').trim()
}

function letterFromValue(value, options) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  const letter = raw.toUpperCase()
  if (LETTERS.includes(letter)) return letter
  const match = options.findIndex((option) => option && option.toLowerCase() === raw.toLowerCase())
  return match >= 0 ? LETTERS[match] : ''
}

export function normalizeAiQuestions(raw) {
  const list = Array.isArray(raw) ? raw : raw?.questions
  if (!Array.isArray(list) || list.length === 0) fail('No questions were returned. Try again.')
  return list.slice(0, 10).map((item, index) => {
    const prompt = String(item?.prompt ?? item?.question ?? '').replace(/\s+/g, ' ').trim()
    if (prompt.length < 8) fail(`Question ${index + 1} was incomplete. Try again.`)
    const source = Array.isArray(item?.options) ? item.options : Array.isArray(item?.choices) ? item.choices : []
    const options = source
      .slice(0, 4)
      .map((option) => optionText(option))
      .filter(Boolean)
    if (options.length < 2) fail(`Question ${index + 1} needs at least two choices. Try again.`)
    while (options.length < 4) options.push('')
    const markedText = optionText(source.find((option) => option?.correct === true || option?.isCorrect === true))
    let answer = letterFromValue(
      item?.answer ?? item?.correct ?? item?.correctAnswer ?? item?.correct_answer ?? item?.key,
      options,
    )
    const indexValue = item?.answer_index ?? item?.correctIndex
    const choiceIndex = Number(indexValue)
    if (!answer && indexValue !== undefined && indexValue !== null && indexValue !== '' && Number.isInteger(choiceIndex) && options[choiceIndex]) {
      answer = LETTERS[choiceIndex]
    }
    if (!answer && markedText) {
      const marked = options.findIndex((option) => option.toLowerCase() === markedText.toLowerCase())
      if (marked >= 0) answer = LETTERS[marked]
    }
    if (!answer) answer = 'A'
    const answerIndex = LETTERS.indexOf(answer)
    if (!options[answerIndex]) fail(`Question ${index + 1} has no correct choice. Try again.`)
    return {
      prompt: prompt.slice(0, 800),
      answer,
      options: options.map((text) => ({ text: text.slice(0, 400) })),
    }
  })
}

export function distributeAnswers(questions, random = Math.random) {
  const start = Math.floor(random() * LETTERS.length)
  return questions.map((question, index) => {
    const texts = question.options.map((option) => option.text)
    const correctIndex = LETTERS.indexOf(question.answer)
    const safeIndex = correctIndex >= 0 && texts[correctIndex] ? correctIndex : 0
    const correctText = texts[safeIndex]
    const target = (start + index) % LETTERS.length
    const rest = texts.filter((_, optionIndex) => optionIndex !== safeIndex)
    const next = Array.from({ length: texts.length }, () => '')
    let restIndex = 0
    for (let slot = 0; slot < next.length; slot += 1) {
      next[slot] = slot === target ? correctText : rest[restIndex++] ?? ''
    }
    return {
      ...question,
      answer: LETTERS[target],
      options: next.map((text) => ({ text })),
    }
  })
}

export async function generateScript({ brief, kind, level }) {
  const topic = String(brief ?? '').trim()
  if (topic.length < 3) fail('Describe what the clip should be about.')
  const conversation = kind === 'conversation'
  const result = await groqJson(
    [
      {
        role: 'system',
        content: [
          'You write spoken English for a college listening test in India.',
          'Reply with JSON only: {"script":"..."}',
          'The script is read aloud as one recording. Do not add a title, instructions, or markdown.',
          conversation
            ? 'Write a conversation. Use two first names. Put each turn on its own line as "Name: sentence". Include 8 to 12 short turns. Include a time, a place, and one clear reason.'
            : 'Write one continuous passage for a single narrator. Do not use speaker labels. Use 120 to 170 words. Include a time, a place, and one clear reason.',
          'Use clear spoken English. Do not invent a question list.',
        ].join(' '),
      },
      {
        role: 'user',
        content: `Level: ${String(level || 'Intermediate').slice(0, 40)}. Topic: ${topic.slice(0, 500)}`,
      },
    ],
    { temperature: 0.7, maxTokens: 1200 },
  )
  return { script: normalizeScript(result.script) }
}

export function questionCountFromInstruction(instruction) {
  const match = String(instruction ?? '').match(/\b(\d{1,2})\b/)
  if (!match) return null
  const count = Number(match[1])
  if (!count) return null
  return Math.min(10, Math.max(1, count))
}

export async function generateQuestions({ script, instruction, count, level }) {
  const source = String(script ?? '').trim()
  if (source.length < 40) fail('Add a script first. Questions are written from that script only.')
  const ask = String(instruction ?? '').trim() || (count ? `Write ${count} questions` : '')
  if (ask.length < 2) fail('Say how many questions to write.')
  const wanted = questionCountFromInstruction(ask) ?? Math.min(10, Math.max(1, Number(count) || 3))
  const result = await groqJson(
    [
      {
        role: 'system',
        content: [
          'You write multiple-choice questions for a listening test.',
          'Reply with JSON only: {"questions":[{"prompt":"","answer":"C","options":["","","",""]}]}',
          `Write exactly ${wanted} questions.`,
          'Use only facts that are stated in the script. Do not change or repeat the whole script.',
          'Each question has exactly 4 options. "answer" is the letter A, B, C, or D of the one correct option.',
          'Do not put the correct option in A for every question. Use a different correct letter across the set, including B, C, and D.',
          'The other options must be plausible and wrong. Do not make the correct text always the first option.',
          'Phrase prompts as questions a student can answer after hearing the clip. Do not say "according to the script".',
        ].join(' '),
      },
      {
        role: 'user',
        content: `Level: ${String(level || 'Intermediate').slice(0, 40)}\nRequest: ${ask.slice(0, 400)}\n\nScript:\n${source.slice(0, 4000)}`,
      },
    ],
    { temperature: 0.6, maxTokens: 2200 },
  )
  const questions = distributeAnswers(normalizeAiQuestions(result).slice(0, wanted))
  if (questions.length < 1) fail('No questions were returned. Try again.')
  return { questions }
}

function clampScore(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return null
  return Math.max(0, Math.min(100, Math.round(number)))
}

export async function judgeSpokenReply({ prompt, scenario, transcript }) {
  const spoken = String(transcript ?? '').replace(/\s+/g, ' ').trim()
  if (!spoken) {
    return {
      relevance: 0,
      appropriateness: 0,
      grammar: 0,
      vocabulary: 0,
      overall: 0,
      evidence: '',
      note: 'No speech was detected in the recording.',
    }
  }

  const result = await groqJson(
    [
      {
        role: 'system',
        content: [
          'You score one spoken reply using only the transcript of what the student actually said.',
          'Do not assume words that are not in the transcript.',
          'Reply with JSON only: {"relevance":0,"appropriateness":0,"grammar":0,"vocabulary":0,"overall":0,"evidence":"","note":""}',
          'Scores are integers from 0 to 100.',
          'evidence must be a short quote copied from the transcript.',
          'relevance: does the reply address the situation?',
          'appropriateness: is it a suitable thing to say?',
          'grammar and vocabulary: judge only the words in the transcript.',
          'overall is your combined communication score for this reply, not an average you invent beyond the transcript.',
          'If the transcript is noise or off-topic, use low scores.',
        ].join(' '),
      },
      {
        role: 'user',
        content: `Situation:\n${String(prompt || '').slice(0, 800)}\n\nWhat the student heard:\n${String(scenario || '').slice(0, 800)}\n\nTranscript of the student:\n${spoken.slice(0, 2000)}`,
      },
    ],
    { temperature: 0.1, maxTokens: 500 },
  )

  const evidence = String(result?.evidence ?? '').replace(/\s+/g, ' ').trim().slice(0, 240)
  const spokenKey = spoken.toLowerCase()
  const quoted = evidence.toLowerCase()
  const sharesWords = spokenKey.split(' ').filter((word) => word.length > 3 && quoted.includes(word))
  const grounded = !evidence || sharesWords.length > 0 || spokenKey.includes(quoted)
  const scores = {
    relevance: clampScore(result?.relevance),
    appropriateness: clampScore(result?.appropriateness),
    grammar: clampScore(result?.grammar),
    vocabulary: clampScore(result?.vocabulary),
    overall: clampScore(result?.overall),
  }
  if (!grounded || scores.overall == null) {
    return {
      relevance: 0,
      appropriateness: 0,
      grammar: 0,
      vocabulary: 0,
      overall: 0,
      evidence,
      note: 'The recording was heard, but the score was not accepted because it did not refer to the student\'s words.',
    }
  }
  return {
    ...scores,
    evidence,
    note: String(result?.note ?? '').replace(/\s+/g, ' ').trim().slice(0, 280),
  }
}
