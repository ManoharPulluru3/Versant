import { Router } from 'express'
import multer from 'multer'
import { hashPassword, requireUser } from '../auth.js'
import { id, now, presentActivity, questionsFor, requireString } from '../domain.js'
import { generateQuestions, generateScript } from '../ai.js'
import { describeAudio, limitScript, resolveVoice, synthesizeSpeech, transcribeAudio, VOICES } from '../speech.js'
import { load, putMedia, save } from '../store.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
})

const AUDIO_TYPES = {
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/wave': '.wav',
  'audio/mp4': '.m4a',
  'audio/m4a': '.m4a',
  'audio/x-m4a': '.m4a',
  'audio/aac': '.aac',
  'audio/webm': '.webm',
  'audio/ogg': '.ogg',
  'audio/flac': '.flac',
  'audio/opus': '.opus',
}

function audioExtension(file) {
  if (AUDIO_TYPES[file.mimetype]) return AUDIO_TYPES[file.mimetype]
  const match = String(file.originalname ?? '').toLowerCase().match(/\.(mp3|wav|m4a|aac|webm|ogg|flac|opus|mp4)$/)
  if (!match) return null
  if (match[1] === 'mp4') return '.m4a'
  return `.${match[1]}`
}

function safeAudioName(file, extension) {
  const base = String(file.originalname ?? 'recording').replace(/[^a-zA-Z0-9._-]/g, '')
  if (base.toLowerCase().endsWith(extension)) return base.slice(0, 80)
  return `${base.slice(0, 70) || 'recording'}${extension}`
}

export const adminRouter = Router()

adminRouter.use(requireUser('admin'))

function normalizeQuestions(raw, activityId) {
  if (!Array.isArray(raw) || raw.length === 0) {
    const error = new Error('Add at least one question')
    error.status = 400
    throw error
  }
  return raw.map((item, index) => {
    const options = Array.isArray(item.options) ? item.options.slice(0, 4) : []
    if (options.length < 2) {
      const error = new Error(`Question ${index + 1} needs at least two choices`)
      error.status = 400
      throw error
    }
    const cleaned = options.map((option, optionIndex) => ({
      id: ['A', 'B', 'C', 'D'][optionIndex],
      text: requireString(option.text, `Choice ${optionIndex + 1}`, 400),
    }))
    const answer = String(item.answer ?? 'A')
    if (!cleaned.some((option) => option.id === answer)) {
      const error = new Error(`Question ${index + 1} needs a correct choice`)
      error.status = 400
      throw error
    }
    return {
      id: typeof item.id === 'string' && item.id ? item.id : id('q'),
      activityId,
      order: index + 1,
      prompt: requireString(item.prompt, `Question ${index + 1}`, 800),
      answer,
      options: cleaned,
    }
  })
}

function activityFields(body, current = {}) {
  return {
    title: requireString(body.title ?? current.title, 'Title', 120),
    description: requireString(body.description ?? current.description, 'Description', 280),
    duration: requireString(body.duration ?? current.duration ?? '5 min', 'Duration', 20),
    level: requireString(body.level ?? current.level ?? 'Intermediate', 'Level', 40),
    iconBg: current.iconBg ?? '#DCEBDD',
    iconColor: current.iconColor ?? '#1F6B4F',
    audioLabel: requireString(body.audioLabel ?? current.audioLabel ?? 'Audio', 'Audio label', 40),
    headline: requireString(body.headline ?? current.headline ?? body.title, 'Headline', 140),
    subtitle: requireString(body.subtitle ?? current.subtitle ?? body.description, 'Subtitle', 280),
    audioSeconds: Math.min(600, Math.max(1, Number(body.audioSeconds ?? current.audioSeconds ?? 15))),
    script: limitScript(body.script ?? current.script ?? '').script,
    audioFile: current.audioFile ?? null,
    audioSource: current.audioSource ?? null,
    audioUpdatedAt: current.audioUpdatedAt ?? null,
    voice: resolveVoice(body.voice ?? current.voice).id,
    maxListens: 2,
    questionSeconds: Math.min(180, Math.max(10, Number(body.questionSeconds ?? current.questionSeconds ?? 45))),
    tip: requireString(body.tip ?? current.tip ?? 'Listen for the main idea, then choose the best answer.', 'Tip', 280),
    published: body.published == null ? current.published !== false : Boolean(body.published),
  }
}

adminRouter.get('/dashboard', async (_req, res, next) => {
  const db = load()
  const scores = db.attempts.map((item) => item.score)
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0
  res.json({
    students: db.users.filter((item) => item.role === 'student').length,
    activities: db.activities.length,
    tests: db.tests.length,
    assignments: db.assignments.length,
    attempts: db.attempts.length,
    inProgress: db.assignments.filter((item) => item.status === 'in_progress').length,
    averageScore: average,
  })
})

adminRouter.get('/students', async (_req, res, next) => {
  const db = load()
  res.json({
    students: db.users
      .filter((item) => item.role === 'student')
      .map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        college: student.college,
        program: student.program,
        assignments: db.assignments.filter((item) => item.studentId === student.id).length,
        attempts: db.attempts.filter((item) => item.studentId === student.id).length,
      })),
  })
})

adminRouter.post('/students', async (req, res, next) => {
  const db = load()
  const email = requireString(req.body?.email, 'Email', 120).toLowerCase()
  const studentId = requireString(req.body?.studentId, 'Student ID', 40)
  const password = String(req.body?.password ?? '')
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  if (db.users.some((item) => item.email.toLowerCase() === email || item.studentId?.toLowerCase() === studentId.toLowerCase())) {
    return res.status(409).json({ error: 'A student with that email or ID already exists' })
  }
  const student = {
    id: id('user'),
    role: 'student',
    name: requireString(req.body?.name, 'Name', 80),
    email,
    studentId,
    college: requireString(req.body?.college ?? load().settings.collegeName, 'College', 80),
    program: requireString(req.body?.program ?? 'English Communication', 'Program', 80),
    passwordHash: hashPassword(password),
    settings: { rememberDevice: true, autoPlayAudio: false, language: 'English' },
    createdAt: now(),
  }
  db.users.push(student)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.status(201).json({ id: student.id })
})

adminRouter.delete('/students/:id', async (req, res, next) => {
  const db = load()
  const student = db.users.find((item) => item.id === req.params.id && item.role === 'student')
  if (!student) return res.status(404).json({ error: 'Student not found' })
  db.users = db.users.filter((item) => item.id !== student.id)
  db.assignments = db.assignments.filter((item) => item.studentId !== student.id)
  db.attempts = db.attempts.filter((item) => item.studentId !== student.id)
  db.notifications = db.notifications.filter((item) => item.studentId !== student.id)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ ok: true })
})

adminRouter.get('/voices', async (_req, res) => {
  res.json({ voices: VOICES })
})

adminRouter.get('/activities', async (_req, res, next) => {
  const db = load()
  res.json({
    activities: db.activities.map((activity) => ({
      ...presentActivity(db, activity, { includeAnswers: true }),
      questionCount: questionsFor(db, activity.id).length,
    })),
  })
})

adminRouter.post('/activities', async (req, res, next) => {
  const db = load()
  const activityId = id('act')
  const activity = { id: activityId, ...activityFields(req.body), createdAt: now() }
  const questions = normalizeQuestions(req.body?.questions, activityId)
  db.activities.push(activity)
  db.questions.push(...questions)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.status(201).json({ activity: presentActivity(db, activity, { includeAnswers: true }) })
})

adminRouter.post('/ai/script', async (req, res, next) => {
  try {
    const draft = await generateScript({
      brief: req.body?.brief,
      kind: req.body?.kind === 'conversation' ? 'conversation' : 'passage',
      level: req.body?.level,
    })
    res.json(draft)
  } catch (error) {
    return next(error)
  }
})

adminRouter.post('/ai/questions', async (req, res, next) => {
  try {
    const draft = await generateQuestions({
      script: req.body?.script,
      instruction: req.body?.instruction,
      count: req.body?.count,
      level: req.body?.level,
    })
    res.json(draft)
  } catch (error) {
    return next(error)
  }
})

adminRouter.post('/speech/preview', async (req, res, next) => {
  try {
    const script = requireString(req.body?.script, 'Script', 4000)
    const voice = resolveVoice(req.body?.voice)
    const speech = await synthesizeSpeech(script, voice.id)
    res.setHeader('Content-Type', speech.contentType)
    res.setHeader('Cache-Control', 'no-store')
    res.send(speech.data)
  } catch (error) {
    return next(error)
  }
})

adminRouter.post('/activities/:id/speech', async (req, res, next) => {
  const db = load()
  const activity = db.activities.find((item) => item.id === req.params.id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })
  try {
    const script = requireString(req.body?.script ?? activity.script, 'Script', 4000)
    const voice = resolveVoice(req.body?.voice ?? activity.voice)
    const speech = await synthesizeSpeech(script, voice.id)
    const filename = `${activity.id}.mp3`
    await putMedia(filename, speech.data, speech.contentType)
    activity.script = script
    activity.voice = voice.id
    activity.audioSource = 'tts'
    activity.audioFile = filename
    activity.audioSeconds = speech.seconds
    activity.audioUpdatedAt = now()
    await save()
    res.json({ activity: presentActivity(db, activity, { includeAnswers: true }) })
  } catch (error) {
    return next(error)
  }
})

adminRouter.post('/speech/transcribe', upload.single('audio'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'Choose an audio file' })
  const extension = audioExtension(req.file)
  if (!extension) return res.status(400).json({ error: 'Upload an mp3, wav, m4a, or webm recording' })
  try {
    const transcript = await transcribeAudio(req.file.buffer, safeAudioName(req.file, extension), req.file.mimetype)
    res.json({ script: transcript.script, seconds: transcript.seconds, trimmed: transcript.trimmed })
  } catch (error) {
    return next(error)
  }
})

adminRouter.post('/activities/:id/audio', upload.single('audio'), async (req, res, next) => {
  const db = load()
  const activity = db.activities.find((item) => item.id === req.params.id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })
  if (!req.file) return res.status(400).json({ error: 'Choose an audio file' })
  const extension = audioExtension(req.file)
  if (!extension) return res.status(400).json({ error: 'Upload an mp3, wav, m4a, or webm recording' })
  try {
    const described = await describeAudio(req.file.buffer, req.file.mimetype)
    const filename = `${activity.id}${extension}`
    await putMedia(filename, req.file.buffer, req.file.mimetype)
    let script = limitScript(req.body?.script ?? '').script
    if (!script) {
      const transcript = await transcribeAudio(req.file.buffer, safeAudioName(req.file, extension), req.file.mimetype)
      script = transcript.script
    }
    activity.script = script
    activity.audioSource = 'upload'
    activity.audioFile = filename
    activity.audioSeconds = described.seconds
    activity.audioUpdatedAt = now()
    await save()
    res.json({ activity: presentActivity(db, activity, { includeAnswers: true }) })
  } catch (error) {
    return next(error)
  }
})

adminRouter.put('/activities/:id', async (req, res, next) => {
  const db = load()
  const activity = db.activities.find((item) => item.id === req.params.id)
  if (!activity) return res.status(404).json({ error: 'Activity not found' })
  Object.assign(activity, activityFields(req.body, activity))
  if (req.body?.questions) {
    db.questions = db.questions.filter((item) => item.activityId !== activity.id)
    db.questions.push(...normalizeQuestions(req.body.questions, activity.id))
  }
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ activity: presentActivity(db, activity, { includeAnswers: true }) })
})

adminRouter.delete('/activities/:id', async (req, res, next) => {
  const db = load()
  const used = db.tests.some((test) => test.activityIds.includes(req.params.id))
  if (used) return res.status(409).json({ error: 'Remove this activity from tests before deleting it' })
  db.activities = db.activities.filter((item) => item.id !== req.params.id)
  db.questions = db.questions.filter((item) => item.activityId !== req.params.id)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ ok: true })
})

adminRouter.get('/tests', async (_req, res, next) => {
  const db = load()
  res.json({
    tests: db.tests.map((test) => ({
      ...test,
      assigned: db.assignments.filter((item) => item.testId === test.id).length,
      questionCount: test.activityIds.reduce((sum, activityId) => sum + questionsFor(db, activityId).length, 0),
    })),
    activities: db.activities.map((activity) => ({ id: activity.id, title: activity.title })),
  })
})

adminRouter.post('/tests', async (req, res, next) => {
  const db = load()
  const activityIds = Array.isArray(req.body?.activityIds) ? req.body.activityIds.filter((item) => db.activities.some((activity) => activity.id === item)) : []
  if (activityIds.length === 0) return res.status(400).json({ error: 'Choose at least one listening activity' })
  const test = {
    id: id('test'),
    title: requireString(req.body?.title, 'Title', 120),
    description: requireString(req.body?.description, 'Description', 280),
    badge: requireString(req.body?.badge ?? 'Listening test', 'Badge', 40),
    durationMinutes: Math.min(180, Math.max(5, Number(req.body?.durationMinutes ?? 20))),
    dueDate: requireString(req.body?.dueDate, 'Due date', 20),
    status: req.body?.status === 'draft' ? 'draft' : 'published',
    activityIds,
    createdAt: now(),
  }
  db.tests.push(test)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.status(201).json({ test })
})

adminRouter.put('/tests/:id', async (req, res, next) => {
  const db = load()
  const test = db.tests.find((item) => item.id === req.params.id)
  if (!test) return res.status(404).json({ error: 'Test not found' })
  const activityIds = Array.isArray(req.body?.activityIds)
    ? req.body.activityIds.filter((item) => db.activities.some((activity) => activity.id === item))
    : test.activityIds
  if (activityIds.length === 0) return res.status(400).json({ error: 'Choose at least one listening activity' })
  test.title = requireString(req.body?.title ?? test.title, 'Title', 120)
  test.description = requireString(req.body?.description ?? test.description, 'Description', 280)
  test.badge = requireString(req.body?.badge ?? test.badge, 'Badge', 40)
  test.durationMinutes = Math.min(180, Math.max(5, Number(req.body?.durationMinutes ?? test.durationMinutes)))
  test.dueDate = requireString(req.body?.dueDate ?? test.dueDate, 'Due date', 20)
  test.status = req.body?.status === 'draft' ? 'draft' : 'published'
  test.activityIds = activityIds
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ test })
})

adminRouter.delete('/tests/:id', async (req, res, next) => {
  const db = load()
  db.tests = db.tests.filter((item) => item.id !== req.params.id)
  db.assignments = db.assignments.filter((item) => item.testId !== req.params.id)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ ok: true })
})

adminRouter.post('/tests/:id/assign', async (req, res, next) => {
  const db = load()
  const test = db.tests.find((item) => item.id === req.params.id)
  if (!test) return res.status(404).json({ error: 'Test not found' })
  const studentIds = Array.isArray(req.body?.studentIds) ? req.body.studentIds : []
  let created = 0
  for (const studentId of studentIds) {
    const student = db.users.find((item) => item.id === studentId && item.role === 'student')
    if (!student) continue
    const existing = db.assignments.find((item) => item.testId === test.id && item.studentId === student.id)
    if (existing) continue
    db.assignments.push({
      id: id('asg'),
      testId: test.id,
      studentId: student.id,
      status: 'assigned',
      assignedAt: now(),
    })
    db.notifications.unshift({
      id: id('note'),
      studentId: student.id,
      title: 'New listening test',
      body: `${test.title} is due ${test.dueDate}.`,
      read: false,
      createdAt: now(),
    })
    created += 1
  }
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ created })
})

adminRouter.get('/results', async (_req, res, next) => {
  const db = load()
  const results = db.attempts
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((attempt) => {
      const student = db.users.find((item) => item.id === attempt.studentId)
      const activity = db.activities.find((item) => item.id === attempt.activityId)
      const test = db.tests.find((item) => item.id === attempt.testId)
      return {
        id: attempt.id,
        student: student?.name ?? 'Student',
        studentId: student?.studentId ?? '',
        kind: attempt.kind,
        title: test?.title ?? activity?.title ?? 'Listening',
        section: activity?.title ?? '',
        score: attempt.score,
        correct: attempt.correct,
        total: attempt.total,
        createdAt: attempt.createdAt,
        answers: attempt.answers,
      }
    })
  res.json({ results, passMark: db.settings.passMark })
})

adminRouter.get('/monitoring', async (_req, res, next) => {
  const db = load()
  const sessions = db.assignments
    .filter((item) => item.status === 'in_progress')
    .map((assignment) => {
      const student = db.users.find((item) => item.id === assignment.studentId)
      const test = db.tests.find((item) => item.id === assignment.testId)
      const done = db.attempts.filter((item) => item.assignmentId === assignment.id).length
      return {
        id: assignment.id,
        student: student?.name ?? 'Student',
        test: test?.title ?? 'Test',
        done,
        total: test?.activityIds.length ?? 0,
      }
    })
  res.json({ sessions })
})

adminRouter.get('/analytics', async (_req, res, next) => {
  const db = load()
  const byActivity = db.activities.map((activity) => {
    const attempts = db.attempts.filter((item) => item.activityId === activity.id)
    const average = attempts.length
      ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length)
      : 0
    return { id: activity.id, title: activity.title, attempts: attempts.length, average }
  })
  res.json({ byActivity, passMark: db.settings.passMark })
})

adminRouter.get('/settings', async (_req, res, next) => {
  res.json({ settings: load().settings })
})

adminRouter.put('/settings', async (req, res, next) => {
  const db = load()
  db.settings = {
    collegeName: requireString(req.body?.collegeName ?? db.settings.collegeName, 'College name', 80),
    supportEmail: requireString(req.body?.supportEmail ?? db.settings.supportEmail, 'Support email', 120),
    passMark: Math.min(100, Math.max(0, Number(req.body?.passMark ?? db.settings.passMark))),
  }
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ settings: db.settings })
})
