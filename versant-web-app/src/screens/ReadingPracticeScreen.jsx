import { useNavigate } from 'react-router-dom'

const ACTIVITIES = [
  {
    id: 'read-aloud',
    title: 'Read Aloud',
    description: 'Read sentences and passages clearly',
    duration: '5 min',
    tag: 'Speaking + Reading',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M4 5h16" />
        <path strokeLinecap="round" d="M4 9h12" />
        <path strokeLinecap="round" d="M4 13h16" />
        <path strokeLinecap="round" d="M4 17h10" />
      </svg>
    ),
  },
  {
    id: 'sentence-completion',
    title: 'Sentence Completion',
    description: 'Complete sentences using the right words',
    duration: '5 min',
    tag: 'Vocabulary',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M5 5h14" />
        <path strokeLinecap="round" d="M5 9h7" />
        <path strokeLinecap="round" d="M5 13h14" />
        <path strokeLinecap="round" d="M5 17h9" />
      </svg>
    ),
  },
  {
    id: 'reading-comprehension',
    title: 'Reading Comprehension',
    description: 'Read passages and answer questions',
    duration: '8 min',
    tag: 'Intermediate',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M3 5h18" />
        <path strokeLinecap="round" d="M3 9h18" />
        <path strokeLinecap="round" d="M3 13h11" />
        <path strokeLinecap="round" d="M3 17h15" />
      </svg>
    ),
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary in Context',
    description: 'Understand words from the context',
    duration: '5 min',
    tag: 'Vocabulary',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M4 5h16" />
        <path strokeLinecap="round" d="M4 9h10" />
        <path strokeLinecap="round" d="M4 13h16" />
        <path strokeLinecap="round" d="M4 17h10" />
      </svg>
    ),
  },
]

export default function ReadingPracticeScreen() {
  const navigate = useNavigate()

  return (
    <div className="hide-scrollbar relative h-full overflow-y-auto bg-transparent font-nunito text-dark">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-light/30 blur-3xl" />
        <div className="absolute left-[-80px] top-[45%] h-32 w-32 rounded-full bg-[#FCE5D2]/25 blur-3xl" />
      </div>

      <header className="relative z-10 px-6 pb-5 pt-7">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/practice')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3EC] text-dark transition active:scale-95"
            aria-label="Back to practice"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="text-center">
            <p className="type-label text-muted">Practice</p>
            <h1 className="type-section mt-0.5">Reading</h1>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3EC] text-dark transition active:scale-95"
            aria-label="Reading history"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 3-6.7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4v5h5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
            </svg>
          </button>
        </div>
      </header>

      <div className="relative z-10 px-6 pb-6">
        <section className="relative mb-7 overflow-hidden rounded-[28px] bg-brand-light p-6">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/35" />
          <div className="absolute bottom-[-55px] -right-12 h-32 w-32 rounded-full bg-white/25" />
          <div className="absolute bottom-[-70px] left-[-45px] h-28 w-28 rounded-full bg-brand/10" />

          <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
              />
              <path strokeLinecap="round" d="M8 6h8" />
              <path strokeLinecap="round" d="M8 10h8" />
            </svg>
          </div>

          <div className="relative">
            <h2 className="type-title">
              Read. Understand.
              <br />
              Grow.
            </h2>
            <p className="type-body mt-3 max-w-[290px] text-[#526057]">
              Build stronger comprehension, vocabulary and reading confidence.
            </p>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="type-caption font-bold text-[#526057]">Today&apos;s practice</span>
                <span className="type-caption font-extrabold text-brand">7 / 15 min</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/70">
                <div className="h-full w-[47%] rounded-full bg-brand" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="type-section">Quick Practice</h2>
            <span className="type-caption font-bold text-muted">3 min</span>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-4 rounded-[22px] border border-[#E7E9E1] bg-white/95 p-4 text-left backdrop-blur-sm transition active:scale-[0.99]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#F1F4EB] text-brand">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" d="M4 4h16v16H4z" />
                <path strokeLinecap="round" d="M8 8h8" />
                <path strokeLinecap="round" d="M8 12h8" />
                <path strokeLinecap="round" d="M8 16h5" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="type-card">Read & Answer</h3>
              <p className="type-caption mt-0.5 text-muted">
                Read a short passage and answer questions
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="type-caption rounded-full bg-[#F1F4EB] px-2 py-0.5 font-bold text-brand">
                  Beginner
                </span>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </button>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="type-section">Reading Activities</h2>
            <button type="button" className="type-link text-brand">
              See all
            </button>
          </div>

          <div className="space-y-3">
            {ACTIVITIES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex w-full items-center gap-4 rounded-[22px] border border-[#E7E9E1] bg-white/95 p-4 text-left backdrop-blur-sm transition active:scale-[0.99]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#F1F4EB] text-brand">
                  {item.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="type-meta font-extrabold">{item.title}</h3>
                  <p className="type-caption mt-0.5 text-muted">{item.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="type-caption font-bold text-muted">{item.duration}</span>
                    <span className="h-1 w-1 rounded-full bg-[#C5CBC5]" />
                    <span className="type-caption font-bold text-brand">{item.tag}</span>
                  </div>
                </div>

                <svg
                  className="h-4 w-4 shrink-0 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="flex gap-3 rounded-[22px] border border-[#F4DEC9] bg-[#FFF4E9]/95 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FCE2CC] text-accent">
              <svg
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" d="M9 18h6" />
                <path strokeLinecap="round" d="M10 22h4" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2Z"
                />
              </svg>
            </div>
            <div>
              <p className="type-caption font-extrabold text-dark">Reading Tip</p>
              <p className="type-caption mt-1 leading-4 text-[#756B63]">
                Focus on the main idea first. Use the surrounding words to understand unfamiliar
                vocabulary instead of translating every word.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
