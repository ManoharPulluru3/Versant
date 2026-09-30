import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminApi } from '../api'
import { Button, Field, Notice, Page, Panel, inputClass } from './ui'

const blank = {
  title: '',
  description: '',
  badge: 'Listening test',
  durationMinutes: 20,
  dueDate: '2026-10-15',
  status: 'published',
  activityIds: [],
}

export default function AssessmentForm() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const navigate = useNavigate()
  const [form, setForm] = useState(blank)
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    adminApi('/admin/tests')
      .then((data) => {
        if (!active) return
        setActivities(data.activities)
        if (id) {
          const test = data.tests.find((item) => item.id === id)
          if (test) setForm(test)
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
    return () => {
      active = false
    }
  }, [id])

  function toggle(activityId) {
    setForm((current) => ({
      ...current,
      activityIds: current.activityIds.includes(activityId)
        ? current.activityIds.filter((item) => item !== activityId)
        : [...current.activityIds, activityId],
    }))
  }

  async function save() {
    setBusy(true)
    setError('')
    try {
      if (id) await adminApi(`/admin/tests/${id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await adminApi('/admin/tests', { method: 'POST', body: JSON.stringify(form) })
      navigate('/admin/assessments')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Page>
      <Panel title={id ? 'Edit listening test' : 'Create listening test'}>
        {error ? <Notice>{error}</Notice> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <input className={inputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <Field label="Badge">
            <input className={inputClass} value={form.badge} onChange={(event) => setForm({ ...form, badge: event.target.value })} />
          </Field>
          <Field label="Description">
            <input className={inputClass} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </Field>
          <Field label="Due date">
            <input className={inputClass} type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          </Field>
          <Field label="Minutes">
            <input
              className={inputClass}
              type="number"
              value={form.durationMinutes}
              onChange={(event) => setForm({ ...form, durationMinutes: Number(event.target.value) })}
            />
          </Field>
          <Field label="Status">
            <select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-xs font-bold text-muted">Listening activities, in order</p>
          {activities.map((activity) => (
            <label key={activity.id} className="flex items-center gap-3 rounded-xl border border-[#E5E8E2] px-3 py-3 text-sm font-semibold">
              <input type="checkbox" checked={form.activityIds.includes(activity.id)} onChange={() => toggle(activity.id)} />
              {activity.title}
            </label>
          ))}
        </div>
        <Button className="mt-5" disabled={busy} onClick={save}>
          {busy ? 'Saving…' : 'Save test'}
        </Button>
      </Panel>
    </Page>
  )
}
