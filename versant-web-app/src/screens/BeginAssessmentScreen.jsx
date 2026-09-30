import { useNavigate, useParams } from 'react-router-dom'

const READY_CHECKS = [
  {
    id: 'device',
    title: 'Device ready',
    description: 'Microphone and internet connected',
  },
  {
    id: 'instructions',
    title: 'Instructions reviewed',
    description: 'You confirmed the assessment rules',
  },
  {
    id: 'sample',
    title: 'Sample completed',
    description: "You've seen how the questions work",
  },
]

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

export default function BeginAssessmentScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
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
            <p className="type-caption font-extrabold text-brand">Step 4 of 4</p>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-brand/10">
          <div className="h-full w-full rounded-full bg-brand" />
        </div>
      </header>

      <section className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-brand-light text-brand">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>

          <p className="type-label mt-5 text-brand">You're ready</p>
          <h1 className="type-title mt-2">
            Begin your
            <br />
            assessment
          </h1>
          <p className="type-body mx-auto mt-3 max-w-[320px] text-muted">
            Your device is ready and the sample is complete. You're all set to start the English
            Communication Test.
          </p>
        </div>

        <div className="mb-5 rounded-[26px] bg-brand-light p-5">
          <div className="mb-5 flex items-start justify-between">
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

          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-[16px] bg-white/70 p-3 text-center">
              <p className="type-caption text-muted">Time</p>
              <p className="type-meta mt-1 font-extrabold">30 min</p>
            </div>
            <div className="rounded-[16px] bg-white/70 p-3 text-center">
              <p className="type-caption text-muted">Questions</p>
              <p className="type-meta mt-1 font-extrabold">40</p>
            </div>
            <div className="rounded-[16px] bg-white/70 p-3 text-center">
              <p className="type-caption text-muted">Skills</p>
              <p className="type-meta mt-1 font-extrabold">4</p>
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-[24px] border border-black/5 bg-white p-5">
          <h3 className="type-meta mb-4 font-extrabold">Ready checks</h3>
          <div className="space-y-3">
            {READY_CHECKS.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand">
                  <CheckIcon />
                </div>
                <div>
                  <p className="type-meta font-extrabold">{item.title}</p>
                  <p className="type-caption text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-brand/10 bg-brand/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" />
                <path d="M12 18v3" />
                <path d="M8 21h8" />
              </svg>
            </div>

            <div className="flex-1">
              <p className="type-label text-brand">First section</p>
              <h3 className="type-meta mt-0.5 font-extrabold">Speaking</h3>
              <p className="type-caption mt-0.5 text-muted">
                Starts with Read Aloud · about 10 minutes
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 px-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-[#F7F7F2] text-muted">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <p className="type-caption leading-5 text-muted">
            Once you begin, the assessment timer starts. Stay in a quiet place and keep this window
            open.
          </p>
        </div>
      </section>

      <div className="shrink-0 border-t border-black/5 bg-surface/95 px-5 pb-5 pt-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => navigate(`/tests/${testId}/assessment`)}
          className="type-btn flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-brand text-white shadow-lg shadow-brand/15 transition hover:bg-[#195C44] active:scale-[0.99]"
        >
          Start Speaking Section
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
        <p className="type-caption mt-3 text-center text-muted">
          Assessment begins immediately after you continue
        </p>
      </div>
    </div>
  )
}
