import { useNavigate, useParams } from 'react-router-dom'

const SECTIONS = [
  {
    id: 'speaking',
    title: 'Speaking',
    description: 'Speak clearly and naturally',
    duration: '~10 min',
    active: true,
    icon: (
      <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <path d="M12 18v3" />
        <path d="M8 21h8" />
      </svg>
    ),
  },
  {
    id: 'listening',
    title: 'Listening',
    description: 'Listen and understand',
    duration: '~7 min',
    active: false,
    icon: (
      <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 13a8 8 0 0 1 16 0" />
        <path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Z" />
        <path d="M20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
        <path d="M17 18c-.7 1.5-2 2.5-4 2.5" />
      </svg>
    ),
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'Read and understand',
    duration: '~6 min',
    active: false,
    icon: (
      <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M4 5.5v14" />
        <path d="M8 7h8" />
        <path d="M8 11h7" />
      </svg>
    ),
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Write clearly and accurately',
    duration: '~7 min',
    active: false,
    icon: (
      <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
      </svg>
    ),
  },
]

const EXPECTATIONS = [
  {
    id: 'timed',
    title: 'Timed',
    description: 'Each section has a time limit',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    id: 'forward',
    title: 'Forward only',
    description: 'You cannot return to earlier questions',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18" />
        <path d="M7 8h10" />
        <path d="M7 16h10" />
      </svg>
    ),
  },
  {
    id: 'recorded',
    title: 'Recorded',
    description: 'Responses are evaluated',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
]

export default function TestOverviewScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/instructions`)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 transition hover:bg-brand/5"
            aria-label="Go back"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-[11px] bg-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 7.4 7.4 0 0 1-3.2-.7L4 20l1.7-4.2A7.5 7.5 0 1 1 20 11.5Z" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
            </div>
            <span className="type-meta font-extrabold tracking-tight">ElytEdu</span>
          </div>

          <div className="text-right">
            <p className="type-label text-muted">Assessment</p>
            <p className="type-caption font-extrabold text-brand">Step 3 of 4</p>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-brand/10">
          <div className="h-full w-3/4 rounded-full bg-brand" />
        </div>
      </header>

      <section className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-7">
        <div className="mb-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[16px] bg-brand-light text-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
              <path d="M4 5.5v14" />
              <path d="M8 7h8" />
              <path d="M8 11h8" />
            </svg>
          </div>

          <h1 className="type-title">Your assessment</h1>
          <p className="type-body mt-2 max-w-[360px] text-muted">
            Here's what you'll complete in your English Communication Test. Take your time and focus
            on each section.
          </p>
        </div>

        <div className="mb-6 rounded-[24px] bg-brand-light p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="type-label text-brand/70">English</p>
              <h2 className="type-section mt-1">Communication Test</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/70 text-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[16px] bg-white/65 p-3.5">
              <p className="type-caption text-muted">Estimated time</p>
              <p className="type-card mt-1 font-extrabold">30 minutes</p>
            </div>
            <div className="rounded-[16px] bg-white/65 p-3.5">
              <p className="type-caption text-muted">Total questions</p>
              <p className="type-card mt-1 font-extrabold">40 questions</p>
            </div>
          </div>
        </div>

        <div className="mb-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="type-section">Assessment journey</h2>
            <span className="type-caption font-bold text-muted">4 sections</span>
          </div>

          <div className="relative">
            <div className="absolute bottom-6 left-[20px] top-6 w-px bg-brand/15" />

            {SECTIONS.map((section, index) => (
              <div
                key={section.id}
                className={`relative flex gap-4 ${index < SECTIONS.length - 1 ? 'pb-4' : ''}`}
              >
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] ${
                    section.active
                      ? 'bg-brand'
                      : 'border border-brand/15 bg-white text-brand'
                  }`}
                >
                  {section.icon}
                </div>

                <div className="flex-1 rounded-[18px] border border-black/5 bg-white px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="type-meta font-extrabold">{section.title}</h3>
                      <p className="type-caption mt-0.5 text-muted">{section.description}</p>
                    </div>
                    <span className="shrink-0 type-caption font-extrabold text-brand">
                      {section.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="type-section mb-4">What to expect</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {EXPECTATIONS.map((item) => (
              <div key={item.id} className="rounded-[17px] bg-[#F7F7F2] p-3.5">
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-brand">
                  {item.icon}
                </div>
                <p className="type-caption font-extrabold">{item.title}</p>
                <p className="type-caption mt-1 leading-4 text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="shrink-0 border-t border-black/5 bg-surface/95 px-5 pb-5 pt-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="type-label text-muted">Ready?</p>
            <p className="type-meta mt-0.5 font-extrabold">30 min assessment</p>
          </div>
          <div className="text-right">
            <p className="type-caption text-muted">40 questions</p>
            <p className="type-caption mt-0.5 font-bold text-brand">4 skills</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/tests/${testId}/sample`)}
          className="type-btn flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-brand text-white transition hover:bg-[#195C44] active:scale-[0.99]"
        >
          Continue to Sample
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
