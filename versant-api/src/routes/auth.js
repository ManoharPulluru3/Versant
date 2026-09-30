import { Router } from 'express'
import { checkPassword, requireUser, signToken } from '../auth.js'
import { publicUser } from '../domain.js'
import { load } from '../store.js'

export const authRouter = Router()

authRouter.post('/login', (req, res) => {
  const identifier = String(req.body?.identifier ?? '').trim().toLowerCase()
  const password = String(req.body?.password ?? '')
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Student ID and password are required' })
  }

  const user = load().users.find((item) => {
    if (item.role !== 'student') return false
    return item.email.toLowerCase() === identifier || item.studentId?.toLowerCase() === identifier
  })

  if (!user || !checkPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Those sign-in details do not match' })
  }

  res.json({ token: signToken(user), user: publicUser(user) })
})

authRouter.post('/admin/login', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const password = String(req.body?.password ?? '')
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = load().users.find((item) => item.role === 'admin' && item.email.toLowerCase() === email)
  if (!user || !checkPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Those sign-in details do not match' })
  }

  res.json({ token: signToken(user), user: publicUser(user) })
})

authRouter.get('/me', requireUser(), (req, res) => {
  res.json({ user: publicUser(req.user) })
})
