import { useEffect, useState } from 'react'
import { adminApi } from '../api'
import { Button, Field, Notice, Page, Panel, inputClass } from './ui'

export default function Settings() {
  const [form, setForm] = useState({ collegeName: '', supportEmail: '', passMark: 60 })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi('/admin/settings')
      .then((data) => setForm(data.settings))
      .catch((err) => setError(err.message))
  }, [])

  async function save() {
    setError('')
    setMessage('')
    try {
      const data = await adminApi('/admin/settings', { method: 'PUT', body: JSON.stringify(form) })
      setForm(data.settings)
      setMessage('Settings saved.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Page>
      <Panel title="College settings" subtitle="Shown to students in help and support.">
        {error ? <Notice>{error}</Notice> : null}
        {message ? <p className="mb-3 text-sm font-semibold text-brand">{message}</p> : null}
        <div className="grid max-w-xl gap-3">
          <Field label="College name">
            <input className={inputClass} value={form.collegeName} onChange={(event) => setForm({ ...form, collegeName: event.target.value })} />
          </Field>
          <Field label="Support email">
            <input className={inputClass} value={form.supportEmail} onChange={(event) => setForm({ ...form, supportEmail: event.target.value })} />
          </Field>
          <Field label="Pass mark">
            <input className={inputClass} type="number" value={form.passMark} onChange={(event) => setForm({ ...form, passMark: Number(event.target.value) })} />
          </Field>
          <Button onClick={save}>Save settings</Button>
        </div>
      </Panel>
    </Page>
  )
}
