import { judgeSpokenReply } from './ai.js'
import { grade, passMark, questionsFor } from './domain.js'
import { getMedia } from './store.js'
import { transcribeAudio } from './speech.js'

function needsScore(attempt) {
  if (attempt.pending) return true
  if (attempt.score == null && (attempt.answers || []).some((answer) => answer.responseAudioId)) return true
  return (attempt.answers || []).some((answer) => answer.evaluationStatus === 'pending' && answer.responseAudioId)
}

async function hear(row) {
  if (typeof row.transcript === 'string') return row.transcript
  const media = row.audioFile ? await getMedia(row.audioFile) : null
  if (!media) return null
  try {
    const result = await transcribeAudio(media.data, row.audioFile, media.contentType)
    return result.script
  } catch (error) {
    if (String(error?.message || '').includes('No speech')) return ''
    throw error
  }
}

export async function reevaluatePending(db) {
  db.speechResponses = db.speechResponses ?? []
  const report = []
  for (const attempt of db.attempts) {
    if (!needsScore(attempt)) continue
    const activity = db.activities.find((item) => item.id === attempt.activityId)
    if (!activity) continue
    const questions = questionsFor(db, activity.id)
    let changed = false
    for (const answer of attempt.answers || []) {
      if (!answer.responseAudioId) continue
      if (answer.evaluationStatus === 'scored' && answer.correct != null) continue
      const question = questions.find((item) => item.id === answer.questionId)
      if (!question || (question.type !== 'repeat' && question.type !== 'respond')) continue
      let row = db.speechResponses.find((item) => item.id === answer.responseAudioId && item.questionId === question.id)
      if (!row) {
        row = {
          id: answer.responseAudioId,
          studentId: attempt.studentId,
          activityId: activity.id,
          questionId: question.id,
          audioFile: null,
          transcript: null,
          evaluation: null,
        }
        db.speechResponses.push(row)
      }
      if (!row.audioFile) {
        const names = ['.m4a', '.mp3', '.wav', '.webm'].map((extension) => `${answer.responseAudioId}${extension}`)
        for (const name of names) {
          const media = await getMedia(name)
          if (media) {
            row.audioFile = name
            break
          }
        }
      }
      try {
        const transcript = await hear(row)
        if (transcript == null) continue
        row.transcript = transcript
        if (question.type === 'respond') {
          row.evaluation = await judgeSpokenReply({
            prompt: question.prompt,
            scenario: question.spoken || activity.script || '',
            transcript,
          })
        }
        changed = true
      } catch (error) {
        report.push({ id: attempt.id, title: activity.title, error: error.message })
      }
    }
    if (!changed) continue
    const speech = db.speechResponses.filter((item) => item.studentId === attempt.studentId && item.activityId === activity.id)
    const graded = grade(
      questions,
      (attempt.answers || []).map((answer) => ({
        questionId: answer.questionId,
        optionId: answer.optionId,
        text: answer.text,
        responseAudioId: answer.responseAudioId,
        pairs: answer.pairs,
        fields: answer.fields,
      })),
      speech,
    )
    attempt.answers = graded.review.map((item) => ({
      questionId: item.questionId,
      optionId: item.optionId ?? null,
      correct: item.correct,
      ...(item.text != null ? { text: item.text } : {}),
      ...(item.responseAudioId ? { responseAudioId: item.responseAudioId } : {}),
      ...(item.evaluationStatus ? { evaluationStatus: item.evaluationStatus } : {}),
      ...(item.accuracy != null ? { accuracy: item.accuracy } : {}),
      ...(item.words ? { words: item.words, extra: item.extra ?? [] } : {}),
      ...(item.evaluation ? { evaluation: item.evaluation } : {}),
      ...(item.fields ? { fields: item.fields } : {}),
      ...(item.pairs ? { pairs: item.pairs } : {}),
    }))
    attempt.correct = graded.correct
    attempt.total = graded.total
    attempt.score = graded.score
    attempt.pending = Boolean(graded.pending)
    attempt.passed = graded.score == null ? null : graded.score >= passMark(db)
    report.push({
      id: attempt.id,
      title: activity.title,
      score: attempt.score,
      pending: attempt.pending,
      note: attempt.answers.find((item) => item.evaluation)?.evaluation?.note || attempt.answers.find((item) => item.text)?.text || '',
    })
  }
  return report
}
