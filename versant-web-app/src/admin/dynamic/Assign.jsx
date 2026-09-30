import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { adminApi } from '../api'
import { Button, Field, Notice, Page, Panel, inputClass } from './ui'

export default function Assign() {
  const [params] = useSearchParams()
  const [tests, setTests] = useState([])
  const [students, setStudents] = useState([])
  const [testId, setTestId] = useState(params.get('test') || '')
  const [selected, setSelected] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([adminApi('/admin/tests'), adminApi('/admin/students')])
      .then(([testData, studentData]) => {
        setTests(testData.tests)
        setStudents(studentData.students)
        setTestId((current) => current || testData.tests[0]?.id || '')
      })
      .catch((err) => setError(err.message))
  }, [])

  function toggle(id) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  async function assign() {
    setError('')
    setMessage('')
    try {
      const data = await adminApi(`/admin/tests/${testId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ studentIds: selected }),
      })
      setMessage(data.created ? `Assigned to ${data.created} student${data.created === 1 ? '' : 's'}.` : 'Those students already have this test.')
      setSelected([])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Page>
      <Panel title="Assign a listening test" subtitle="Students will see it on the Tests tab.">
        {error ? <Notice>{error}</Notice> : null}
        {message ? <p className="mb-3 text-sm font-semibold text-brand">{message}</p> : null}
        <Field label="Test">
          <select className={inputClass} value={testId} onChange={(event) => setTestId(event.target.value)}>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title}
              </option>
            ))}
          </select>
        </Field>
        <div className="mt-4 space-y-2">
          {students.map((student) => (
            <label key={student.id} className="flex items-center gap-3 rounded-xl border border-[#E5E8E2] px-3 py-3 text-sm">
              <input type="checkbox" checked={selected.includes(student.id)} onChange={() => toggle(student.id)} />
              <span className="font-extrabold">{student.name}</span>
              <span className="text-muted">{student.studentId}</span>
            </label>
          ))}
        </div>
        <Button className="mt-5" onClick={assign} disabled={!testId || selected.length === 0}>
          Assign
        </Button>
      </Panel>
    </Page>
  )
}
