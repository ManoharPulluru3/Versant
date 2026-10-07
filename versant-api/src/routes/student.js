import { Router } from 'express'
import multer from 'multer'
import { checkPassword, hashPassword, revokeUserSessions } from '../auth.js'
import {
  assessmentScores,
  formatDue,
  grade,
  levelFor,
  listeningScore,
  passMark,
  reviewStats,
  now,
  presentActivity,
  publicUser,
  questionsFor,
  requireString,
} from '../domain.js'
import { load, putMedia, save } from '../store.js'
import { requireUser } from '../auth.js'
import { describeAudio, transcribeAudio } from '../speech.js'
import { judgeSpokenReply } from '../ai.js'
import { activityKind } from '../listening-tasks.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
})

const AUDIO_TYPES = {
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/wav': '.wav',
  'audio/mp4': '.m4a',
  'audio/m4a': '.m4a',
  'audio/x-m4a': '.m4a',
  'audio/aac': '.aac',
  'audio/webm': '.webm',
}

export const studentRouter = Router()

studentRouter.use(requireUser('student'))

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function assignmentResult(db, assignment) {
  const linked = db.attempts.filter((item) => item.assignmentId === assignment.id && item.kind === 'assessment')
  const attempts = linked.length
    ? linked
    : db.attempts.filter(
        (item) => item.studentId === assignment.studentId && item.testId === assignment.testId && item.kind === 'assessment',
      )
  const correct = attempts.reduce((sum, item) => sum + Number(item.correct || 0), 0)
  const total = attempts.reduce((sum, item) => sum + Number(item.total || 0), 0)
  const completedAt = attempts.map((item) => item.createdAt).filter(Boolean).sort().at(-1) ?? null
  return {
    score: total ? Math.round((correct / total) * 100) : null,
    correct: attempts.length ? correct : null,
    total: attempts.length ? total : null,
    completedAt,
  }
}

function stampAssignment(assignment, result) {
  assignment.score = result.score
  assignment.correct = result.correct
  assignment.total = result.total
  assignment.completedAt = result.completedAt
}

function recordAttempt(db, user, { kind, activity, test, assignment, answers, durationSeconds }) {
  const questions = questionsFor(db, activity.id)
  const speech = (db.speechResponses ?? []).filter((item) => item.studentId === user.id && item.activityId === activity.id)
  const graded = grade(questions, answers, speech)
  const attempt = {
    id: `att_${Date.now().toString(36)}`,
    studentId: user.id,
    kind,
    activityId: activity.id,
    activityKind: activityKind(activity.kind),
    testId: test?.id ?? null,
    assignmentId: assignment?.id ?? null,
    durationSeconds: Math.max(0, Math.round(Number(durationSeconds) || 0)),
    answers: graded.review.map((item) => ({
      questionId: item.questionId,
      optionId: item.optionId ?? null,
      correct: item.correct,
      ...(item.evaluation ? { evaluation: item.evaluation } : {}),
      ...(item.text != null ? { text: item.text } : {}),
      ...(item.responseAudioId ? { responseAudioId: item.responseAudioId } : {}),
      ...(item.evaluationStatus ? { evaluationStatus: item.evaluationStatus } : {}),
      ...(item.accuracy != null ? { accuracy: item.accuracy } : {}),
      ...(item.words ? { words: item.words, extra: item.extra ?? [] } : {}),
      ...(item.fields ? { fields: item.fields } : {}),
      ...(item.pairs ? { pairs: item.pairs } : {}),
    })),
    correct: graded.correct,
    total: graded.total,
    score: graded.score,
    pending: Boolean(graded.pending),
    passed: graded.score == null ? null : graded.score >= passMark(db),
    attemptNumber:
      db.attempts.filter((item) => item.studentId === user.id && item.activityId === activity.id && item.kind === kind).length + 1,
    createdAt: now(),
  }
  db.attempts.push(attempt)
  db.notifications.unshift({
    id: `note_${attempt.id}`,
    studentId: user.id,
    title: kind === 'assessment' ? 'Listening section saved' : 'Practice saved',
    body: graded.pending
      ? `${activity.title}: response saved. Speech evaluation is still pending.`
      : `${activity.title}: ${graded.correct} of ${graded.total} correct.`,
    read: false,
    createdAt: attempt.createdAt,
  })
  return { attempt, graded }
}

studentRouter.get('/home', async (req, res, next) => {
  const db = load()
  const score = listeningScore(db, req.user.id)
  const level = levelFor(score)
  const upcoming = db.assignments
    .filter((item) => item.studentId === req.user.id && item.status !== 'completed')
    .map((item) => ({ assignment: item, test: db.tests.find((test) => test.id === item.testId) }))
    .find((item) => item.test)

  const recent = db.attempts
    .filter((item) => item.studentId === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((item) => {
      const activity = db.activities.find((activity) => activity.id === item.activityId)
      return {
        id: item.id,
        title: item.kind === 'assessment' ? 'Listening assessment' : 'Listening practice',
        meta: activity?.title ?? 'Listening',
        score: item.score,
        createdAt: item.createdAt,
      }
    })

  res.json({
    greeting: greeting(),
    student: publicUser(req.user),
    unread: db.notifications.filter((item) => item.studentId === req.user.id && !item.read).length,
    upcoming: upcoming?.test
      ? {
          id: upcoming.test.id,
          title: upcoming.test.title,
          description: upcoming.test.description,
          durationMinutes: upcoming.test.durationMinutes,
          dueLabel: `Due ${formatDue(upcoming.test.dueDate)}`,
        }
      : null,
    score,
    level,
    practice: db.activities.filter((item) => item.published).slice(0, 3).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      duration: item.duration,
    })),
    recent,
    todayMinutes: Math.min(15, db.attempts.filter((item) => item.studentId === req.user.id && item.kind === 'practice').length * 3),
    goalMinutes: 15,
  })
})

studentRouter.get('/practice/listening', async (req, res, next) => {
  const db = load()
  const practiceAttempts = db.attempts.filter((item) => item.studentId === req.user.id && item.kind === 'practice')
  const activities = db.activities.filter((item) => item.published).map((item) => {
    const mine = practiceAttempts.filter((attempt) => attempt.activityId === item.id)
    const latest = mine.slice().sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt))).at(-1) ?? null
    return {
      ...presentActivity(db, item),
      completed: mine.length > 0,
      attemptCount: mine.length,
      bestCorrect: latest?.correct ?? null,
      bestTotal: latest?.total ?? null,
    }
  })
  res.json({
    todayMinutes: Math.min(15, practiceAttempts.length * 3),
    goalMinutes: 15,
    activities,
  })
})

studentRouter.get('/practice/listening/:activityId', async (req, res, next) => {
  const db = load()
  const activity = db.activities.find((item) => item.id === req.params.activityId && item.published)
  if (!activity) return res.status(404).json({ error: 'Listening activity not found' })
  res.json({ activity: presentActivity(db, activity) })
})

studentRouter.post('/practice/listening/:activityId/speech', upload.single('audio'), async (req, res, next) => {
  const db = load()
  const activity = db.activities.find((item) => item.id === req.params.activityId && item.published)
  if (!activity) return res.status(404).json({ error: 'Listening activity not found' })
  const questionId = String(req.body?.questionId ?? '')
  const question = questionsFor(db, activity.id).find((item) => item.id === questionId)
  if (!question) return res.status(400).json({ error: 'Choose an item to attach this recording to' })
  if (!req.file) return res.status(400).json({ error: 'Recording is missing' })
  const match = String(req.file.originalname ?? '').toLowerCase().match(/\.(mp3|wav|m4a|aac|webm|ogg|mp4)$/)
  const extension = AUDIO_TYPES[req.file.mimetype] || (match ? (match[1] === 'mp4' ? '.m4a' : `.${match[1]}`) : null)
  if (!extension) return res.status(400).json({ error: 'Use an m4a, mp3, or wav recording' })
  try {
    await describeAudio(req.file.buffer, req.file.mimetype).catch(() => ({ seconds: 0 }))
    const responseId = `resp_${Date.now().toString(36)}`
    const filename = `${responseId}${extension}`
    await putMedia(filename, req.file.buffer, req.file.mimetype || 'audio/mp4')
    let transcript = null
    let evaluation = null
    if (question.type === 'repeat' || question.type === 'respond') {
      try {
        const result = await transcribeAudio(req.file.buffer, `response${extension}`, req.file.mimetype)
        transcript = result.script
      } catch (error) {
        transcript = String(error?.message || '').includes('No speech') ? '' : null
      }
      if (question.type === 'respond' && transcript != null) {
        try {
          evaluation = await judgeSpokenReply({
            prompt: question.prompt,
            scenario: question.spoken || activity.script || '',
            transcript,
          })
        } catch {
          evaluation = null
        }
      }
    }
    db.speechResponses = db.speechResponses ?? []
    db.speechResponses.push({
      id: responseId,
      studentId: req.user.id,
      activityId: activity.id,
      questionId,
      audioFile: filename,
      transcript,
      evaluation,
      createdAt: new Date().toISOString(),
    })
    await save()
    res.status(201).json({
      responseId,
      evaluationStatus: evaluation || (question.type === 'repeat' && transcript) ? 'scored' : 'pending',
    })
  } catch (error) {
    return next(error)
  }
})

studentRouter.post('/practice/listening/:activityId/attempts', async (req, res, next) => {
  const db = load()
  const activity = db.activities.find((item) => item.id === req.params.activityId && item.published)
  if (!activity) return res.status(404).json({ error: 'Listening activity not found' })
  const { attempt, graded } = recordAttempt(db, req.user, {
    kind: 'practice',
    activity,
    answers: req.body?.answers,
    durationSeconds: req.body?.durationSeconds,
  })
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.status(201).json({
    attemptId: attempt.id,
    correct: graded.correct,
    total: graded.total,
    score: graded.score,
    pending: Boolean(graded.pending),
    review: graded.review,
  })
})

studentRouter.get('/tests', async (req, res, next) => {
  const db = load()
  const items = db.assignments
    .filter((item) => item.studentId === req.user.id)
    .map((assignment) => {
      const test = db.tests.find((item) => item.id === assignment.testId)
      if (!test) return null
      const questionCount = test.activityIds.reduce((sum, activityId) => sum + questionsFor(db, activityId).length, 0)
      const result = assignment.status === 'completed' ? assignmentResult(db, assignment) : null
      const completedOn = result?.completedAt ? new Date(result.completedAt) : null
      return {
        assignmentId: assignment.id,
        testId: test.id,
        title: test.title,
        description: test.description,
        badge: test.badge,
        durationMinutes: test.durationMinutes,
        dueLabel: `Due ${formatDue(test.dueDate)}`,
        status: assignment.status,
        questionCount,
        score: result?.score ?? null,
        correct: result?.correct ?? null,
        total: result?.total ?? null,
        completedLabel:
          completedOn && !Number.isNaN(completedOn.getTime())
            ? `Completed ${completedOn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : null,
      }
    })
    .filter(Boolean)

  res.json({
    counts: {
      assigned: items.filter((item) => item.status === 'assigned').length,
      inProgress: items.filter((item) => item.status === 'in_progress').length,
      completed: items.filter((item) => item.status === 'completed').length,
    },
    items,
  })
})

studentRouter.get('/tests/:testId', async (req, res, next) => {
  const db = load()
  const assignment = db.assignments.find((item) => item.studentId === req.user.id && item.testId === req.params.testId)
  const test = db.tests.find((item) => item.id === req.params.testId && item.status === 'published')
  if (!assignment || !test) return res.status(404).json({ error: 'Test not found' })

  const sections = test.activityIds
    .map((activityId) => db.activities.find((item) => item.id === activityId))
    .filter(Boolean)
    .map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      duration: activity.duration,
      questionCount: questionsFor(db, activity.id).length,
      completed: db.attempts.some(
        (item) => item.assignmentId === assignment.id && item.activityId === activity.id,
      ),
    }))

  res.json({
    id: test.id,
    title: test.title,
    description: test.description,
    badge: test.badge,
    durationMinutes: test.durationMinutes,
    dueLabel: `Due ${formatDue(test.dueDate)}`,
    status: assignment.status,
    sections,
  })
})

studentRouter.post('/tests/:testId/attempts', async (req, res, next) => {
  const db = load()
  const assignment = db.assignments.find((item) => item.studentId === req.user.id && item.testId === req.params.testId)
  const test = db.tests.find((item) => item.id === req.params.testId)
  const activity = db.activities.find((item) => item.id === req.body?.activityId)
  if (!assignment || !test || !activity || !test.activityIds.includes(activity.id)) {
    return res.status(404).json({ error: 'Listening section not found' })
  }
  if (db.attempts.some((item) => item.assignmentId === assignment.id && item.activityId === activity.id)) {
    return res.status(409).json({ error: 'This listening section is already submitted' })
  }

  const { attempt, graded } = recordAttempt(db, req.user, {
    kind: 'assessment',
    activity,
    test,
    assignment,
    answers: req.body?.answers,
    durationSeconds: req.body?.durationSeconds,
  })

  const doneIds = new Set(
    db.attempts.filter((item) => item.assignmentId === assignment.id).map((item) => item.activityId),
  )
  const nextActivityId = test.activityIds.find((activityId) => !doneIds.has(activityId)) ?? null
  assignment.status = nextActivityId ? 'in_progress' : 'completed'
  if (!nextActivityId) {
    stampAssignment(assignment, assignmentResult(db, assignment))
    db.notifications.unshift({
      id: `note_done_${attempt.id}`,
      studentId: req.user.id,
      title: 'Test completed',
      body: `${test.title} is finished.`,
      read: false,
      createdAt: now(),
    })
  }
  try {
    await save()
  } catch (error) {
    return next(error)
  }

  const sectionAttempts = db.attempts.filter((item) => item.assignmentId === assignment.id)
  res.status(201).json({
    attemptId: attempt.id,
    correct: graded.correct,
    total: graded.total,
    score: graded.score,
    pending: Boolean(graded.pending),
    review: graded.review,
    testCorrect: sectionAttempts.reduce((sum, item) => sum + (Number(item.correct) || 0), 0),
    testTotal: sectionAttempts.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
    testCompleted: !nextActivityId,
    nextActivityId,
  })
})

studentRouter.get('/progress', async (req, res, next) => {
  const db = load()
  const score = listeningScore(db, req.user.id)
  const level = levelFor(score)
  const assessments = assessmentScores(db, req.user.id)
  const latest = assessments.at(-1)?.score ?? null
  const previous = assessments.at(-2)?.score ?? null
  const history = db.attempts
    .filter((item) => item.studentId === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((item) => {
      const activity = db.activities.find((activity) => activity.id === item.activityId)
      const test = db.tests.find((test) => test.id === item.testId)
      return {
        id: item.id,
        name: test?.title ?? activity?.title ?? 'Listening',
        date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: item.score,
        level: item.score == null ? null : levelFor(item.score).code,
        kind: item.kind,
        activityId: item.activityId ?? null,
        testId: item.testId ?? null,
        correct: item.correct,
        total: item.total,
        passed: item.score == null ? null : item.passed === true || (item.passed == null && item.score >= passMark(db)),
        activityKind: item.activityKind ?? activityKind(activity?.kind),
        durationSeconds: item.durationSeconds ?? null,
        attemptNumber: item.attemptNumber ?? null,
      }
    })
  const mine = db.attempts.filter((item) => item.studentId === req.user.id)

  res.json({
    score,
    level,
    delta: latest != null && previous != null ? latest - previous : null,
    attempts: history.length,
    review: reviewStats(mine, passMark(db)),
    history,
  })
})

studentRouter.get('/notifications', async (req, res, next) => {
  const db = load()
  const items = db.notifications
    .filter((item) => item.studentId === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  res.json({ items, unread: items.filter((item) => !item.read).length })
})

studentRouter.post('/notifications/:id/read', async (req, res, next) => {
  const db = load()
  const note = db.notifications.find((item) => item.id === req.params.id && item.studentId === req.user.id)
  if (!note) return res.status(404).json({ error: 'Notification not found' })
  note.read = true
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ ok: true })
})

studentRouter.patch('/me', async (req, res, next) => {
  const db = load()
  const user = db.users.find((item) => item.id === req.user.id)
  if (req.body?.name != null) user.name = requireString(req.body.name, 'Name', 80)
  if (req.body?.email != null) {
    const email = requireString(req.body.email, 'Email', 120).toLowerCase()
    const taken = db.users.some((item) => item.id !== user.id && item.email.toLowerCase() === email)
    if (taken) return res.status(409).json({ error: 'That email is already in use' })
    user.email = email
  }
  if (req.body?.settings && typeof req.body.settings === 'object') {
    user.settings = {
      ...user.settings,
      rememberDevice: Boolean(req.body.settings.rememberDevice ?? user.settings.rememberDevice),
      autoPlayAudio: Boolean(req.body.settings.autoPlayAudio),
      language: 'English',
    }
  }
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  req.user = user
  res.json({ user: publicUser(user) })
})

studentRouter.post('/me/password', async (req, res, next) => {
  const db = load()
  const user = db.users.find((item) => item.id === req.user.id)
  const currentPassword = String(req.body?.currentPassword ?? '')
  const nextPassword = String(req.body?.newPassword ?? '')
  if (!checkPassword(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'Current password is incorrect' })
  }
  if (nextPassword.length < 8) {
    return res.status(400).json({ error: 'Use at least 8 characters' })
  }
  user.passwordHash = hashPassword(nextPassword)
  revokeUserSessions(user.id)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ ok: true })
})

studentRouter.get('/support', async (req, res, next) => {
  const settings = load().settings
  res.json({
    collegeName: settings.collegeName,
    supportEmail: settings.supportEmail,
  })
})
