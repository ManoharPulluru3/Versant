import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, secret(), { expiresIn: '12h' })
}

export function requireUser(role) {
  return (req, res, next) => {
    const header = req.headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'Sign in required' })

    try {
      const payload = jwt.verify(token, secret())
      const user = load().users.find((item) => item.id === payload.sub)
      if (!user) return res.status(401).json({ error: 'Sign in required' })
      if (role && user.role !== role) return res.status(403).json({ error: 'You do not have access to this' })
      req.user = user
      next()
    } catch {
      res.status(401).json({ error: 'Sign in required' })
    }
  }
}
