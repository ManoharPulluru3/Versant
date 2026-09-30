import { useSearchParams } from 'react-router-dom'
import { adminApi } from '../api'
import { Notice, Page, Panel, useLoad } from './ui'

export default function Results() {
  const [params] = useSearchParams()
  const focus = params.get('attempt')
  const { loading, error, data } = useLoad(() => adminApi('/admin/results'))
  const rows = data?.results ?? []
  const selected = rows.find((item) => item.id === focus)

  return (
    <Page>
      <Panel title="Listening results" subtitle={`Pass mark ${data?.passMark ?? 60}.`}>
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <Notice>{error}</Notice> : null}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="py-2">Student</th>
                <th>Activity</th>
                <th>Type</th>
                <th>Score</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={`border-t border-[#EEF0E9] ${row.id === focus ? 'bg-brand-light' : ''}`}>
                  <td className="py-3 font-extrabold">
                    {row.student}
                    <div className="text-xs font-semibold text-muted">{row.studentId}</div>
                  </td>
                  <td>
                    {row.title}
                    <div className="text-xs text-muted">{row.section}</div>
                  </td>
                  <td className="capitalize">{row.kind}</td>
                  <td className="font-extrabold">{row.score}</td>
                  <td>{new Date(row.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      {selected ? (
        <Panel title="Answer review">
          <p className="text-sm text-muted">
            {selected.correct} of {selected.total} correct.
          </p>
        </Panel>
      ) : null}
    </Page>
  )
}
