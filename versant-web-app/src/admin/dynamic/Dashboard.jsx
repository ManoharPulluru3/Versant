import { adminApi } from '../api'
import { Page, Panel, useLoad } from './ui'

const CARDS = [
  ['students', 'Students'],
  ['activities', 'Listening activities'],
  ['tests', 'Tests'],
  ['assignments', 'Assignments'],
  ['attempts', 'Attempts'],
  ['inProgress', 'In progress'],
  ['averageScore', 'Average score'],
]

export default function Dashboard() {
  const { loading, error, data } = useLoad(() => adminApi('/admin/dashboard'))

  return (
    <Page>
      <Panel title="Listening overview" subtitle="Live counts from the listening module.">
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <p className="text-sm font-semibold text-[#B65F39]">{error}</p> : null}
        {data ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map(([key, label]) => (
              <div key={key} className="rounded-2xl bg-brand-light p-4">
                <p className="text-3xl font-black text-brand">{data[key]}</p>
                <p className="mt-1 text-xs font-bold text-[#617067]">{label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Panel>
    </Page>
  )
}
