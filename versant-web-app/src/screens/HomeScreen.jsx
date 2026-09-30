import { useNavigate } from 'react-router-dom'

export default function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="hide-scrollbar h-full overflow-y-auto bg-transparent font-nunito">
        <header className="px-5 pt-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#E5EBD9] text-2xl">
                👩🏻
              </div>
              <div>
                <p className="type-caption text-[#8A918B]">Good morning</p>
                <h1 className="type-card mt-0.5 text-dark">Emma Wilson</h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/notifications')}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-cream"
              aria-label="Notifications"
            >
              <svg
                className="h-5 w-5 text-[#26342D]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.4-1.5A2 2 0 0 1 18 14.1V11a6 6 0 1 0-12 0v3.1c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
                />
              </svg>
              <span className="type-nav absolute right-2 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-extrabold text-white">
                4
              </span>
            </button>
          </div>
        </header>

        <div className="px-5 pb-6 pt-6">
          <section className="relative overflow-hidden rounded-[28px] bg-brand p-5 text-white">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[22px] border-white/10" />
            <div className="absolute -bottom-16 -right-4 h-32 w-32 rounded-full border-[18px] border-white/5" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F7B267]" />
                    <span className="type-label text-white">Upcoming Assessment</span>
                  </div>

                  <h2 className="type-title max-w-[250px] text-white">
                    English Communication Test
                  </h2>

                  <p className="type-body mt-2 max-w-[250px] text-white/75">
                    Your college has assigned a new English assessment.
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                    <path strokeLinecap="round" d="M8 9h8M8 13h5M8 17h3" />
                  </svg>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="8" />
                    <path strokeLinecap="round" d="M12 8v4l2.5 2" />
                  </svg>
                  <span className="type-caption font-semibold text-white/80">30 min</span>
                </div>

                <div className="h-1 w-1 rounded-full bg-white/30" />

                <div className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                    />
                  </svg>
                  <span className="type-caption font-semibold text-white/80">Due Sep 14</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/tests/english-communication')}
                className="type-btn mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-brand transition active:scale-[0.98]"
              >
                Start Assessment
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="type-label text-[#9AA19B]">Your English</p>
                <h2 className="type-section mt-1 text-dark">Communication Level</h2>
              </div>
              <button type="button" className="type-link text-brand">
                View report
              </button>
            </div>

            <div className="mt-4 flex items-center gap-5 rounded-[24px] bg-cream p-4">
              <div className="relative h-[82px] w-[82px] shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#DDE3D5"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#1F6B4F"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="264"
                    strokeDashoffset="52"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="type-score text-dark">80</span>
                  <span className="type-label mt-1 text-muted">Score</span>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="type-card text-dark">B2 — Upper Intermediate</h3>
                <p className="type-caption mt-1 text-muted">
                  You communicate confidently in everyday and academic situations.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#D8DED2]">
                    <div className="h-full w-[80%] rounded-full bg-brand" />
                  </div>
                  <span className="type-caption font-extrabold text-brand">80%</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="type-section text-dark">Your Skills</h2>
              <button type="button" className="type-link text-muted">
                Details
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-[#EEF0E9] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light">
                    <svg
                      className="h-[18px] w-[18px] text-brand"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        d="M12 14a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v3a4 4 0 0 0 4 4Z"
                      />
                      <path strokeLinecap="round" d="M19 10a7 7 0 0 1-14 0M12 17v4M9 21h6" />
                    </svg>
                  </div>
                  <span className="type-card text-brand">84</span>
                </div>
                <p className="type-meta mt-3 font-extrabold text-dark">Speaking</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E9ECE6]">
                  <div className="h-full w-[84%] rounded-full bg-brand" />
                </div>
              </div>

              <div className="rounded-[22px] border border-[#EEF0E9] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0DF]">
                    <svg
                      className="h-4 w-4 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" d="M4 14a8 8 0 0 1 16 0" />
                      <path
                        strokeLinecap="round"
                        d="M4 14v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2ZM20 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"
                      />
                    </svg>
                  </div>
                  <span className="type-card text-accent">78</span>
                </div>
                <p className="type-meta mt-3 font-extrabold text-dark">Listening</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E9ECE6]">
                  <div className="h-full w-[78%] rounded-full bg-accent" />
                </div>
              </div>

              <div className="rounded-[22px] border border-[#EEF0E9] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8EAF7]">
                    <svg
                      className="h-4 w-4 text-[#5C63A8]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z"
                      />
                      <path strokeLinecap="round" d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20" />
                    </svg>
                  </div>
                  <span className="type-card text-[#5C63A8]">81</span>
                </div>
                <p className="type-meta mt-3 font-extrabold text-dark">Reading</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E9ECE6]">
                  <div className="h-full w-[81%] rounded-full bg-[#5C63A8]" />
                </div>
              </div>

              <div className="rounded-[22px] border border-[#EEF0E9] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2E5F1]">
                    <svg
                      className="h-4 w-4 text-[#9A5792]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"
                      />
                    </svg>
                  </div>
                  <span className="type-card text-[#9A5792]">76</span>
                </div>
                <p className="type-meta mt-3 font-extrabold text-dark">Writing</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E9ECE6]">
                  <div className="h-full w-[76%] rounded-full bg-[#9A5792]" />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="type-label text-[#9AA19B]">Improve your skills</p>
                <h2 className="type-section mt-1 text-dark">Quick Practice</h2>
              </div>
              <button type="button" className="type-link text-brand">
                See all
              </button>
            </div>

            <div className="hide-scrollbar -mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1">
              <div className="min-w-[190px] rounded-[23px] bg-cream p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light">
                    <svg
                      className="h-5 w-5 text-brand"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        d="M12 14a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v3a4 4 0 0 0 4 4Z"
                      />
                      <path strokeLinecap="round" d="M19 10a7 7 0 0 1-14 0M12 17v4M9 21h6" />
                    </svg>
                  </div>
                  <span className="type-caption rounded-full bg-white px-2.5 py-1 text-muted">
                    5 min
                  </span>
                </div>
                <h3 className="type-card mt-4 text-dark">Speaking Practice</h3>
                <p className="type-caption mt-1 text-muted">
                  Practice pronunciation and fluency.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/practice/speaking')}
                  className="type-link mt-4 flex items-center gap-1 text-brand"
                >
                  Practice now
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              <div className="min-w-[190px] rounded-[23px] bg-[#FFF2E4] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                    <svg
                      className="h-5 w-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" d="M4 14a8 8 0 0 1 16 0" />
                      <path
                        strokeLinecap="round"
                        d="M4 14v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2ZM20 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"
                      />
                    </svg>
                  </div>
                  <span className="type-caption rounded-full bg-white px-2.5 py-1 text-muted">
                    7 min
                  </span>
                </div>
                <h3 className="type-card mt-4 text-dark">Listening Practice</h3>
                <p className="type-caption mt-1 text-muted">
                  Improve your understanding of spoken English.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/practice/listening')}
                  className="type-link mt-4 flex items-center gap-1 text-accent"
                >
                  Practice now
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              <div className="min-w-[190px] rounded-[23px] bg-[#EEEFFA] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                    <svg
                      className="h-5 w-5 text-[#5C63A8]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z"
                      />
                      <path strokeLinecap="round" d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20" />
                    </svg>
                  </div>
                  <span className="type-caption rounded-full bg-white px-2.5 py-1 text-muted">
                    6 min
                  </span>
                </div>
                <h3 className="type-card mt-4 text-dark">Reading Practice</h3>
                <p className="type-caption mt-1 text-muted">
                  Build comprehension and reading speed.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/practice/reading')}
                  className="type-link mt-4 flex items-center gap-1 text-[#5C63A8]"
                >
                  Practice now
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="type-section text-dark">Recent Activity</h2>
              <button type="button" className="type-link text-muted">
                View all
              </button>
            </div>

            <div className="mt-3 divide-y divide-[#EEF0E9]">
              <div className="flex items-center gap-3 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light">
                  <svg
                    className="h-4 w-4 text-brand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" d="M5 12l4 4L19 6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="type-meta truncate font-extrabold text-dark">Speaking Practice</p>
                  <p className="type-caption mt-0.5 text-[#8A918B]">
                    Story Retelling · 8 minutes ago
                  </p>
                </div>
                <span className="type-meta font-black text-brand">86</span>
              </div>

              <div className="flex items-center gap-3 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0DF]">
                  <svg
                    className="h-4 w-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" d="M4 14a8 8 0 0 1 16 0" />
                    <path
                      strokeLinecap="round"
                      d="M4 14v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2ZM20 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="type-meta truncate font-extrabold text-dark">Listening Practice</p>
                  <p className="type-caption mt-0.5 text-[#8A918B]">Conversations · Yesterday</p>
                </div>
                <span className="type-meta font-black text-accent">78</span>
              </div>

              <div className="flex items-center gap-3 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEEFFA]">
                  <svg
                    className="h-4 w-4 text-[#5C63A8]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="type-meta truncate font-extrabold text-dark">Reading Practice</p>
                  <p className="type-caption mt-0.5 text-[#8A918B]">
                    Passage Comprehension · 2 days ago
                  </p>
                </div>
                <span className="type-meta font-black text-[#5C63A8]">81</span>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[24px] border border-[#EEF0E9] bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0DF]">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <p className="type-meta font-extrabold text-dark">Daily Practice Goal</p>
                  <p className="type-caption mt-0.5 text-[#8A918B]">
                    Keep your English improving
                  </p>
                </div>
              </div>
              <span className="type-meta font-black text-accent">12 / 15 min</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EEF0E9]">
              <div className="h-full w-[80%] rounded-full bg-accent" />
            </div>
          </section>
        </div>
    </div>
  )
}
