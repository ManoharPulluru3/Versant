import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import http from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

process.env.DB_PATH = path.join(mkdtempSync(path.join(tmpdir(), 'versant-')), 'db.json')
process.env.JWT_SECRET = 'test-secret'
process.env.VERSAN_FRESH = '1'

const { createApp } = await import('../src/app.js')

function listen(app) {
  const server = http.createServer(app)
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

async function call(base, path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json()
  return { status: response.status, data }
}

test('student login, hidden answers, and scored attempt', async () => {
  const server = await listen(await createApp())
  const { port } = server.address()
  const base = `http://127.0.0.1:${port}/api/v1`

  const denied = await call(base, '/home')
  assert.equal(denied.status, 401)

  const bad = await call(base, '/auth/login', {
    method: 'POST',
    body: { identifier: 'EW20260421', password: 'wrong' },
  })
  assert.equal(bad.status, 401)

  const login = await call(base, '/auth/login', {
    method: 'POST',
    body: { identifier: 'EW20260421', password: 'Student@123' },
  })
  assert.equal(login.status, 200)
  assert.equal(login.data.user.name, 'Emma Wilson')
  const token = login.data.token

  const activity = await call(base, '/practice/listening/listen-respond', { token })
  assert.equal(activity.status, 200)
  assert.equal(activity.data.activity.questions.length, 3)
  assert.equal('answer' in activity.data.activity.questions[0], false)

  const attempt = await call(base, '/practice/listening/listen-respond/attempts', {
    method: 'POST',
    token,
    body: {
      answers: [
        { questionId: 'listen-respond-q1', optionId: 'B' },
        { questionId: 'listen-respond-q2', optionId: 'A' },
        { questionId: 'listen-respond-q3', optionId: 'C' },
      ],
    },
  })
  assert.equal(attempt.status, 201)
  assert.equal(attempt.data.correct, 3)
  assert.equal(attempt.data.score, 100)

  const tests = await call(base, '/tests', { token })
  assert.equal(tests.data.items.length, 2)

  server.close()
})

test('admin can create a listening activity and assign a test', async () => {
  const server = await listen(await createApp())
  const { port } = server.address()
  const base = `http://127.0.0.1:${port}/api/v1`

  const login = await call(base, '/auth/admin/login', {
    method: 'POST',
    body: { email: 'admin@elytedu.com', password: 'Admin@123' },
  })
  assert.equal(login.status, 200)
  const token = login.data.token

  const created = await call(base, '/admin/activities', {
    method: 'POST',
    token,
    body: {
      title: 'Campus announcement',
      description: 'A short notice',
      duration: '4 min',
      audioLabel: 'Notice',
      audioSeconds: 12,
      questionSeconds: 30,
      questions: [
        {
          prompt: 'Where is the notice posted?',
          answer: 'A',
          options: [
            { text: 'On the library board' },
            { text: 'In the car park' },
          ],
        },
      ],
    },
  })
  assert.equal(created.status, 201)
  assert.equal(created.data.activity.questions[0].answer, 'A')

  const students = await call(base, '/admin/students', { token })
  const emma = students.data.students.find((item) => item.studentId === 'EW20260421')
  const assigned = await call(base, '/admin/tests/level-assessment/assign', {
    method: 'POST',
    token,
    body: { studentIds: [emma.id] },
  })
  assert.equal(assigned.status, 200)
  assert.equal(assigned.data.created, 0)

  server.close()
})

test('new listening tasks score without changing multiple choice', async () => {
  const server = await listen(await createApp())
  const { port } = server.address()
  const base = `http://127.0.0.1:${port}/api/v1`
  const admin = await call(base, '/auth/admin/login', {
    method: 'POST',
    body: { email: 'admin@elytedu.com', password: 'Admin@123' },
  })
  const student = await call(base, '/auth/login', {
    method: 'POST',
    body: { identifier: 'EW20260421', password: 'Student@123' },
  })
  const token = admin.data.token
  const studentToken = student.data.token

  const created = await call(base, '/admin/activities', {
    method: 'POST',
    token,
    body: {
      title: 'Listen and type the notice',
      description: 'Type the sentence you hear',
      duration: '3 min',
      audioLabel: 'Announcement',
      kind: 'type',
      questions: [
        {
          type: 'type',
          prompt: 'Type exactly what you hear.',
          spoken: 'The placement interview will begin at ten thirty tomorrow morning.',
        },
      ],
    },
  })
  assert.equal(created.status, 201)
  const activityId = created.data.activity.id
  assert.equal(created.data.activity.kind, 'type')
  assert.equal('expected' in created.data.activity.questions[0], true)

  const hidden = await call(base, `/practice/listening/${activityId}`, { token: studentToken })
  assert.equal(hidden.status, 200)
  assert.equal('expected' in hidden.data.activity.questions[0], false)
  assert.equal(hidden.data.activity.questions[0].type, 'type')

  const typed = await call(base, `/practice/listening/${activityId}/attempts`, {
    method: 'POST',
    token: studentToken,
    body: {
      durationSeconds: 40,
      answers: [
        {
          questionId: hidden.data.activity.questions[0].id,
          text: 'The placement interview will begin at ten thirty tomorrow morning!',
        },
      ],
    },
  })
  assert.equal(typed.status, 201)
  assert.equal(typed.data.score, 100)
  assert.equal(typed.data.review[0].words.every((word) => word.ok), true)

  const missed = await call(base, `/practice/listening/${activityId}/attempts`, {
    method: 'POST',
    token: studentToken,
    body: {
      answers: [{ questionId: hidden.data.activity.questions[0].id, text: 'The placement interview will begin tomorrow' }],
    },
  })
  assert.equal(missed.status, 201)
  assert.ok(missed.data.score < 100)
  assert.equal(missed.data.review[0].words.find((word) => word.word === 'morning').ok, false)

  const recall = await call(base, '/admin/activities', {
    method: 'POST',
    token,
    body: {
      title: 'Recall the interview',
      description: 'Remember the details',
      duration: '4 min',
      audioLabel: 'Announcement',
      kind: 'recall',
      questions: [
        {
          type: 'recall',
          prompt: 'Fill in what you remember.',
          fields: [
            { label: 'Person', answer: 'Ravi' },
            { label: 'Company', answer: 'ABC Technologies' },
            { label: 'Day', answer: 'Thursday' },
          ],
        },
      ],
    },
  })
  assert.equal(recall.status, 201)
  const recallId = recall.data.activity.id
  const recallStudent = await call(base, `/practice/listening/${recallId}`, { token: studentToken })
  assert.equal('answer' in recallStudent.data.activity.questions[0].fields[0], false)
  const recallAttempt = await call(base, `/practice/listening/${recallId}/attempts`, {
    method: 'POST',
    token: studentToken,
    body: {
      answers: [
        {
          questionId: recallStudent.data.activity.questions[0].id,
          fields: [
            { id: recallStudent.data.activity.questions[0].fields[0].id, text: 'ravi' },
            { id: recallStudent.data.activity.questions[0].fields[1].id, text: 'ABC Technologies' },
            { id: recallStudent.data.activity.questions[0].fields[2].id, text: 'Friday' },
          ],
        },
      ],
    },
  })
  assert.equal(recallAttempt.status, 201)
  assert.equal(recallAttempt.data.score, 67)

  const classic = await call(base, '/practice/listening/listen-respond/attempts', {
    method: 'POST',
    token: studentToken,
    body: {
      answers: [
        { questionId: 'listen-respond-q1', optionId: 'B' },
        { questionId: 'listen-respond-q2', optionId: 'A' },
        { questionId: 'listen-respond-q3', optionId: 'C' },
      ],
    },
  })
  assert.equal(classic.status, 201)
  assert.equal(classic.data.correct, 3)
  assert.equal(classic.data.score, 100)

  const shapes = await call(base, '/admin/activities', {
    method: 'POST',
    token,
    body: {
      title: 'Mixed listening checks',
      description: 'Blank, match, true or false, and identify',
      duration: '4 min',
      audioLabel: 'Reading',
      kind: 'answering',
      questions: [
        { type: 'blank', prompt: 'The meeting is at ____.', answer: 'ten thirty|10:30' },
        {
          type: 'match',
          prompt: 'Match the pairs.',
          pairs: [
            { id: 'p1', left: 'Monday', right: 'Library' },
            { id: 'p2', left: 'Tuesday', right: 'Lab' },
          ],
        },
        { type: 'truefalse', prompt: 'The lab is on Tuesday.', answer: 'A' },
        {
          type: 'identify',
          prompt: 'Choose the word you heard.',
          spoken: 'ship',
          answer: 'A',
          options: [{ text: 'ship' }, { text: 'sheep' }, { text: 'chip' }],
        },
      ],
    },
  })
  assert.equal(shapes.status, 201)
  const mixedId = shapes.data.activity.id
  const mixed = await call(base, `/practice/listening/${mixedId}`, { token: studentToken })
  const [blank, match, truth, identify] = mixed.data.activity.questions
  assert.equal(blank.type, 'blank')
  assert.equal('answer' in blank, false)
  assert.equal(match.left.length, 2)
  const mixedAttempt = await call(base, `/practice/listening/${mixedId}/attempts`, {
    method: 'POST',
    token: studentToken,
    body: {
      answers: [
        { questionId: blank.id, text: '10:30' },
        { questionId: match.id, pairs: [{ leftId: 'p1', rightId: 'p1' }, { leftId: 'p2', rightId: 'p2' }] },
        { questionId: truth.id, optionId: 'A' },
        { questionId: identify.id, optionId: 'B' },
      ],
    },
  })
  assert.equal(mixedAttempt.status, 201)
  assert.equal(mixedAttempt.data.correct, 3)
  assert.equal(mixedAttempt.data.total, 4)

  const spoken = await call(base, '/admin/activities', {
    method: 'POST',
    token,
    body: {
      title: 'Respond to the manager',
      description: 'Speak your own reply',
      duration: '3 min',
      audioLabel: 'Conversation',
      kind: 'respond',
      questions: [{ type: 'respond', prompt: 'Your manager moved the deadline to tomorrow. Respond.' }],
    },
  })
  assert.equal(spoken.status, 201)
  const respondAttempt = await call(base, `/practice/listening/${spoken.data.activity.id}/attempts`, {
    method: 'POST',
    token: studentToken,
    body: { answers: [{ questionId: spoken.data.activity.questions[0].id, responseAudioId: 'missing' }] },
  })
  assert.equal(respondAttempt.status, 201)
  assert.equal(respondAttempt.data.score, null)
  assert.equal(respondAttempt.data.pending, true)

  server.close()
})
