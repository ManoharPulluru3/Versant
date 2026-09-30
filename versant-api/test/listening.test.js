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
