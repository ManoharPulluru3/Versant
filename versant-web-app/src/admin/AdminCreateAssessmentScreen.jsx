import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SKILL_META = {
  Speaking: {
    desc: 'Pronunciation, fluency and spoken communication.',
    questions: '10 Q',
    sectionMeta: '10 questions · ~10 minutes',
  },
  Listening: {
    desc: 'Comprehension, context and response accuracy.',
    questions: '8 Q',
    sectionMeta: '8 questions · ~7 minutes',
  },
  Reading: {
    desc: 'Comprehension, vocabulary and inference.',
    questions: '10 Q',
    sectionMeta: '10 questions · ~6 minutes',
  },
  Writing: {
    desc: 'Grammar, vocabulary, organization and clarity.',
    questions: '12 Q',
    sectionMeta: '12 questions · ~7 minutes',
  },
}

const DEFAULT_INSTRUCTIONS = `Please complete the assessment independently.

Make sure you are in a quiet environment and have a stable internet connection.

For speaking sections, allow microphone access and speak clearly.

Once you continue to the next question, you may not be able to return to the previous question.`

const STEPS = [
  { n: 1, title: 'Basic Details', desc: 'Assessment information', active: true },
  { n: 2, title: 'Skills & Structure', desc: 'Build assessment' },
  { n: 3, title: 'Assessment Rules', desc: 'Configure behavior' },
  { n: 4, title: 'Review', desc: 'Confirm & publish' },
]

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
        checked ? 'bg-brand' : 'bg-[#d6ddd7]'
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function SkillIcon({ name }) {
  const props = {
    width: 22,
    height: 22,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
  }
  if (name === 'Speaking') {
    return (
      <svg {...props}>
        <rect x="6" y="3" width="7" height="11" rx="3.5" />
        <path d="M3.5 10a6 6 0 0 0 12 0M9.5 16v3M6.5 19h6" />
      </svg>
    )
  }
  if (name === 'Listening') {
    return (
      <svg {...props}>
        <path d="M4 11V9a5 5 0 0 1 10 0v2" />
        <path d="M4 11v3a2 2 0 0 0 2 2h1M14 11v3a2 2 0 0 1-2 2h-1" />
        <path d="M18 9v6" />
      </svg>
    )
  }
  if (name === 'Reading') {
    return (
      <svg {...props}>
        <path d="M4 3h10a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2z" />
        <path d="M6 19V5a2 2 0 0 1 2-2" />
        <path d="M8 8h5M8 11h5M8 14h4" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <path d="m14 3 3 3-9.5 9.5L4 16l.5-3.5z" />
      <path d="m12 5 3 3" />
      <path d="M4 19h12" />
    </svg>
  )
}

export default function AdminCreateAssessmentScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Communication')
  const [level, setLevel] = useState('Intermediate')
  const [skills, setSkills] = useState(() => new Set(['Speaking', 'Listening', 'Reading', 'Writing']))
  const [duration, setDuration] = useState(30)
  const [attempts, setAttempts] = useState('1 attempt')
  const [passScore, setPassScore] = useState(60)
  const [randomize, setRandomize] = useState(true)
  const [forwardOnly, setForwardOnly] = useState(true)
  const [recording, setRecording] = useState(true)
  const [autoSubmit, setAutoSubmit] = useState(true)
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS)
  const [startDate, setStartDate] = useState('2026-09-08')
  const [endDate, setEndDate] = useState('2026-09-14')

  const previewName = name.trim() || 'English Communication Test'
  const skillList = useMemo(() => Object.keys(SKILL_META).filter((s) => skills.has(s)), [skills])
  const questionTotal = skillList.reduce((sum, s) => {
    const n = parseInt(SKILL_META[s].questions, 10)
    return sum + (Number.isFinite(n) ? n : 0)
  }, 0)

  function toggleSkill(skill) {
    setSkills((prev) => {
      const next = new Set(prev)
      if (next.has(skill)) {
        if (next.size === 1) {
          window.alert('At least one skill must be selected.')
          return prev
        }
        next.delete(skill)
      } else {
        next.add(skill)
      }
      return next
    })
  }

  function saveDraft() {
    if (!name.trim()) {
      window.alert('Please enter an assessment name.')
      return
    }
    window.alert(`Assessment saved as draft.\n\nName: ${name.trim()}`)
  }

  function continueBuilder() {
    if (!name.trim()) {
      window.alert('Please enter an assessment name.')
      return
    }
    if (skills.size === 0) {
      window.alert('Please select at least one skill.')
      return
    }
    navigate('/admin/assessments/builder')
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10">
        <div className="mb-5 flex items-center gap-2 text-[15px] font-semibold text-muted">
          <Link to="/admin/assessments" className="hover:text-brand">
            Assessments
          </Link>
          <svg width="18" height="18" fill="none" stroke="currentColor">
            <path d="m5 3 3.5 3.5L5 10" />
          </svg>
          <span className="text-dark">Create Assessment</span>
        </div>

        <div className="mb-7">
          <h1 className="text-[28px] font-extrabold tracking-tight">Create Assessment</h1>
          <p className="mt-1.5 text-[16px] text-muted">
            Set up the assessment details, skills and evaluation rules.
          </p>
        </div>

        <div className="mb-7 rounded-2xl border border-[#e5e9e4] bg-surface px-4 py-5 shadow-[0_8px_30px_rgba(31,107,79,0.06)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {STEPS.map((step, index) => (
              <div key={step.n} className="contents">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold ${
                      step.active
                        ? 'bg-brand text-white'
                        : 'border border-[#d8dfd9] bg-white text-muted'
                    }`}
                  >
                    {step.n}
                  </div>
                  <div>
                    <div className={`text-[15px] font-bold ${step.active ? 'text-dark' : 'text-muted'}`}>
                      {step.title}
                    </div>
                    <div className="text-[13px] text-muted">{step.desc}</div>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="mx-5 hidden h-px flex-1 bg-[#dce3dc] lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#e5e9e4] bg-surface shadow-[0_8px_30px_rgba(31,107,79,0.06)]">
              <div className="border-b border-[#e9ede8] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 3h10l3 3v11H4z" />
                      <path d="M14 3v4h3M7 10h7M7 13h5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold">Basic Details</h2>
                    <p className="text-[14px] text-muted">
                      Define the basic information for this assessment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-6 py-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_180px]">
                  <div>
                    <label className="mb-2 block text-[15px] font-bold">
                      Assessment Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. English Communication Test"
                      className="h-11 w-full rounded-xl border border-[#dfe5df] bg-white px-4 text-[15px] outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-light"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[15px] font-bold">Assessment Code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="ECT-2026"
                      className="h-11 w-full rounded-xl border border-[#dfe5df] bg-white px-4 text-[15px] uppercase outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[15px] font-bold">
                    Description <span className="text-accent">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this assessment measures and what students should expect..."
                    className="w-full resize-none rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-[15px] leading-5 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-light"
                  />
                  <div className="mt-1.5 text-right text-[13px] text-muted">
                    Recommended: 100–250 characters
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[15px] font-bold">Assessment Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#dfe5df] bg-white px-4 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-light"
                    >
                      <option>Communication</option>
                      <option>Placement</option>
                      <option>Speaking</option>
                      <option>Practice</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[15px] font-bold">Recommended Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#dfe5df] bg-white px-4 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-light"
                    >
                      <option>Beginner</option>
                      <option>Elementary</option>
                      <option>Intermediate</option>
                      <option>Upper Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e9e4] bg-surface shadow-[0_8px_30px_rgba(31,107,79,0.06)]">
              <div className="border-b border-[#e9ede8] px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="9" cy="9" r="6.5" />
                        <path d="M9 5v4l2.5 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold">Skills & Structure</h2>
                      <p className="text-[14px] text-muted">
                        Select the communication skills included in the assessment.
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-light px-3 py-1 text-[13px] font-bold text-brand">
                    {skills.size} {skills.size === 1 ? 'skill' : 'skills'} selected
                  </span>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(SKILL_META).map(([skill, meta]) => {
                    const selected = skills.has(skill)
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`relative rounded-2xl border-2 p-5 text-left transition hover:-translate-y-0.5 ${
                          selected
                            ? 'border-brand bg-[#f4f9f3]'
                            : 'border-[#e1e6e0] bg-white'
                        }`}
                      >
                        <div
                          className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white transition ${
                            selected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                          }`}
                        >
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="m3 6 2 2 4-5" />
                          </svg>
                        </div>
                        <div
                          className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                            selected ? 'bg-brand-light text-brand' : 'bg-[#f0f2ed] text-muted'
                          }`}
                        >
                          <SkillIcon name={skill} />
                        </div>
                        <div className="text-[16px] font-bold">{skill}</div>
                        <div className="mt-1 text-[14px] leading-4 text-muted">{meta.desc}</div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 rounded-xl border border-[#e6ebe5] bg-[#f7f9f5] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[15px] font-bold">Assessment Structure</div>
                      <div className="text-[13px] text-muted">
                        Configure the sections that will appear in the assessment.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-[14px] font-bold text-brand"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 2v10M2 7h10" />
                      </svg>
                      Add Section
                    </button>
                  </div>

                  <div className="space-y-2">
                    {skillList.map((skill, index) => (
                      <div
                        key={skill}
                        className="flex items-center gap-3 rounded-xl border border-[#e1e6e0] bg-white px-4 py-3"
                      >
                        <div className="cursor-grab text-[#a8b0aa]">
                          <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M5 4h.01M10 4h.01M5 8h.01M10 8h.01M5 12h.01M10 12h.01" />
                          </svg>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand">
                          <span className="text-[14px] font-extrabold">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[15px] font-bold">{skill}</div>
                          <div className="text-[13px] text-muted">{SKILL_META[skill].sectionMeta}</div>
                        </div>
                        <button type="button" className="text-muted hover:text-dark" aria-label="Section menu">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <circle cx="8" cy="3" r=".7" fill="currentColor" />
                            <circle cx="8" cy="8" r=".7" fill="currentColor" />
                            <circle cx="8" cy="13" r=".7" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e9e4] bg-surface shadow-[0_8px_30px_rgba(31,107,79,0.06)]">
              <div className="border-b border-[#e9ede8] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0e4] text-accent">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M9 2v2M9 14v2M2 9h2M14 9h2" />
                      <circle cx="9" cy="9" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold">Assessment Rules</h2>
                    <p className="text-[14px] text-muted">
                      Control how students experience the assessment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#edf0eb] px-6">
                <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[15px] font-bold">Assessment Duration</div>
                    <div className="mt-1 text-[13px] text-muted">
                      Maximum time allowed to complete the assessment.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="h-10 w-20 rounded-xl border border-[#dfe5df] bg-white px-3 text-center text-[15px] font-bold outline-none focus:border-brand"
                    />
                    <span className="text-[14px] font-semibold text-muted">minutes</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[15px] font-bold">Maximum Attempts</div>
                    <div className="mt-1 text-[13px] text-muted">
                      Number of times a student can attempt this assessment.
                    </div>
                  </div>
                  <select
                    value={attempts}
                    onChange={(e) => setAttempts(e.target.value)}
                    className="h-10 w-28 rounded-xl border border-[#dfe5df] bg-white px-3 text-[15px] font-bold outline-none focus:border-brand"
                  >
                    <option>1 attempt</option>
                    <option>2 attempts</option>
                    <option>3 attempts</option>
                    <option>Unlimited</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[15px] font-bold">Passing Score</div>
                    <div className="mt-1 text-[13px] text-muted">Minimum score required to pass.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={passScore}
                      onChange={(e) => setPassScore(Number(e.target.value))}
                      className="h-10 w-20 rounded-xl border border-[#dfe5df] bg-white px-3 text-center text-[15px] font-bold outline-none focus:border-brand"
                    />
                    <span className="text-[14px] font-semibold text-muted">/ 100</span>
                  </div>
                </div>

                {[
                  {
                    title: 'Randomize Questions',
                    desc: 'Show questions in a different order for each student.',
                    value: randomize,
                    set: setRandomize,
                  },
                  {
                    title: 'Forward-Only Navigation',
                    desc: 'Students cannot return to previously completed questions.',
                    value: forwardOnly,
                    set: setForwardOnly,
                  },
                  {
                    title: 'Recording Required',
                    desc: 'Automatically record responses for speaking activities.',
                    value: recording,
                    set: setRecording,
                  },
                  {
                    title: 'Auto-submit',
                    desc: 'Automatically submit when the assessment timer reaches zero.',
                    value: autoSubmit,
                    set: setAutoSubmit,
                  },
                ].map((rule) => (
                  <div
                    key={rule.title}
                    className="flex items-center justify-between gap-4 py-5"
                  >
                    <div>
                      <div className="text-[15px] font-bold">{rule.title}</div>
                      <div className="mt-1 text-[13px] text-muted">{rule.desc}</div>
                    </div>
                    <Toggle checked={rule.value} onChange={rule.set} label={rule.title} />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e9e4] bg-surface shadow-[0_8px_30px_rgba(31,107,79,0.06)]">
              <div className="border-b border-[#e9ede8] px-6 py-5">
                <h2 className="text-[15px] font-bold">Student Instructions</h2>
                <p className="mt-1 text-[14px] text-muted">
                  These instructions will be shown before the assessment starts.
                </p>
              </div>
              <div className="px-6 py-6">
                <textarea
                  rows={6}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full resize-none rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-[15px] leading-6 outline-none focus:border-brand focus:ring-4 focus:ring-brand-light"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e9e4] bg-surface shadow-[0_8px_30px_rgba(31,107,79,0.06)]">
              <div className="border-b border-[#e9ede8] px-6 py-5">
                <h2 className="text-[15px] font-bold">Availability</h2>
                <p className="mt-1 text-[14px] text-muted">
                  Define when students can access this assessment.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[15px] font-bold">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-[#dfe5df] bg-white px-4 text-[15px] outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[15px] font-bold">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-[#dfe5df] bg-white px-4 text-[15px] outline-none focus:border-brand"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-[#e5e9e4] bg-surface p-5 shadow-[0_8px_30px_rgba(31,107,79,0.06)] xl:sticky xl:top-[98px]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-bold">Assessment Preview</div>
                  <div className="mt-0.5 text-[13px] text-muted">Configuration summary</div>
                </div>
                <span className="rounded-full bg-[#f0f2ed] px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-muted">
                  Draft
                </span>
              </div>

              <div className="rounded-2xl bg-brand p-5 text-white">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="5" y="2.5" width="10" height="15" rx="2" />
                    <path d="M8 6h4M8 9h4M8 12h3" />
                  </svg>
                </div>
                <div className="text-[17px] font-extrabold leading-6">{previewName}</div>
                <div className="mt-1 text-[13px] text-white/70">College Assessment</div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#f6f8f4] p-3">
                  <div className="text-[13px] font-semibold text-muted">Duration</div>
                  <div className="mt-1 text-[16px] font-extrabold">{duration} min</div>
                </div>
                <div className="rounded-xl bg-[#f6f8f4] p-3">
                  <div className="text-[13px] font-semibold text-muted">Questions</div>
                  <div className="mt-1 text-[16px] font-extrabold">{questionTotal || 40}</div>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-3 text-[14px] font-bold">Included Skills</div>
                <div className="space-y-2">
                  {skillList.map((skill) => (
                    <div key={skill} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand" />
                        <span className="text-[14px] font-semibold text-muted">{skill}</span>
                      </div>
                      <span className="text-[13px] font-bold">{SKILL_META[skill].questions}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="my-5 h-px bg-[#e9ede8]" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-muted">Recommended Level</span>
                  <span className="text-[14px] font-bold">{level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-muted">Attempts</span>
                  <span className="text-[14px] font-bold">
                    {attempts === 'Unlimited' ? '∞' : attempts.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-muted">Passing Score</span>
                  <span className="text-[14px] font-bold">{passScore} / 100</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#dfe9df] bg-[#f3f8f2] p-3.5">
                <div className="flex gap-2.5">
                  <div className="mt-0.5 text-brand">
                    <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="7.5" cy="7.5" r="6" />
                      <path d="M7.5 6.5v4M7.5 4.5h.01" />
                    </svg>
                  </div>
                  <p className="text-[13px] leading-4 text-muted">
                    Questions will be added and configured in the{' '}
                    <span className="font-bold text-brand">Assessment Builder</span> after
                    continuing.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={saveDraft}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d9e0da] bg-white text-[15px] font-bold transition hover:bg-[#f5f7f3]"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 3h8l2 2v9H4z" />
                  <path d="M6 3v4h6V3M6 14v-4h5v4" />
                </svg>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-[#e1e6e0] bg-surface/95 px-5 py-4 backdrop-blur sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/assessments')}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-bold text-muted hover:bg-[#f0f3ee] hover:text-dark"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 4 6 8l4 4" />
            </svg>
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-xl border border-[#d8dfd9] bg-white px-5 py-2.5 text-[15px] font-bold hover:bg-[#f5f7f3]"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={continueBuilder}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[15px] font-bold text-white shadow-sm transition hover:bg-[#185b43]"
            >
              Continue to Builder
              <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 3.5 9 7.5 5 11.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
