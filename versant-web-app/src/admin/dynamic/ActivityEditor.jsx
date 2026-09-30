import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { adminApi } from '../api'
import { Button, Field, Notice, Page, Panel, inputClass } from './ui'

function blankQuestion() {
  return {
    prompt: '',
    answer: 'A',
    options: [
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ],
  }
}

const blank = {
  title: '',
  description: '',
  duration: '5 min',
  level: 'Intermediate',
  audioLabel: 'Audio',
  headline: '',
  subtitle: '',
  audioSeconds: 15,
  questionSeconds: 45,
  tip: 'Listen for the main idea, then choose the best answer.',
  published: true,
  questions: [blankQuestion()],
}

export default function ActivityEditor() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const navigate = useNavigate()
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id) return undefined
    let active = true
    adminApi('/admin/activities')
      .then((data) => {
        const activity = data.activities.find((item) => item.id === id)
        if (active && activity) {
          setForm({
            ...activity,
            questions: activity.questions.map((question) => ({
              id: question.id,
              prompt: question.prompt,
              answer: question.answer,
              options: [...question.options, { text: '' }, { text: '' }, { text: '' }, { text: '' }].slice(0, 4),
            })),
          })
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
    return () => {
      active = false
    }
  }, [id])

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateQuestion(index, patch) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, itemIndex) => (itemIndex === index ? { ...question, ...patch } : question)),
    }))
  }

  async function save() {
    setBusy(true)
    setError('')
    const body = {
      ...form,
      questions: form.questions
        .map((question) => ({
          ...question,
          options: question.options.filter((option) => option.text.trim()),
        }))
        .filter((question) => question.prompt.trim()),
    }
    try {
      if (id) await adminApi(`/admin/activities/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      else await adminApi('/admin/activities', { method: 'POST', body: JSON.stringify(body) })
      navigate('/admin/question-bank')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Page>
      <Panel
        title={id ? 'Edit listening activity' : 'New listening activity'}
        subtitle="Students hear the clip, then answer these questions."
        action={
          <Link to="/admin/question-bank">
            <Button tone="ghost">Back</Button>
          </Link>
        }
      >
        {error ? <Notice>{error}</Notice> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <input className={inputClass} value={form.title} onChange={(event) => set('title', event.target.value)} />
          </Field>
          <Field label="Duration label">
            <input className={inputClass} value={form.duration} onChange={(event) => set('duration', event.target.value)} />
          </Field>
          <Field label="Description">
            <input className={inputClass} value={form.description} onChange={(event) => set('description', event.target.value)} />
          </Field>
          <Field label="Audio label">
            <input className={inputClass} value={form.audioLabel} onChange={(event) => set('audioLabel', event.target.value)} />
          </Field>
          <Field label="Clip length (seconds)">
            <input className={inputClass} type="number" value={form.audioSeconds} onChange={(event) => set('audioSeconds', Number(event.target.value))} />
          </Field>
          <Field label="Time per question (seconds)">
            <input className={inputClass} type="number" value={form.questionSeconds} onChange={(event) => set('questionSeconds', Number(event.target.value))} />
          </Field>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={form.published} onChange={(event) => set('published', event.target.checked)} />
          Published for students
        </label>
      </Panel>

      {form.questions.map((question, index) => (
        <Panel key={question.id || index} title={`Question ${index + 1}`}>
          <Field label="Prompt">
            <textarea
              className={`${inputClass} h-24 py-3`}
              value={question.prompt}
              onChange={(event) => updateQuestion(index, { prompt: event.target.value })}
            />
          </Field>
          <div className="mt-3 grid gap-3">
            {question.options.map((option, optionIndex) => {
              const optionId = ['A', 'B', 'C', 'D'][optionIndex]
              return (
                <label key={optionId} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`answer-${index}`}
                    checked={question.answer === optionId}
                    onChange={() => updateQuestion(index, { answer: optionId })}
                  />
                  <span className="w-5 text-sm font-extrabold text-brand">{optionId}</span>
                  <input
                    className={inputClass}
                    value={option.text}
                    placeholder="Choice"
                    onChange={(event) => {
                      const options = question.options.map((item, itemIndex) =>
                        itemIndex === optionIndex ? { text: event.target.value } : item,
                      )
                      updateQuestion(index, { options })
                    }}
                  />
                </label>
              )
            })}
          </div>
        </Panel>
      ))}

      <div className="flex gap-3">
        <Button tone="ghost" onClick={() => set('questions', [...form.questions, blankQuestion()])}>
          Add question
        </Button>
        <Button disabled={busy} onClick={save}>
          {busy ? 'Saving…' : 'Save activity'}
        </Button>
      </div>
    </Page>
  )
}
