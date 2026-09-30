import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LEVEL_LABELS = {
  C2: 'C2 Proficient',
  C1: 'C1 Advanced',
  B2: 'B2 Upper Intermediate',
  B1: 'B1 Intermediate',
  A2: 'A2 Elementary',
  A1: 'A1 Beginner',
}

const SKILLS = [
  { name: 'Speaking', score: 86.2, accent: true },
  { name: 'Listening', score: 79.4, accent: false },
  { name: 'Reading', score: 84.1, accent: true },
  { name: 'Writing', score: 78.3, accent: false },
]

const DISTRIBUTION = [
  { label: '0–49', count: 18, height: '20%', color: 'bg-[#E6ECE3]' },
  { label: '50–59', count: 46, height: '43%', color: 'bg-[#D5E4D6]' },
  { label: '60–69', count: 112, height: '65%', color: 'bg-[#C2D9C5]' },
  { label: '70–79', count: 278, height: '85%', color: 'bg-[#A9CCAF]' },
  { label: '80–89', count: 421, height: '100%', color: 'bg-brand' },
  { label: '90–100', count: 311, height: '72%', color: 'bg-[#7CA98A]' },
]

const PROFICIENCY = [
  { label: 'A1 Beginner', pct: '4.2%', color: 'bg-[#B8CDBB]' },
  { label: 'A2 Elementary', pct: '8.7%', color: 'bg-[#9FBDA5]' },
  { label: 'B1 Intermediate', pct: '21.4%', color: 'bg-[#78A486]' },
  { label: 'B2 Upper Intermediate', pct: '42.6%', color: 'bg-brand' },
  { label: 'C1 Advanced', pct: '19.8%', color: 'bg-accent' },
  { label: 'C2 Proficient', pct: '3.3%', color: 'bg-[#E9C09C]' },
]

const RESULTS = [
  {
    name: 'Emma Wilson',
    id: '24CS001',
    initials: 'EW',
    avatar: 'bg-[#DCEBDD] text-brand',
    batch: 'CSE 3A',
    overall: 98,
    speaking: 97,
    listening: 96,
    reading: 98,
    writing: 99,
    level: 'C2',
    result: 'Passed',
    skill: 'Speaking',
  },
  {
    name: 'Liam Parker',
    id: '24CS002',
    initials: 'LP',
    avatar: 'bg-[#F4E8DD] text-accent',
    batch: 'CSE 3A',
    overall: 91,
    speaking: 93,
    listening: 87,
    reading: 92,
    writing: 91,
    level: 'B2',
    result: 'Passed',
    skill: 'Listening',
  },
  {
    name: 'Olivia Martin',
    id: '24CS003',
    initials: 'OM',
    avatar: 'bg-[#F3DDD0] text-accent',
    batch: 'CSE 3B',
    overall: 68,
    speaking: 62,
    listening: 71,
    reading: 72,
    writing: 67,
    level: 'B1',
    result: 'Needs Review',
    skill: 'Speaking',
  },
  {
    name: 'Noah Brown',
    id: '24CS004',
    initials: 'NB',
    avatar: 'bg-[#DCEBDD] text-brand',
    batch: 'CSE 3A',
    overall: 88,
    speaking: 89,
    listening: 83,
    reading: 92,
    writing: 86,
    level: 'B2',
    result: 'Passed',
    skill: 'Reading',
  },
  {
    name: 'Sophia Lee',
    id: '24EC005',
    initials: 'SL',
    avatar: 'bg-[#DCEBDD] text-brand',
    batch: 'ECE 3',
    overall: 94,
    speaking: 96,
    listening: 92,
    reading: 95,
    writing: 93,
    level: 'C1',
    result: 'Passed',
    skill: 'Writing',
  },
  {
    name: 'Ethan Davis',
    id: '24CS006',
    initials: 'ED',
    avatar: 'bg-[#F4E8DD] text-accent',
    batch: 'CSE 3B',
    overall: 72,
    speaking: 75,
    listening: 69,
    reading: 77,
    writing: 67,
    level: 'B1',
    result: 'Needs Review',
    skill: 'Writing',
  },
]

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-7 right-7 z-[100] transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-20 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl bg-[#17221D] px-4 py-3 text-white shadow-xl">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#315E4C]">✓</div>
        <span className="text-[13px] font-semibold">{message}</span>
      </div>
    </div>
  )
}

function ResultBadge({ result }) {
  if (result === 'Needs Review' || result === 'REVIEW') {
    return (
      <span className="rounded-md bg-[#F8EDE4] px-2 py-1 text-[12px] font-extrabold text-accent">
        REVIEW
      </span>
    )
  }
  if (result === 'Failed' || result === 'FAILED') {
    return (
      <span className="rounded-md bg-[#F8EDE4] px-2 py-1 text-[12px] font-extrabold text-accent">
        FAILED
      </span>
    )
  }
  return (
    <span className="rounded-md bg-[#E5F0E5] px-2 py-1 text-[12px] font-extrabold text-brand">
      PASSED
    </span>
  )
}

function LevelBadge({ level }) {
  const warm = level === 'B1' || level === 'A2' || level === 'A1'
  return (
    <span
      className={`rounded-md px-2 py-1 text-[12px] font-extrabold ${
        warm ? 'bg-[#F4EEE4] text-accent' : 'bg-[#E5F0E5] text-brand'
      }`}
    >
      {level}
    </span>
  )
}

export default function AdminResultsScreen() {
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState('English Communication Test')
  const [cohort, setCohort] = useState('All Students')
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [resultFilter, setResultFilter] = useState('')
  const [batchFilter, setBatchFilter] = useState('')
  const [student, setStudent] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportType, setReportType] = useState('Assessment Summary')
  const [includes, setIncludes] = useState(() => new Set(['Overall scores', 'Skill scores', 'Proficiency', 'AI insights']))
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return RESULTS.filter((row) => {
      const haystack = `${row.name} ${row.id} ${row.batch}`.toLowerCase()
      const matchesSearch = !q || haystack.includes(q)
      const matchesSkill = !skillFilter || row.skill === skillFilter
      const matchesLevel = !levelFilter || row.level === levelFilter
      const matchesResult = !resultFilter || row.result === resultFilter
      const matchesBatch = !batchFilter || row.batch === batchFilter
      return matchesSearch && matchesSkill && matchesLevel && matchesResult && matchesBatch
    })
  }, [search, skillFilter, levelFilter, resultFilter, batchFilter])

  useEffect(() => {
    if (!toast) return undefined
    setToastVisible(true)
    const timer = setTimeout(() => {
      setToastVisible(false)
      setTimeout(() => setToast(''), 300)
    }, 2600)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setStudent(null)
        setExportOpen(false)
        setReportOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function showToast(message) {
    setToast(message)
  }

  function resetFilters() {
    setSearch('')
    setSkillFilter('')
    setLevelFilter('')
    setResultFilter('')
    setBatchFilter('')
    setPage(1)
  }

  function modalBadge(overall) {
    if (overall < 70) return { text: 'FAILED', className: 'bg-[#F8EDE4] text-accent' }
    if (overall < 80) return { text: 'REVIEW', className: 'bg-[#F8EDE4] text-accent' }
    return { text: 'PASSED', className: 'bg-[#E5F0E5] text-brand' }
  }

  return (
    <div className="w-full p-6 sm:p-8 lg:p-10">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[14px] text-muted">
            <Link to="/admin/results" className="hover:text-brand">
              Results
            </Link>
            <span>/</span>
            <span>Assessment Results</span>
          </div>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">
            Assessment Results
          </h1>
          <p className="mt-1 text-sm text-muted">
            Review student performance, scores and evaluation outcomes.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#DDE4DA] bg-surface px-4 text-[13px] font-bold hover:bg-white"
          >
            Export
          </button>
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-bold text-white hover:bg-[#195A43]"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-[#E1E7DD] bg-surface p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E4F0E5] text-brand">
              ≡
            </div>
            <div>
              <div className="text-[13px] font-bold uppercase tracking-[1.3px] text-muted">
                Selected Assessment
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <select
                  value={assessment}
                  onChange={(e) => {
                    setAssessment(e.target.value)
                    showToast(`Loaded ${e.target.value}`)
                  }}
                  className="cursor-pointer border-0 bg-transparent pr-6 text-base font-extrabold outline-none"
                >
                  <option>English Communication Test</option>
                  <option>Campus English Placement Test</option>
                  <option>Professional Communication Assessment</option>
                </select>
                <span className="rounded-md bg-[#E5F0E5] px-2 py-1 text-[12px] font-extrabold uppercase tracking-wide text-brand">
                  Published
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8 text-[13px]">
            {[
              ['Attempts', '1,248'],
              ['Completed', '1,186'],
              ['Completion', '95.0%'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-[13px] font-bold uppercase tracking-wide text-muted">{label}</div>
                <div className="mt-1 font-extrabold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: 'Average Score', value: '82.4', meta: '↑ 4.8% from previous', metaClass: 'text-[#4C8A67]' },
          { label: 'Pass Rate', value: '78.6%', meta: '↑ 3.2% from previous', metaClass: 'text-[#4C8A67]' },
          { label: 'Highest Score', value: '98', meta: 'Emma Wilson', metaClass: 'text-muted' },
          {
            label: 'Needs Review',
            value: '24',
            meta: 'AI confidence below threshold',
            metaClass: 'text-accent font-bold',
          },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-[#E1E7DD] bg-surface p-5">
            <div className="text-[13px] font-semibold text-muted">{kpi.label}</div>
            <div className="mt-2 text-[30px] font-extrabold">{kpi.value}</div>
            <div className={`mt-1 text-[13px] font-bold ${kpi.metaClass}`}>{kpi.meta}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#E1E7DD] bg-surface p-6 xl:col-span-2">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-extrabold">Performance Overview</h2>
              <p className="mt-1 text-[13px] text-muted">Average skill scores across completed attempts</p>
            </div>
            <select
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              className="rounded-lg border-0 bg-[#F4F6F0] px-3 py-2 text-[13px] font-bold outline-none"
            >
              <option>All Students</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>IT</option>
              <option>EEE</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-bold">{skill.name}</span>
                  <span className="text-sm font-extrabold">{skill.score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#E9EDE6]">
                  <div
                    className={`h-full rounded-full ${skill.accent ? 'bg-brand' : 'bg-accent'}`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[12px] text-muted">
                  <span>Weak</span>
                  <span>Strong</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-[#E7EBE4] pt-6">
            <div className="mb-3">
              <div className="text-[13px] font-bold">Score Distribution</div>
              <div className="mt-0.5 text-[13px] text-muted">Students by overall score range</div>
            </div>
            <div className="flex h-[100px] items-end gap-3">
              {DISTRIBUTION.map((bar) => (
                <div key={bar.label} className="flex h-full flex-1 flex-col justify-end">
                  <div className={`rounded-t-lg ${bar.color}`} style={{ height: bar.height }} />
                  <div className="mt-2 text-center text-[12px] text-muted">{bar.label}</div>
                  <div className="text-center text-[12px] font-bold">{bar.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E1E7DD] bg-surface p-6">
          <h2 className="text-[16px] font-extrabold">Proficiency Levels</h2>
          <p className="mt-1 text-[13px] text-muted">Student distribution by level</p>

          <div className="my-6 flex justify-center">
            <div className="relative h-[170px] w-[170px]">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#E8EDE5" strokeWidth="14" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#1F6B4F"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="565"
                  strokeDashoffset="102"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[29px] font-extrabold">B2</div>
                <div className="text-[13px] font-semibold text-muted">Most common</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {PROFICIENCY.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="text-[13px] font-semibold">{item.label}</span>
                </div>
                <span className="text-[13px] font-extrabold">{item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[#E1E7DD] bg-surface p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative max-w-[330px] flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              width="20" height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, ID or batch..."
              className="h-10 w-full rounded-xl border border-[#E1E6DE] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-brand"
            />
          </div>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="h-10 rounded-xl border border-[#E1E6DE] bg-white px-3 text-[13px] font-semibold outline-none"
          >
            <option value="">All Skills</option>
            <option>Speaking</option>
            <option>Listening</option>
            <option>Reading</option>
            <option>Writing</option>
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="h-10 rounded-xl border border-[#E1E6DE] bg-white px-3 text-[13px] font-semibold outline-none"
          >
            <option value="">All Levels</option>
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="h-10 rounded-xl border border-[#E1E6DE] bg-white px-3 text-[13px] font-semibold outline-none"
          >
            <option value="">All Results</option>
            <option>Passed</option>
            <option>Needs Review</option>
            <option>Failed</option>
          </select>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="h-10 rounded-xl border border-[#E1E6DE] bg-white px-3 text-[13px] font-semibold outline-none"
          >
            <option value="">All Batches</option>
            <option>CSE 3A</option>
            <option>CSE 3B</option>
            <option>ECE 3</option>
            <option>IT 3A</option>
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 rounded-xl px-3 text-[13px] font-bold text-muted hover:bg-[#F1F4EE] hover:text-dark"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E1E7DD] bg-surface">
        <div className="flex items-center justify-between border-b border-[#E7EBE4] px-5 py-4">
          <div>
            <div className="text-sm font-extrabold">Student Results</div>
            <div className="mt-0.5 text-[13px] text-muted">1,186 completed assessments</div>
          </div>
          <button
            type="button"
            onClick={() => showToast('CSV export prepared')}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E1E6DE] px-3 text-[13px] font-bold hover:bg-white"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="border-b border-[#E7EBE4] bg-[#F5F7F2]">
              <tr className="text-[12px] font-extrabold uppercase tracking-[1px] text-muted">
                {[
                  'Student',
                  'Batch',
                  'Overall',
                  'Speaking',
                  'Listening',
                  'Reading',
                  'Writing',
                  'Level',
                  'Result',
                  'Action',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3 ${i === 0 ? 'px-5' : i === 9 ? 'px-5 text-right' : 'px-4'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EDE6]">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAFBF8]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-extrabold ${row.avatar}`}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <div className="text-[13px] font-extrabold">{row.name}</div>
                        <div className="text-[12px] text-muted">{row.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] font-semibold">{row.batch}</td>
                  <td className="px-4 py-4 text-sm font-extrabold">{row.overall}</td>
                  <td className="px-4 py-4 text-[13px] font-bold">{row.speaking}</td>
                  <td className="px-4 py-4 text-[13px] font-bold">{row.listening}</td>
                  <td className="px-4 py-4 text-[13px] font-bold">{row.reading}</td>
                  <td className="px-4 py-4 text-[13px] font-bold">{row.writing}</td>
                  <td className="px-4 py-4">
                    <LevelBadge level={row.level} />
                  </td>
                  <td className="px-4 py-4">
                    <ResultBadge result={row.result} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setStudent(row)}
                      className="text-[13px] font-extrabold text-brand hover:underline"
                    >
                      {row.result === 'Needs Review' ? 'Review' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-[13px] text-muted">
                    No results match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E7EBE4] px-5 py-3.5">
          <div className="text-[13px] text-muted">
            Showing <span className="font-bold text-dark">1–{filtered.length}</span> of{' '}
            <span className="font-bold text-dark">1,186</span> results
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-7 w-7 rounded-lg text-[13px] font-bold ${
                  page === n ? 'bg-brand text-white' : 'hover:bg-[#F0F3ED]'
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-1 text-[13px] text-muted">...</span>
            <button type="button" className="h-7 w-7 rounded-lg text-[13px] font-bold hover:bg-[#F0F3ED]">
              198
            </button>
          </div>
        </div>
      </div>

      {student && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221D]/35 p-6 backdrop-blur-[4px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setStudent(null)
          }}
        >
          <div className="max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-3xl bg-surface shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5EAE2] bg-surface px-7 py-5">
              <div>
                <div className="text-[13px] font-bold uppercase tracking-[1.3px] text-muted">
                  Student Result
                </div>
                <h2 className="mt-1 text-xl font-extrabold">{student.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setStudent(null)}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F3ED] text-muted"
              >
                ×
              </button>
            </div>

            <div className="p-7">
              <div className="mb-7 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-extrabold ${student.avatar}`}
                  >
                    {student.initials}
                  </div>
                  <div>
                    <div className="text-[13px] text-muted">{student.id}</div>
                    <div className="mt-1 text-[13px] font-bold">{student.batch}</div>
                    <div className="mt-1 text-[13px] text-muted">{assessment}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex rounded-lg px-3 py-1.5 text-[13px] font-extrabold ${
                      modalBadge(student.overall).className
                    }`}
                  >
                    {modalBadge(student.overall).text}
                  </span>
                  <div className="mt-2 text-[13px] font-bold">
                    {LEVEL_LABELS[student.level] || student.level}
                  </div>
                </div>
              </div>

              <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="col-span-2 flex items-center justify-center rounded-2xl bg-[#EAF1E8] p-5">
                  <div className="text-center">
                    <div className="text-[13px] font-bold uppercase tracking-[1px] text-muted">
                      Overall Score
                    </div>
                    <div className="mt-2 text-[48px] font-extrabold leading-none text-brand">
                      {student.overall}
                    </div>
                    <div className="mt-2 text-[13px] text-muted">out of 100</div>
                  </div>
                </div>
                {[
                  ['Speaking', student.speaking],
                  ['Listening', student.listening],
                  ['Reading', student.reading],
                  ['Writing', student.writing],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[#E5EAE2] p-4">
                    <div className="text-[13px] font-bold text-muted">{label}</div>
                    <div className="mt-2 text-xl font-extrabold">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mb-5 rounded-2xl border border-[#E5EAE2] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold">Evaluation Summary</div>
                    <div className="mt-1 text-[13px] text-muted">AI-generated performance indicators</div>
                  </div>
                  <span className="rounded-lg bg-[#E5F0E5] px-2.5 py-1 text-[12px] font-extrabold text-brand">
                    HIGH CONFIDENCE
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {[
                    ['Fluency', 94],
                    ['Pronunciation', 96],
                    ['Vocabulary', 91],
                    ['Grammar', 95],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-[13px]">
                        <span className="font-semibold">{label}</span>
                        <span className="font-bold">{value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#E9EDE6]">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#F4F6F0] p-5">
                <div className="mb-2 text-[13px] font-extrabold">Performance Insight</div>
                <p className="text-[13px] leading-relaxed text-muted">
                  Strong overall communication ability with consistent performance across all four
                  skills. Continue advanced speaking and writing practice to maintain proficiency.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#E5EAE2] px-7 py-4">
              <button
                type="button"
                onClick={() => setStudent(null)}
                className="h-10 rounded-xl border border-[#DDE4DA] px-4 text-[13px] font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setStudent(null)
                  navigate('/admin/results/report')
                }}
                className="h-10 rounded-xl bg-brand px-4 text-[13px] font-bold text-white"
              >
                View Detailed Report
              </button>
            </div>
          </div>
        </div>
      )}

      {exportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221D]/35 p-6 backdrop-blur-[4px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setExportOpen(false)
          }}
        >
          <div className="w-full max-w-[440px] rounded-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5EAE2] px-6 py-5">
              <div>
                <h3 className="text-lg font-extrabold">Export Results</h3>
                <p className="mt-1 text-[13px] text-muted">Choose your export format</p>
              </div>
              <button
                type="button"
                onClick={() => setExportOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0F3ED] text-muted"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 p-6">
              {[
                ['CSV', 'CSV Spreadsheet', 'Student scores and skill-level data'],
                ['Excel', 'Excel Workbook', 'Formatted results for analysis'],
                ['PDF', 'PDF Report', 'Presentation-ready assessment summary'],
              ].map(([type, title, desc]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setExportOpen(false)
                    showToast(`${type} export prepared`)
                  }}
                  className="w-full rounded-xl border border-[#E1E6DE] p-4 text-left hover:bg-[#F4F6F0]"
                >
                  <div className="text-[13px] font-bold">{title}</div>
                  <div className="mt-1 text-[13px] text-muted">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221D]/35 p-6 backdrop-blur-[4px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReportOpen(false)
          }}
        >
          <div className="w-full max-w-[500px] rounded-3xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5EAE2] px-6 py-5">
              <div>
                <h3 className="text-lg font-extrabold">Generate Report</h3>
                <p className="mt-1 text-[13px] text-muted">Create a performance report</p>
              </div>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0F3ED] text-muted"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <label className="text-[13px] font-bold uppercase tracking-wide text-muted">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#E1E6DE] bg-white px-3 text-[13px] font-semibold outline-none"
              >
                <option>Assessment Summary</option>
                <option>Student Performance Report</option>
                <option>Batch Performance Report</option>
                <option>Skill Analysis Report</option>
              </select>
              <label className="mt-5 block text-[13px] font-bold uppercase tracking-wide text-muted">
                Include
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['Overall scores', 'Skill scores', 'Proficiency', 'AI insights'].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 rounded-xl bg-[#F4F6F0] p-3 text-[13px] font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={includes.has(item)}
                      onChange={(e) => {
                        setIncludes((prev) => {
                          const next = new Set(prev)
                          if (e.target.checked) next.add(item)
                          else next.delete(item)
                          return next
                        })
                      }}
                      className="accent-brand"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[#E5EAE2] px-6 py-4">
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="h-10 rounded-xl border border-[#DDE4DA] px-4 text-[13px] font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportOpen(false)
                  showToast('Report generation started')
                }}
                className="h-10 rounded-xl bg-brand px-4 text-[13px] font-bold text-white"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} visible={toastVisible} />
    </div>
  )
}
