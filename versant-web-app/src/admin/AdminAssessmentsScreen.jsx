import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ASSESSMENTS = [
  {
    id: 'ect',
    name: 'English Communication Test',
    meta: 'Updated Sep 8, 2026 · By Admin',
    type: 'Communication',
    typeClass: 'bg-[#eef2ea] text-[#526158]',
    iconBg: 'bg-brand-light text-brand',
    icon: 'doc',
    questions: '40',
    duration: '30 min',
    assigned: '1,240',
    batches: '4 batches',
    completion: 78,
    score: '82.4',
    status: 'Published',
  },
  {
    id: 'epa',
    name: 'English Placement Assessment',
    meta: 'Updated Sep 5, 2026 · By Admin',
    type: 'Placement',
    typeClass: 'bg-[#eeeaf6] text-[#625a7f]',
    iconBg: 'bg-[#e8e6f1] text-[#5e587e]',
    icon: 'clock',
    questions: '32',
    duration: '25 min',
    assigned: '860',
    batches: '3 batches',
    completion: 91,
    score: '76.8',
    status: 'Published',
  },
  {
    id: 'se',
    name: 'Speaking Evaluation',
    meta: 'Updated Aug 29, 2026 · By Dr. Priya',
    type: 'Speaking',
    typeClass: 'bg-[#fff0e4] text-[#a86535]',
    iconBg: 'bg-[#f5e5d7] text-[#a86535]',
    icon: 'mic',
    questions: '10',
    duration: '12 min',
    assigned: '420',
    batches: '2 batches',
    completion: 64,
    score: '79.2',
    status: 'Published',
  },
  {
    id: 'csp',
    name: 'Communication Skills Practice',
    meta: 'Updated Sep 7, 2026 · By Admin',
    type: 'Practice',
    typeClass: 'bg-[#e8eef1] text-[#536d79]',
    iconBg: 'bg-[#e4edf1] text-[#496a79]',
    icon: 'plus',
    questions: '20',
    duration: '15 min',
    assigned: '—',
    batches: 'Not assigned',
    completion: null,
    score: null,
    status: 'Draft',
  },
  {
    id: 'gca',
    name: 'Graduate Communication Assessment',
    meta: 'Closed Aug 20, 2026',
    type: 'Communication',
    typeClass: 'bg-[#eef2ea] text-[#526158]',
    iconBg: 'bg-[#eee9e4] text-[#766c64]',
    icon: 'grad',
    questions: '36',
    duration: '28 min',
    assigned: '610',
    batches: '2 batches',
    completion: 96,
    score: '74.6',
    status: 'Closed',
  },
]

const STATS = [
  {
    label: 'Total Assessments',
    value: '24',
    meta: '+3 this month',
    metaTone: 'brand',
    iconBg: 'bg-[#e8f1e8] text-brand',
    icon: 'doc',
  },
  {
    label: 'Published',
    value: '15',
    meta: 'Currently available',
    metaTone: 'muted',
    iconBg: 'bg-[#e8f1e8] text-brand',
    icon: 'check',
  },
  {
    label: 'In Progress',
    value: '6',
    meta: 'Active assessments',
    metaTone: 'accent',
    iconBg: 'bg-[#fff0e4] text-accent',
    icon: 'clock',
  },
  {
    label: 'Drafts',
    value: '3',
    meta: 'Not published yet',
    metaTone: 'muted',
    iconBg: 'bg-[#f0f1ed] text-[#737a75]',
    icon: 'draft',
  },
]

const STATUS_STYLES = {
  Published: 'bg-[#e7f3e8] text-[#287047]',
  Draft: 'bg-[#f0f1ed] text-[#737a75]',
  Closed: 'bg-[#f0f1ed] text-[#737a75]',
}

const STATUS_DOT = {
  Published: 'bg-[#287047]',
  Draft: 'bg-[#737a75]',
  Closed: 'bg-[#737a75]',
}

function Icon({ name, className = 'h-5 w-5' }) {
  const props = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  }
  if (name === 'doc') {
    return (
      <svg {...props}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" d="M12 8v4l2.5 2" />
      </svg>
    )
  }
  if (name === 'draft') {
    return (
      <svg {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14v16H5z" />
        <path strokeLinecap="round" d="M8 9h8M8 13h5" />
      </svg>
    )
  }
  if (name === 'mic') {
    return (
      <svg {...props}>
        <rect x="7" y="3" width="10" height="14" rx="5" />
        <path strokeLinecap="round" d="M4 11a8 8 0 0 0 16 0M12 19v3M8 22h8" />
      </svg>
    )
  }
  if (name === 'plus') {
    return (
      <svg {...props}>
        <path strokeLinecap="round" d="M5 12h14M12 5v14" />
      </svg>
    )
  }
  if (name === 'grad') {
    return (
      <svg {...props}>
        <path
          strokeLinecap="round"
          d="M6 4h12M6 20h12M8 4v4a4 4 0 0 0 4 4 4 4 0 0 0 4-4V4M8 20v-4a4 4 0 0 1 4-4 4 4 0 0 1 4 4v4"
        />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <path strokeLinecap="round" d="M12 3v18M7 7h10M7 12h10M7 17h6" />
    </svg>
  )
}

export default function AdminAssessmentsScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [menu, setMenu] = useState(null)
  const menuRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return ASSESSMENTS.filter((row) => {
      const matchesSearch = !q || row.name.toLowerCase().includes(q)
      const matchesType = !type || row.type === type
      const matchesStatus = !status || row.status === status
      return matchesSearch && matchesType && matchesStatus
    })
  }, [query, type, status])

  const allSelected =
    filtered.length > 0 && filtered.every((row) => selected.has(row.id))

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

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

  function openMenu(e, assessment) {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setMenu({
      assessment,
      left: Math.max(8, rect.right - 192),
      top: rect.bottom + 5,
    })
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="w-full">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[13px] text-[#89918b]">
              <span>Administration</span>
              <span>/</span>
              <span className="font-semibold text-brand">Assessments</span>
            </div>
            <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
              Assessments
            </h1>
            <p className="mt-1 text-sm text-[#7A837D]">
              Create and manage English communication assessments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/assessments/create')}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#185a42]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            Create Assessment
          </button>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#e3e7df] bg-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#7A837D]">{stat.label}</div>
                  <div className="mt-2 text-2xl font-extrabold">{stat.value}</div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon name={stat.icon} />
                </div>
              </div>
              <div
                className={`mt-3 text-[13px] ${
                  stat.metaTone === 'brand'
                    ? 'font-bold text-brand'
                    : stat.metaTone === 'accent'
                      ? 'font-bold text-accent'
                      : 'text-[#7A837D]'
                }`}
              >
                {stat.meta}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#e3e7df] bg-surface">
          <div className="flex flex-col gap-4 border-b border-[#e7ebe4] p-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:w-[350px]">
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#929a94]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-4-4" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assessments..."
                className="w-full rounded-xl border border-[#dce2d8] bg-[#fafbf8] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-xl border border-[#dce2d8] bg-[#fafbf8] px-3 py-2.5 text-sm text-[#59625c] outline-none"
              >
                <option value="">All Types</option>
                <option value="Communication">Communication</option>
                <option value="Placement">Placement</option>
                <option value="Speaking">Speaking</option>
                <option value="Practice">Practice</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-[#dce2d8] bg-[#fafbf8] px-3 py-2.5 text-sm text-[#59625c] outline-none"
              >
                <option value="">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setType('')
                  setStatus('')
                }}
                className="rounded-xl border border-[#dce2d8] px-3 py-2.5 text-sm font-bold text-[#68716b] hover:bg-[#f4f6f1]"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[1150px]">
              <thead>
                <tr className="bg-[#f7f8f4] text-left">
                  <th className="w-10 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="h-4 w-4 accent-brand"
                      aria-label="Select all assessments"
                    />
                  </th>
                  {[
                    'Assessment',
                    'Type',
                    'Questions',
                    'Assigned',
                    'Completion',
                    'Avg. Score',
                    'Status',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3 text-[14px] font-bold uppercase tracking-wider text-[#8a928c] [&:nth-child(n+3)]:px-4"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0eb]">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-[#fafbf8]">
                    <td className="px-6 py-4">
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
                        className="h-4 w-4 accent-brand"
                        aria-label={`Select ${row.name}`}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${row.iconBg}`}
                        >
                          <Icon name={row.icon} />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{row.name}</div>
                          <div className="text-[13px] text-[#89918b]">{row.meta}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-lg px-2.5 py-1 text-[13px] font-bold ${row.typeClass}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold">{row.questions}</div>
                      <div className="text-[14px] text-[#89918b]">{row.duration}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold">{row.assigned}</div>
                      <div className="text-[14px] text-[#89918b]">{row.batches}</div>
                    </td>
                    <td className="px-4 py-4">
                      {row.completion == null ? (
                        <span className="text-sm text-[#89918b]">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e7ebe4]">
                            <div
                              className={`h-full rounded-full ${
                                row.status === 'Closed' ? 'bg-[#737a75]' : 'bg-brand'
                              }`}
                              style={{ width: `${row.completion}%` }}
                            />
                          </div>
                          <span className="text-[13px] font-bold">{row.completion}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {row.score == null ? (
                        <span className="text-sm text-[#89918b]">—</span>
                      ) : (
                        <>
                          <span className="text-sm font-extrabold">{row.score}</span>
                          <span className="text-[14px] text-[#89918b]"> / 100</span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-bold ${STATUS_STYLES[row.status]}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[row.status]}`} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => openMenu(e, row)}
                        className="h-10 w-10 rounded-lg text-[#68716b] hover:bg-[#f0f3ed]"
                        aria-label={`Actions for ${row.name}`}
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm font-bold text-[#8a928c]">
                      No assessments match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#e7ebe4] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[13px] text-[#7A837D]">
              Showing <span className="font-bold text-[#344139]">1–{filtered.length}</span> of{' '}
              <span className="font-bold text-[#344139]">24</span> assessments
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce2d8] text-[#9aa19b]"
              >
                ‹
              </button>
              <button type="button" className="h-10 w-10 rounded-lg bg-brand text-[13px] font-bold text-white">
                1
              </button>
              <button type="button" className="h-10 w-10 rounded-lg text-sm hover:bg-[#f0f3ed]">
                2
              </button>
              <button type="button" className="h-10 w-10 rounded-lg text-sm hover:bg-[#f0f3ed]">
                3
              </button>
              <span className="px-1 text-[#89918b]">…</span>
              <button type="button" className="h-10 w-10 rounded-lg text-sm hover:bg-[#f0f3ed]">
                5
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce2d8] text-[#68716b]"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#d6e5d7] bg-[#e6f0e7] p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-brand">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-.8.6-1 1.3-1 2H9c0-.7-.2-1.4-1-2Z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-extrabold">Assessment insight</div>
              <p className="mt-1 text-[13px] text-[#68716b]">
                Your English Communication Test has a 78% completion rate across 1,240 assigned
                students.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/analytics')}
            className="whitespace-nowrap text-sm font-bold text-brand"
          >
            View Analytics →
          </button>
        </div>
      </div>

      {menu && (
        <div
          ref={menuRef}
          className="fixed z-[60] w-48 rounded-xl border border-[#e1e6de] bg-surface p-1 shadow-xl"
          style={{ left: menu.left, top: menu.top }}
        >
          {[
            ['View Assessment', () => window.alert('Open Assessment Details')],
            ['Edit Assessment', () => navigate('/admin/assessments/builder')],
            ['Assign Assessment', () => navigate('/admin/assessments/assign')],
            ['Duplicate', () => window.alert('Assessment duplicated successfully.')],
          ].map(([label, action]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setMenu(null)
                action()
              }}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-[#f1f4ec]"
            >
              {label}
            </button>
          ))}
          <div className="my-1 h-px bg-[#e8ebe4]" />
          <button
            type="button"
            onClick={() => {
              setMenu(null)
              if (window.confirm('Are you sure you want to archive this assessment?')) {
                window.alert('Assessment archived.')
              }
            }}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#a75f32] hover:bg-[#fff3eb]"
          >
            Archive
          </button>
        </div>
      )}
    </div>
  )
}
