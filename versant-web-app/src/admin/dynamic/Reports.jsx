import { adminApi } from '../api'
import { Button, Notice, Page, Panel, useLoad } from './ui'

export default function Reports() {
  const { loading, error, data } = useLoad(() => adminApi('/admin/results'))

  function download() {
    const blob = new Blob([JSON.stringify(data?.results ?? [], null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'listening-results.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Page>
      <Panel
        title="Export listening results"
        subtitle="Download every scored attempt as JSON."
        action={
          <Button onClick={download} disabled={!data}>
            Download JSON
          </Button>
        }
      >
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <Notice>{error}</Notice> : null}
        <p className="text-sm text-muted">{data?.results?.length ?? 0} attempts ready to export.</p>
      </Panel>
    </Page>
  )
}
