import { useState } from 'react'
import { adminApi } from '../api'
import { Button, Field, Notice, Page, Panel, inputClass, useReload } from './ui'

const empty = { name: '', email: '', studentId: '', password: '', program: 'English Communication' }

export default function Students() {
  const [form, setForm] = useState(empty)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { loading, error: loadError, data, reload } = useReload(() => adminApi('/admin/students'))

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function createStudent(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await adminApi('/admin/students', { method: 'POST', body: JSON.stringify(form) })
      setForm(empty)
      setMessage('Student added. They can sign in on the mobile app.')
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(student) {
    if (!window.confirm(`Remove ${student.name}? Their listening attempts will be deleted.`)) return
    await adminApi(`/admin/students/${student.id}`, { method: 'DELETE' })
    reload()
  }

  return (
    <Page>
      <Panel title="Add a student" subtitle="Students sign in with their ID or email.">
        <form onSubmit={createStudent} className="grid gap-3 md:grid-cols-2">
          {error ? <Notice>{error}</Notice> : null}
          {message ? <p className="text-sm font-semibold text-brand md:col-span-2">{message}</p> : null}
          <Field label="Full name">
            <input className={inputClass} value={form.name} onChange={(event) => set('name', event.target.value)} required />
          </Field>
          <Field label="Email">
            <input className={inputClass} type="email" value={form.email} onChange={(event) => set('email', event.target.value)} required />
          </Field>
          <Field label="Student ID">
            <input className={inputClass} value={form.studentId} onChange={(event) => set('studentId', event.target.value)} required />
          </Field>
          <Field label="Password">
            <input className={inputClass} type="text" value={form.password} onChange={(event) => set('password', event.target.value)} required minLength={8} />
          </Field>
          <Field label="Program">
            <input className={inputClass} value={form.program} onChange={(event) => set('program', event.target.value)} />
          </Field>
          <div className="flex items-end">
            <Button onClick={createStudent}>Add student</Button>
          </div>
        </form>
      </Panel>

      <Panel title="Students">
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {loadError ? <Notice>{loadError}</Notice> : null}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="py-2">Name</th>
                <th>ID</th>
                <th>Email</th>
                <th>Tests</th>
                <th>Attempts</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data?.students?.map((student) => (
                <tr key={student.id} className="border-t border-[#EEF0E9]">
                  <td className="py-3 font-extrabold">{student.name}</td>
                  <td>{student.studentId}</td>
                  <td>{student.email}</td>
                  <td>{student.assignments}</td>
                  <td>{student.attempts}</td>
                  <td className="text-right">
                    <Button tone="danger" onClick={() => remove(student)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  )
}

