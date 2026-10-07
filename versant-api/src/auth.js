import { createHash, randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { id } from './domain.js'
import { load } from './store.js'

function secret() {
  return process.env.JWT_SECRET || 'versant-dev-secret-change-me'
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

export function checkPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash)
}

const ACCESS_SECONDS = 15 * 60
const REFRESH_DAYS = 30

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, typ: 'access' }, secret(), { expiresIn: '12h' })
}

function hashToken(token) {
  return createHash('sha256').update(`${secret()}:${token}`).digest('hex')
}

function sessions(db = load()) {
  if (!Array.isArray(db.refreshTokens)) db.refreshTokens = []
  return db.refreshTokens
}

export function issueSession(user) {
  const refreshToken = randomBytes(32).toString('base64url')
  const record = {
    id: id('rt'),
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    revokedAt: null,
  }
  sessions().push(record)
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role, typ: 'access', sid: record.id },
    secret(),
    { expiresIn: ACCESS_SECONDS },
  )
  return {
    token: accessToken,
    accessToken,
    refreshToken,
    expiresIn: ACCESS_SECONDS,
  }
}

export function rotateSession(refreshToken) {
  const current = sessions().find((item) => item.tokenHash === hashToken(String(refreshToken ?? '')))
  if (!current || Date.parse(current.expiresAt) <= Date.now()) return null
  if (current.revokedAt) {
    revokeUserSessions(current.userId)
    return { revoked: true }
  }
  const db = load()
  const user = db.users.find((item) => item.id === current.userId && item.status !== 'disabled')
  if (!user) return null
  current.revokedAt = new Date().toISOString()
  const next = issueSession(user)
  current.replacedBy = sessions().at(-1)?.id ?? null
  return { ...next, user }
}

export function revokeRefreshToken(refreshToken) {
  const current = sessions().find((item) => item.tokenHash === hashToken(String(refreshToken ?? '')))
  if (current && !current.revokedAt) current.revokedAt = new Date().toISOString()
}

export function revokeSession(sessionId) {
  const current = sessions().find((item) => item.id === sessionId)
  if (current && !current.revokedAt) current.revokedAt = new Date().toISOString()
}

export function endSession(accessToken, refreshToken) {
  revokeRefreshToken(refreshToken)
  if (!accessToken) return
  try {
    const payload = jwt.verify(accessToken, secret(), { ignoreExpiration: true })
    if (payload?.sid) revokeSession(payload.sid)
  } catch {
    // A bad access token does not block revoking the refresh token.
  }
}

export function revokeUserSessions(userId) {
  const stamp = new Date().toISOString()
  for (const item of sessions()) {
    if (item.userId === userId && !item.revokedAt) item.revokedAt = stamp
  }
}

function sessionIsLive(sessionId, userId) {
  const current = sessions().find((item) => item.id === sessionId && item.userId === userId)
  return Boolean(current && !current.revokedAt && Date.parse(current.expiresAt) > Date.now())
}

export function requireUser(role) {
  return (req, res, next) => {
    const header = req.headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'Sign in required' })

    try {
      const payload = jwt.verify(token, secret())
      if (payload.typ && payload.typ !== 'access') {
        return res.status(401).json({ error: 'Sign in required' })
      }
      const user = load().users.find((item) => item.id === payload.sub)
      if (!user) return res.status(401).json({ error: 'Sign in required' })
      if (payload.sid && !sessionIsLive(payload.sid, user.id)) {
        return res.status(401).json({ error: 'Sign in required' })
      }
      if (role && user.role !== role) return res.status(403).json({ error: 'You do not have access to this' })
      req.user = user
      next()
    } catch {
      res.status(401).json({ error: 'Sign in required' })
    }
  }
}
