import { useNavigate } from 'react-router-dom'

const ACTIVITIES = [
  {
    id: 'read-aloud',
    title: 'Read Aloud',
    description: 'Read sentences clearly and naturally',
    duration: '5 min',
    iconBg: 'bg-brand-light',
    iconColor: 'text-brand',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h5M9 12h5" />
      </svg>
    ),
  },
  {
    id: 'repeat',
    title: 'Repeat',
    description: 'Listen to a sentence and repeat it',
    duration: '5 min',
    iconBg: 'bg-[#FFF0E2]',
    iconColor: 'text-accent',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6v12l10-6L8 6Z" />
      </svg>
    ),
  },
  {
    id: 'short-answer',
    title: 'Short Answer',
    description: 'Answer everyday questions naturally',
    duration: '5 min',
    iconBg: 'bg-brand-light',
    iconColor: 'text-brand',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 8h10M7 12h6M5 20l2.5-3H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"
        />
      </svg>
    ),
  },
  {
    id: 'story-retelling',
    title: 'Story Retelling',
    description: 'Listen to a story and retell it',
    duration: '7 min',
    iconBg: 'bg-cream',
    iconColor: 'text-brand',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 9h16M4 13h10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l3 3m0 0l-3 3m3-3h-7" />
      </svg>
    ),
  },
  {
    id: 'open-question',
    title: 'Open Question',
    description: 'Express your thoughts on a topic',
    duration: '7 min',
    iconBg: 'bg-[#FFF0E2]',
    iconColor: 'text-accent',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1.1.9-1.7 1.3-1.7 2.7"
        />
        <path strokeLinecap="round" d="M12 17h.01" />
      </svg>
    ),
  },
]

export default function SpeakingPracticeScreen() {
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
            <h1 className="type-section mt-0.5">Speaking</h1>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream"
            aria-label="Speaking history"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v4a4 4 0 0 0 4 4Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 0 1-14 0" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
            </svg>
          </div>

          <h2 className="type-title relative z-10 mt-5">Speak with confidence.</h2>
          <p className="type-body relative z-10 mt-2 max-w-[310px] text-[#617067]">
            Practice speaking naturally and improve your pronunciation, fluency and communication.
          </p>

          <div className="relative z-10 mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="type-caption font-bold text-[#617067]">Today&apos;s practice</span>
              <span className="type-caption font-extrabold text-brand">8 / 15 min</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
              <div className="h-full w-[53%] rounded-full bg-brand" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="type-section">Quick practice</h2>
            <p className="type-caption mt-1 text-muted">Start with a short speaking activity</p>
          </div>
          <span className="type-caption font-bold text-accent">5–10 min</span>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v4a4 4 0 0 0 4 4Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10a7 7 0 0 1-14 0" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v4" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="type-card">Speak about yourself</h3>
              <p className="type-caption mt-1 text-muted">Answer a simple question</p>
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
          <h2 className="type-section">Speaking activities</h2>
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
              <p className="type-caption font-extrabold">Speaking tip</p>
              <p className="type-caption mt-1 leading-5 text-muted">
                Focus on speaking naturally. Don&apos;t worry about being perfect. Clear and
                confident communication matters most.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
