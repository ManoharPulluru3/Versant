import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SKILLS = [
  {
    id: 'speaking',
    name: 'Speaking',
    detail: 'Fluency & pronunciation',
    score: 86,
    label: 'Strong',
    tone: 'brand',
    headerStyle: 'hero',
    insightTitle: 'Speaking is your strongest skill',
    insightText:
      'You communicated ideas clearly with good fluency and pronunciation. Continue expanding your vocabulary to make your responses more precise.',
    metrics: [
      { title: 'Fluency', description: 'Pace, flow and natural speech', score: 88 },
      { title: 'Pronunciation', description: 'Clarity and sound accuracy', score: 85 },
      { title: 'Vocabulary', description: 'Range and appropriate word use', score: 84 },
      { title: 'Grammar', description: 'Accuracy of spoken sentences', score: 87 },
    ],
  },
  {
    id: 'listening',
    name: 'Listening',
    detail: 'Understanding spoken English',
    score: 79,
    label: 'Good',
    tone: 'accent',
    headerStyle: 'card',
    insightTitle: 'Focus on key details',
    insightText:
      'You understand the main idea well. Practice listening for names, numbers, reasons and specific details to improve accuracy.',
    metrics: [
      { title: 'Main Idea', description: 'Understanding overall meaning', score: 82 },
      { title: 'Key Details', description: 'Identifying important information', score: 76 },
      { title: 'Context', description: 'Understanding meaning from context', score: 80 },
      { title: 'Response Accuracy', description: 'Selecting appropriate responses', score: 78 },
    ],
  },
  {
    id: 'reading',
    name: 'Reading',
    detail: 'Comprehension & vocabulary',
    score: 84,
    label: 'Strong',
    tone: 'brand',
    headerStyle: 'card',
    insightTitle: 'Reading is a strong area',
    insightText:
      'You showed good comprehension and vocabulary awareness. Continue reading longer and more complex passages to build advanced understanding.',
    metrics: [
      { title: 'Comprehension', description: 'Understanding written passages', score: 86 },
      { title: 'Vocabulary', description: 'Understanding words in context', score: 82 },
      { title: 'Grammar', description: 'Recognizing correct sentence structure', score: 83 },
      { title: 'Inference', description: 'Connecting ideas and implied meaning', score: 85 },
    ],
  },
  {
    id: 'writing',
    name: 'Writing',
    detail: 'Grammar & written communication',
    score: 78,
    label: 'Good',
    tone: 'accent',
    headerStyle: 'card',
    insightTitle: 'Writing is your main improvement area',
    insightText:
      'Your ideas are clear, but improving grammar accuracy and sentence structure will make your writing more effective and professional.',
    metrics: [
      { title: 'Grammar', description: 'Sentence accuracy and structure', score: 76 },
      { title: 'Vocabulary', description: 'Word range and precision', score: 80 },
      { title: 'Organization', description: 'Structure and flow of ideas', score: 79 },
      { title: 'Task Completion', description: 'Addressing the requested task', score: 77 },
    ],
  },
]

function SkillGlyph({ id, className = 'h-5 w-5' }) {
  if (id === 'speaking') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="8" y="3" width="8" height="13" rx="4" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (id === 'listening') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 13a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path
          d="M4 13v3a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2ZM20 13v3a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    )
  }

  if (id === 'reading') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5v-15Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M5 20.5A2.5 2.5 0 0 1 7.5 18H19" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m14 5 5 5M4 20l3.5-.8L18.5 8.2a2.1 2.1 0 0 0-3-3L4.5 16.2 4 20Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DetailedReportScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()
  const [activeSkill, setActiveSkill] = useState('speaking')

  const skill = SKILLS.find((item) => item.id === activeSkill) ?? SKILLS[0]
  const isAccent = skill.tone === 'accent'

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
            onClick={() => navigate(`/tests/${testId}/results`)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E1E6DF] bg-white transition hover:bg-[#F6F8F4]"
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
            <p className="type-meta mt-0.5 font-extrabold">Detailed Report</p>
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
        <div className="inline-flex items-center gap-2 rounded-full border border-[#CFE2D2] bg-brand-light px-3 py-1.5 type-label font-extrabold uppercase tracking-[1.2px] text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Skill analysis
        </div>

        <h1 className="type-display mt-4 tracking-[-1.2px]">Detailed Skill Report</h1>
        <p className="type-body mt-2 leading-6 text-muted">
          A closer look at your performance across the four English communication skills.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#E3E8E1] bg-white px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-brand">
              <path
                d="M7 3.8h7.5L19 8.3V20H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M14 3.8V9h5" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M8.5 14h7M8.5 17h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="type-label font-bold text-muted">Assessment</p>
            <p className="type-caption font-extrabold">English Communication Test</p>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-5 rounded-[24px] border border-[#E5EAE4] bg-white p-5">
          <div>
            <p className="type-label font-extrabold uppercase tracking-[1.2px] text-muted">
              Overall performance
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[38px] font-extrabold tracking-[-1px]">82</span>
              <span className="type-meta font-bold text-[#9AA19C]">/ 100</span>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 rounded-lg bg-brand-light px-3 py-1.5 text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="type-caption font-extrabold">B2 · Upper Intermediate</span>
            </div>
            <p className="type-caption mt-2 text-muted">Strong overall communication ability</p>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {SKILLS.map((item) => {
            const active = item.id === activeSkill
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSkill(item.id)}
                className={`shrink-0 rounded-xl px-4 py-2.5 type-caption font-extrabold transition ${
                  active
                    ? 'bg-brand text-white'
                    : 'border border-[#E0E6DF] bg-white text-muted'
                }`}
              >
                {item.name}
              </button>
            )
          })}
        </div>

        <div className="mt-5">
          {skill.headerStyle === 'hero' ? (
            <div className="relative overflow-hidden rounded-[24px] bg-brand p-6 text-white">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <SkillGlyph id={skill.id} />
                    </div>
                    <div>
                      <p className="type-card text-white">{skill.name}</p>
                      <p className="type-caption text-white/60">{skill.detail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[34px] font-extrabold leading-none">{skill.score}</p>
                    <p className="type-label mt-1 font-bold text-white/60">{skill.label}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between type-label font-bold text-white/60">
                    <span>Performance</span>
                    <span>{skill.score}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`flex items-center justify-between gap-4 rounded-[24px] border p-[17px] ${
                isAccent
                  ? 'border-[#F1E0D3] bg-[#FFF9F5]'
                  : 'border-[#DDE9DE] bg-[#F7FAF6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-[13px] ${
                    isAccent ? 'bg-[#F8E7D9] text-accent' : 'bg-brand-light text-brand'
                  }`}
                >
                  <SkillGlyph id={skill.id} />
                </div>
                <div>
                  <p className="type-card">{skill.name}</p>
                  <p className="type-caption text-muted">{skill.detail}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[27px] font-extrabold leading-none">{skill.score}</p>
                <p
                  className={`type-label mt-1 font-extrabold ${
                    isAccent ? 'text-accent' : 'text-brand'
                  }`}
                >
                  {skill.label}
                </p>
              </div>
            </div>
          )}

          <div className="mt-3 grid grid-cols-1 gap-3">
            {skill.metrics.map((metric) => (
              <div
                key={metric.title}
                className="rounded-[20px] border border-[#E6EBE5] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="type-meta font-extrabold">{metric.title}</p>
                    <p className="type-label mt-0.5 leading-4 text-muted">{metric.description}</p>
                  </div>
                  <span className="text-[20px] font-extrabold">{metric.score}</span>
                </div>
                <div className="mt-4 h-[7px] overflow-hidden rounded-full bg-[#EEF1EC]">
                  <div
                    className={`h-full rounded-full ${isAccent ? 'bg-accent' : 'bg-brand'}`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-[20px] border border-[#E4EAE2] bg-[#F5F7F2] p-4">
            <div
              className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] ${
                isAccent ? 'bg-[#F8E7D9] text-accent' : 'bg-brand-light text-brand'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M12 3v18M7 8h10M7 16h10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="type-caption font-extrabold">{skill.insightTitle}</p>
              <p className="type-caption mt-1 leading-[18px] text-muted">{skill.insightText}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-[#E5EAE4] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="type-label font-extrabold uppercase tracking-[1.2px] text-muted">
                Next step
              </p>
              <h3 className="type-section mt-1">Build your improvement plan</h3>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/tests/${testId}/improvement-plan`)}
              className="type-caption flex h-11 shrink-0 items-center justify-center rounded-xl bg-brand px-5 font-extrabold text-white transition hover:bg-[#195A42]"
            >
              View Plan
            </button>
          </div>
          <p className="type-caption mt-2 max-w-[650px] leading-5 text-muted">
            Get personalized practice recommendations based on your assessment performance and
            focus areas.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center pb-4">
          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/results`)}
            className="type-caption font-bold text-muted transition hover:text-brand"
          >
            ← Back to Results
          </button>
        </div>

        <p className="pb-3 text-center type-label font-bold tracking-[1.4px] text-[#A0A7A2]">
          ELYTEDU · ENGLISH ASSESSMENT
        </p>
      </section>
    </div>
  )
}
