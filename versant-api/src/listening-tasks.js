export const ACTIVITY_KINDS = ['answering', 'repeat', 'type', 'respond', 'recall', 'identify']

export const QUESTION_TYPES = ['mcq', 'blank', 'match', 'truefalse', 'repeat', 'type', 'respond', 'recall', 'identify']

export function activityKind(value) {
  return ACTIVITY_KINDS.includes(value) ? value : 'answering'
}

export function questionType(value) {
  return QUESTION_TYPES.includes(value) ? value : 'mcq'
}

export function normalizeSpeech(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function compareWords(expected, actual) {
  const wanted = normalizeSpeech(expected).split(' ').filter(Boolean)
  const heard = normalizeSpeech(actual).split(' ').filter(Boolean)
  const used = new Set()
  const words = wanted.map((word) => {
    const index = heard.findIndex((item, itemIndex) => !used.has(itemIndex) && item === word)
    if (index < 0) return { word, ok: false }
    used.add(index)
    return { word, ok: true }
  })
  const extra = heard.filter((_, index) => !used.has(index))
  const hit = words.filter((item) => item.ok).length
  const accuracy = wanted.length === 0 ? 0 : Math.round((hit / wanted.length) * 100)
  return { words, extra, accuracy }
}

function givenAnswer(answers, questionId) {
  return (Array.isArray(answers) ? answers : []).find((item) => item?.questionId === questionId) ?? {}
}

export function gradeTask(question, answers, speech = []) {
  const type = questionType(question.type)
  const given = givenAnswer(answers, question.id)
  const base = { questionId: question.id, prompt: question.prompt, type }

  if (type === 'truefalse' || type === 'identify') {
    const optionId = given.optionId ?? null
    const correct = optionId === question.answer
    return { ...base, optionId, answer: question.answer, correct, points: correct ? 1 : 0, evaluationStatus: 'scored' }
  }

  if (type === 'blank') {
    const text = String(given.text ?? '')
    const accepted = String(question.answer ?? '')
      .split('|')
      .map((item) => normalizeSpeech(item))
      .filter(Boolean)
    const correct = accepted.includes(normalizeSpeech(text))
    return { ...base, text, correct, points: correct ? 1 : 0, evaluationStatus: 'scored' }
  }

  if (type === 'match') {
    const sent = Array.isArray(given.pairs) ? given.pairs : []
    const pairs = (question.pairs ?? []).map((pair) => ({
      id: pair.id,
      left: pair.left,
      right: pair.right,
      correct: sent.find((item) => item.leftId === pair.id)?.rightId === pair.id,
    }))
    const correct = pairs.length > 0 && pairs.every((pair) => pair.correct)
    return { ...base, pairs, correct, points: correct ? 1 : 0, evaluationStatus: 'scored' }
  }

  if (type === 'recall') {
    const sent = Array.isArray(given.fields) ? given.fields : []
    const fields = (question.fields ?? []).map((field) => {
      const text = String(sent.find((item) => item.id === field.id)?.text ?? '')
      return {
        id: field.id,
        label: field.label,
        text,
        expected: field.answer,
        correct: normalizeSpeech(text) === normalizeSpeech(field.answer),
      }
    })
    const hit = fields.filter((field) => field.correct).length
    const points = fields.length === 0 ? 0 : hit / fields.length
    return {
      ...base,
      fields,
      correct: fields.length > 0 && hit === fields.length,
      points,
      accuracy: Math.round(points * 100),
      evaluationStatus: 'scored',
    }
  }

  if (type === 'type' || type === 'repeat') {
    const row =
      type === 'repeat'
        ? speech.find((item) => item.id === given.responseAudioId && item.questionId === question.id)
        : null
    const source = type === 'repeat' ? row?.transcript : given.text
    if (type === 'repeat' && !source) {
      return {
        ...base,
        responseAudioId: given.responseAudioId ?? null,
        correct: null,
        points: null,
        evaluationStatus: 'pending',
      }
    }
    const compared = compareWords(question.expected || question.spoken || '', source ?? '')
    return {
      ...base,
      text: type === 'type' ? String(given.text ?? '') : undefined,
      responseAudioId: type === 'repeat' ? row?.id ?? null : undefined,
      words: compared.words,
      extra: compared.extra,
      accuracy: compared.accuracy,
      correct: compared.accuracy === 100,
      points: compared.accuracy / 100,
      evaluationStatus: 'scored',
    }
  }

  if (type === 'respond') {
    const row = speech.find((item) => item.id === given.responseAudioId && item.questionId === question.id)
    const evaluation = row?.evaluation
    if (!evaluation || evaluation.overall == null) {
      return {
        ...base,
        responseAudioId: row?.id ?? given.responseAudioId ?? null,
        text: row?.transcript || '',
        correct: null,
        points: null,
        evaluationStatus: 'pending',
      }
    }
    const overall = Math.max(0, Math.min(100, Math.round(Number(evaluation.overall))))
    return {
      ...base,
      responseAudioId: row?.id ?? given.responseAudioId ?? null,
      text: row?.transcript || '',
      evaluation,
      accuracy: overall,
      correct: overall >= 60,
      points: overall / 100,
      evaluationStatus: 'scored',
    }
  }

  return {
    ...base,
    responseAudioId: given.responseAudioId ?? null,
    correct: null,
    points: null,
    evaluationStatus: 'pending',
  }
}

export function presentTaskQuestion(question, { includeAnswers = false } = {}) {
  const type = questionType(question.type)
  const audioUrl = question.audioFile
    ? `/media/${question.audioFile}?v=${encodeURIComponent(question.audioUpdatedAt || '1')}`
    : null
  const base = {
    id: question.id,
    type,
    prompt: question.prompt,
    prepareSeconds: Number(question.prepareSeconds) || 0,
    audioUrl,
  }
  if (type === 'mcq' || type === 'identify' || type === 'truefalse') {
    return { ...base, options: question.options ?? [], ...(includeAnswers ? { answer: question.answer } : {}) }
  }
  if (type === 'blank') {
    return { ...base, ...(includeAnswers ? { answer: question.answer } : {}) }
  }
  if (type === 'match') {
    const pairs = question.pairs ?? []
    return {
      ...base,
      left: pairs.map((pair) => ({ id: pair.id, text: pair.left })),
      right: pairs.map((pair) => ({ id: pair.id, text: pair.right })),
      ...(includeAnswers ? { pairs } : {}),
    }
  }
  if (type === 'recall') {
    return {
      ...base,
      fields: (question.fields ?? []).map((field) => ({
        id: field.id,
        label: field.label,
        ...(includeAnswers ? { answer: field.answer } : {}),
      })),
    }
  }
  if (includeAnswers) {
    return { ...base, spoken: question.spoken ?? '', expected: question.expected ?? question.spoken ?? '' }
  }
  return base
}
