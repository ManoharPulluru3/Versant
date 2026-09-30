import { adminApi } from '../api'
import { Notice, Page, Panel, useLoad } from './ui'

export default function Analytics() {
  const { loading, error, data } = useLoad(() => adminApi('/admin/analytics'))

  return (
    <Page>
      <Panel title="Listening analytics" subtitle="Average score for each activity.">
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <Notice>{error}</Notice> : null}
        <div className="space-y-4">
          {data?.byActivity?.map((item) => (
            <div key={item.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-extrabold">{item.title}</span>
                <span className="text-muted">
                  {item.attempts} attempts · {item.average}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E9EDE5]">
                <div className="h-full rounded-full bg-brand" style={{ width: `${item.average}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Page>
  )
}
