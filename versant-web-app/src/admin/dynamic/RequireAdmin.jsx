import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { adminApi, adminToken } from '../api'

export default function RequireAdmin({ children }) {
  const [state, setState] = useState(adminToken() ? 'checking' : 'signed-out')

  useEffect(() => {
    if (!adminToken()) return undefined
    let active = true
    adminApi('/auth/me')
      .then((data) => {
        if (!active) return
        setState(data.user?.role === 'admin' ? 'ready' : 'signed-out')
      })
      .catch(() => {
        if (active) setState('signed-out')
      })
    return () => {
      active = false
    }
  }, [])

  if (state === 'signed-out') return <Navigate to="/admin/login" replace />
  if (state === 'checking') {
    return <div className="grid min-h-svh place-items-center font-nunito text-sm font-semibold text-muted">Opening admin…</div>
  }
  return children
}
