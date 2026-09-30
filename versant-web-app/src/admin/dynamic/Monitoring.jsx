import { adminApi } from '../api'
import { Notice, Page, Panel, useLoad } from './ui'

export default function Monitoring() {
  const { loading, error, data } = useLoad(() => adminApi('/admin/monitoring'))
  const sessions = data?.sessions ?? []

  return (
    <Page>
      <Panel title="Live listening attempts" subtitle="Tests a student has started and not finished.">
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <Notice>{error}</Notice> : null}
        {sessions.length === 0 && !loading ? <p className="text-sm text-muted">No listening test is in progress.</p> : null}
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-2xl border border-[#E5E8E2] p-4">
              <p className="font-extrabold">{session.student}</p>
              <p className="mt-1 text-sm text-muted">
                {session.test} · {session.done} of {session.total} sections submitted
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </Page>
  )
}
