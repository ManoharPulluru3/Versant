import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SECTIONS = [
  {
    id: 'Speaking',
    meta: '10 questions · 10 min',
    target: 10,
    added: 7,
    progress: 70,
  },
  {
    id: 'Listening',
    meta: '8 questions · 7 min',
    target: 8,
    added: 0,
    progress: 0,
  },
  {
    id: 'Reading',
    meta: '10 questions · 6 min',
    target: 10,
    added: 0,
    progress: 0,
  },
  {
    id: 'Writing',
    meta: '12 questions · 7 min',
    target: 12,
    added: 0,
    progress: 0,
  },
]

const SPEAKING_QUESTIONS = [
  {
    id: 1,
    type: 'Read Aloud',
    points: '1 point',
    time: '30 sec',
    prompt: 'Read the following sentence aloud clearly and naturally.',
    content: 'The students are preparing for their final examination.',
  },
  {
    id: 2,
    type: 'Repeat',
    points: '1 point',
    time: '30 sec',
    prompt: 'Listen to the sentence and repeat it exactly as you hear it.',
  },
  {
    id: 3,
    type: 'Short Answer',
    points: '2 points',
    time: '45 sec',
    prompt: 'What do you usually do after classes?',
    category: 'Everyday Life',
  },
  {
    id: 4,
    type: 'Story Retelling',
    points: '3 points',
    time: '60 sec',
    prompt: 'Listen to the story and retell the main events in your own words.',
  },
  {
    id: 5,
    type: 'Open Question',
    points: '3 points',
    time: '60 sec',
    prompt: 'Describe one skill you would like to improve and explain why.',
  },
]

const QUESTION_TYPES = [
  {
    name: 'Read Aloud',
    desc: 'Student reads a displayed sentence aloud.',
  },
  {
    name: 'Repeat',
    desc: 'Student listens and repeats an audio sentence.',
  },
  {
    name: 'Short Answer',
    desc: 'Student gives a brief spoken response.',
  },
  {
    name: 'Story Retelling',
    desc: 'Listen to a story and retell the key ideas.',
  },
  {
    name: 'Open Question',
    desc: 'Student gives an extended spoken response.',
  },
]

const AI_METRICS = ['Pronunciation', 'Fluency', 'Grammar', 'Vocabulary']

function SectionIcon({ id, active }) {
  const color = active ? 'text-brand' : 'text-muted'
  const bg = active ? 'bg-brand-light' : 'bg-[#e8ece8]'
  const wrap = `flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${color}`
  if (id === 'Speaking') {
    return (
      <div className={wrap}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="5" y="2.5" width="6" height="9" rx="3" />
          <path d="M2.5 8a5 5 0 0 0 10 0M7.5 13v2M5 15h5" />
        </svg>
      </div>
    )
  }
  if (id === 'Listening') {
    return (
      <div className={wrap}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9V7a4.5 4.5 0 0 1 9 0v2" />
          <path d="M3 9v2.5A1.5 1.5 0 0 0 4.5 13H6M12 9v2.5A1.5 1.5 0 0 1 10.5 13H9" />
        </svg>
      </div>
    )
  }
  if (id === 'Reading') {
    return (
      <div className={wrap}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3h8a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2z" />
          <path d="M5 3v12" />
          <path d="M7 7h4M7 10h4" />
        </svg>
      </div>
    )
  }
  return (
    <div className={wrap}>
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m12 2 2 2-8.5 8.5L3 13l.5-2.5z" />
        <path d="m10.5 3.5 2 2" />
        <path d="M3 15h10" />
      </svg>
    </div>
  )
}

export default function AdminAssessmentBuilderScreen() {
  const navigate = useNavigate()
  const [section, setSection] = useState('Speaking')
  const [selectedId, setSelectedId] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [questionType, setQuestionType] = useState('Read Aloud')
  const [prompt, setPrompt] = useState(
    'Read the following sentence aloud clearly and naturally.',
  )
  const [content, setContent] = useState(
    'The students are preparing for their final examination.',
  )
  const [points, setPoints] = useState(1)
  const [timeLimit, setTimeLimit] = useState(30)
  const [aiMetrics, setAiMetrics] = useState(() => new Set(AI_METRICS))
  const [required, setRequired] = useState(true)
  const [allowRetry, setAllowRetry] = useState(false)

  const questions = section === 'Speaking' ? SPEAKING_QUESTIONS : []
  const selectedQuestion = useMemo(
    () => questions.find((q) => q.id === selectedId) || questions[0],
    [questions, selectedId],
  )

  function selectSection(next) {
    setSection(next)
    if (next !== 'Speaking') {
      window.alert(`${next} section selected.\n\nQuestions for this section will appear here.`)
      return
    }
    setSelectedId(1)
    setPrompt(SPEAKING_QUESTIONS[0].prompt)
    setContent(SPEAKING_QUESTIONS[0].content || '')
  }

  function selectQuestion(q) {
    setSelectedId(q.id)
    setQuestionType(q.type)
    setPrompt(q.prompt)
    setContent(q.content || '')
    setPoints(parseInt(q.points, 10) || 1)
    setTimeLimit(parseInt(q.time, 10) || 30)
  }

  function openQuestionBank() {
    window.alert(
      'Question Bank\n\nOpen reusable questions, filter by skill/type/level, select questions and add them to this assessment.',
    )
  }

  function goBack() {
    if (
      window.confirm(
        'Leave the Assessment Builder?\n\nYour latest changes have been saved.',
      )
    ) {
      navigate('/admin/assessments/create')
    }
  }

  return (
    <div className="-mx-0 flex min-h-[calc(100svh-76px)] flex-col bg-surface">
      <div className="border-b border-[#e5e9e4] bg-surface px-5 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-bold text-muted hover:bg-[#f2f4ef] hover:text-dark"
            >
              <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m9 3-5 5 5 5" />
              </svg>
              Back to Assessment
            </button>
            <div className="mx-2 hidden h-5 w-px bg-[#e0e5df] sm:block" />
            <span className="rounded-lg bg-brand-light px-2.5 py-1 text-[13px] font-bold text-brand">
              Draft
            </span>
            <div className="ml-2 hidden items-center gap-2 rounded-full bg-[#f3f6f1] px-3 py-1.5 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="text-[13px] font-semibold text-muted">All changes saved</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.alert('Opening student assessment preview...')}
              className="flex items-center gap-2 rounded-xl border border-[#dce2dc] bg-white px-4 py-2 text-[14px] font-bold hover:bg-[#f5f7f3]"
            >
              <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2.5 9s2.3-4 6.5-4 6.5 4 6.5 4-2.3 4-6.5 4-6.5-4-6.5-4Z" />
                <circle cx="9" cy="9" r="1.7" />
              </svg>
              Preview
            </button>
            <button
              type="button"
              onClick={() =>
                window.alert(
                  'Assessment saved successfully.\n\nNext step: Assessment Rules & Review.',
                )
              }
              className="rounded-xl bg-brand px-4 py-2 text-[14px] font-bold text-white hover:bg-[#185b43]"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        {/* Sections */}
        <aside className="relative flex w-full flex-col border-b border-[#e5e9e4] bg-[#F7F9F5] xl:w-[245px] xl:shrink-0 xl:border-b-0 xl:border-r">
          <div className="border-b border-[#e4e9e3] px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-bold">Assessment Sections</div>
                <div className="mt-1 text-[13px] text-muted">4 sections · 40 questions</div>
              </div>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-brand hover:bg-brand-light"
                aria-label="Add section"
              >
                <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7.5 2v11M2 7.5h11" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-1 p-3">
            {SECTIONS.map((s) => {
              const active = section === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSection(s.id)}
                  className={`w-full rounded-xl p-3 text-left transition ${
                    active
                      ? 'border border-brand bg-white shadow-sm'
                      : 'border border-transparent hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SectionIcon id={s.id} active={active} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-bold">{s.id}</div>
                      <div className="mt-0.5 text-[12px] text-muted">{s.meta}</div>
                    </div>
                    {active ? (
                      <svg
                        width="18" height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="text-brand"
                      >
                        <path d="m5 3 4 4-4 4" />
                      </svg>
                    ) : (
                      <span className="rounded-full bg-[#f0f2ee] px-2 py-0.5 text-[12px] font-bold text-muted">
                        {s.added} / {s.target}
                      </span>
                    )}
                  </div>
                  {active && (
                    <>
                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#e9eee9]">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <div className="mt-1 text-right text-[12px] font-semibold text-muted">
                        {s.added} / {s.target} added
                      </div>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          <div className="px-3 pt-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#ccd6ce] py-3 text-[13px] font-bold text-muted hover:border-brand hover:text-brand"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 2v10M2 7h10" />
              </svg>
              Add Section
            </button>
          </div>

          <div className="mt-auto p-3">
            <div className="rounded-xl border border-[#dce5dd] bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold">Builder Progress</span>
                <span className="text-[13px] font-extrabold text-brand">17%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e7ece7]">
                <div className="h-full w-[17%] rounded-full bg-brand" />
              </div>
              <div className="mt-2 text-[12px] text-muted">7 of 40 questions added</div>
            </div>
          </div>
        </aside>

        {/* Questions */}
        <section className="min-w-0 flex-1 bg-surface">
          <div className="border-b border-[#e8ece7] px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-brand-light px-2 py-1 text-[12px] font-bold uppercase tracking-wide text-brand">
                    Section 0{SECTIONS.findIndex((s) => s.id === section) + 1}
                  </span>
                  <span className="text-[13px] text-muted">{section}</span>
                </div>
                <h1 className="mt-2 text-[20px] font-extrabold tracking-tight">
                  {section} Questions
                </h1>
                <p className="mt-1 text-[14px] text-muted">
                  Add and arrange questions for the {section.toLowerCase()} section.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openQuestionBank}
                  className="flex items-center gap-2 rounded-xl border border-[#dce2dc] bg-white px-4 py-2.5 text-[14px] font-bold hover:bg-[#f5f7f3]"
                >
                  <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 3h9v13H4z" />
                    <path d="M7 6h3M7 9h3M7 12h2" />
                  </svg>
                  Question Bank
                </button>
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[14px] font-bold text-white hover:bg-[#185b43]"
                >
                  <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 2v10M2 7h10" />
                  </svg>
                  Add Question
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[calc(100svh-265px)] space-y-3 overflow-y-auto px-5 py-6 sm:px-7">
            {questions.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#ccd6ce] bg-white px-6 py-12 text-center">
                <div className="text-[15px] font-bold">No questions yet</div>
                <p className="mt-1 text-[14px] text-muted">
                  Add questions to the {section} section to get started.
                </p>
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="mt-4 rounded-xl bg-brand px-4 py-2.5 text-[14px] font-bold text-white"
                >
                  Add Question
                </button>
              </div>
            )}

            {questions.map((q) => {
              const active = selectedId === q.id
              return (
                <div
                  key={q.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectQuestion(q)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') selectQuestion(q)
                  }}
                  className={`cursor-pointer rounded-2xl p-4 transition ${
                    active
                      ? 'border-2 border-brand bg-[#f3f8f2]'
                      : 'border border-[#e4e9e4] bg-white hover:border-[#cbd6ce]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[13px] font-extrabold ${
                        active ? 'bg-brand text-white' : 'bg-[#edf1ed] text-muted'
                      }`}
                    >
                      {String(q.id).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-1 text-[12px] font-bold uppercase tracking-wide ${
                            active ? 'bg-white text-brand' : 'bg-[#f2f4f1] text-muted'
                          }`}
                        >
                          {q.type}
                        </span>
                        <span className="text-[12px] font-semibold text-muted">{q.points}</span>
                        <span className="text-[12px] text-muted">·</span>
                        <span className="text-[12px] text-muted">{q.time}</span>
                      </div>
                      <p className="text-[15px] font-semibold leading-5">{q.prompt}</p>
                      {q.content && (
                        <div className="mt-3 rounded-xl bg-white px-4 py-3">
                          <p className="text-[15px] leading-5 text-[#465149]">{q.content}</p>
                        </div>
                      )}
                      {q.category && (
                        <div className="mt-2 text-[13px] text-muted">Category: {q.category}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.alert(
                          'Question Actions\n\n• Edit Question\n• Duplicate\n• Move Up\n• Move Down\n• Preview\n• Delete',
                        )
                      }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-white"
                      aria-label="Question menu"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="8" cy="3" r=".7" fill="currentColor" />
                        <circle cx="8" cy="8" r=".7" fill="currentColor" />
                        <circle cx="8" cy="13" r=".7" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}

            {questions.length > 0 && (
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#ccd6ce] bg-white py-4 text-[14px] font-bold text-muted hover:border-brand hover:text-brand"
              >
                <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7.5 2v11M2 7.5h11" />
                </svg>
                Add Question
              </button>
            )}
          </div>
        </section>

        {/* Settings */}
        <aside className="flex w-full flex-col border-t border-[#e5e9e4] bg-[#F7F9F5] xl:w-[335px] xl:shrink-0 xl:border-l xl:border-t-0">
          <div className="border-b border-[#e4e9e3] px-5 py-5">
            <div className="text-[15px] font-bold">Question Settings</div>
            <div className="mt-1 text-[13px] text-muted">
              {selectedQuestion
                ? `Question ${String(selectedQuestion.id).padStart(2, '0')} · ${selectedQuestion.type}`
                : `${section} · No question selected`}
            </div>
          </div>

          <div className="max-h-[calc(100svh-180px)] space-y-5 overflow-y-auto p-5">
            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted">
                Question Type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#dce2dc] bg-white px-3 text-[14px] font-semibold outline-none focus:border-brand"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted">
                Question Prompt
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full resize-none rounded-xl border border-[#dce2dc] bg-white px-3 py-3 text-[14px] leading-5 outline-none focus:border-brand focus:ring-4 focus:ring-brand-light"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[13px] font-bold uppercase tracking-[0.1em] text-muted">
                  Reading Content
                </label>
                <button type="button" className="text-[13px] font-bold text-brand">
                  Generate with AI
                </button>
              </div>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full resize-none rounded-xl border border-[#dce2dc] bg-white px-3 py-3 text-[14px] leading-5 outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.1em] text-muted">
                Audio / Media
              </label>
              <div className="rounded-xl border border-[#dce2dc] bg-white p-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white"
                    aria-label="Play audio"
                  >
                    <svg width="19" height="19" fill="currentColor">
                      <path d="M5 3.5v8l6-4z" />
                    </svg>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold">speaking-q01.mp3</div>
                    <div className="mt-1 text-[12px] text-muted">00:08 · Audio</div>
                  </div>
                  <button type="button" className="text-muted hover:text-red-500" aria-label="Remove media">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M4 5h8M6 5v7M10 5v7M5 3h6l.5 10h-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#ccd6ce] py-2.5 text-[13px] font-bold text-muted hover:border-brand hover:text-brand"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M7 2v10M2 7h10" />
                </svg>
                Upload Media
              </button>
            </div>

            <div className="rounded-xl border border-[#dfe6df] bg-white p-4">
              <div className="mb-4 text-[14px] font-bold">Scoring</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-muted">Points</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="h-10 w-full rounded-lg border border-[#dce2dc] px-3 text-[14px] font-bold outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-muted">
                    Time Limit
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      className="h-10 w-full rounded-lg border border-[#dce2dc] px-3 text-[14px] font-bold outline-none focus:border-brand"
                    />
                    <span className="text-[12px] text-muted">sec</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-[12px] font-semibold text-muted">
                  Evaluation Method
                </label>
                <select className="h-10 w-full rounded-lg border border-[#dce2dc] bg-white px-3 text-[13px] font-semibold outline-none focus:border-brand">
                  <option>AI Evaluation</option>
                  <option>Manual Evaluation</option>
                  <option>AI + Manual Review</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-[#dfe6df] bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[14px] font-bold">AI Evaluation</div>
                  <div className="mt-1 text-[12px] text-muted">
                    Select metrics for automated scoring.
                  </div>
                </div>
                <span className="rounded-full bg-brand-light px-2 py-1 text-[12px] font-bold text-brand">
                  Enabled
                </span>
              </div>
              <div className="space-y-2">
                {AI_METRICS.map((metric) => (
                  <label
                    key={metric}
                    className="flex items-center justify-between rounded-lg bg-[#f7f9f6] px-3 py-2"
                  >
                    <span className="text-[13px] font-semibold">{metric}</span>
                    <input
                      type="checkbox"
                      checked={aiMetrics.has(metric)}
                      onChange={(e) => {
                        setAiMetrics((prev) => {
                          const next = new Set(prev)
                          if (e.target.checked) next.add(metric)
                          else next.delete(metric)
                          return next
                        })
                      }}
                      className="accent-brand"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.1em] text-muted">
                Question Behavior
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between rounded-xl border border-[#e0e5df] bg-white px-3 py-3">
                  <div>
                    <div className="text-[13px] font-bold">Required</div>
                    <div className="text-[12px] text-muted">Student must respond</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={required}
                    onChange={(e) => setRequired(e.target.checked)}
                    className="accent-brand"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-[#e0e5df] bg-white px-3 py-3">
                  <div>
                    <div className="text-[13px] font-bold">Allow Retry</div>
                    <div className="text-[12px] text-muted">Allow another recording</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowRetry}
                    onChange={(e) => setAllowRetry(e.target.checked)}
                    className="accent-brand"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Delete this question?\n\nThis action cannot be undone.',
                  )
                ) {
                  window.alert('Question deleted.')
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#efd9d4] bg-[#fff8f6] py-2.5 text-[13px] font-bold text-[#b45c4d] hover:bg-[#fff1ed]"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 5h8M6 5v7M10 5v7M5 3h6l.5 10h-7z" />
              </svg>
              Delete Question
            </button>

            <p className="text-center text-[12px] text-muted">
              Or browse the{' '}
              <Link to="/admin/question-bank" className="font-bold text-brand">
                Question Bank
              </Link>
            </p>
          </div>
        </aside>
      </div>

      {addOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17221d]/25 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddOpen(false)
          }}
        >
          <div className="w-full max-w-[720px] rounded-3xl border border-[#e2e7e1] bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e8ece7] px-6 py-5">
              <div>
                <div className="text-[16px] font-extrabold">Add Question</div>
                <div className="mt-1 text-[13px] text-muted">
                  Choose a question type for the {section} section.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-[#f0f3ee]"
                aria-label="Close"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m5 5 7 7M12 5l-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2">
              {QUESTION_TYPES.map((type) => {
                const selected = questionType === type.name
                return (
                  <button
                    key={type.name}
                    type="button"
                    onClick={() => setQuestionType(type.name)}
                    className={`relative rounded-2xl p-4 text-left transition ${
                      selected
                        ? 'border-2 border-brand bg-[#f3f8f2]'
                        : 'border border-[#e0e5df] bg-white hover:border-brand'
                    }`}
                  >
                    <span
                      className={`absolute right-3 top-3 transition ${
                        selected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                      }`}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="m3 6 2 2 4-5" />
                        </svg>
                      </span>
                    </span>
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${
                        selected ? 'bg-brand-light text-brand' : 'bg-[#edf1ed] text-muted'
                      }`}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="5" y="2.5" width="7" height="10" rx="3.5" />
                        <path d="M2.5 8a6 6 0 0 0 12 0M8.5 14v2M5.5 16h6" />
                      </svg>
                    </div>
                    <div className="text-[15px] font-bold">{type.name}</div>
                    <div className="mt-1 text-[12px] leading-4 text-muted">{type.desc}</div>
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => {
                  setAddOpen(false)
                  openQuestionBank()
                }}
                className="rounded-2xl border border-dashed border-[#cbd6ce] bg-[#f8faf7] p-4 text-left hover:border-brand sm:col-span-2"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 3h9v13H4z" />
                    <path d="M7 6h3M7 9h3M7 12h2" />
                  </svg>
                </div>
                <div className="text-[15px] font-bold">Add from Question Bank</div>
                <div className="mt-1 text-[12px] leading-4 text-muted">
                  Reuse an existing question.
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-[#e8ece7] px-6 py-4">
              <span className="text-[12px] text-muted">Questions can be edited after adding.</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="rounded-xl border border-[#dce2dc] bg-white px-4 py-2.5 text-[13px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddOpen(false)
                    window.alert(`${questionType} question added successfully.`)
                  }}
                  className="rounded-xl bg-brand px-4 py-2.5 text-[13px] font-bold text-white"
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
