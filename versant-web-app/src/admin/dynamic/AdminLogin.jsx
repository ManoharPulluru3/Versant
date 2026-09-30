import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, saveAdminSession } from '../api'
import { Button, Field, Notice, inputClass } from './ui'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@elytedu.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await adminApi('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      saveAdminSession(data.token, data.user)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#F6F7F2] px-4 font-nunito text-dark">
      <form onSubmit={submit} className="w-full max-w-md rounded-[28px] border border-[#E5E8E2] bg-white p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand">ElytEdu</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">Manage listening activities, tests, and student results.</p>
        <div className="mt-6 space-y-4">
          {error ? <Notice>{error}</Notice> : null}
          <Field label="Email">
            <input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
          </Field>
          <Field label="Password">
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <Button className="w-full" disabled={busy} onClick={submit}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </div>
      </form>
    </div>
  )
}
