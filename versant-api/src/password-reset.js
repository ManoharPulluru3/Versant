import { createHash, randomInt, timingSafeEqual } from 'node:crypto'

const RESET_MINUTES = 15

function pepper() {
  return process.env.JWT_SECRET || 'versant-dev-secret-change-me'
}

export function makeResetCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function hashResetCode(code) {
  return createHash('sha256').update(`${pepper()}:${code}`).digest('hex')
}

export function resetExpiry(from = Date.now()) {
  return new Date(from + RESET_MINUTES * 60 * 1000).toISOString()
}

export function codesMatch(code, hash) {
  if (!hash || !/^\d{6}$/.test(String(code ?? '').trim())) return false
  const left = Buffer.from(hashResetCode(String(code).trim()))
  const right = Buffer.from(String(hash))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function resetStillValid(expiresAt, now = Date.now()) {
  const time = Date.parse(expiresAt ?? '')
  return Number.isFinite(time) && time > now
}

export function recentlySent(sentAt, now = Date.now()) {
  const time = Date.parse(sentAt ?? '')
  return Number.isFinite(time) && now - time < 60_000
}
