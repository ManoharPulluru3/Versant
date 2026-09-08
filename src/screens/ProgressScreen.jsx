import { useNavigate } from 'react-router-dom'

const DEFAULT_TEST_ID = 'english-communication'

const SKILLS = [
  {
    name: 'Speaking',
    score: 86,
    label: 'Strong',
    tone: 'brand',
    icon: 'mic',
  },
  {
    name: 'Listening',
    score: 79,
    label: 'Good',
    tone: 'brand',
    icon: 'speaker',
  },
  {
    name: 'Reading',
    score: 84,
    label: 'Strong',
    tone: 'brand',
    icon: 'book',
  },
  {
    name: 'Writing',
    score: 78,
    label: 'Focus area',
    tone: 'accent',
    icon: 'pen',
  },
]

const HISTORY = [
  {
    name: 'English Communication Test',
    date: 'Sep 8, 2026',
    score: 82,
    delta: '+8',
    level: 'B2',
    levelTone: 'brand',
  },
  {
    name: 'English Placement Test',
    date: 'Aug 12, 2026',
    score: 74,
    level: 'B1',
    levelTone: 'brand',
  },
  {
    name: 'Speaking Evaluation',
    date: 'Jul 21, 2026',
    score: 71,
    level: 'B1',
    levelTone: 'muted',
  },
  {
    name: 'Communication Practice Test',
    date: 'Jun 10, 2026',
    score: 68,
    level: 'B1',
    levelTone: 'muted',
  },
]

function SkillIcon({ name }) {
  if (name === 'mic') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <path d="M12 19v3" />
        <path d="M8 22h8" />
      </svg>
    )
  }

  if (name === 'speaker') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5 6 9H2v6h4l5 4Z" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    )
  }

  if (name === 'book') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
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

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

export default function ProgressScreen() {
  const navigate = useNavigate()

  return (
    <div className="hide-scrollbar relative h-full overflow-y-auto bg-transparent font-nunito text-dark">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-16 h-52 w-52 rounded-full bg-brand-light opacity-70 blur-3xl" />
        <div className="absolute -right-16 top-[40%] h-48 w-48 rounded-full bg-[#F4D7BE] opacity-45 blur-3xl" />
      </div>

      <header className="relative z-10 px-5 pb-2 pt-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-label text-[#9AA19B]">Your scores over time</p>
            <h1 className="type-title mt-1 text-dark">Progress</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/tests')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream"
            aria-label="View assessments"
          >
            <svg
              className="h-[19px] w-[19px] text-[#39443E]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m7 16 4-5 3 3 6-8" />
            </svg>
          </button>
        </div>
      </header>

      <section className="relative z-10 px-5 pb-8 pt-5">
        <p className="type-body leading-6 text-muted">
          Track how your skills have developed and where you&apos;re improving.
        </p>

        {/* Current score */}
        <div className="mt-5 overflow-hidden rounded-[25px] bg-brand p-5 text-white">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="type-label text-white/70">Current score</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[44px] font-extrabold leading-none tracking-[-0.05em]">
                  82
                </span>
                <span className="pb-1 type-meta font-semibold text-white/65">/ 100</span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="rounded-full bg-white/15 px-2.5 py-1 type-label font-extrabold text-white">
                  B2
                </span>
                <span className="type-caption text-white/70">Upper Intermediate</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3 text-right">
              <p className="type-label text-white/65">Since last</p>
              <p className="mt-1 text-[26px] font-extrabold leading-none">+8</p>
              <p className="mt-1 type-label text-white/60">74 → 82</p>
            </div>
          </div>
        </div>

        {/* Score trend */}
        <div className="mt-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="type-label text-[#9AA19B]">Score trend</p>
              <h2 className="type-section mt-1 text-dark">Overall performance</h2>
            </div>
            <span className="rounded-full bg-brand-light px-3 py-1.5 type-label font-extrabold text-brand">
              +8 pts
            </span>
          </div>

          <div className="mt-4 rounded-[24px] border border-[#E7EAE4] bg-white p-4">
            <div className="relative h-[200px] w-full">
              <div className="absolute bottom-0 left-0 top-0 flex w-7 flex-col justify-between type-label font-bold text-[#A0A7A2]">
                <span>100</span>
                <span>80</span>
                <span>60</span>
              </div>

              <div className="absolute bottom-0 left-8 right-0 top-0">
                <svg
                  viewBox="0 0 700 220"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1F6B4F" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#1F6B4F" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="10" x2="700" y2="10" stroke="#EEF1EB" strokeWidth="1" />
                  <line x1="0" y1="110" x2="700" y2="110" stroke="#EEF1EB" strokeWidth="1" />
                  <line x1="0" y1="210" x2="700" y2="210" stroke="#EEF1EB" strokeWidth="1" />

                  <path
                    d="M 30 180 L 160 145 L 290 120 L 420 95 L 550 70 L 670 45 L 670 220 L 30 220 Z"
                    fill="url(#scoreGradient)"
                  />
                  <path
                    d="M 30 180 L 160 145 L 290 120 L 420 95 L 550 70 L 670 45"
                    fill="none"
                    stroke="#1F6B4F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="30" cy="180" r="5" fill="#FCFBF8" stroke="#1F6B4F" strokeWidth="3" />
                  <circle cx="160" cy="145" r="5" fill="#FCFBF8" stroke="#1F6B4F" strokeWidth="3" />
                  <circle cx="290" cy="120" r="5" fill="#FCFBF8" stroke="#1F6B4F" strokeWidth="3" />
                  <circle cx="420" cy="95" r="5" fill="#FCFBF8" stroke="#1F6B4F" strokeWidth="3" />
                  <circle cx="550" cy="70" r="5" fill="#FCFBF8" stroke="#1F6B4F" strokeWidth="3" />
                  <circle cx="670" cy="45" r="5" fill="#FCFBF8" stroke="#1F6B4F" strokeWidth="3" />
                </svg>

                <div className="absolute right-[1%] top-[2%] rounded-lg bg-dark px-2 py-1 type-label font-extrabold text-white">
                  82
                </div>
              </div>
            </div>

            <div className="ml-8 mt-2 grid grid-cols-6 text-center type-label font-bold text-[#9AA19C]">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#F4F7F1] p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 17 6-6 4 4 8-8" />
                  <path d="M14 7h7v7" />
                </svg>
              </div>
              <div>
                <div className="type-caption font-extrabold">Steady improvement</div>
                <p className="type-caption mt-0.5 leading-5 text-muted">
                  Your score has risen across recent assessments. Keep practicing to reach the next
                  level.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-7">
          <p className="type-label text-[#9AA19B]">Skill progress</p>
          <h2 className="type-section mt-1 text-dark">How your skills compare</h2>

          <div className="mt-4 space-y-3">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="rounded-[22px] border border-[#E7EAE4] bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        skill.tone === 'accent'
                          ? 'bg-[#FBE9DC] text-accent'
                          : 'bg-brand-light text-brand'
                      }`}
                    >
                      <SkillIcon name={skill.icon} />
                    </div>
                    <div>
                      <div className="type-meta font-extrabold">{skill.name}</div>
                      <div className="type-label mt-0.5 text-[#929A95]">{skill.label}</div>
                    </div>
                  </div>
                  <span className="text-[20px] font-extrabold">{skill.score}</span>
                </div>

                <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-[#EEF1EB]">
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

        {/* History */}
        <div className="mt-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="type-label text-[#9AA19B]">History</p>
              <h2 className="type-section mt-1 text-dark">Recent assessments</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/tests')}
              className="type-caption font-extrabold text-brand"
            >
              View all
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-[24px] border border-[#E7EAE4] bg-white">
            {HISTORY.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => navigate(`/tests/${DEFAULT_TEST_ID}/results`)}
                className={`flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-[#F7F8F4] ${
                  index < HISTORY.length - 1 ? 'border-b border-[#EEF1EB]' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate type-meta font-extrabold">{item.name}</div>
                  <div className="mt-1 type-label font-semibold text-[#929A95]">{item.date}</div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-[17px] font-extrabold">{item.score}</span>
                    {item.delta && (
                      <span className="type-label font-bold text-brand">{item.delta}</span>
                    )}
                  </div>
                  <div
                    className={`mt-0.5 type-label font-extrabold ${
                      item.levelTone === 'brand' ? 'text-brand' : 'text-muted'
                    }`}
                  >
                    {item.level}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="mt-6 flex items-start gap-3.5 rounded-[24px] border border-[#E7EAE4] bg-white p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="m7 16 4-5 3 3 6-8" />
            </svg>
          </div>
          <div>
            <div className="type-meta font-extrabold">Biggest improvement</div>
            <p className="type-caption mt-1 leading-5 text-muted">
              Up{' '}
              <span className="font-extrabold text-brand">14 points</span> since your first
              assessment — consistent practice is paying off.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/practice')}
          className="type-btn mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand font-extrabold text-white transition hover:opacity-95"
        >
          Continue Practicing
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
      </section>
    </div>
  )
}
