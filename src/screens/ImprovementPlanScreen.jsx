import { useNavigate, useParams } from 'react-router-dom'

const FOCUS_AREAS = [
  {
    name: 'Writing',
    note: 'Main improvement area',
    score: 78,
    tone: 'accent',
    tags: ['Grammar', 'Organization', 'Task completion'],
    icon: 'pen',
  },
  {
    name: 'Listening',
    note: 'Secondary focus',
    score: 79,
    tone: 'brand',
    tags: ['Key details', 'Context', 'Accuracy'],
    icon: 'speaker',
  },
]

const ACTIVITIES = [
  {
    title: 'Email Writing',
    description: 'Practice professional tone, structure and clear requests.',
    minutes: '7 min',
    skill: 'Writing',
    priority: true,
    tone: 'accent',
    route: '/practice/writing',
    icon: 'email',
  },
  {
    title: 'Grammar Practice',
    description: 'Improve sentence accuracy, verb forms and common grammar patterns.',
    minutes: '5 min',
    skill: 'Writing',
    priority: false,
    tone: 'brand',
    route: '/practice/writing',
    icon: 'book',
  },
  {
    title: 'Listening for Details',
    description: 'Listen to short conversations and identify important details.',
    minutes: '6 min',
    skill: 'Listening',
    priority: false,
    tone: 'brand',
    route: '/practice/listening',
    icon: 'speaker',
  },
  {
    title: 'Passage Comprehension',
    description: 'Read short passages and identify the main idea and supporting details.',
    minutes: '5 min',
    skill: 'Reading',
    priority: false,
    tone: 'brand',
    route: '/practice/reading',
    icon: 'passage',
  },
]

function FocusIcon({ name, className = 'h-5 w-5' }) {
  if (name === 'pen') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 5 6 9H2v6h4l5 4Z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function ActivityIcon({ name }) {
  if (name === 'email') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  }

  if (name === 'book') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5V5a2 2 0 0 1 2-2h11" />
        <path d="M6 17h14" />
        <path d="M6 21h14" />
        <path d="M18 3v14" />
      </svg>
    )
  }

  if (name === 'passage') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 5a3 3 0 0 1 3-3h13v18H7a3 3 0 0 0-3 3Z" />
        <path d="M7 2v18" />
      </svg>
    )
  }

  return <FocusIcon name="speaker" className="h-5 w-5" />
}

export default function ImprovementPlanScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent font-nunito text-dark">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-90px] top-[5%] h-[260px] w-[260px] rounded-full bg-[rgba(31,107,79,0.10)] blur-[80px]" />
        <div className="absolute right-[-70px] top-[45%] h-[220px] w-[220px] rounded-full bg-[rgba(229,138,69,0.10)] blur-[80px]" />
      </div>

      <header className="relative z-10 shrink-0 border-b border-[#E8ECE4]">
        <div className="flex items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/detailed-report`)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3E8E1] bg-white transition hover:bg-cream"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.2 9.2 0 0 1-4-.9L3 21l1.9-4.5A8.5 8.5 0 1 1 21 11.5Z" />
                <path d="M8 10h.01" />
                <path d="M12 10h.01" />
                <path d="M16 10h.01" />
              </svg>
            </div>
            <div className="leading-none">
              <div className="type-meta font-extrabold tracking-[-0.02em]">ElytEdu</div>
              <div className="mt-1 type-label font-bold tracking-[0.18em] text-muted">
                ENGLISH ASSESSMENT
              </div>
            </div>
          </div>

          <div className="w-10" />
        </div>
      </header>

      <section className="relative z-10 flex-1 overflow-y-auto px-5 pb-10 pt-7">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3.5 py-1.5 type-caption font-extrabold tracking-wide text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          PERSONALIZED PLAN
        </div>

        <h1 className="type-display mt-4 tracking-[-0.04em]">Your improvement plan</h1>
        <p className="type-body mt-3 max-w-[720px] leading-7 text-muted">
          A focused practice plan based on your assessment performance. Strengthen your weaker
          areas while continuing to build on your strengths.
        </p>

        <div className="mt-7 overflow-hidden rounded-[28px] bg-brand p-6 text-white shadow-[0_18px_40px_rgba(31,107,79,0.16)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="type-label font-extrabold uppercase tracking-[0.14em] text-white/65">
                YOUR CURRENT LEVEL
              </div>
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <span className="text-[42px] font-extrabold leading-none tracking-[-0.05em]">B2</span>
                <span className="pb-1 type-meta font-semibold text-white/75">
                  Upper Intermediate
                </span>
              </div>
              <p className="mt-3 max-w-[500px] type-body leading-6 text-white/75">
                You already communicate effectively in English. Your next step is to improve
                written accuracy and listening detail.
              </p>
            </div>

            <div className="flex h-[88px] w-[88px] shrink-0 flex-col items-center justify-center rounded-[24px] border border-white/15 bg-white/10">
              <span className="text-[28px] font-extrabold leading-none">82</span>
              <span className="mt-1 type-label font-bold text-white/60">OVERALL</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="type-label font-extrabold uppercase tracking-[0.13em] text-muted">
            WHERE TO FOCUS
          </div>
          <h2 className="type-section mt-1.5 tracking-[-0.03em]">Your priority areas</h2>

          <div className="mt-4 space-y-4">
            {FOCUS_AREAS.map((area) => (
              <div
                key={area.name}
                className="rounded-[24px] border border-[#E7EAE4] bg-white p-5 transition hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        area.tone === 'accent'
                          ? 'bg-[#FBE9DC] text-accent'
                          : 'bg-brand-light text-brand'
                      }`}
                    >
                      <FocusIcon name={area.icon} />
                    </div>
                    <div>
                      <div className="type-meta font-extrabold">{area.name}</div>
                      <div className="type-caption text-muted">{area.note}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-extrabold">{area.score}</div>
                    <div className="type-label font-bold text-muted">/ 100</div>
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EEF1EB]">
                  <div
                    className={`h-full rounded-full ${
                      area.tone === 'accent' ? 'bg-accent' : 'bg-brand'
                    }`}
                    style={{ width: `${area.score}%` }}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {area.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F7F4EE] px-3 py-1.5 type-caption font-bold text-[#6F7772]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9">
          <div className="type-label font-extrabold uppercase tracking-[0.13em] text-muted">
            7-DAY PLAN
          </div>
          <h2 className="type-section mt-1.5 tracking-[-0.03em]">Your recommended practice</h2>
          <p className="type-caption mt-1 text-muted">
            Spend about 15 minutes a day building these skills.
          </p>

          <div className="mt-5 space-y-3">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity.title}
                type="button"
                onClick={() => navigate(activity.route)}
                className="flex w-full items-center gap-4 rounded-[22px] border border-[#E7EAE4] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[rgba(31,107,79,0.25)]"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    activity.tone === 'accent'
                      ? 'bg-[#FBE9DC] text-accent'
                      : 'bg-brand-light text-brand'
                  }`}
                >
                  <ActivityIcon name={activity.icon} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="type-meta font-extrabold">{activity.title}</span>
                    {activity.priority && (
                      <span className="rounded-full bg-[#FBE9DC] px-2 py-0.5 type-label font-extrabold text-[#B96528]">
                        HIGH PRIORITY
                      </span>
                    )}
                  </div>
                  <p className="type-caption mt-0.5 leading-5 text-muted">{activity.description}</p>
                  <div className="mt-2 flex items-center gap-3 type-label font-bold text-[#8A918C]">
                    <span>{activity.minutes}</span>
                    <span>•</span>
                    <span>{activity.skill}</span>
                  </div>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7A837D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-8 overflow-hidden rounded-[26px] border border-[#DDE7DB] bg-[#F2F7EF] p-5"
          style={{
            backgroundImage:
              'radial-gradient(rgba(31, 107, 79, 0.08) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div>
                <div className="type-meta font-extrabold">Keep your daily goal</div>
                <p className="type-caption mt-1 max-w-[560px] leading-5 text-muted">
                  Aim for at least 15 minutes of focused English practice each day. Consistency
                  will help turn these recommendations into progress.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div>
              <span className="text-[24px] font-extrabold">12</span>
              <span className="type-caption font-bold text-muted"> / 15 min</span>
            </div>
            <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-[#DDE5DA]">
              <div className="h-full rounded-full bg-brand" style={{ width: '80%' }} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-[24px] border border-[#E7EAE4] bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="type-meta font-extrabold">Don't stop practicing speaking</div>
            <p className="type-caption mt-1 leading-5 text-muted">
              Speaking is currently your strongest skill at{' '}
              <span className="font-extrabold text-brand">86</span>. Continue with short speaking
              activities to maintain your fluency and pronunciation.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/detailed-report`)}
            className="type-btn flex h-12 items-center justify-center rounded-2xl border border-[#DDE3DC] bg-white font-extrabold text-dark transition hover:bg-[#F6F7F3]"
          >
            View Detailed Report
          </button>
          <button
            type="button"
            onClick={() => navigate('/practice/writing')}
            className="type-btn flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand font-extrabold text-white transition hover:opacity-95"
          >
            Start Practice
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="pb-2 pt-8 text-center">
          <div className="type-label font-extrabold tracking-[0.2em] text-[#A1A7A2]">
            ELYTEDU · ENGLISH ASSESSMENT
          </div>
        </div>
      </section>
    </div>
  )
}
