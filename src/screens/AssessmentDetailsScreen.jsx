import { useNavigate, useParams } from 'react-router-dom'

const SKILLS = [
  {
    id: 'speaking',
    title: 'Speaking',
    description: 'Pronunciation & fluency',
    icon: (
      <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15a3 3 0 003-3V7a3 3 0 10-6 0v5a3 3 0 003 3z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 18v3M8 21h8" />
      </svg>
    ),
  },
  {
    id: 'listening',
    title: 'Listening',
    description: 'Understanding spoken English',
    icon: (
      <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4M8 7v10M12 5v14M16 8v8M20 10v4" />
      </svg>
    ),
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'Comprehension & vocabulary',
    icon: (
      <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 014 16.5v-11z"
        />
        <path strokeLinecap="round" d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Grammar & written communication',
    icon: (
      <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L19 9a2.1 2.1 0 00-3-3L5 17v3z" />
        <path strokeLinecap="round" d="M14 7l3 3" />
      </svg>
    ),
  },
]

export default function AssessmentDetailsScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="flex shrink-0 items-center justify-between px-5 pb-4 pt-6">
        <button
          type="button"
          onClick={() => navigate('/tests')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white text-dark shadow-sm transition active:scale-95"
          aria-label="Go back"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <p className="type-label text-muted">Assessment</p>
          <h1 className="type-meta mt-0.5 font-extrabold text-dark">Test Details</h1>
        </div>

        <div className="h-10 w-10" />
      </header>

      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <div className="relative overflow-hidden rounded-[28px] bg-brand p-6 text-white">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border-[22px] border-white/10" />
          <div className="absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-white/[0.05]" />

          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h4m-6 5h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="relative mt-5">
            <div className="flex items-center gap-2">
              <span className="type-label rounded-full bg-accent px-2.5 py-1 text-white">
                College Assessment
              </span>
              <span className="type-caption text-white/60">•</span>
              <span className="type-caption font-semibold text-white/70">English</span>
            </div>

            <h2 className="type-title mt-3 max-w-[290px] text-white">English Communication Test</h2>
            <p className="type-body mt-3 max-w-[320px] text-white/75">
              Evaluate your English communication skills across speaking, listening, reading and
              writing.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-[20px] border border-black/[0.05] bg-white p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="8.5" />
                <path strokeLinecap="round" d="M12 7v5l3 2" />
              </svg>
            </div>
            <p className="type-caption mt-3 font-semibold text-muted">Duration</p>
            <p className="type-card mt-0.5 text-dark">30 min</p>
          </div>

          <div className="rounded-[20px] border border-black/[0.05] bg-white p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h12M8 12h12M8 18h12" />
                <circle cx="4" cy="6" r="1" />
                <circle cx="4" cy="12" r="1" />
                <circle cx="4" cy="18" r="1" />
              </svg>
            </div>
            <p className="type-caption mt-3 font-semibold text-muted">Questions</p>
            <p className="type-card mt-0.5 text-dark">40</p>
          </div>

          <div className="rounded-[20px] border border-black/[0.05] bg-white p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 11a8.1 8.1 0 01-1.4 4.6A8 8 0 116.3 4.3"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 4v7h-7" />
              </svg>
            </div>
            <p className="type-caption mt-3 font-semibold text-muted">Attempts</p>
            <p className="type-card mt-0.5 text-dark">1 left</p>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between">
            <h3 className="type-section text-dark">Skills assessed</h3>
            <span className="type-caption font-bold text-muted">4 skills</span>
          </div>

          <div className="mt-3 space-y-2.5">
            {SKILLS.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-3 rounded-[18px] border border-black/[0.05] bg-white p-3.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                  {skill.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="type-meta font-extrabold text-dark">{skill.title}</p>
                  <p className="type-caption mt-0.5 text-muted">{skill.description}</p>
                </div>
                <svg
                  className="h-4 w-4 text-brand"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <h3 className="type-section text-dark">Assessment information</h3>

          <div className="mt-3 overflow-hidden rounded-[22px] border border-black/[0.05] bg-white">
            <div className="flex items-center justify-between border-b border-black/[0.05] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path strokeLinecap="round" d="M8 3v4M16 3v4M4 10h16" />
                  </svg>
                </div>
                <div>
                  <p className="type-caption font-semibold text-muted">Due date</p>
                  <p className="type-meta mt-0.5 font-extrabold text-dark">September 14, 2026</p>
                </div>
              </div>
              <span className="type-caption rounded-full bg-accent/10 px-2.5 py-1 font-extrabold text-accent">
                7 days left
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-black/[0.05] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 11a8 8 0 11-2.34-5.66" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 4v7h-7" />
                  </svg>
                </div>
                <div>
                  <p className="type-caption font-semibold text-muted">Attempts allowed</p>
                  <p className="type-meta mt-0.5 font-extrabold text-dark">1 attempt</p>
                </div>
              </div>
              <span className="type-caption font-bold text-brand">1 remaining</span>
            </div>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l2.5 5.1L20 9l-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4 5.5-.9L12 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="type-caption font-semibold text-muted">Recommended level</p>
                  <p className="type-meta mt-0.5 font-extrabold text-dark">Intermediate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 mb-2 flex gap-3 rounded-[20px] border border-brand/10 bg-brand-light/60 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M10.3 3.8l-7 12.1A2 2 0 005 19h14a2 2 0 001.7-3.1l-7-12.1a2 2 0 00-3.4 0z"
              />
            </svg>
          </div>
          <div>
            <p className="type-caption font-extrabold text-dark">Before you begin</p>
            <p className="type-caption mt-1 leading-5 text-muted">
              Make sure you are in a quiet place with a stable internet connection. You will need
              microphone access for this assessment.
            </p>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-black/[0.05] bg-surface/95 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="min-w-[72px]">
            <p className="type-label text-muted">Duration</p>
            <p className="type-meta mt-0.5 font-extrabold text-dark">30 minutes</p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/device-check`)}
            className="type-btn flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[18px] bg-brand text-white shadow-[0_8px_20px_rgba(31,107,79,0.20)] transition active:scale-[0.98]"
          >
            Start Assessment
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
