import { useLocation, useNavigate } from 'react-router-dom'

const COPY = {
  '/admin/monitoring': {
    title: 'Live Monitoring',
    blurb: 'Watch in-progress attempts in real time.',
  },
  '/admin/results': {
    title: 'Results',
    blurb: 'Review scores, CEFR levels, and skill breakdowns.',
  },
  '/admin/analytics': {
    title: 'Analytics',
    blurb: 'Program-level trends across cohorts and skills.',
  },
  '/admin/reports': {
    title: 'Reports / Export',
    blurb: 'Export PDFs and spreadsheets for stakeholders.',
  },
}

export default function AdminPlaceholderScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const info = COPY[location.pathname] || {
    title: 'Admin',
    blurb: 'This section is coming next.',
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="w-full">
        <div className="rounded-[28px] border border-[#E6EAE3] bg-surface p-8 shadow-[0_20px_60px_rgba(31,107,79,0.06)] sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-[12px] font-extrabold tracking-[0.1em] text-brand">
            COMING NEXT
          </div>
          <h1 className="mt-4 text-[28px] font-extrabold tracking-[-0.04em]">{info.title}</h1>
          <p className="mt-2 max-w-xl text-[16px] leading-6 text-muted">{info.blurb}</p>
          <p className="mt-4 text-[15px] font-semibold text-[#8A928C]">
            Dashboard is live. Paste the next admin screen HTML and we’ll build it the same way.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="flex h-11 items-center rounded-xl bg-brand px-5 text-[15px] font-extrabold text-white"
            >
              Back to Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="flex h-11 items-center rounded-xl border border-[#DDE3DB] bg-white px-5 text-[15px] font-extrabold"
            >
              Open Student App
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
