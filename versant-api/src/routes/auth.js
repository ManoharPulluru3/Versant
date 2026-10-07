import { Router } from 'express'
import { checkPassword, endSession, hashPassword, issueSession, requireUser, revokeUserSessions, rotateSession, signToken } from '../auth.js'
import { publicUser } from '../domain.js'
import { sendResetCode } from '../mail.js'
import { codesMatch, hashResetCode, makeResetCode, recentlySent, resetExpiry, resetStillValid } from '../password-reset.js'
import { load, save } from '../store.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res, next) => {
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

  const session = issueSession(user)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ ...session, user: publicUser(user) })
})

authRouter.post('/refresh', async (req, res, next) => {
  const session = rotateSession(req.body?.refreshToken)
  if (!session || session.revoked) {
    if (session?.revoked) {
      try {
        await save()
      } catch (error) {
        return next(error)
      }
    }
    return res.status(401).json({ error: 'Sign in required' })
  }
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  const { user, ...tokens } = session
  res.json({ ...tokens, user: publicUser(user) })
})

authRouter.post('/logout', async (req, res, next) => {
  const header = req.headers.authorization ?? ''
  const accessToken = header.startsWith('Bearer ') ? header.slice(7) : ''
  endSession(accessToken, req.body?.refreshToken)
  try {
    await save()
  } catch (error) {
    return next(error)
  }
  res.json({ ok: true })
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

function findStudent(identifier) {
  const key = String(identifier ?? '').trim().toLowerCase()
  if (!key) return null
  return load().users.find((item) => {
    if (item.role !== 'student') return false
    return item.email.toLowerCase() === key || item.studentId?.toLowerCase() === key
  })
}

const RESET_MESSAGE = 'If that account exists, we sent a 6-digit code to its email. The code expires in 15 minutes.'

authRouter.post('/forgot-password', async (req, res) => {
  const identifier = String(req.body?.identifier ?? '').trim()
  if (!identifier) return res.status(400).json({ error: 'Enter your student ID or email' })

  const user = findStudent(identifier)
  if (!user) return res.json({ ok: true, message: RESET_MESSAGE })
  if (recentlySent(user.resetSentAt) && user.resetCodeHash && resetStillValid(user.resetExpiresAt)) {
    return res.json({ ok: true, message: RESET_MESSAGE })
  }

  const code = makeResetCode()
  user.resetCodeHash = hashResetCode(code)
  user.resetExpiresAt = resetExpiry()
  delete user.resetSentAt
  await save()

  try {
    await sendResetCode({ to: user.email, name: user.name, code })
  } catch (error) {
    delete user.resetCodeHash
    delete user.resetExpiresAt
    await save()
    throw error
  }

  user.resetSentAt = new Date().toISOString()
  await save()
  res.json({ ok: true, message: RESET_MESSAGE })
})

authRouter.post('/reset-password', async (req, res) => {
  const identifier = String(req.body?.identifier ?? '').trim()
  const code = String(req.body?.code ?? '').trim()
  const nextPassword = String(req.body?.password ?? '')
  if (!identifier || !code) return res.status(400).json({ error: 'Enter the code from your email' })
  if (nextPassword.length < 8) return res.status(400).json({ error: 'Use at least 8 characters' })
  if (nextPassword.length > 72) return res.status(400).json({ error: 'Use at most 72 characters' })

  const user = findStudent(identifier)
  if (!user || !codesMatch(code, user.resetCodeHash) || !resetStillValid(user.resetExpiresAt)) {
    return res.status(400).json({ error: 'That code is incorrect or has expired' })
  }

  user.passwordHash = hashPassword(nextPassword)
  delete user.resetCodeHash
  delete user.resetExpiresAt
  delete user.resetSentAt
  revokeUserSessions(user.id)
  await save()
  res.json({ ok: true })
})
