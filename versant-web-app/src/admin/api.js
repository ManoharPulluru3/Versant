const API = import.meta.env.VITE_API_URL || 'http://13.207.57.80:4000/api/v1'
export const API_ORIGIN = API.replace(/\/api\/v1\/?$/, '')

export function adminToken() {
  return localStorage.getItem('elytedu-admin-token')
}

export function adminUser() {
  try {
    return JSON.parse(localStorage.getItem('elytedu-admin-user') || 'null')
  } catch {
    return null
  }
}

export function saveAdminSession(token, user) {
  localStorage.setItem('elytedu-admin-token', token)
  localStorage.setItem('elytedu-admin-user', JSON.stringify(user))
}

export function clearAdminSession() {
  localStorage.removeItem('elytedu-admin-token')
  localStorage.removeItem('elytedu-admin-user')
}

export async function adminApi(path, options = {}) {
  const headers = { ...(options.headers || {}) }
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  const token = adminToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (response.status === 401 && !path.includes('/auth/')) {
    clearAdminSession()
    if (window.location.pathname !== '/admin/login') window.location.assign('/admin/login')
  }
  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }
  return data
}

export async function adminAudio(path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = adminToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API}${path}`, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Request failed')
  }
  return response.blob()
}

export async function adminUpload(path, formData) {
  const headers = {}
  const token = adminToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API}${path}`, { method: 'POST', headers, body: formData })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Upload failed')
  return data
}
