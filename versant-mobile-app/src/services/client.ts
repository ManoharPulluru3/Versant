import { ENV } from '../config/env'
import { clearSession, getToken } from './session'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const token = await getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${ENV.API_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check that the API is running.')
  }

  const data = await response.json().catch(() => ({}))
  if (response.status === 401) await clearSession()
  if (!response.ok) {
    throw new ApiError(response.status, typeof data.error === 'string' ? data.error : 'Request failed')
  }
  return data as T
}
