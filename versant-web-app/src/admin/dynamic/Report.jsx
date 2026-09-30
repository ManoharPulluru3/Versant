import { Link, useSearchParams } from 'react-router-dom'
import { adminApi } from '../api'
import { Notice, Page, Panel, useLoad } from './ui'

export default function Report() {
  const [params] = useSearchParams()
  const attemptId = params.get('attempt')
  const { loading, error, data } = useLoad(() => adminApi('/admin/results'))
  const attempt = data?.results?.find((item) => item.id === attemptId) ?? data?.results?.[0]

  return (
    <Page>
      <Panel
        title={attempt ? `${attempt.student} · ${attempt.section || attempt.title}` : 'Attempt'}
        subtitle={attempt ? `${attempt.correct} of ${attempt.total} correct · score ${attempt.score}` : ''}
        action={
          <Link to="/admin/results" className="text-sm font-extrabold text-brand">
            All results
          </Link>
        }
      >
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <Notice>{error}</Notice> : null}
        <p className="text-sm text-muted">
          {attempt
            ? `${attempt.kind} attempt on ${new Date(attempt.createdAt).toLocaleString()}.`
            : 'No attempts yet.'}
        </p>
      </Panel>
    </Page>
  )
}
