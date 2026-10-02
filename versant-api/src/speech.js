import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'
import { parseBuffer } from 'music-metadata'

export const SCRIPT_LIMIT = 12000
const SPEECH_LIMIT = 4000

export const VOICES = [
  { id: 'en-IN-NeerjaNeural', name: 'Female', gender: 'Female' },
  { id: 'en-IN-PrabhatNeural', name: 'Male', gender: 'Male' },
]

export function resolveVoice(id) {
  return VOICES.find((voice) => voice.id === id) ?? VOICES[0]
}

export function scriptFromTranscript(result) {
  const text = String(result?.text ?? '').replace(/\s+/g, ' ').trim()
  const words = Array.isArray(result?.words) ? result.words : []
  const speakers = new Set(words.map((word) => word?.speaker).filter((speaker) => speaker != null))
  if (speakers.size < 2) return paragraphsFromSegments(result?.segments, text)

  const lines = []
  let speaker = null
  let parts = []
  const flush = () => {
    if (speaker == null || parts.length === 0) return
    lines.push(`Speaker ${Number(speaker) + 1}: ${parts.join(' ').replace(/\s+/g, ' ').trim()}`)
    parts = []
  }
  for (const word of words) {
    const token = String(word?.text ?? '').trim()
    if (!token) continue
    const next = word.speaker ?? 0
    if (speaker !== next) {
      flush()
      speaker = next
    }
    parts.push(token)
  }
  flush()
  return lines.join('\n\n').trim() || text
}

function paragraphsFromSegments(segments, fallback) {
  if (!Array.isArray(segments) || segments.length === 0) return fallback
  const paragraphs = []
  let current = []
  let lastEnd = 0
  for (const segment of segments) {
    const piece = String(segment?.text ?? '').trim()
    if (!piece) continue
    const start = Number(segment.start) || 0
    if (current.length && start - lastEnd > 1.2) {
      paragraphs.push(current.join(' '))
      current = []
    }
    current.push(piece)
    lastEnd = Number(segment.end) || start
  }
  if (current.length) paragraphs.push(current.join(' '))
  return paragraphs.join('\n\n').trim() || fallback
}

export function limitScript(script) {
  const text = String(script ?? '').trim()
  if (text.length <= SCRIPT_LIMIT) return { script: text, trimmed: false }
  return { script: text.slice(0, SCRIPT_LIMIT).trim(), trimmed: true }
}

export async function synthesizeSpeech(text, voiceId) {
  const script = String(text ?? '').trim()
  if (!script) {
    const error = new Error('Add a script to read aloud')
    error.status = 400
    throw error
  }
  if (script.length > SPEECH_LIMIT) {
    const error = new Error('Script must be 4000 characters or less')
    error.status = 400
    throw error
  }

  const tts = new MsEdgeTTS()
  try {
    await tts.setMetadata(resolveVoice(voiceId).id, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)
    const { audioStream } = tts.toStream(script)
    const chunks = []
    for await (const chunk of audioStream) chunks.push(Buffer.from(chunk))
    const data = Buffer.concat(chunks)
    if (data.length < 128) {
      const error = new Error('Speech synthesis did not return audio')
      error.status = 502
      throw error
    }
    const meta = await parseBuffer(data, { mimeType: 'audio/mpeg' }, { duration: true })
    const seconds = Math.max(1, Math.round(meta.format.duration || 1))
    return { data, seconds, contentType: 'audio/mpeg' }
  } finally {
    tts.close()
  }
}

export async function describeAudio(buffer, mimeType) {
  const meta = await parseBuffer(buffer, { mimeType }, { duration: true })
  const seconds = Math.max(1, Math.round(meta.format.duration || 1))
  return { seconds }
}

export async function transcribeAudio(buffer, filename, mimeType) {
  const key = process.env.GROQ_API_KEY
  if (!key) {
    const error = new Error('Transcription is not configured')
    error.status = 422
    throw error
  }

  const form = new FormData()
  form.append('model', 'whisper-large-v3-turbo')
  form.append('language', 'en')
  form.append('response_format', 'verbose_json')
  form.append('timestamp_granularities[]', 'segment')
  form.append('file', new File([buffer], filename || 'recording.mp3', { type: mimeType || 'audio/mpeg' }))

  let response
  try {
    response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form,
      signal: AbortSignal.timeout(120000),
    })
  } catch (cause) {
    const error = new Error('Transcription timed out. Try a shorter recording.')
    error.status = 422
    error.cause = cause
    throw error
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    console.error('Groq speech-to-text failed', response.status, detail.slice(0, 500))
    const error = new Error('Could not transcribe this recording. Use an mp3, wav, or m4a file with clear speech.')
    error.status = 422
    throw error
  }

  const result = await response.json()
  const limited = limitScript(scriptFromTranscript(result))
  if (!limited.script) {
    const error = new Error('No speech was detected in that recording')
    error.status = 422
    throw error
  }
  const seconds = Math.max(1, Math.round(Number(result.duration) || 1))
  return { ...limited, seconds }
}
