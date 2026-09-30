import { ENV } from '../config/env'

export type ApiRequestOptions = RequestInit & {
  token?: string | null
  tenantHost?: string | null
}

export async function apiFetch(path: string, options: ApiRequestOptions = {}) {
  const { token, tenantHost, headers: extraHeaders, ...init } = options
  const url = path.startsWith('http') ? path : `${ENV.API_URL}${path}`

  const headers = new Headers(extraHeaders)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (tenantHost) {
    headers.set('X-Tenant-Host', tenantHost)
  }

  return fetch(url, { ...init, headers })
}
