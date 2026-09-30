import { Link } from 'react-router-dom'
import { adminApi } from '../api'
import { Button, Notice, Page, Panel, useReload } from './ui'

export default function Activities() {
  const { loading, error, data, reload } = useReload(() => adminApi('/admin/activities'))

  async function remove(activity) {
    if (!window.confirm(`Delete ${activity.title}?`)) return
    try {
      await adminApi(`/admin/activities/${activity.id}`, { method: 'DELETE' })
      reload()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <Page>
      <Panel
        title="Listening question bank"
        subtitle="Each activity is a clip plus multiple-choice questions."
        action={
          <Link to="/admin/question-bank/editor">
            <Button>New activity</Button>
          </Link>
        }
      >
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <Notice>{error}</Notice> : null}
        <div className="space-y-3">
          {data?.activities?.map((activity) => (
            <div key={activity.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E8E2] p-4">
              <div>
                <p className="font-extrabold">{activity.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {activity.questionCount} questions · {activity.duration} · {activity.published ? 'Published' : 'Hidden'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/question-bank/editor?id=${activity.id}`}>
                  <Button tone="ghost">Edit</Button>
                </Link>
                <Button tone="danger" onClick={() => remove(activity)}>
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

