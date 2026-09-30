import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const ASSESSMENTS = {
  english: {
    name: 'English Communication Test',
    meta: 'College Assessment · Sep 8, 2026 · 09:00 AM – 11:59 PM',
  },
  placement: {
    name: 'English Placement Test',
    meta: 'Placement · Sep 8, 2026 · 09:00 AM – 05:00 PM',
  },
  speaking: {
    name: 'Speaking Evaluation',
    meta: 'Skill Check · Sep 8, 2026 · 10:00 AM – 06:00 PM',
  },
}

const STUDENTS = [
  {
    id: '24CS001',
    key: 'emma',
    name: 'Emma Wilson',
    initials: 'EW',
    avatar: 'bg-[#DCEBDD] text-brand',
    batch: 'cse3a',
    batchLabel: 'CSE · 3A',
    skill: 'speaking',
    section: 'Speaking',
    question: 'Q4 · Story Retelling',
    questionShort: 'Story Retelling',
    progress: 38,
    progressLabel: '4 / 10',
    time: '08:42',
    connection: 'Excellent',
    connectionTone: 'good',
    status: 'active',
    latency: '48 ms',
    year: 'CSE · 3rd Year',
    recording: true,
  },
  {
    id: '24CS002',
    key: 'liam',
    name: 'Liam Parker',
    initials: 'LP',
    avatar: 'bg-[#FCEBDD] text-[#B96B2E]',
    batch: 'cse3a',
    batchLabel: 'CSE · 3A',
    skill: 'listening',
    section: 'Listening',
    question: 'Q7 · Passage',
    questionShort: 'Passage',
    progress: 61,
    progressLabel: '7 / 10',
    time: '17:26',
    connection: 'Good',
    connectionTone: 'good',
    status: 'active',
    latency: '62 ms',
    year: 'CSE · 3rd Year',
    recording: false,
  },
  {
    id: '24CS003',
    key: 'olivia',
    name: 'Olivia Martin',
    initials: 'OM',
    avatar: 'bg-[#E9E8F5] text-[#64618B]',
    batch: 'cse3b',
    batchLabel: 'CSE · 3B',
    skill: 'speaking',
    section: 'Speaking',
    question: 'Q3 · Short Answer',
    questionShort: 'Short Answer',
    progress: 28,
    progressLabel: '3 / 10',
    time: '06:51',
    connection: 'Unstable',
    connectionTone: 'warn',
    status: 'warning',
    latency: '420 ms',
    year: 'CSE · 3rd Year',
    recording: false,
  },
  {
    id: '24CS004',
    key: 'noah',
    name: 'Noah Brown',
    initials: 'NB',
    avatar: 'bg-[#DCEBDD] text-brand',
    batch: 'cse3a',
    batchLabel: 'CSE · 3A',
    skill: 'reading',
    section: 'Reading',
    question: 'Q8 · Comprehension',
    questionShort: 'Comprehension',
    progress: 72,
    progressLabel: '8 / 10',
    time: '21:04',
    connection: 'Excellent',
    connectionTone: 'good',
    status: 'active',
    latency: '41 ms',
    year: 'CSE · 3rd Year',
    recording: false,
  },
  {
    id: '24EC005',
    key: 'sophia',
    name: 'Sophia Lee',
    initials: 'SL',
    avatar: 'bg-[#FCEBDD] text-[#B96B2E]',
    batch: 'ece3',
    batchLabel: 'ECE · 3',
    skill: 'writing',
    section: 'Writing',
    question: 'Q10 · Dictation',
    questionShort: 'Dictation',
    progress: 83,
    progressLabel: '10 / 12',
    time: '24:38',
    connection: 'Good',
    connectionTone: 'good',
    status: 'active',
    latency: '55 ms',
    year: 'ECE · 3rd Year',
    recording: false,
  },
  {
    id: '24CS006',
    key: 'ethan',
    name: 'Ethan Davis',
    initials: 'ED',
    avatar: 'bg-[#E9E8F5] text-[#64618B]',
    batch: 'cse3b',
    batchLabel: 'CSE · 3B',
    skill: 'listening',
    section: 'Listening',
    question: 'Q6 · Conversation',
    questionShort: 'Conversation',
    progress: 54,
    progressLabel: '6 / 10',
    time: '14:03',
    connection: 'Reconnecting',
    connectionTone: 'muted',
    status: 'paused',
    latency: '—',
    year: 'CSE · 3rd Year',
    recording: false,
  },
]

const ACTIVITY = [
  {
    name: 'Emma Wilson',
    text: (
      <>
        started recording response for <span className="font-bold text-brand">Story Retelling</span>
      </>
    ),
    meta: 'Just now · Speaking · Q4',
    tone: 'brand',
  },
  {
    name: 'Olivia Martin',
    text: <>experienced an unstable connection</>,
    meta: '34 seconds ago · Connection warning',
    tone: 'warn',
  },
  {
    name: 'Noah Brown',
    text: (
      <>
        moved to <span className="font-bold">Reading · Q8</span>
      </>
    ),
    meta: '1 minute ago · Progress 72%',
    tone: 'muted',
  },
  {
    name: 'Sophia Lee',
    text: (
      <>
        completed <span className="font-bold text-brand">Dictation</span>
      </>
    ),
    meta: '2 minutes ago · Writing · Q10',
    tone: 'brand',
  },
]

const ALERTS = [
  { name: 'Olivia Martin', issue: 'Connection unstable' },
  { name: 'Ethan Davis', issue: 'Reconnecting for 42 sec' },
  { name: 'Ava Johnson', issue: 'Browser permission issue' },
]

function Toast({ title, message, visible }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl bg-[#17221D] px-4 py-3 text-white shadow-xl transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[120px] opacity-0'
      }`}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DCEBDD] text-brand">✓</div>
      <div>
        <div className="text-[14px] font-extrabold">{title}</div>
        <div className="text-[13px] text-white/60">{message}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'warning') {
    return (
      <span className="rounded-md bg-[#FCEBDD] px-2 py-1 text-[12px] font-extrabold text-[#B96B2E]">
        WARNING
      </span>
    )
  }
  if (status === 'paused') {
    return (
      <span className="rounded-md bg-[#F1F3F0] px-2 py-1 text-[12px] font-extrabold text-muted">
        PAUSED
      </span>
    )
  }
  return (
    <span className="rounded-md bg-[#DCEBDD] px-2 py-1 text-[12px] font-extrabold text-brand">
      ACTIVE
    </span>
  )
}

function ConnectionDot({ tone }) {
  const color =
    tone === 'warn' ? 'bg-accent' : tone === 'muted' ? 'bg-[#A6AEA8]' : 'bg-brand'
  const text =
    tone === 'warn' ? 'text-[#B96B2E]' : tone === 'muted' ? 'text-muted' : 'text-brand'
  return { color, text }
}

export default function AdminLiveMonitoringScreen() {
  const [assessment, setAssessment] = useState('english')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [skillFilter, setSkillFilter] = useState('all')
  const [batchFilter, setBatchFilter] = useState('all')
  const [selectedKey, setSelectedKey] = useState('emma')
  const [detail, setDetail] = useState(null)
  const [endOpen, setEndOpen] = useState(false)
  const [activeCount, setActiveCount] = useState(18)
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [page, setPage] = useState(1)

  const assessmentInfo = ASSESSMENTS[assessment]

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return STUDENTS.filter((row) => {
      const searchMatch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        row.batchLabel.toLowerCase().includes(q)
      const statusMatch = statusFilter === 'all' || row.status === statusFilter
      const skillMatch = skillFilter === 'all' || row.skill === skillFilter
      const batchMatch = batchFilter === 'all' || row.batch === batchFilter
      return searchMatch && statusMatch && skillMatch && batchMatch
    })
  }, [search, statusFilter, skillFilter, batchFilter])

  useEffect(() => {
    if (!toast) return undefined
    setToastVisible(true)
    const timer = setTimeout(() => {
      setToastVisible(false)
      setTimeout(() => setToast(null), 300)
    }, 3200)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setDetail(null)
        setEndOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCount((current) => {
        const variation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0
        return Math.max(12, current + variation)
      })
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  function showToast(title, message) {
    setToast({ title, message })
  }

  function resetFilters() {
    setSearch('')
    setStatusFilter('all')
    setSkillFilter('all')
    setBatchFilter('all')
    setPage(1)
  }

  function refreshData() {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showToast('Monitoring refreshed', 'Live attempt data is up to date.')
    }, 650)
  }

  function openStudent(rowOrName) {
    if (typeof rowOrName === 'string') {
      const found = STUDENTS.find((s) => s.name === rowOrName)
      setDetail(
        found || {
          name: rowOrName,
          initials: rowOrName
            .split(' ')
            .map((p) => p[0])
            .join(''),
          avatar: 'bg-[#DCEBDD] text-brand',
          id: '—',
          year: '—',
          progress: 0,
          progressLabel: '—',
          time: '—',
          connection: 'Unknown',
          connectionTone: 'muted',
          section: '—',
          questionShort: '—',
          latency: '—',
          recording: false,
          status: 'warning',
        },
      )
      return
    }
    setDetail(rowOrName)
    setSelectedKey(rowOrName.key)
  }

  const detailConn = detail ? ConnectionDot({ tone: detail.connectionTone }) : null

  return (
    <div className="w-full p-6 sm:p-8 lg:p-10">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            <span className="text-[13px] font-extrabold uppercase tracking-[1.5px] text-brand">
              Live monitoring
            </span>
          </div>
          <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
            <Link to="/admin/assessments" className="text-muted hover:text-brand">
              Assessments
            </Link>
            <span className="text-[#A0A8A2]">/</span>
            <span className="font-bold text-dark">Live Attempt Monitoring</span>
          </div>
          <h1 className="text-[30px] font-extrabold tracking-tight">Live Attempt Monitoring</h1>
          <p className="mt-1 text-[16px] text-muted">
            Monitor students currently taking assessments in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshData}
            className="flex items-center gap-2 rounded-xl border border-[#DDE3DE] bg-white px-4 py-2.5 text-[15px] font-bold hover:bg-[#F5F7F4]"
          >
            <svg
              width="20" height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              className={`transition-transform ${refreshing ? 'rotate-[360deg] duration-700' : ''}`}
            >
              <path d="M21 12a9 9 0 1 1-2.25-6" strokeLinecap="round" />
              <path d="M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setEndOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[#E8D5CC] bg-[#FFF9F6] px-4 py-2.5 text-[15px] font-bold text-[#B15F42] hover:bg-[#FFF2EC]"
          >
            End Attempts
          </button>
        </div>
      </div>

      <section className="mb-6 rounded-2xl border border-[#E3E8E3] bg-surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCEBDD] text-brand">
              <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-extrabold">{assessmentInfo.name}</h2>
                <span className="rounded bg-[#DCEBDD] px-2 py-0.5 text-[12px] font-extrabold text-brand">
                  LIVE
                </span>
              </div>
              <div className="mt-0.5 text-[14px] text-muted">{assessmentInfo.meta}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="mr-1 text-right">
              <div className="text-[13px] font-bold uppercase tracking-wide text-muted">
                Active attempts
              </div>
              <div className="text-[20px] font-extrabold text-brand">{activeCount}</div>
            </div>
            <select
              value={assessment}
              onChange={(e) => {
                const value = e.target.value
                setAssessment(value)
                showToast('Assessment changed', `Monitoring ${ASSESSMENTS[value].name}.`)
              }}
              className="h-10 min-w-[190px] rounded-xl border border-[#DDE3DE] bg-white px-3 text-[14px] font-bold outline-none"
            >
              <option value="english">English Communication Test</option>
              <option value="placement">English Placement Test</option>
              <option value="speaking">Speaking Evaluation</option>
            </select>
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
        {[
          {
            label: 'Active now',
            value: activeCount,
            meta: 'Live attempts',
            metaClass: 'text-brand font-bold',
            border: 'border-[#DCEBDD]',
            iconBg: 'bg-[#DCEBDD] text-brand',
            live: true,
          },
          {
            label: 'Connected',
            value: 17,
            meta: 'Stable connection',
            metaClass: 'text-muted',
            border: 'border-[#E3E8E3]',
            iconBg: 'bg-[#F1F4F0] text-muted',
          },
          {
            label: 'Warnings',
            value: 3,
            meta: 'Needs attention',
            metaClass: 'text-[#B96B2E] font-bold',
            border: 'border-[#EDE1D6]',
            iconBg: 'bg-[#FCEBDD] text-[#B96B2E]',
          },
          {
            label: 'Completed today',
            value: 47,
            meta: 'Submitted successfully',
            metaClass: 'text-muted',
            border: 'border-[#E3E8E3]',
            iconBg: 'bg-[#F1F4F0] text-muted',
          },
          {
            label: 'Avg. progress',
            value: '64%',
            meta: 'Across active attempts',
            metaClass: 'text-muted',
            border: 'border-[#E3E8E3]',
            iconBg: 'bg-[#F1F4F0] text-muted',
          },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-2xl border bg-surface p-5 ${kpi.border}`}>
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-bold uppercase tracking-wide text-muted">{kpi.label}</div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.iconBg}`}>•</div>
            </div>
            <div className="mt-3 text-[27px] font-extrabold">{kpi.value}</div>
            <div className={`mt-1 flex items-center gap-1.5 text-[13px] ${kpi.metaClass}`}>
              {kpi.live && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
              {kpi.meta}
            </div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#E3E8E3] bg-surface">
        <div className="border-b border-[#E7EBE7] px-5 py-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                width="20" height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" strokeLinecap="round" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, ID or batch..."
                className="h-10 w-full rounded-xl border border-[#DDE3DE] bg-white pl-10 pr-4 text-[15px] outline-none focus:border-brand"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#DDE3DE] bg-white px-3 text-[14px] font-semibold xl:w-[135px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="paused">Paused</option>
            </select>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#DDE3DE] bg-white px-3 text-[14px] font-semibold xl:w-[135px]"
            >
              <option value="all">All Sections</option>
              <option value="speaking">Speaking</option>
              <option value="listening">Listening</option>
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
            </select>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#DDE3DE] bg-white px-3 text-[14px] font-semibold xl:w-[145px]"
            >
              <option value="all">All Batches</option>
              <option value="cse3a">CSE · 3A</option>
              <option value="cse3b">CSE · 3B</option>
              <option value="ece3">ECE · 3rd Year</option>
            </select>
            <button
              type="button"
              onClick={resetFilters}
              className="h-10 rounded-xl px-3 text-[14px] font-bold text-muted hover:bg-[#F1F3F0]"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-[#E8ECE8] bg-[#F7F8F5]">
                {['Student', 'Batch', 'Current Section', 'Progress', 'Time', 'Connection', 'Status', 'Action'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`py-3 text-[12px] font-extrabold uppercase tracking-[1px] text-muted ${
                        i === 0 ? 'px-5 text-left' : i === 7 ? 'px-5 text-right' : 'px-4 text-left'
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const conn = ConnectionDot({ tone: row.connectionTone })
                const barColor =
                  row.status === 'warning'
                    ? 'bg-accent'
                    : row.status === 'paused'
                      ? 'bg-[#A6AEA8]'
                      : 'bg-brand'
                const actionWarn = row.status === 'warning' || row.status === 'paused'
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedKey(row.key)}
                    className={`cursor-pointer border-b border-[#EEF1EE] transition hover:bg-[#F7F9F6] ${
                      selectedKey === row.key ? 'bg-[#F1F7F2] shadow-[inset_3px_0_0_#1F6B4F]' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-[14px] font-extrabold ${row.avatar}`}
                        >
                          {row.initials}
                        </div>
                        <div>
                          <div className="text-[15px] font-extrabold">{row.name}</div>
                          <div className="text-[13px] text-muted">{row.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4">
                      <span className="rounded-md bg-[#F1F3F0] px-2 py-1 text-[13px] font-bold text-muted">
                        {row.batchLabel}
                      </span>
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F1F4F0] text-[13px] font-bold text-muted">
                          {row.section[0]}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold">{row.section}</div>
                          <div className="text-[12px] text-muted">{row.question}</div>
                        </div>
                      </div>
                    </td>
                    <td className="w-[150px] px-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[13px] font-bold">{row.progress}%</span>
                        <span className="text-[12px] text-muted">{row.progressLabel}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#E8ECE8]">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4">
                      <span className="text-[14px] font-bold">{row.time}</span>
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${conn.color}`} />
                        <span className={`text-[13px] font-semibold ${conn.text}`}>{row.connection}</span>
                      </div>
                    </td>
                    <td className="px-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openStudent(row)
                        }}
                        className={`rounded-lg px-3 py-1.5 text-[13px] font-bold ${
                          actionWarn
                            ? 'bg-[#FCEBDD] text-[#B96B2E] hover:bg-[#F7DDCA]'
                            : 'bg-[#F1F4F0] text-brand hover:bg-[#DCEBDD]'
                        }`}
                      >
                        {actionWarn ? 'Review' : 'Monitor'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-[15px] text-muted">
                    No attempts match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E7EBE7] px-5 py-4">
          <span className="text-[13px] text-muted">
            Showing {filtered.length} active attempts
          </span>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-10 w-10 rounded-lg text-[14px] font-bold ${
                  page === n
                    ? 'bg-brand text-white'
                    : 'border border-[#DDE3DE] bg-white text-muted'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-2xl border border-[#E3E8E3] bg-surface p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold">Live Activity</h2>
              <p className="mt-0.5 text-[14px] text-muted">Recent events from active attempts</p>
            </div>
            <span className="text-[13px] font-bold text-brand">Updating automatically</span>
          </div>
          <div className="space-y-4">
            {ACTIVITY.map((item) => (
              <div key={item.meta} className="flex gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                    item.tone === 'warn'
                      ? 'bg-[#FCEBDD] text-[#B96B2E]'
                      : item.tone === 'muted'
                        ? 'bg-[#F1F4F0] text-muted'
                        : 'bg-[#DCEBDD] text-brand'
                  }`}
                >
                  •
                </div>
                <div className="flex-1">
                  <div className="text-[14px]">
                    <span className="font-extrabold">{item.name}</span> {item.text}
                  </div>
                  <div className="mt-1 text-[12px] text-muted">{item.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E3E8E3] bg-surface p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold">Attention Required</h2>
              <p className="mt-0.5 text-[14px] text-muted">Attempts needing review</p>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FCEBDD] text-[14px] font-extrabold text-[#B96B2E]">
              3
            </span>
          </div>
          <div className="space-y-3">
            {ALERTS.map((alert) => (
              <div key={alert.name} className="rounded-xl border border-[#EDE1D6] p-3.5">
                <div className="text-[14px] font-extrabold">{alert.name}</div>
                <div className="mt-0.5 text-[12px] text-muted">{alert.issue}</div>
                <button
                  type="button"
                  onClick={() => openStudent(alert.name)}
                  className="mt-2 text-[12px] font-bold text-brand"
                >
                  Review attempt →
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {detail && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17221D]/35 p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetail(null)
          }}
        >
          <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-2xl bg-surface shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E7EBE7] bg-surface px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-extrabold ${detail.avatar}`}
                >
                  {detail.initials}
                </div>
                <div>
                  <div className="text-[16px] font-extrabold">{detail.name}</div>
                  <div className="text-[13px] text-muted">
                    {detail.id} · {detail.year}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-[#F1F3F0]"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-5 flex items-center justify-between rounded-xl border border-[#DCEBDD] bg-[#F2F7F2] p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-brand" />
                  <div>
                    <div className="text-[15px] font-extrabold text-brand">Assessment in progress</div>
                    <div className="text-[13px] text-muted">Last activity received just now</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-extrabold">{detail.time}</div>
                  <div className="text-[12px] text-muted">elapsed time</div>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#E3E8E3] p-4">
                  <div className="text-[13px] font-bold uppercase tracking-wide text-muted">Progress</div>
                  <div className="mt-1 text-[22px] font-extrabold">{detail.progress}%</div>
                  <div className="mt-2 h-1.5 rounded-full bg-[#E8ECE8]">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${detail.progress}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-[#E3E8E3] p-4">
                  <div className="text-[13px] font-bold uppercase tracking-wide text-muted">Current</div>
                  <div className="mt-2 text-[16px] font-extrabold">
                    {detail.question?.split(' · ')[0] || 'Q—'}
                  </div>
                  <div className="mt-1 text-[12px] text-muted">{detail.questionShort}</div>
                </div>
                <div className="rounded-xl border border-[#E3E8E3] p-4">
                  <div className="text-[13px] font-bold uppercase tracking-wide text-muted">
                    Connection
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${detailConn.color}`} />
                    <span className={`text-[15px] font-extrabold ${detailConn.text}`}>
                      {detail.connection}
                    </span>
                  </div>
                  <div className="mt-1 text-[12px] text-muted">{detail.latency} latency</div>
                </div>
              </div>

              <div className="mb-5 rounded-xl border border-[#E3E8E3] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold uppercase tracking-wide text-brand">
                      {detail.section} · {detail.questionShort}
                    </div>
                    <div className="mt-1 text-[15px] font-extrabold">
                      Question {detail.progressLabel?.replace(' / ', ' of ') || '—'}
                    </div>
                  </div>
                  {detail.recording && (
                    <span className="rounded-lg bg-[#DCEBDD] px-2.5 py-1 text-[12px] font-extrabold text-brand">
                      RECORDING
                    </span>
                  )}
                </div>
                <div className="rounded-xl bg-[#F5F7F4] p-4">
                  <div className="mb-2 text-[13px] font-bold text-muted">CURRENT RESPONSE</div>
                  <div className="text-[15px] font-semibold leading-relaxed">
                    Student is currently recording a response. Live audio is being processed after
                    submission.
                  </div>
                  {detail.recording && (
                    <div className="mt-4 flex h-8 items-center gap-1">
                      {[8, 14, 21, 12, 18, 9, 16].map((h, i) => (
                        <span
                          key={i}
                          className="wave-bar w-[3px] rounded-full bg-brand"
                          style={{ height: h, animationDelay: `${(i + 1) * 0.1}s` }}
                        />
                      ))}
                      <span className="ml-2 text-[12px] text-muted">Recording in progress</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {['Internet · Connected', 'Microphone · Working', 'Browser · Fullscreen'].map(
                  (item) => {
                    const [label, value] = item.split(' · ')
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-[#E3E8E3] p-3.5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DCEBDD] text-brand">
                          •
                        </div>
                        <div>
                          <div className="text-[13px] text-muted">{label}</div>
                          <div className="text-[14px] font-bold text-brand">{value}</div>
                        </div>
                      </div>
                    )
                  },
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-[#E7EBE7] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setDetail(null)
                    showToast(
                      'Attempt flagged',
                      'The attempt has been added to the review queue.',
                    )
                  }}
                  className="rounded-xl border border-[#E8D5CC] bg-[#FFF9F6] px-4 py-2.5 text-[14px] font-bold text-[#B15F42]"
                >
                  Flag Attempt
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDetail(null)}
                    className="rounded-xl border border-[#DDE3DE] bg-white px-4 py-2.5 text-[14px] font-bold"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDetail(null)
                      showToast('Attempt ended', 'The student attempt has been ended.')
                    }}
                    className="rounded-xl bg-brand px-4 py-2.5 text-[14px] font-extrabold text-white"
                  >
                    End Attempt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {endOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#17221D]/35 p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEndOpen(false)
          }}
        >
          <div className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-surface shadow-2xl">
            <div className="p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FCEBDD] text-[#B96B2E]">
                ⌫
              </div>
              <h3 className="text-[17px] font-extrabold">End active attempts?</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                This will immediately stop all currently active attempts for this assessment. Students
                may not be able to resume after the attempt is ended.
              </p>
              <div className="mt-4 rounded-xl border border-[#EDE1D6] bg-[#FFF8F4] p-3.5">
                <div className="flex justify-between">
                  <span className="text-[13px] text-muted">Active attempts</span>
                  <span className="text-[15px] font-extrabold text-[#B15F42]">
                    {activeCount} students
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#E7EBE7] px-6 py-4">
              <button
                type="button"
                onClick={() => setEndOpen(false)}
                className="rounded-xl border border-[#DDE3DE] bg-white px-5 py-2.5 text-[14px] font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setEndOpen(false)
                  showToast('Attempts ended', 'All active attempts have been stopped.')
                }}
                className="rounded-xl bg-[#B15F42] px-5 py-2.5 text-[14px] font-extrabold text-white"
              >
                End All Attempts
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast title={toast?.title || ''} message={toast?.message || ''} visible={toastVisible} />
    </div>
  )
}
