import { randomUUID } from 'node:crypto'
import { activityKind, gradeTask, presentTaskQuestion, questionType } from './listening-tasks.js'

export function id(prefix) {
  return `${prefix}_${randomUUID().slice(0, 8)}`
}

export function now() {
  return new Date().toISOString()
}

export function levelFor(score) {
  if (score >= 85) return { code: 'C1', label: 'Advanced' }
  if (score >= 70) return { code: 'B2', label: 'Upper Intermediate' }
  if (score >= 55) return { code: 'B1', label: 'Intermediate' }
  if (score >= 40) return { code: 'A2', label: 'Elementary' }
  return { code: 'A1', label: 'Beginner' }
}

export function publicUser(user) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    studentId: user.studentId ?? null,
    college: user.college ?? null,
    program: user.program ?? null,
    settings: user.settings ?? {},
  }
}

export const LISTENING_CATEGORIES = [
  'Conversation',
  'Reading',
  'Telephone',
  'Product explanation',
  'Announcement',
]

const CATEGORY_ALIASES = {
  conversation: 'Conversation',
  dialogue: 'Conversation',
  reading: 'Reading',
  notice: 'Reading',
  passage: 'Reading',
  telephone: 'Telephone',
  phone: 'Telephone',
  voicemail: 'Telephone',
  call: 'Telephone',
  product: 'Product explanation',
  'product explanation': 'Product explanation',
  announcement: 'Announcement',
}

export function listeningCategory(value) {
  const key = String(value ?? '').trim().toLowerCase()
  return CATEGORY_ALIASES[key] ?? null
}

export function questionsFor(db, activityId) {
  return db.questions
    .filter((question) => question.activityId === activityId)
    .sort((a, b) => a.order - b.order)
}

export function presentActivity(db, activity, { includeAnswers = false } = {}) {
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    duration: activity.duration,
    level: activity.level ?? null,
    iconBg: activity.iconBg,
    iconColor: activity.iconColor,
    audioLabel: activity.audioLabel,
    category: listeningCategory(activity.category) || listeningCategory(activity.audioLabel) || 'Reading',
    headline: activity.headline,
    subtitle: activity.subtitle,
    audioSeconds: activity.audioSeconds,
    audioUrl: activity.audioFile
      ? `/media/${activity.audioFile}?v=${encodeURIComponent(activity.audioUpdatedAt || activity.voice || '1')}`
      : null,
    ...(includeAnswers
      ? {
          script: activity.script ?? '',
          audioSource: activity.audioSource ?? null,
          voice: activity.voice ?? 'en-IN-NeerjaNeural',
        }
      : {}),
    maxListens: activity.maxListens,
    questionSeconds: activity.questionSeconds,
    tip: activity.tip,
    published: activity.published,
    kind: activityKind(activity.kind),
    questions: questionsFor(db, activity.id).map((question) => {
      if (!question.type || question.type === 'mcq') {
        return {
          id: question.id,
          type: 'mcq',
          prompt: question.prompt,
          options: question.options,
          ...(includeAnswers ? { answer: question.answer } : {}),
        }
      }
      return presentTaskQuestion(question, { includeAnswers })
    }),
  }
}

export function grade(questions, answers, speech = []) {
  const task = questions.some((question) => question.type && question.type !== 'mcq')
  if (!task) {
    const review = questions.map((question) => {
      const chosen = answers.find((item) => item.questionId === question.id)?.optionId ?? null
      return {
        questionId: question.id,
        prompt: question.prompt,
        optionId: chosen,
        answer: question.answer,
        correct: chosen === question.answer,
      }
    })
    const correct = review.filter((item) => item.correct).length
    const total = questions.length
    const score = total === 0 ? 0 : Math.round((correct / total) * 100)
    return { review, correct, total, score }
  }

  const review = questions.map((question) => {
    if (!question.type || questionType(question.type) === 'mcq') {
      const chosen = answers.find((item) => item.questionId === question.id)?.optionId ?? null
      const correct = chosen === question.answer
      return {
        questionId: question.id,
        prompt: question.prompt,
        type: 'mcq',
        optionId: chosen,
        answer: question.answer,
        correct,
        points: correct ? 1 : 0,
        evaluationStatus: 'scored',
      }
    }
    return gradeTask(question, answers, speech)
  })
  const decided = review.filter((item) => item.points != null)
  const correct = review.filter((item) => item.correct === true).length
  const total = review.filter((item) => item.correct != null).length
  const score = decided.length === 0 ? null : Math.round((decided.reduce((sum, item) => sum + item.points, 0) / decided.length) * 100)
  return { review, correct, total, score, pending: review.some((item) => item.evaluationStatus === 'pending') }
}

export function listeningScore(db, studentId) {
  const attempts = db.attempts.filter((item) => item.studentId === studentId && item.score != null)
  if (attempts.length === 0) return 0
  const sum = attempts.reduce((total, item) => total + item.score, 0)
  return Math.round(sum / attempts.length)
}

export function passMark(db) {
  const mark = Number(db.settings?.passMark)
  return Number.isFinite(mark) ? mark : 60
}

export function attemptPassed(attempt, mark) {
  if (typeof attempt.passed === 'boolean') return attempt.passed
  if (attempt.score == null) return null
  return Number(attempt.score) >= mark
}

export function reviewStats(attempts, mark) {
  const decided = attempts.filter((item) => attemptPassed(item, mark) != null)
  const total = decided.length
  const successes = decided.filter((item) => attemptPassed(item, mark)).length
  const failures = total - successes
  return {
    attempts: total,
    successes,
    failures,
    successRate: total ? Math.round((successes / total) * 100) : 0,
    failureRate: total ? Math.round((failures / total) * 100) : 0,
    passMark: mark,
  }
}

export function assessmentScores(db, studentId) {
  return db.attempts
    .filter((item) => item.studentId === studentId && item.kind === 'assessment')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function formatDue(isoDate) {
  if (!isoDate) return 'No due date'
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function requireString(value, label, max = 240) {
  if (typeof value !== 'string' || !value.trim()) {
    const error = new Error(`${label} is required`)
    error.status = 400
    throw error
  }
  return value.trim().slice(0, max)
}
