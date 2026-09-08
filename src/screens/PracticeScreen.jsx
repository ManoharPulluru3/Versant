import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SKILL_TABS = [
  { id: 'all', label: 'All Skills' },
  { id: 'speaking', label: 'Speaking' },
  { id: 'listening', label: 'Listening' },
  { id: 'reading', label: 'Reading' },
  { id: 'writing', label: 'Writing' },
]

const ACTIVITIES = [
  {
    id: 'speaking-practice',
    skill: 'speaking',
    title: 'Speaking Practice',
    duration: '15 min',
    description: 'Practice pronunciation, fluency and speaking activities.',
    iconBg: 'bg-brand-light',
    iconColor: 'text-brand',
    buttonBg: 'bg-cream',
    route: '/practice/speaking',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 14a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v3a4 4 0 0 0 4 4Z" />
        <path strokeLinecap="round" d="M19 10a7 7 0 0 1-14 0M12 17v4M9 21h6" />
      </svg>
    ),
  },
  {
    id: 'listening-practice',
    skill: 'listening',
    title: 'Listening Practice',
    duration: '15 min',
    description: 'Train your ability to understand spoken English.',
    iconBg: 'bg-[#FFF0DF]',
    iconColor: 'text-accent',
    buttonBg: 'bg-[#FFF2E4]',
    route: '/practice/listening',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path strokeLinecap="round" d="M15 9.5a4 4 0 0 1 0 5" />
        <path strokeLinecap="round" d="M17.5 7a7.5 7.5 0 0 1 0 10" />
      </svg>
    ),
  },
  {
    id: 'reading-practice',
    skill: 'reading',
    title: 'Reading Practice',
    duration: '15 min',
    description: 'Build comprehension, vocabulary and reading confidence.',
    iconBg: 'bg-[#EEEFFA]',
    iconColor: 'text-[#5C63A8]',
    buttonBg: 'bg-[#EEEFFA]',
    route: '/practice/reading',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z"
        />
        <path strokeLinecap="round" d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20" />
      </svg>
    ),
  },
  {
    id: 'writing-practice',
    skill: 'writing',
    title: 'Writing Practice',
    duration: '15 min',
    description: 'Build grammar, vocabulary and written communication.',
    iconBg: 'bg-[#F2E5F1]',
    iconColor: 'text-[#9A5792]',
    buttonBg: 'bg-[#F2E5F1]',
    route: '/practice/writing',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 20h9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"
        />
        <path strokeLinecap="round" d="m15 5 3 3" />
      </svg>
    ),
  },
  {
    id: 'read-aloud',
    skill: 'speaking',
    title: 'Read Aloud',
    duration: '3 min',
    description: 'Read sentences clearly and naturally.',
    iconBg: 'bg-brand-light',
    iconColor: 'text-brand',
    buttonBg: 'bg-cream',
    route: '/practice/speaking',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M12 14a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v3a4 4 0 0 0 4 4Z" />
        <path strokeLinecap="round" d="M19 10a7 7 0 0 1-14 0M12 17v4M9 21h6" />
      </svg>
    ),
  },
  {
    id: 'repeat',
    skill: 'speaking',
    title: 'Repeat',
    duration: '4 min',
    description: 'Listen and repeat sentences accurately.',
    iconBg: 'bg-brand-light',
    iconColor: 'text-brand',
    buttonBg: 'bg-cream',
    route: '/practice/speaking',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M6 8a6 6 0 0 1 10.5-3.9L19 7" />
        <path strokeLinecap="round" d="M19 4v3h-3" />
        <path strokeLinecap="round" d="M18 16a6 6 0 0 1-10.5 3.9L5 17" />
        <path strokeLinecap="round" d="M5 20v-3h3" />
      </svg>
    ),
  },
  {
    id: 'listen-respond',
    skill: 'listening',
    title: 'Listen & Respond',
    duration: '5 min',
    description: 'Listen and choose the best response.',
    iconBg: 'bg-[#FFF0DF]',
    iconColor: 'text-accent',
    buttonBg: 'bg-[#FFF2E4]',
    route: '/practice/listening',
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
    skill: 'listening',
    title: 'Conversations',
    duration: '5 min',
    description: 'Listen to conversations and answer questions.',
    iconBg: 'bg-[#FFF0DF]',
    iconColor: 'text-accent',
    buttonBg: 'bg-[#FFF2E4]',
    route: '/practice/listening',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M4 14a8 8 0 0 1 16 0" />
        <path strokeLinecap="round" d="M4 14v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Z" />
        <path strokeLinecap="round" d="M20 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
      </svg>
    ),
  },
  {
    id: 'passage',
    skill: 'reading',
    title: 'Passage Comprehension',
    duration: '6 min',
    description: 'Read passages and identify key information.',
    iconBg: 'bg-[#EEEFFA]',
    iconColor: 'text-[#5C63A8]',
    buttonBg: 'bg-[#EEEFFA]',
    route: '/practice/reading',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z"
        />
        <path strokeLinecap="round" d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20" />
      </svg>
    ),
  },
  {
    id: 'email',
    skill: 'writing',
    title: 'Email Writing',
    duration: '8 min',
    description: 'Practice writing clear and professional emails.',
    iconBg: 'bg-[#F2E5F1]',
    iconColor: 'text-[#9A5792]',
    buttonBg: 'bg-[#F2E5F1]',
    route: '/practice/writing',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"
        />
        <path strokeLinecap="round" d="m13.5 7.5 3 3" />
      </svg>
    ),
  },
  {
    id: 'dictation',
    skill: 'writing listening',
    title: 'Dictation',
    duration: '4 min',
    description: 'Listen carefully and type exactly what you hear.',
    iconBg: 'bg-[#F2E5F1]',
    iconColor: 'text-[#9A5792]',
    buttonBg: 'bg-[#F2E5F1]',
    route: '/practice/writing',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M7 4h10" />
        <path strokeLinecap="round" d="M7 8h10" />
        <path strokeLinecap="round" d="M7 12h7" />
        <path strokeLinecap="round" d="M7 16h10" />
        <path strokeLinecap="round" d="M7 20h5" />
      </svg>
    ),
  },
]

function ChevronButton({ className }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${className}`}
    >
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" d="M9 18l6-6-6-6" />
      </svg>
    </span>
  )
}

export default function PracticeScreen() {
  const navigate = useNavigate()
  const [activeSkill, setActiveSkill] = useState('all')

  const filteredActivities = ACTIVITIES.filter(
    (item) => activeSkill === 'all' || item.skill.includes(activeSkill),
  )

  function openActivity(item) {
    if (item.route) navigate(item.route)
  }

  return (
    <div className="hide-scrollbar h-full overflow-y-auto bg-transparent font-nunito">
      <header className="px-5 pb-2 pt-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-label text-[#9AA19B]">Improve your English</p>
            <h1 className="type-title mt-1 text-dark">Practice</h1>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream"
            aria-label="Practice history"
          >
            <svg
              className="h-[19px] w-[19px] text-[#39443E]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" d="M3 12a9 9 0 1 0 3-6.7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v5h5" />
              <path strokeLinecap="round" d="M12 7v5l3 2" />
            </svg>
          </button>
        </div>
      </header>

      <div className="px-5 pb-6 pt-5">
        <section className="rounded-[25px] bg-brand p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="type-label text-white/70">Today&apos;s practice</p>
              <h2 className="type-title mt-1 text-white">12 of 15 minutes</h2>
              <p className="type-caption mt-1 text-white/70">You&apos;re almost at today&apos;s goal.</p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-white/15">
              <span className="type-meta font-black">80%</span>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[80%] rounded-full bg-white" />
          </div>
        </section>

        <section className="mt-7">
          <div className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
            {SKILL_TABS.map((tab) => {
              const isActive = activeSkill === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSkill(tab.id)}
                  className={`type-caption shrink-0 rounded-full px-5 py-2.5 font-extrabold ${
                    isActive ? 'bg-brand text-white' : 'bg-cream text-[#667068]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-7">
          <div>
            <p className="type-label text-[#9AA19B]">Recommended for you</p>
            <h2 className="type-section mt-1 text-dark">Continue practicing</h2>
          </div>

          <div className="mt-4 rounded-[24px] border border-[#E9EDE6] bg-white p-4">
            <div className="flex gap-4">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[17px] bg-brand-light">
                <svg
                  className="h-6 w-6 text-brand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    d="M12 14a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v3a4 4 0 0 0 4 4Z"
                  />
                  <path strokeLinecap="round" d="M19 10a7 7 0 0 1-14 0" />
                  <path strokeLinecap="round" d="M12 17v4M9 21h6" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="type-label text-brand">Speaking</span>
                    <h3 className="type-card mt-1 text-dark">Story Retelling</h3>
                  </div>
                  <span className="type-caption shrink-0 text-[#8A918B]">6 min</span>
                </div>
                <p className="type-caption mt-1 text-muted">
                  Listen to a short story and retell it in your own words.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E9ECE6]">
                <div className="h-full w-[60%] rounded-full bg-brand" />
              </div>
              <span className="type-caption font-extrabold text-brand">60%</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/practice/speaking')}
              className="type-btn mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-brand text-white"
            >
              Continue Practice
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
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="type-label text-[#9AA19B]">Practice activities</p>
              <h2 className="type-section mt-1 text-dark">Build your skills</h2>
            </div>
            <button type="button" className="type-link text-brand">
              See all
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {filteredActivities.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openActivity(item)}
                className="w-full rounded-[21px] border border-[#EEF0E9] bg-white p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${item.iconBg} ${item.iconColor}`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="type-meta font-extrabold text-dark">{item.title}</h3>
                      <span className="type-caption shrink-0 text-[#8A918B]">{item.duration}</span>
                    </div>
                    <p className="type-caption mt-1 text-muted">{item.description}</p>
                  </div>

                  <ChevronButton className={`${item.buttonBg} ${item.iconColor}`} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-[22px] bg-[#FFF7ED] p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
              💡
            </div>
            <div>
              <p className="type-meta font-extrabold text-[#59483B]">Practice tip</p>
              <p className="type-caption mt-1 text-[#8A7767]">
                Speak naturally instead of rushing. Clear pronunciation and steady fluency are more
                important than speed.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
