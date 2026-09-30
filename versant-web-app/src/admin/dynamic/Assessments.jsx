import { Link } from 'react-router-dom'
import { adminApi } from '../api'
import { Button, Notice, Page, Panel, useReload } from './ui'

export default function Assessments() {
  const { loading, error, data, reload } = useReload(() => adminApi('/admin/tests'))

  async function remove(test) {
    if (!window.confirm(`Delete ${test.title}? Assignments for it will be removed.`)) return
    await adminApi(`/admin/tests/${test.id}`, { method: 'DELETE' })
    reload()
  }

  return (
    <Page>
      <Panel
        title="Listening tests"
        subtitle="A test is an ordered set of listening activities."
        action={
          <Link to="/admin/assessments/create">
            <Button>New test</Button>
          </Link>
        }
      >
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <Notice>{error}</Notice> : null}
        <div className="space-y-3">
          {data?.tests?.map((test) => (
            <div key={test.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E8E2] p-4">
              <div>
                <p className="font-extrabold">{test.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {test.questionCount} questions · {test.durationMinutes} min · {test.assigned} assigned · {test.status}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/assessments/builder?id=${test.id}`}>
                  <Button tone="ghost">Edit</Button>
                </Link>
                <Link to={`/admin/assessments/assign?test=${test.id}`}>
                  <Button tone="ghost">Assign</Button>
                </Link>
                <Button tone="danger" onClick={() => remove(test)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Page>
  )
}
