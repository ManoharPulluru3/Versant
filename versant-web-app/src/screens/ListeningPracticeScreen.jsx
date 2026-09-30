import { useNavigate } from 'react-router-dom'

const ACTIVITIES = [
  {
    id: 'listen-respond',
    title: 'Listen & Respond',
    description: 'Listen and choose the best response',
    duration: '5 min',
    iconBg: 'bg-[#FFF0E2]',
    iconColor: 'text-accent',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path strokeLinecap="round" d="M15 9.5a4 4 0 0 1 0 5" />
        <path strokeLinecap="round" d="M17.5 7a7.5 7.5 0 0 1 0 10" />
      </svg>
    ),
  },
  {
    id: 'conversations',
    title: 'Conversations',
    description: 'Understand everyday conversations',
    duration: '7 min',
    iconBg: 'bg-brand-light',
    iconColor: 'text-brand',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        />
        <path strokeLinecap="round" d="M7 10h10M7 13h6" />
      </svg>
    ),
  },
  {
    id: 'passage',
    title: 'Passage Comprehension',
    description: 'Listen to a passage and answer questions',
    duration: '8 min',
    iconBg: 'bg-cream',
    iconColor: 'text-brand',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        />
        <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    id: 'audio-comprehension',
    title: 'Audio Comprehension',
    description: 'Listen carefully and identify key information',
    duration: '6 min',
    iconBg: 'bg-[#FFF0E2]',
    iconColor: 'text-accent',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" d="M10 9v6l5-3-5-3Z" />
      </svg>
    ),
  },
]

export default function ListeningPracticeScreen() {
  const navigate = useNavigate()

  return (
    <div className="hide-scrollbar h-full overflow-y-auto bg-transparent font-nunito text-dark">
      <header className="px-6 pb-3 pt-7">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/practice')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream"
            aria-label="Back to practice"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="text-center">
            <p className="type-label text-muted">Practice</p>
            <h1 className="type-section mt-0.5">Listening</h1>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream"
            aria-label="Listening history"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 3-6.7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4v5h5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
            </svg>
          </button>
        </div>
      </header>

      <section className="mt-5 px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-brand-light p-6">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/40" />
          <div className="absolute bottom-[-35px] right-8 h-24 w-24 rounded-full bg-accent/10" />

          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path strokeLinecap="round" d="M15 9.5a4 4 0 0 1 0 5" />
              <path strokeLinecap="round" d="M17.5 7a7.5 7.5 0 0 1 0 10" />
            </svg>
          </div>

          <h2 className="type-title relative z-10 mt-5">Listen. Understand. Respond.</h2>
          <p className="type-body relative z-10 mt-2 max-w-[320px] text-[#617067]">
            Train your ability to understand spoken English in everyday conversations and
            situations.
          </p>

          <div className="relative z-10 mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="type-caption font-bold text-[#617067]">Today&apos;s practice</span>
              <span className="type-caption font-extrabold text-brand">6 / 15 min</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
              <div className="h-full w-[40%] rounded-full bg-brand" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="type-section">Quick practice</h2>
            <p className="type-caption mt-1 text-muted">Start with a short listening activity</p>
          </div>
          <span className="type-caption font-bold text-accent">3–5 min</span>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-[24px] border border-[#E5E8E2] bg-white p-4 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E2]">
              <svg
                className="h-6 w-6 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path strokeLinecap="round" d="M15 9.5a4 4 0 0 1 0 5" />
                <path strokeLinecap="round" d="M17.5 7a7.5 7.5 0 0 1 0 10" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="type-card">Listen & Respond</h3>
              <p className="type-caption mt-1 text-muted">Listen and choose the best response</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="type-caption text-muted">Beginner</span>
                <span className="text-[#D8DDD7]">•</span>
                <span className="type-caption text-muted">3 min</span>
              </div>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </button>
      </section>

      <section className="mt-7 px-6 pb-6">
        <div>
          <h2 className="type-section">Listening activities</h2>
          <p className="type-caption mt-1 text-muted">Choose what you want to practice</p>
        </div>

        <div className="mt-4 space-y-3">
          {ACTIVITIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full rounded-[22px] border border-[#E5E8E2] bg-white p-4 text-left"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                >
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="type-card">{item.title}</h3>
                  <p className="type-caption mt-0.5 text-muted">{item.description}</p>
                </div>

                <div className="text-right">
                  <span className="type-caption block font-bold text-muted">{item.duration}</span>
                  <svg
                    className="ml-auto mt-2 h-4 w-4 text-[#A0A7A2]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-cream p-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
              <span className="text-sm">💡</span>
            </div>
            <div>
              <p className="type-caption font-extrabold">Listening tip</p>
              <p className="type-caption mt-1 leading-5 text-muted">
                Don&apos;t try to understand every word. Focus on the main idea, important details
                and the speaker&apos;s intent.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
