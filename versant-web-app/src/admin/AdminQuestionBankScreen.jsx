import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
  {
    id: 'QB-001',
    title: 'Read the sentence aloud',
    excerpt: 'The students are preparing for their final examination.',
    skill: 'Speaking',
    type: 'Read Aloud',
    difficulty: 'Beginner',
    points: '1',
    used: '24',
    evaluation: 'AI Evaluation',
    status: 'Active',
    ai: true,
    iconBg: 'bg-[#EAF1EA] text-brand',
    search:
      'QB-001 read the sentence aloud the students are preparing for their final examination',
  },
  {
    id: 'QB-002',
    title: 'Listen and repeat the sentence',
    excerpt: 'Repeat the sentence exactly as you hear it.',
    skill: 'Speaking',
    type: 'Repeat',
    difficulty: 'Intermediate',
    points: '1',
    used: '18',
    evaluation: 'AI Evaluation',
    status: 'Active',
    ai: false,
    iconBg: 'bg-[#EAF1EA] text-brand',
    search: 'QB-002 listen carefully and repeat the sentence exactly',
  },
  {
    id: 'QB-003',
    title: 'What do you usually do after classes?',
    excerpt: 'Everyday life',
    skill: 'Speaking',
    type: 'Short Answer',
    difficulty: 'Beginner',
    points: '2',
    used: '31',
    evaluation: 'AI Evaluation',
    status: 'Active',
    ai: false,
    iconBg: 'bg-[#EAF1EA] text-brand',
    search: 'QB-003 what do you usually do after classes everyday life',
  },
  {
    id: 'QB-004',
    title: 'Listen to the story and retell it',
    excerpt: 'Retell the main events using your own words.',
    skill: 'Speaking',
    type: 'Story Retelling',
    difficulty: 'Advanced',
    points: '3',
    used: '12',
    evaluation: 'AI Evaluation',
    status: 'Active',
    ai: true,
    iconBg: 'bg-[#EAF1EA] text-brand',
    search: 'QB-004 listen to the story and retell it in your own words',
  },
  {
    id: 'QB-005',
    title: 'Choose the most natural response',
    excerpt: 'Everyday conversation comprehension',
    skill: 'Listening',
    type: 'Conversation',
    difficulty: 'Intermediate',
    points: '2',
    used: '27',
    evaluation: 'Auto Scored',
    status: 'Active',
    ai: false,
    iconBg: 'bg-[#F0EFE7] text-[#7D7957]',
    search: 'QB-005 conversation choose natural response',
  },
  {
    id: 'QB-006',
    title: 'Complete the sentence',
    excerpt: 'Students could ______ research materials from anywhere.',
    skill: 'Reading',
    type: 'Sentence Completion',
    difficulty: 'Intermediate',
    points: '1',
    used: '34',
    evaluation: 'Auto Scored',
    status: 'Active',
    ai: true,
    iconBg: 'bg-[#EEF0E8] text-[#67745E]',
    search:
      'QB-006 university introduced digital library access research materials anywhere',
  },
  {
    id: 'QB-007',
    title: 'Write an email to your faculty coordinator',
    excerpt: 'Explain an absence and request workshop materials.',
    skill: 'Writing',
    type: 'Email Writing',
    difficulty: 'Advanced',
    points: '4',
    used: '9',
    evaluation: 'AI + Manual',
    status: 'Active',
    ai: false,
    iconBg: 'bg-[#FFF0E5] text-[#C66E2D]',
    search: 'QB-007 write email faculty coordinator workshop materials',
  },
  {
    id: 'QB-008',
    title: 'Reconstruct the passage in your own words',
    excerpt: 'Preserve the main meaning and key information.',
    skill: 'Writing',
    type: 'Passage Reconstruction',
    difficulty: 'Advanced',
    points: '4',
    used: '0',
    evaluation: 'AI Evaluation',
    status: 'Draft',
    ai: false,
    iconBg: 'bg-[#FFF0E5] text-[#C66E2D]',
    search:
      'QB-008 passage reconstruction students academic responsibilities weekly schedule',
  },
]

const KPIS = [
  {
    label: 'Total Questions',
    value: '1,248',
    meta: '+86 this month',
    metaTone: 'brand',
    showIcon: true,
  },
  { label: 'Speaking', value: '382', meta: '30.6% of bank' },
  { label: 'Listening', value: '296', meta: '23.7% of bank' },
  { label: 'Reading', value: '314', meta: '25.2% of bank' },
  { label: 'Writing', value: '256', meta: '20.5% of bank' },
]

const DIFFICULTY_STYLES = {
  Beginner: 'bg-[#EAF1EA] text-[#3F684F]',
  Intermediate: 'bg-[#FFF2E6] text-[#B86D32]',
  Advanced: 'bg-[#F5E8E3] text-[#9A5B48]',
}

const STATUS_STYLES = {
  Active: 'text-[#3F684F]',
  Draft: 'text-[#A66A32]',
  Archived: 'text-[#7A837D]',
}

const STATUS_DOT = {
  Active: 'bg-brand',
  Draft: 'bg-accent',
  Archived: 'bg-[#9BA29D]',
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

export default function AdminQuestionBankScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [skill, setSkill] = useState('')
  const [type, setType] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [preview, setPreview] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return QUESTIONS.filter((row) => {
      const matchesSearch = !q || row.search.toLowerCase().includes(q)
      const matchesSkill = !skill || row.skill === skill
      const matchesType = !type || row.type === type
      const matchesDifficulty = !difficulty || row.difficulty === difficulty
      const matchesStatus = !status || row.status === status
      return (
        matchesSearch && matchesSkill && matchesType && matchesDifficulty && matchesStatus
      )
    })
  }, [query, skill, type, difficulty, status])

  const allSelected =
    filtered.length > 0 && filtered.every((row) => selected.has(row.id))

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
        setPreview(null)
        setAddOpen(false)
        setImportOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function showToast(message) {
    setToast(message)
  }

  function toggleAll(checked) {
    setSelected((prev) => {
      const next = new Set(prev)
      filtered.forEach((row) => {
        if (checked) next.add(row.id)
        else next.delete(row.id)
      })
      return next
    })
  }

  function resetFilters() {
    setQuery('')
    setSkill('')
    setType('')
    setDifficulty('')
    setStatus('')
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="w-full">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[15px] text-[#9AA19C]">
              <span>Assessments</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#B4BAB5]">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <span className="font-bold text-[#303A34]">Question Bank</span>
            </div>
            <h1 className="text-[28px] font-extrabold tracking-tight">Question Bank</h1>
            <p className="mt-1 text-[15px] text-muted">
              Create, organize and reuse assessment questions across your college.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#DDE2DC] bg-surface px-4 text-[15px] font-extrabold text-[#344039] hover:bg-[#F4F6F1]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path
                  d="M8 8L12 4L16 8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M5 13V19H19V13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              Import
            </button>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[15px] font-extrabold text-white shadow-sm hover:bg-[#18583F]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M5 12H19" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Add Question
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-[#E3E8E1] bg-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[14px] font-bold uppercase tracking-wide text-[#8B948E]">
                    {kpi.label}
                  </div>
                  <div className="mt-2 text-[27px] font-extrabold">{kpi.value}</div>
                  <div
                    className={`mt-1 text-[13px] ${
                      kpi.metaTone === 'brand' ? 'font-bold text-brand' : 'text-[#8B948E]'
                    }`}
                  >
                    {kpi.meta}
                  </div>
                </div>
                {kpi.showIcon && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF1EA] text-brand">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M6 4H18V20H6V4Z" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M9 8H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      <path d="M9 12H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      <path d="M9 16H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4 rounded-2xl border border-[#E3E8E1] bg-surface p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1 xl:min-w-[280px]">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA29C]"
                width="20" height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, IDs, tags..."
                className="h-10 w-full rounded-xl border border-transparent bg-[#F5F6F2] pl-10 pr-4 text-[15px] font-semibold outline-none placeholder:text-[#A1A8A3] focus:border-[#BFD2C5] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="h-10 rounded-xl border border-transparent bg-[#F5F6F2] px-3 text-[15px] font-bold text-[#56615A] outline-none"
              >
                <option value="">All Skills</option>
                <option value="Speaking">Speaking</option>
                <option value="Listening">Listening</option>
                <option value="Reading">Reading</option>
                <option value="Writing">Writing</option>
              </select>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 rounded-xl border border-transparent bg-[#F5F6F2] px-3 text-[15px] font-bold text-[#56615A] outline-none"
              >
                <option value="">All Types</option>
                <option value="Read Aloud">Read Aloud</option>
                <option value="Repeat">Repeat</option>
                <option value="Short Answer">Short Answer</option>
                <option value="Story Retelling">Story Retelling</option>
                <option value="Open Question">Open Question</option>
                <option value="Conversation">Conversation</option>
                <option value="Passage">Passage</option>
                <option value="Sentence Completion">Sentence Completion</option>
                <option value="Email Writing">Email Writing</option>
                <option value="Passage Reconstruction">Passage Reconstruction</option>
              </select>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="h-10 rounded-xl border border-transparent bg-[#F5F6F2] px-3 text-[15px] font-bold text-[#56615A] outline-none"
              >
                <option value="">All Difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 rounded-xl border border-transparent bg-[#F5F6F2] px-3 text-[15px] font-bold text-[#56615A] outline-none"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 rounded-xl px-3 text-[14px] font-extrabold text-[#69736D] hover:bg-[#F2F5E8]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-[#CFE0D1] bg-[#EAF1EA] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-[14px] font-extrabold text-white">
                {selected.size}
              </div>
              <span className="text-[15px] font-bold text-[#315341]">questions selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast(
                    `${selected.size} question${selected.size > 1 ? 's' : ''} added to assessment`,
                  )
                }}
                className="h-8 rounded-lg bg-brand px-3 text-[14px] font-extrabold text-white"
              >
                Add to Assessment
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(
                    `${selected.size} question${selected.size > 1 ? 's' : ''} moved to archive`,
                  )
                  setSelected(new Set())
                }}
                className="h-8 rounded-lg border border-[#D5DED6] bg-white px-3 text-[14px] font-extrabold text-[#56615A]"
              >
                Archive
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="h-8 rounded-lg px-3 text-[14px] font-extrabold text-[#6D776F] hover:bg-white"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#E3E8E1] bg-surface">
          <div className="flex items-center justify-between border-b border-[#E7EAE5] px-5 py-4">
            <div>
              <h2 className="text-[16px] font-extrabold">All Questions</h2>
              <p className="mt-0.5 text-[13px] text-[#929A95]">
                Showing <span>{filtered.length}</span> questions
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 text-[14px] font-extrabold text-brand hover:underline"
            >
              + Create question
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-[#E7EAE5] bg-[#F7F8F5]">
                  <th className="w-[46px] px-5 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="accent-brand"
                      aria-label="Select all"
                    />
                  </th>
                  {[
                    'Question',
                    'Skill / Type',
                    'Difficulty',
                    'Points',
                    'Used',
                    'Evaluation',
                    'Status',
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-3 py-3 text-[12px] font-extrabold uppercase tracking-wider text-[#8A928C] ${
                        h === 'Points' || h === 'Used' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                  <th className="w-[70px]" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-[#EEF0EC] transition hover:bg-[#FAFBF8]">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={(e) => {
                          setSelected((prev) => {
                            const next = new Set(prev)
                            if (e.target.checked) next.add(row.id)
                            else next.delete(row.id)
                            return next
                          })
                        }}
                        className="accent-brand"
                        aria-label={`Select ${row.id}`}
                      />
                    </td>
                    <td className="max-w-[380px] px-3 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${row.iconBg}`}
                        >
                          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M6 4H18V20H6V4Z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-extrabold text-[#929A95]">{row.id}</span>
                            {row.ai && (
                              <span className="rounded-md bg-[#FFF0E3] px-1.5 py-0.5 text-[12px] font-extrabold text-[#C36D2D]">
                                AI GENERATED
                              </span>
                            )}
                          </div>
                          <div className="mt-1 truncate text-[15px] font-extrabold">{row.title}</div>
                          <div className="mt-1 truncate text-[13px] text-[#7C857F]">{row.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-[14px] font-extrabold">{row.skill}</div>
                      <div className="mt-0.5 text-[13px] text-[#8B938E]">{row.type}</div>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-md px-2 py-1 text-[12px] font-extrabold ${DIFFICULTY_STYLES[row.difficulty]}`}
                      >
                        {row.difficulty}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center text-[14px] font-extrabold">{row.points}</td>
                    <td className="px-3 py-4 text-center">
                      <div className="text-[14px] font-extrabold">{row.used}</div>
                      <div className="text-[12px] text-[#929A95]">assessments</div>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`text-[13px] font-bold ${
                          row.evaluation.includes('AI') ? 'text-[#426B55]' : 'text-[#59645D]'
                        }`}
                      >
                        {row.evaluation}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[12px] font-extrabold ${STATUS_STYLES[row.status]}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[row.status]}`} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setPreview(row)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-[#727C75] hover:bg-[#EEF2EB]"
                        aria-label={`Preview ${row.id}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
                          <path
                            d="M10 9L15 12L10 15V9Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-sm font-bold text-[#8a928c]">
                      No questions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#E7EAE5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[13px] text-[#8C958F]">
              Showing <span className="font-bold text-[#4B554F]">1–{filtered.length}</span> of{' '}
              <span className="font-bold text-[#4B554F]">1,248</span> questions
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E1E5DF] text-[#A1A8A3]"
              >
                ‹
              </button>
              <button type="button" className="h-10 w-10 rounded-lg bg-brand text-[13px] font-extrabold text-white">
                1
              </button>
              <button type="button" className="h-10 w-10 rounded-lg text-[13px] font-bold text-[#69736D] hover:bg-[#F2F5E8]">
                2
              </button>
              <button type="button" className="h-10 w-10 rounded-lg text-[13px] font-bold text-[#69736D] hover:bg-[#F2F5E8]">
                3
              </button>
              <span className="px-1 text-[14px] text-[#A0A6A1]">...</span>
              <button type="button" className="h-10 w-10 rounded-lg text-[13px] font-bold text-[#69736D] hover:bg-[#F2F5E8]">
                156
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E1E5DF] text-[#69736D]"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreview(null)
          }}
        >
          <div className="w-full max-w-[680px] overflow-hidden rounded-3xl border border-[#E1E6DF] bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E9E4] px-6 py-5">
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#8D958F]">
                  Question Preview
                </div>
                <div className="mt-1 text-[15px] font-extrabold text-brand">{preview.id}</div>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[#69736D] hover:bg-[#F2F5E8]"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-[#EAF1EA] px-2.5 py-1 text-[13px] font-extrabold text-[#3F684F]">
                  {preview.skill}
                </span>
                <span className="rounded-lg bg-[#F3F4F0] px-2.5 py-1 text-[13px] font-extrabold text-[#68726C]">
                  {preview.type}
                </span>
                <span className="rounded-lg bg-[#FFF2E6] px-2.5 py-1 text-[13px] font-extrabold text-[#B86D32]">
                  {preview.difficulty}
                </span>
              </div>
              <h2 className="text-[21px] font-extrabold tracking-tight">{preview.title}</h2>
              <div className="mt-5 rounded-2xl border border-[#E6EAE4] bg-[#F5F6F2] p-5">
                <div className="mb-2 text-[13px] font-extrabold uppercase tracking-wider text-[#909892]">
                  Question Content
                </div>
                <p className="text-[16px] font-semibold leading-7 text-[#354039]">{preview.excerpt}</p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-[#F7F8F5] p-4">
                  <div className="text-[12px] font-extrabold uppercase tracking-wide text-[#969D98]">
                    Points
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold">{preview.points}</div>
                </div>
                <div className="rounded-xl bg-[#F7F8F5] p-4">
                  <div className="text-[12px] font-extrabold uppercase tracking-wide text-[#969D98]">
                    Evaluation
                  </div>
                  <div className="mt-1 text-[15px] font-extrabold">{preview.evaluation}</div>
                </div>
                <div className="rounded-xl bg-[#F7F8F5] p-4">
                  <div className="text-[12px] font-extrabold uppercase tracking-wide text-[#969D98]">
                    Status
                  </div>
                  <div className="mt-1 text-[15px] font-extrabold text-[#3F684F]">{preview.status}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E6E9E4] px-6 py-4">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="h-10 rounded-xl border border-[#DDE2DC] px-4 text-[14px] font-extrabold text-[#59645D]"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null)
                    showToast('Question duplicated successfully')
                  }}
                  className="h-10 rounded-xl border border-[#DDE2DC] px-4 text-[14px] font-extrabold text-[#59645D]"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null)
                    showToast('Question added to assessment')
                  }}
                  className="h-10 rounded-xl bg-brand px-4 text-[14px] font-extrabold text-white"
                >
                  Add to Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddOpen(false)
          }}
        >
          <div className="w-full max-w-[760px] overflow-hidden rounded-3xl border border-[#E1E6DF] bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E9E4] px-6 py-5">
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#8D958F]">
                  Question Bank
                </div>
                <h2 className="mt-1 text-[20px] font-extrabold">Add Question</h2>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[#69736D] hover:bg-[#F2F5E8]"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-3 text-[14px] font-extrabold text-[#7B847E]">
                Choose how you want to create the question
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddOpen(false)
                    showToast('Opening AI Question Composer...')
                  }}
                  className="rounded-2xl border border-[#DDE5DD] p-5 text-left transition hover:border-[#AFC8B7] hover:bg-[#F7FAF6]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF1EA] text-brand">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3L13.8 8.2L19 10L13.8 11.8L12 17L10.2 11.8L5 10L10.2 8.2L12 3Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-[16px] font-extrabold">Generate with AI</div>
                  <div className="mt-1 text-[13px] leading-5 text-[#7E8781]">
                    Describe the skill, level and topic. ElytEdu will generate an assessment-ready
                    question.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddOpen(false)
                    navigate('/admin/question-bank/editor')
                  }}
                  className="rounded-2xl border border-[#DDE5DD] p-5 text-left transition hover:border-[#AFC8B7] hover:bg-[#F7FAF6]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F3EF] text-[#657069]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 19L6.2 15.2L15.8 5.6C16.6 4.8 17.9 4.8 18.7 5.6L19 5.9C19.8 6.7 19.8 8 19 8.8L9.4 18.4L5 19Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-[16px] font-extrabold">Create Manually</div>
                  <div className="mt-1 text-[13px] leading-5 text-[#7E8781]">
                    Build a question yourself with complete control over content, scoring and
                    evaluation.
                  </div>
                </button>
              </div>

              <div className="mt-5 rounded-xl border border-[#E5E9E3] bg-[#F5F6F2] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M12 10V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      <circle cx="12" cy="7" r="1" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold">Questions can be reused</div>
                    <div className="mt-1 text-[13px] leading-5 text-[#858E88]">
                      Every question created here can later be added to multiple assessments without
                      duplicating the original question.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-[#E6E9E4] px-6 py-4">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="h-10 rounded-xl border border-[#DDE2DC] px-4 text-[14px] font-extrabold text-[#59645D]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {importOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setImportOpen(false)
          }}
        >
          <div className="w-full max-w-[600px] overflow-hidden rounded-3xl border border-[#E1E6DF] bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E9E4] px-6 py-5">
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-wider text-[#8D958F]">
                  Question Bank
                </div>
                <h2 className="mt-1 text-[20px] font-extrabold">Import Questions</h2>
              </div>
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-[#69736D] hover:bg-[#F2F5E8]"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="cursor-pointer rounded-2xl border-2 border-dashed border-[#D7DED7] p-10 text-center transition hover:border-[#AFC8B7]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF1EA] text-brand">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    <path
                      d="M8 8L12 4L16 8"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <path d="M5 13V19H19V13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="mt-4 text-[16px] font-extrabold">Upload question file</div>
                <div className="mt-1 text-[13px] text-[#8B938E]">CSV or Excel files up to 10 MB</div>
                <button
                  type="button"
                  className="mt-5 h-10 rounded-xl bg-brand px-4 text-[14px] font-extrabold text-white"
                >
                  Choose File
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[13px] text-[#8B938E]">Need the correct format?</div>
                <button type="button" className="text-[13px] font-extrabold text-brand hover:underline">
                  Download Template
                </button>
              </div>
            </div>

            <div className="flex justify-end border-t border-[#E6E9E4] px-6 py-4">
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="h-10 rounded-xl border border-[#DDE2DC] px-4 text-[14px] font-extrabold text-[#59645D]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} visible={toastVisible} />
    </div>
  )
}
