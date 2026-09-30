import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TYPES_BY_SKILL = {
  Speaking: ['Read Aloud', 'Repeat', 'Short Answer', 'Story Retelling', 'Open Question'],
  Listening: ['Conversation', 'Passage', 'Short Answer', 'Audio Comprehension'],
  Reading: ['Sentence Completion', 'Reading Comprehension', 'Vocabulary', 'Inference'],
  Writing: ['Typing', 'Dictation', 'Passage Reconstruction', 'Email Writing'],
}

const DEFAULT_OPTIONS = [
  { id: 1, text: 'access', correct: true },
  { id: 2, text: 'arrive', correct: false },
  { id: 3, text: 'remove', correct: false },
  { id: 4, text: 'divide', correct: false },
]

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative shrink-0"
    >
      <div
        className={`h-5 w-9 rounded-full transition ${checked ? 'bg-brand' : 'bg-[#D5DBD5]'}`}
      />
      <div
        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          checked ? 'translate-x-4' : ''
        }`}
      />
    </button>
  )
}

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-20 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl bg-[#17221D] px-4 py-3 text-white shadow-xl">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12L10 17L19 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-[14px] font-bold">{message}</span>
      </div>
    </div>
  )
}

export default function AdminQuestionEditorScreen() {
  const navigate = useNavigate()
  const [skill, setSkill] = useState('Speaking')
  const [questionType, setQuestionType] = useState('Read Aloud')
  const [title, setTitle] = useState('Read the sentence aloud')
  const [prompt, setPrompt] = useState(
    'Read the sentence below aloud clearly and naturally.',
  )
  const [readingContent, setReadingContent] = useState(
    'The students are preparing for their final examination.',
  )
  const [referenceAnswer, setReferenceAnswer] = useState(
    'The students are preparing for their final examination.',
  )
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [points, setPoints] = useState(1)
  const [timeLimit, setTimeLimit] = useState(30)
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [evaluation, setEvaluation] = useState('AI Evaluation')
  const [required, setRequired] = useState(true)
  const [allowRetry, setAllowRetry] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [tags, setTags] = useState(['pronunciation', 'speaking', 'beginner'])
  const [tagDraft, setTagDraft] = useState('')
  const [topic, setTopic] = useState('Pronunciation')
  const [folder, setFolder] = useState('General English')
  const [metrics, setMetrics] = useState(() => new Set(['Pronunciation', 'Fluency', 'Grammar', 'Vocabulary']))
  const [saveStatus, setSaveStatus] = useState('saved')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [aiInstruction, setAiInstruction] = useState(
    'Create a beginner-level speaking Read Aloud question focused on clear pronunciation.',
  )
  const [audioPercent, setAudioPercent] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const typeOptions = TYPES_BY_SKILL[skill] || []

  const showReading = useMemo(() => {
    if (['Typing', 'Email Writing', 'Passage Reconstruction'].includes(questionType)) return false
    if (['Repeat', 'Story Retelling', 'Dictation'].includes(questionType)) return false
    return true
  }, [questionType])

  const showMedia = useMemo(() => {
    return !['Typing', 'Email Writing', 'Passage Reconstruction'].includes(questionType)
  }, [questionType])

  const showMcq = useMemo(() => {
    return [
      'Conversation',
      'Passage',
      'Audio Comprehension',
      'Sentence Completion',
      'Reading Comprehension',
      'Vocabulary',
      'Inference',
    ].includes(questionType)
  }, [questionType])

  const showCorrectAnswer = questionType !== 'Email Writing'
  const showAiConfig = evaluation === 'AI Evaluation' || evaluation === 'AI + Manual'

  useEffect(() => {
    if (!toast) return undefined
    setToastVisible(true)
    const timer = setTimeout(() => {
      setToastVisible(false)
      setTimeout(() => setToast(''), 300)
    }, 2500)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setPreviewOpen(false)
        setAiOpen(false)
        setDeleteOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!audioPlaying) return undefined
    const timer = setInterval(() => {
      setAudioPercent((prev) => {
        const next = prev + 2
        if (next >= 100) {
          setAudioPlaying(false)
          setTimeout(() => setAudioPercent(0), 300)
          return 100
        }
        return next
      })
    }, 100)
    return () => clearInterval(timer)
  }, [audioPlaying])

  function showToast(message) {
    setToast(message)
  }

  function markUnsaved() {
    setSaveStatus('unsaved')
  }

  function saveQuestion() {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('saved')
      showToast('Question saved successfully')
    }, 700)
  }

  function changeSkill(next) {
    setSkill(next)
    const nextTypes = TYPES_BY_SKILL[next] || []
    setQuestionType(nextTypes[0] || '')
    markUnsaved()
  }

  function addOption() {
    setOptions((prev) => [
      ...prev,
      { id: Date.now(), text: '', correct: false },
    ])
    markUnsaved()
  }

  function removeOption(id) {
    setOptions((prev) => {
      if (prev.length <= 2) {
        showToast('At least two options are required')
        return prev
      }
      return prev.filter((o) => o.id !== id)
    })
    markUnsaved()
  }

  function selectCorrect(id) {
    setOptions((prev) => prev.map((o) => ({ ...o, correct: o.id === id })))
    markUnsaved()
  }

  function addTag() {
    const value = tagDraft.trim().toLowerCase()
    if (!value || tags.includes(value)) return
    setTags((prev) => [...prev, value])
    setTagDraft('')
    markUnsaved()
  }

  function generateQuestion() {
    setAiOpen(false)
    setTitle('Read the sentence aloud')
    setPrompt('Read the sentence below aloud clearly and naturally.')
    setReadingContent(
      'Students should communicate clearly when working with people from different backgrounds.',
    )
    markUnsaved()
    showToast('AI question generated')
  }

  const statusBadge =
    saveStatus === 'saved'
      ? 'bg-[#EAF1EA] text-[#3F684F]'
      : saveStatus === 'saving'
        ? 'bg-[#F0F2ED] text-[#6F7972]'
        : 'bg-[#FFF2E6] text-[#B86D32]'

  const statusLabel =
    saveStatus === 'saved' ? 'SAVED' : saveStatus === 'saving' ? 'SAVING...' : 'UNSAVED'

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="w-full">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/question-bank')}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#DFE4DE] bg-surface text-[#657069] hover:bg-[#F5F6F2]"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2 text-[15px]">
                <Link to="/admin/assessments" className="text-[#9AA19C] hover:text-brand">
                  Assessments
                </Link>
                <span className="text-[#B4BAB5]">/</span>
                <Link to="/admin/question-bank" className="text-[#9AA19C] hover:text-brand">
                  Question Bank
                </Link>
                <span className="text-[#B4BAB5]">/</span>
                <span className="font-bold text-[#303A34]">Question Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-[25px] font-extrabold tracking-tight">Question Editor</h1>
                <span className={`rounded-md px-2 py-1 text-[12px] font-extrabold ${statusBadge}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1 text-[15px] text-muted">
                Create and configure an assessment-ready question.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#DDE2DC] bg-surface px-4 text-[14px] font-extrabold text-[#4D5952] hover:bg-[#F5F6F2]"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={saveQuestion}
              className="flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-[14px] font-extrabold text-white hover:bg-[#18583F]"
            >
              Save Question
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#949C96]">
                    Question Information
                  </div>
                  <h2 className="mt-1 text-[16px] font-extrabold">Basic Details</h2>
                </div>
                <div className="text-[13px] font-bold text-[#9AA29C]">
                  Question ID: <span className="font-extrabold text-brand">QB-009</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">Skill</label>
                  <select
                    value={skill}
                    onChange={(e) => changeSkill(e.target.value)}
                    className="h-11 w-full rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] px-3 text-[15px] font-bold outline-none"
                  >
                    {Object.keys(TYPES_BY_SKILL).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">
                    Question Type
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => {
                      setQuestionType(e.target.value)
                      markUnsaved()
                    }}
                    className="h-11 w-full rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] px-3 text-[15px] font-bold outline-none"
                  >
                    {typeOptions.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">
                  Internal Question Title
                </label>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    markUnsaved()
                  }}
                  className="h-11 w-full rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] px-3.5 text-[15px] font-bold outline-none focus:border-[#B5CDBB] focus:bg-white"
                />
                <div className="mt-1.5 text-[12px] text-[#9AA19C]">
                  Used by faculty and administrators. Students will not see this title.
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#949C96]">
                    Content
                  </div>
                  <h2 className="mt-1 text-[16px] font-extrabold">Question Prompt</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAiOpen(true)}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-[#F0F5EF] px-3 text-[13px] font-extrabold text-brand hover:bg-[#E7F0E8]"
                >
                  Generate with AI
                </button>
              </div>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  markUnsaved()
                }}
                className="w-full resize-none rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] p-4 text-[15px] font-semibold leading-6 outline-none focus:border-[#B5CDBB] focus:bg-white"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[12px] text-[#9AA19C]">
                  Keep instructions short, clear and student-friendly.
                </span>
                <span className="text-[12px] text-[#9AA19C]">{prompt.length} characters</span>
              </div>
            </section>

            {showReading && (
              <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#949C96]">
                      Reading Content
                    </div>
                    <h2 className="mt-1 text-[16px] font-extrabold">Content Student Will Read</h2>
                  </div>
                  <span className="rounded-md bg-[#EAF1EA] px-2 py-1 text-[12px] font-extrabold text-[#3F684F]">
                    REQUIRED
                  </span>
                </div>
                <div className="rounded-2xl border border-[#DDE5DD] bg-[#F8FAF7] p-5">
                  <textarea
                    rows={5}
                    value={readingContent}
                    onChange={(e) => {
                      setReadingContent(e.target.value)
                      markUnsaved()
                    }}
                    className="w-full resize-none bg-transparent text-[16px] font-semibold leading-8 outline-none"
                  />
                </div>
              </section>
            )}

            {showMedia && (
              <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#949C96]">
                      Audio & Media
                    </div>
                    <h2 className="mt-1 text-[16px] font-extrabold">Question Media</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Audio upload dialog opened')}
                    className="h-8 rounded-lg border border-[#DDE2DC] px-3 text-[13px] font-extrabold text-[#56615A] hover:bg-[#F5F6F2]"
                  >
                    Upload Audio
                  </button>
                </div>
                <div className="rounded-2xl border border-[#E5E9E3] bg-[#F5F6F2] p-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setAudioPlaying((v) => !v)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white"
                      aria-label={audioPlaying ? 'Pause' : 'Play'}
                    >
                      {audioPlaying ? '❚❚' : '▶'}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[13px] font-extrabold">question-audio-009.mp3</span>
                        <span className="text-[12px] text-[#8E9791]">00:06</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#DDE3DD]">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${audioPercent}%` }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioPercent(0)
                        setAudioPlaying(false)
                        showToast('Audio removed')
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-[#8B938E] hover:bg-[#F0F2ED]"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-[12px] text-[#949C96]">
                  Supported formats: MP3, WAV, M4A · Maximum file size 25 MB
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#949C96]">
                    Answer Configuration
                  </div>
                  <h2 className="mt-1 text-[16px] font-extrabold">Response & Evaluation</h2>
                </div>
                <span className="rounded-md bg-[#EAF1EA] px-2 py-1 text-[12px] font-extrabold text-[#3F684F]">
                  AI EVALUATED
                </span>
              </div>

              {showCorrectAnswer && (
                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">
                    Expected / Reference Answer
                  </label>
                  <textarea
                    rows={3}
                    value={referenceAnswer}
                    onChange={(e) => {
                      setReferenceAnswer(e.target.value)
                      markUnsaved()
                    }}
                    className="w-full resize-none rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] p-4 text-[15px] font-semibold leading-6 outline-none focus:border-[#B5CDBB] focus:bg-white"
                  />
                </div>
              )}

              {showMcq && (
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-[13px] font-extrabold text-[#68726C]">Answer Options</label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-[13px] font-extrabold text-brand"
                    >
                      + Add option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center gap-3 rounded-xl border p-3 ${
                          option.correct
                            ? 'border-brand bg-[#F1F7F2]'
                            : 'border-[#E1E6DF]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectCorrect(option.id)}
                          className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                            option.correct ? 'border-brand bg-brand' : 'border-[#C8CEC9]'
                          }`}
                          aria-label="Mark correct"
                        />
                        <input
                          value={option.text}
                          onChange={(e) => {
                            setOptions((prev) =>
                              prev.map((o) =>
                                o.id === option.id ? { ...o, text: e.target.value } : o,
                              ),
                            )
                            markUnsaved()
                          }}
                          className="flex-1 bg-transparent text-[15px] font-bold outline-none"
                          placeholder="Enter answer option"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(option.id)}
                          className="text-[#9AA19C] hover:text-[#C15E45]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 border-t border-[#E8ECE7] pt-5">
                <div className="mb-3 text-[13px] font-extrabold text-[#68726C]">
                  AI Evaluation Metrics
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Pronunciation', 'Fluency', 'Grammar', 'Vocabulary'].map((metric) => (
                    <label
                      key={metric}
                      className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#F5F6F2] p-3"
                    >
                      <input
                        type="checkbox"
                        checked={metrics.has(metric)}
                        onChange={(e) => {
                          setMetrics((prev) => {
                            const next = new Set(prev)
                            if (e.target.checked) next.add(metric)
                            else next.delete(metric)
                            return next
                          })
                          markUnsaved()
                        }}
                        className="accent-brand"
                      />
                      <span className="text-[14px] font-bold">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-6">
              <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#949C96]">
                Organization
              </div>
              <h2 className="mb-5 mt-1 text-[16px] font-extrabold">Tags & Categorization</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">Folder</label>
                  <select
                    value={folder}
                    onChange={(e) => {
                      setFolder(e.target.value)
                      markUnsaved()
                    }}
                    className="h-11 w-full rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] px-3 text-[15px] font-bold outline-none"
                  >
                    <option>General English</option>
                    <option>Placement Test</option>
                    <option>Communication Skills</option>
                    <option>Practice</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">Topic</label>
                  <input
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value)
                      markUnsaved()
                    }}
                    className="h-11 w-full rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] px-3.5 text-[15px] font-bold outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">Tags</label>
                <div className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] p-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-[#EAF1EA] px-2.5 py-1 text-[12px] font-extrabold text-[#3F684F]"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1"
                        onClick={() => {
                          setTags((prev) => prev.filter((t) => t !== tag))
                          markUnsaved()
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagDraft}
                    onChange={(e) => setTagDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Add tag..."
                    className="min-w-[100px] flex-1 bg-transparent px-1 text-[14px] font-semibold outline-none"
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-5">
              <div className="mb-5">
                <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#949C96]">
                  Configuration
                </div>
                <h2 className="mt-1 text-[15px] font-extrabold">Question Settings</h2>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">Points</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPoints((p) => Math.max(1, p - 1))
                      markUnsaved()
                    }}
                    className="h-10 w-10 rounded-xl bg-[#F5F6F2] font-extrabold text-[#68726C]"
                  >
                    −
                  </button>
                  <input
                    value={points}
                    onChange={(e) => {
                      setPoints(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
                      markUnsaved()
                    }}
                    className="h-10 flex-1 rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] text-center text-[15px] font-extrabold outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPoints((p) => Math.min(10, p + 1))
                      markUnsaved()
                    }}
                    className="h-10 w-10 rounded-xl bg-[#F5F6F2] font-extrabold text-[#68726C]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">
                  Time Limit
                </label>
                <div className="relative">
                  <input
                    value={timeLimit}
                    onChange={(e) => {
                      setTimeLimit(Number(e.target.value) || 0)
                      markUnsaved()
                    }}
                    className="h-10 w-full rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] px-3 pr-16 text-[15px] font-bold outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#8A938D]">
                    seconds
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value)
                    markUnsaved()
                  }}
                  className="h-10 w-full rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] px-3 text-[15px] font-bold outline-none"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">
                  Evaluation Method
                </label>
                <select
                  value={evaluation}
                  onChange={(e) => {
                    setEvaluation(e.target.value)
                    markUnsaved()
                  }}
                  className="h-10 w-full rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] px-3 text-[15px] font-bold outline-none"
                >
                  <option>AI Evaluation</option>
                  <option>Manual Evaluation</option>
                  <option>AI + Manual</option>
                  <option>Auto Scored</option>
                </select>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-5">
              <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#949C96]">
                Student Experience
              </div>
              <h2 className="mb-5 mt-1 text-[15px] font-extrabold">Behavior</h2>
              {[
                {
                  title: 'Required',
                  desc: 'Student must answer',
                  value: required,
                  set: setRequired,
                },
                {
                  title: 'Allow Retry',
                  desc: 'Allow another response',
                  value: allowRetry,
                  set: setAllowRetry,
                },
                {
                  title: 'Shuffle Options',
                  desc: 'Randomize answer choices',
                  value: shuffle,
                  set: setShuffle,
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className={`flex items-center justify-between py-3 ${
                    index < 2 ? 'border-b border-[#EDF0EC]' : ''
                  }`}
                >
                  <div>
                    <div className="text-[14px] font-extrabold">{item.title}</div>
                    <div className="mt-0.5 text-[12px] text-[#929A95]">{item.desc}</div>
                  </div>
                  <Toggle
                    checked={item.value}
                    onChange={(v) => {
                      item.set(v)
                      markUnsaved()
                    }}
                    label={item.title}
                  />
                </div>
              ))}
            </section>

            {showAiConfig && (
              <section className="rounded-2xl border border-[#D5E4D6] bg-[#F1F7F2] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
                    ✦
                  </div>
                  <div>
                    <div className="text-[15px] font-extrabold text-[#315341]">AI Evaluation</div>
                    <div className="mt-1 text-[12px] leading-5 text-[#668071]">
                      This question will be evaluated using ElytEdu&apos;s configured AI evaluation
                      pipeline.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Evaluation settings opened')}
                  className="mt-4 h-10 w-full rounded-xl border border-[#D6E3D7] bg-white text-[13px] font-extrabold text-[#3D614B] hover:bg-[#F9FCF8]"
                >
                  Configure Evaluation
                </button>
              </section>
            )}

            <section className="rounded-2xl border border-[#E2E7E1] bg-surface p-5">
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="h-10 w-full rounded-xl border border-[#E8D8D3] text-[13px] font-extrabold text-[#B35F4B] hover:bg-[#FFF7F4]"
              >
                Delete Question
              </button>
            </section>
          </aside>
        </div>
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewOpen(false)
          }}
        >
          <div className="w-full max-w-[700px] overflow-hidden rounded-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6EAE4] px-6 py-5">
              <div>
                <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#929A95]">
                  Student Preview
                </div>
                <h2 className="mt-1 text-[18px] font-extrabold">English Communication Test</h2>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="text-[#69736D]">
                ×
              </button>
            </div>
            <div className="p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-[#8D958F]">
                    {skill} · {questionType}
                  </div>
                  <div className="mt-1 text-[14px] text-[#929A95]">Question 1 of 12</div>
                </div>
                <div className="text-[15px] font-extrabold text-brand">00:{String(timeLimit).padStart(2, '0')}</div>
              </div>
              <h3 className="text-[20px] font-extrabold tracking-tight">{prompt}</h3>
              {showReading && (
                <div className="mt-6 rounded-2xl border border-[#D7E6D9] bg-[#EAF1EA] p-6">
                  <p className="text-[17px] font-bold leading-8 text-[#263A30]">{readingContent}</p>
                </div>
              )}
              <div className="mt-5 rounded-2xl border border-[#E4E8E2] bg-[#F5F6F2] p-5">
                <div className="text-[13px] font-extrabold">Record your response</div>
                <div className="mt-1 text-[12px] text-[#8D958F]">Speak clearly and naturally.</div>
              </div>
            </div>
            <div className="flex justify-end border-t border-[#E6EAE4] px-6 py-4">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="h-10 rounded-xl bg-brand px-4 text-[13px] font-extrabold text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {aiOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAiOpen(false)
          }}
        >
          <div className="w-full max-w-[560px] overflow-hidden rounded-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6EAE4] px-6 py-5">
              <div>
                <div className="text-[12px] font-extrabold uppercase tracking-wider text-brand">
                  ElytEdu AI
                </div>
                <h2 className="mt-1 text-[19px] font-extrabold">Generate Question</h2>
              </div>
              <button type="button" onClick={() => setAiOpen(false)}>
                ×
              </button>
            </div>
            <div className="p-6">
              <label className="mb-2 block text-[13px] font-extrabold text-[#68726C]">
                Generation Instruction
              </label>
              <textarea
                rows={5}
                value={aiInstruction}
                onChange={(e) => setAiInstruction(e.target.value)}
                className="w-full resize-none rounded-xl border border-[#E4E8E2] bg-[#F5F6F2] p-4 text-[15px] font-semibold leading-6 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-[#E6EAE4] px-6 py-4">
              <button
                type="button"
                onClick={() => setAiOpen(false)}
                className="h-10 rounded-xl border border-[#DDE2DC] px-4 text-[13px] font-extrabold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={generateQuestion}
                className="h-10 rounded-xl bg-brand px-4 text-[13px] font-extrabold text-white"
              >
                Generate Question
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteOpen(false)
          }}
        >
          <div className="w-full max-w-[420px] rounded-3xl bg-surface p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0EC] text-[#B35F4B]">
              ⌫
            </div>
            <h2 className="mt-4 text-[18px] font-extrabold">Delete this question?</h2>
            <p className="mt-2 text-[14px] leading-5 text-muted">
              This question will be removed from the question bank. Existing assessment attempts will
              not be affected.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="h-10 rounded-xl border border-[#DDE2DC] px-4 text-[13px] font-extrabold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false)
                  showToast('Question deleted')
                  navigate('/admin/question-bank')
                }}
                className="h-10 rounded-xl bg-[#B35F4B] px-4 text-[13px] font-extrabold text-white"
              >
                Delete Question
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} visible={toastVisible} />
    </div>
  )
}
