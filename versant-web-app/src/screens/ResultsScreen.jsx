import { useNavigate, useParams } from 'react-router-dom'

const SKILLS = [
  {
    name: 'Speaking',
    detail: 'Fluency & pronunciation',
    score: 86,
    label: 'Strong',
    tone: 'brand',
    icon: 'mic',
  },
  {
    name: 'Listening',
    detail: 'Understanding spoken English',
    score: 79,
    label: 'Good',
    tone: 'accent',
    icon: 'headphones',
  },
  {
    name: 'Reading',
    detail: 'Comprehension & vocabulary',
    score: 84,
    label: 'Strong',
    tone: 'brand',
    icon: 'book',
  },
  {
    name: 'Writing',
    detail: 'Grammar & written communication',
    score: 78,
    label: 'Good',
    tone: 'accent',
    icon: 'pen',
  },
]

function SkillIcon({ name, tone }) {
  const color = tone === 'accent' ? 'text-accent' : 'text-brand'
  const bg = tone === 'accent' ? 'bg-[#F8E7D9]' : 'bg-brand-light'

  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
      {name === 'mic' && (
        <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${color}`}>
          <rect x="8" y="3" width="8" height="13" rx="4" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      )}
      {name === 'headphones' && (
        <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${color}`}>
          <path d="M4 13a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path
            d="M4 13v3a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2ZM20 13v3a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M17 18c-.7 1.5-2 2.5-4 2.5h-1"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      )}
      {name === 'book' && (
        <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${color}`}>
          <path
            d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5v-15Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H19" stroke="currentColor" strokeWidth="1.7" />
          <path d="M9 7h6M9 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {name === 'pen' && (
        <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${color}`}>
          <path
            d="m14 5 5 5M4 20l3.5-.8L18.5 8.2a2.1 2.1 0 0 0-3-3L4.5 16.2 4 20Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M13 6.5 17.5 11" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      )}
    </div>
  )
}

export default function ResultsScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent font-nunito text-dark">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-brand-light opacity-70 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-56 w-56 rounded-full bg-[#F5DCC7] opacity-45 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-brand-light opacity-50 blur-3xl" />
      </div>

      <header className="relative z-10 flex h-[64px] shrink-0 items-center justify-between border-b border-[#ECEFE9] px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E1E6DF] bg-white transition hover:bg-[#F6F8F4]"
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-dark">
              <path
                d="M15 18 9 12l6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div>
            <p className="type-label font-extrabold uppercase tracking-[1.5px] text-muted">
              Assessment
            </p>
            <p className="type-meta mt-0.5 font-extrabold">Results</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] text-white">
              <path
                d="M5 6.5C5 5.12 6.12 4 7.5 4h9C17.88 4 19 5.12 19 6.5v6c0 1.38-1.12 2.5-2.5 2.5H12l-4.5 3v-3H7.5C6.12 15 5 13.88 5 12.5v-6Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M9 9h6M9 12h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent" />
          </div>
          <span className="type-card">ElytEdu</span>
        </div>
      </header>

      <section className="relative z-10 flex-1 overflow-y-auto px-5 py-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#CFE2D2] bg-brand-light px-3 py-1.5 type-label font-extrabold uppercase tracking-[1.2px] text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Assessment complete
          </div>

          <h1 className="type-display mt-4 tracking-[-1.3px]">Your results are ready.</h1>

          <p className="type-body mx-auto mt-3 max-w-[560px] leading-6 text-muted">
            Here's how you performed in the English Communication Test. Use your results to
            understand your strengths and what to improve next.
          </p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[28px] bg-brand text-white shadow-[0_18px_45px_rgba(31,107,79,0.16)]">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-white/5" />

          <div className="relative flex flex-col items-center gap-7 px-6 py-7">
            <div className="text-center">
              <p className="type-label font-extrabold uppercase tracking-[1.5px] text-white/65">
                Overall score
              </p>
              <div className="mt-2 flex items-end justify-center gap-2">
                <span className="text-[64px] font-extrabold leading-none tracking-[-3px]">82</span>
                <span className="mb-2 text-[18px] font-bold text-white/55">/ 100</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="inline-flex items-center rounded-lg bg-white/12 px-2.5 py-1 type-caption font-extrabold">
                  B2
                </span>
                <span className="type-meta font-semibold text-white/75">Upper Intermediate</span>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="type-label font-extrabold uppercase tracking-[1px] text-white/60">
                  Performance
                </span>
                <span className="type-caption font-extrabold">Strong</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-white" style={{ width: '82%' }} />
              </div>
              <p className="type-caption mt-3 leading-5 text-white/60">
                You demonstrated strong overall English communication skills.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-4">
            <p className="type-label font-extrabold uppercase tracking-[1.2px] text-muted">
              Skill performance
            </p>
            <h2 className="type-section mt-1">Your English skills</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="rounded-[20px] border border-[#E6EBE5] bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <SkillIcon name={skill.icon} tone={skill.tone} />
                    <div>
                      <p className="type-meta font-extrabold">{skill.name}</p>
                      <p className="type-caption text-muted">{skill.detail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[22px] font-extrabold leading-none">{skill.score}</p>
                    <p
                      className={`type-label mt-1 font-extrabold ${
                        skill.tone === 'accent' ? 'text-accent' : 'text-brand'
                      }`}
                    >
                      {skill.label}
                    </p>
                  </div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EEF1EC]">
                  <div
                    className={`h-full rounded-full ${
                      skill.tone === 'accent' ? 'bg-accent' : 'bg-brand'
                    }`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 rounded-[22px] border border-[#E4EAE2] bg-[#F5F7F2] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-brand">
                <path
                  d="M9 18h6M10 21h4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M8 15.5c-1.2-1-2-2.5-2-4.2a6 6 0 1 1 12 0c0 1.7-.8 3.2-2 4.2-.7.6-1 1.2-1 2H9c0-.8-.3-1.4-1-2Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="type-meta font-extrabold">Your strongest skill is Speaking</p>
              <p className="type-caption mt-1 leading-5 text-muted">
                You showed strong pronunciation, fluency and confidence while speaking. Writing is
                your biggest opportunity for improvement.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/detailed-report`)}
            className="type-btn flex h-12 w-full items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_20px_rgba(31,107,79,0.14)] transition hover:bg-[#195A42] active:scale-[0.98]"
          >
            View Detailed Report
          </button>
          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/improvement-plan`)}
            className="type-btn flex h-12 w-full items-center justify-center rounded-xl border border-[#DDE3DC] bg-white text-dark transition hover:bg-[#F7F8F5] active:scale-[0.98]"
          >
            View Improvement Plan
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/home')}
          className="type-caption mt-5 w-full text-center font-bold text-muted transition hover:text-brand"
        >
          Back to Dashboard
        </button>

        <div className="mt-9 pb-2 text-center">
          <p className="type-label font-bold tracking-[1.4px] text-[#A0A7A2]">
            ELYTEDU · ENGLISH ASSESSMENT
          </p>
        </div>
      </section>
    </div>
  )
}
