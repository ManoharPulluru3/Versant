import { useState } from 'react'
import { adminApi } from '../api'
import { Button, Notice, Page, Panel } from './ui'

export default function BulkUpload() {
  const [text, setText] = useState('Priya Shah, PS2026001, priya.shah@college.edu, Student@123')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function importStudents() {
    setError('')
    setMessage('')
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    let created = 0
    const failures = []
    for (const line of lines) {
      const [name, studentId, email, password] = line.split(',').map((part) => part.trim())
      try {
        await adminApi('/admin/students', {
          method: 'POST',
          body: JSON.stringify({ name, studentId, email, password }),
        })
        created += 1
      } catch (err) {
        failures.push(`${studentId || line}: ${err.message}`)
      }
    }
    setMessage(`Added ${created} student${created === 1 ? '' : 's'}.`)
    if (failures.length) setError(failures.join(' '))
  }

  return (
    <Page>
      <Panel title="Import students" subtitle="One student per line: Name, Student ID, Email, Password">
        {error ? <Notice>{error}</Notice> : null}
        {message ? <p className="mb-3 text-sm font-semibold text-brand">{message}</p> : null}
        <textarea
          className="h-48 w-full rounded-2xl border border-[#E5E8E2] bg-[#F8F9F5] p-4 text-sm font-semibold outline-none focus:border-brand"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button className="mt-4" onClick={importStudents}>
          Import
        </Button>
      </Panel>
    </Page>
  )
}
