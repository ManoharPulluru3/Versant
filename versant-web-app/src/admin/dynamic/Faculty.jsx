import { Link } from 'react-router-dom'
import { Page, Panel } from './ui'

export default function Faculty() {
  return (
    <Page>
      <Panel title="Listening administration" subtitle="Faculty accounts are outside this module.">
        <p className="text-sm leading-6 text-muted">
          Student access, listening questions, test assignment, and scores are managed from Students, the question
          bank, and Assessments.
        </p>
        <Link to="/admin/students" className="mt-4 inline-flex text-sm font-extrabold text-brand">
          Open students
        </Link>
      </Panel>
    </Page>
  )
}
