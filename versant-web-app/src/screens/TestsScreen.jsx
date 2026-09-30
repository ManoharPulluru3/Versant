import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { id: 'assigned', label: 'Assigned' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
]

const TESTS = [
  {
    id: 'english-communication',
    status: 'assigned',
    variant: 'primary',
    badge: 'College Assessment',
    title: 'English Communication Test',
    description: 'Measure your overall English communication skills.',
    skills: ['Speaking', 'Listening', 'Reading', 'Writing'],
    duration: '30 min',
    questions: '40',
    due: 'Sep 14',
    action: 'View Test',
  },
  {
    id: 'level-assessment',
    status: 'assigned',
    variant: 'secondary',
    badge: 'Placement Test',
    badgeColor: 'text-accent',
    title: 'English Level Assessment',
    description: 'Find your current English proficiency level.',
    duration: '20 min',
    questions: '25 questions',
    due: 'Sep 20',
    action: 'View Test',
  },
  {
    id: 'speaking-evaluation',
    status: 'in-progress',
    variant: 'progress',
    badge: 'In Progress',
    title: 'Speaking Evaluation',
    progress: 42,
    action: 'Continue Test',
  },
  {
    id: 'listening-check',
    status: 'completed',
    variant: 'completed',
    badge: 'Completed',
    title: 'Listening Check',
    description: 'Finished with a score of 78.',
    score: '78',
    action: 'View Result',
  },
  {
    id: 'reading-task',
    status: 'completed',
    variant: 'completed',
    badge: 'Completed',
    title: 'Reading Task',
    description: 'Finished with a score of 81.',
    score: '81',
    action: 'View Result',
  },
]

export default function TestsScreen() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('assigned')

  const filteredTests = useMemo(
    () => TESTS.filter((test) => test.status === activeTab),
    [activeTab],
  )

  function openTest(testId) {
    navigate(`/tests/${testId}`)
  }

  return (
    <div className="hide-scrollbar h-full overflow-y-auto bg-transparent font-nunito text-dark">
      <header className="px-5 pb-2 pt-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-label text-[#9AA19B]">English assessment</p>
            <h1 className="type-title mt-1 text-dark">Tests</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/progress')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cream"
            aria-label="Score history"
          >
            <svg
              className="h-[19px] w-[19px] text-[#39443E]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </button>
        </div>
      </header>

      <section className="px-5 pt-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-brand-light p-4">
            <p className="text-2xl font-extrabold">3</p>
            <p className="type-caption mt-1 text-[#617067]">Assigned</p>
          </div>
          <div className="rounded-2xl bg-[#FFF0E2] p-4">
            <p className="text-2xl font-extrabold">1</p>
            <p className="type-caption mt-1 text-[#617067]">In Progress</p>
          </div>
          <div className="rounded-2xl bg-cream p-4">
            <p className="text-2xl font-extrabold">8</p>
            <p className="type-caption mt-1 text-[#617067]">Completed</p>
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="flex gap-6 border-b border-[#E7EAE3]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 type-meta ${
                  isActive
                    ? 'border-b-2 border-brand font-bold text-brand'
                    : 'font-semibold text-muted'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-5 space-y-4 px-5 pb-6">
        {filteredTests.map((test) => {
          if (test.variant === 'primary') {
            return (
              <article key={test.id} className="rounded-[26px] bg-brand p-5 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="type-label inline-flex rounded-full bg-white/15 px-3 py-1 text-white">
                      {test.badge}
                    </span>
                    <h2 className="type-title mt-4 text-white">{test.title}</h2>
                    <p className="type-body mt-1 text-white/70">{test.description}</p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5h6M9 3h6v3H9zM6 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8M8 15h5" />
                    </svg>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {test.skills.map((skill) => (
                    <span
                      key={skill}
                      className="type-caption rounded-full bg-white/10 px-3 py-1.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                  <div>
                    <p className="type-caption text-white/55">Duration</p>
                    <p className="type-meta mt-1 font-bold">{test.duration}</p>
                  </div>
                  <div>
                    <p className="type-caption text-white/55">Questions</p>
                    <p className="type-meta mt-1 font-bold">{test.questions}</p>
                  </div>
                  <div>
                    <p className="type-caption text-white/55">Due</p>
                    <p className="type-meta mt-1 font-bold">{test.due}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openTest(test.id)}
                  className="type-btn mt-5 w-full rounded-xl bg-white py-3.5 text-brand"
                >
                  {test.action}
                </button>
              </article>
            )
          }

          if (test.variant === 'progress') {
            return (
              <article
                key={test.id}
                className="rounded-[24px] border border-[#E5E8E2] bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="type-label text-brand">{test.badge}</span>
                    <h3 className="type-section mt-2 text-dark">{test.title}</h3>
                  </div>
                  <span className="type-meta font-extrabold text-brand">{test.progress}%</span>
                </div>

                <div className="mt-4 h-2 w-full rounded-full bg-[#EEF0EB]">
                  <div
                    className="h-2 rounded-full bg-brand"
                    style={{ width: `${test.progress}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => openTest(test.id)}
                  className="type-btn mt-4 w-full rounded-xl bg-brand py-3 text-white"
                >
                  {test.action}
                </button>
              </article>
            )
          }

          if (test.variant === 'completed') {
            return (
              <article
                key={test.id}
                className="rounded-[24px] border border-[#E5E8E2] bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="type-label text-muted">{test.badge}</span>
                    <h3 className="type-section mt-2 text-dark">{test.title}</h3>
                    <p className="type-body mt-1 text-muted">{test.description}</p>
                  </div>
                  <span className="type-card text-brand">{test.score}</span>
                </div>

                <button
                  type="button"
                  onClick={() => openTest(test.id)}
                  className="type-btn mt-4 w-full rounded-xl bg-cream py-3 text-brand"
                >
                  {test.action}
                </button>
              </article>
            )
          }

          return (
            <article
              key={test.id}
              className="rounded-[24px] border border-[#E5E8E2] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`type-label ${test.badgeColor || 'text-brand'}`}>
                    {test.badge}
                  </span>
                  <h3 className="type-section mt-2 text-dark">{test.title}</h3>
                  <p className="type-body mt-1 text-muted">{test.description}</p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E2]">
                  <svg
                    className="h-5 w-5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-5 type-caption text-muted">
                <span>{test.duration}</span>
                <span>{test.questions}</span>
                <span>{test.due}</span>
              </div>

              <button
                type="button"
                onClick={() => openTest(test.id)}
                className="type-btn mt-4 w-full rounded-xl bg-cream py-3 text-brand"
              >
                {test.action}
              </button>
            </article>
          )
        })}

        {filteredTests.length === 0 && (
          <div className="rounded-[24px] border border-[#E5E8E2] bg-white px-5 py-10 text-center">
            <p className="type-section text-dark">No tests here</p>
            <p className="type-body mt-2 text-muted">
              Switch tabs to see assigned, in-progress, or completed tests.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
