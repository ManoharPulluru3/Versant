import { ENV } from '../config/env'
import { resetToLogin } from '../navigation/navigationRef'
import { clearSession, getRefreshToken, getToken, sessionIsStored, setSession } from './session'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const PUBLIC_PATHS = new Set([
  '/auth/login',
  '/auth/admin/login',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh',
  '/auth/logout',
])

function isPublic(path: string) {
  return PUBLIC_PATHS.has(path.split('?')[0])
}

function accessTokenStale(token: string) {
  const part = token.split('.')[1]
  if (!part || typeof globalThis.atob !== 'function') return false
  try {
    const padded = part.replace(/-/g, '+').replace(/_/g, '/')
    const json = globalThis.atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), '='))
    const payload = JSON.parse(json) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now() + 20_000
  } catch {
    return false
  }
}

let refreshFlight: Promise<'renewed' | 'rejected'> | null = null

async function refreshSession() {
  if (!refreshFlight) {
    refreshFlight = exchangeRefreshToken().finally(() => {
      refreshFlight = null
    })
  }
  return refreshFlight
}

async function exchangeRefreshToken() {
  const refreshToken = await getRefreshToken()
  if (!refreshToken) return 'rejected' as const
  let response: Response
  try {
    response = await fetch(`${ENV.API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check that the API is running.')
  }
  const data = await response.json().catch(() => ({}))
  if (response.status === 401) return 'rejected' as const
  if (!response.ok) throw new ApiError(response.status, typeof data.error === 'string' ? data.error : 'Request failed')
  if (typeof data.accessToken !== 'string' || typeof data.refreshToken !== 'string') return 'rejected' as const
  await setSession(data.accessToken, data.refreshToken, await sessionIsStored())
  return 'renewed' as const
}

async function expireSession() {
  await clearSession()
  resetToLogin()
}

export async function signOut() {
  const [accessToken, refreshToken] = await Promise.all([getToken(), getRefreshToken()])
  try {
    await fetch(`${ENV.API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ refreshToken }),
    })
  } catch {
    // The phone still forgets the session when the server cannot be reached.
  }
  await clearSession()
}

export async function restoreSession() {
  const [access, refresh] = await Promise.all([getToken(), getRefreshToken()])
  if (!access && !refresh) return false
  try {
    await api('/auth/me')
    return true
  } catch (error) {
    if (error instanceof ApiError && error.status === 0) return true
    return false
  }
}

export async function api<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  if (!retried && !isPublic(path)) {
    const current = await getToken()
    if (current && accessTokenStale(current) && (await getRefreshToken())) {
      const renewed = await refreshSession()
      if (renewed === 'rejected') {
        await expireSession()
        throw new ApiError(401, 'Sign in required')
      }
    }
  }

  const headers = new Headers(init.headers)
  if (init.body && !(typeof FormData !== 'undefined' && init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = await getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${ENV.API_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check that the API is running.')
  }

  const data = await response.json().catch(() => ({}))
  if (response.status === 401 && !isPublic(path)) {
    if (!retried && (await refreshSession()) === 'renewed') return api<T>(path, init, true)
    await expireSession()
  }
  if (!response.ok) {
    throw new ApiError(response.status, typeof data.error === 'string' ? data.error : 'Request failed')
  }
  return data as T
}
