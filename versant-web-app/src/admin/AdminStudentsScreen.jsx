import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const YEAR_LABELS = {
  '1': '1st Year',
  '2': '2nd Year',
  '3': '3rd Year',
  '4': '4th Year',
}

const STUDENTS = [
  {
    id: 'CSE2026001',
    name: 'Emma Wilson',
    email: 'emma.wilson@college.edu',
    initials: 'EW',
    avatar: 'bg-brand-light text-brand',
    department: 'CSE',
    year: '3',
    assessments: '8 / 10',
    score: 82,
    status: 'active',
  },
  {
    id: 'ECE2026042',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@college.edu',
    initials: 'RK',
    avatar: 'bg-[#E8EAF6] text-[#5865A8]',
    department: 'ECE',
    year: '2',
    assessments: '5 / 8',
    score: 76,
    status: 'active',
  },
  {
    id: 'CSE2026128',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@college.edu',
    initials: 'AS',
    avatar: 'bg-[#FBE9DC] text-[#B96528]',
    department: 'CSE',
    year: '4',
    assessments: '10 / 10',
    score: 88,
    status: 'active',
  },
  {
    id: 'MECH2026034',
    name: 'Vikram Singh',
    email: 'vikram.singh@college.edu',
    initials: 'VS',
    avatar: 'bg-brand-light text-brand',
    department: 'MECH',
    year: '3',
    assessments: '7 / 9',
    score: 79,
    status: 'active',
  },
  {
    id: 'CIVIL2026087',
    name: 'Priya Reddy',
    email: 'priya.reddy@college.edu',
    initials: 'PR',
    avatar: 'bg-[#EEF0ED] text-[#7A837D]',
    department: 'CIVIL',
    year: '2',
    assessments: '3 / 6',
    score: 64,
    status: 'inactive',
  },
  {
    id: 'MBA2026018',
    name: 'Arjun Patel',
    email: 'arjun.patel@college.edu',
    initials: 'AP',
    avatar: 'bg-[#E8EAF6] text-[#5865A8]',
    department: 'MBA',
    year: '1',
    assessments: '4 / 5',
    score: 73,
    status: 'active',
  },
]

const SUMMARY = [
  {
    label: 'Total students',
    value: '2,450',
    meta: '+12.4%',
    metaTone: 'brand',
    iconBg: 'bg-brand-light text-brand',
    icon: 'users',
  },
  {
    label: 'Active students',
    value: '2,318',
    metaDot: true,
    iconBg: 'bg-brand-light text-brand',
    icon: 'check',
  },
  {
    label: 'New students',
    value: '126',
    meta: 'This month',
    metaTone: 'accent',
    iconBg: 'bg-[#FBE9DC] text-accent',
    icon: 'plus',
  },
  {
    label: 'Inactive students',
    value: '132',
    iconBg: 'bg-[#EEF0ED] text-[#7A837D]',
    icon: 'minus',
  },
]

function SummaryIcon({ name }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  if (name === 'users') {
    return (
      <svg {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg {...props}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }
  if (name === 'plus') {
    return (
      <svg {...props}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </svg>
  )
}

export default function AdminStudentsScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('all')
  const [year, setYear] = useState('all')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(() => new Set())

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return STUDENTS.filter((student) => {
      const haystack = `${student.name} ${student.id} ${student.email}`.toLowerCase()
      const matchesSearch = !q || haystack.includes(q)
      const matchesDepartment = department === 'all' || student.department === department
      const matchesYear = year === 'all' || student.year === year
      const matchesStatus = status === 'all' || student.status === status
      return matchesSearch && matchesDepartment && matchesYear && matchesStatus
    })
  }, [query, department, year, status])

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((student) => selected.has(student.id))

  function toggleAll(checked) {
    setSelected((prev) => {
      const next = new Set(prev)
      filtered.forEach((student) => {
        if (checked) next.add(student.id)
        else next.delete(student.id)
      })
      return next
    })
  }

  function toggleOne(id, checked) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function clearSelection() {
    setSelected(new Set())
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="w-full">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-[12px] font-extrabold tracking-[0.1em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              STUDENT MANAGEMENT
            </div>
            <h1 className="mt-3 text-[28px] font-extrabold tracking-[-0.04em] sm:text-[32px]">
              Students
            </h1>
            <p className="mt-1 text-[15px] text-[#7A837D]">
              Manage students, accounts, classes and assessment access.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/students/bulk-upload')}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#DDE3DB] bg-white px-4 text-[13px] font-extrabold"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Bulk Upload
            </button>
            <button
              type="button"
              onClick={() => window.alert('Open Add Student')}
              className="flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-extrabold text-white"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Student
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {SUMMARY.map((card) => (
            <div
              key={card.label}
              className="rounded-[20px] border border-[#E5E9E2] bg-surface p-5 shadow-[0_20px_60px_rgba(31,107,79,0.05)]"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <SummaryIcon name={card.icon} />
                </div>
                {card.meta && (
                  <span
                    className={`text-[12px] font-extrabold ${
                      card.metaTone === 'accent' ? 'text-accent' : 'text-brand'
                    }`}
                  >
                    {card.meta}
                  </span>
                )}
                {card.metaDot && <span className="h-2 w-2 rounded-full bg-brand" />}
              </div>
              <div className="mt-5 text-[26px] font-extrabold tracking-[-0.04em]">{card.value}</div>
              <div className="mt-0.5 text-[13px] font-bold text-[#7A837D]">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#E5E9E2] bg-surface shadow-[0_20px_60px_rgba(31,107,79,0.05)]">
          <div className="border-b border-[#E7EBE4] p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-[380px]">
                <svg
                  width="20" height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#929A95"
                  strokeWidth="2"
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, student ID or email..."
                  className="h-11 w-full rounded-xl border border-[#E0E5DE] bg-white pl-10 pr-4 text-[14px] font-semibold outline-none transition focus:border-[#9AB9A2]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-10 rounded-xl border border-[#E0E5DE] bg-white px-3 text-[13px] font-extrabold text-[#59635D] outline-none"
                >
                  <option value="all">All Departments</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="MECH">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                  <option value="MBA">Management</option>
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="h-10 rounded-xl border border-[#E0E5DE] bg-white px-3 text-[13px] font-extrabold text-[#59635D] outline-none"
                >
                  <option value="all">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-10 rounded-xl border border-[#E0E5DE] bg-white px-3 text-[13px] font-extrabold text-[#59635D] outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  type="button"
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E0E5DE] bg-white px-3 text-[13px] font-extrabold text-[#59635D]"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M7 12h10M10 18h4" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>

            {selected.size > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F3F6F0] px-4 py-3">
                <span className="text-[13px] font-extrabold text-brand">{selected.size} selected</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/assessments/assign')}
                    className="rounded-lg bg-white px-3 py-2 text-[12px] font-extrabold text-brand"
                  >
                    Assign Assessment
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      window.alert(`Change status for ${selected.size} selected student(s)`)
                    }
                    className="rounded-lg bg-white px-3 py-2 text-[12px] font-extrabold text-[#59635D]"
                  >
                    Change Status
                  </button>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="rounded-lg px-3 py-2 text-[12px] font-extrabold text-[#7A837D]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-[#E9EDE7] bg-[#FAFBF8] text-left">
                  <th className="w-[50px] px-5 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="h-4 w-4 rounded accent-brand"
                      aria-label="Select all students"
                    />
                  </th>
                  {[
                    'Student',
                    'Student ID',
                    'Department',
                    'Year',
                    'Assessments',
                    'Avg. Score',
                    'Status',
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-3 py-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#9AA19C]"
                    >
                      {label}
                    </th>
                  ))}
                  <th className="px-5 py-3 text-right text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#9AA19C]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, index) => {
                  const isActive = student.status === 'active'
                  return (
                    <tr
                      key={student.id}
                      className={`transition hover:bg-[#F7F9F5] ${
                        index < filtered.length - 1 ? 'border-b border-[#EEF1EB]' : ''
                      }`}
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selected.has(student.id)}
                          onChange={(e) => toggleOne(student.id, e.target.checked)}
                          className="h-4 w-4 rounded accent-brand"
                          aria-label={`Select ${student.name}`}
                        />
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[13px] font-extrabold ${student.avatar}`}
                          >
                            {student.initials}
                          </div>
                          <div>
                            <div className="text-[14px] font-extrabold">{student.name}</div>
                            <div className="mt-0.5 text-[12px] font-semibold text-[#929A95]">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-[13px] font-bold text-[#59635D]">{student.id}</td>
                      <td className="px-3 py-4">
                        <span className="rounded-lg bg-[#F0F3EE] px-2 py-1 text-[12px] font-extrabold text-[#59635D]">
                          {student.department}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-[13px] font-bold">{YEAR_LABELS[student.year]}</td>
                      <td className="px-3 py-4 text-[13px] font-bold">{student.assessments}</td>
                      <td className="px-3 py-4">
                        <span
                          className={`text-[14px] font-extrabold ${
                            isActive ? 'text-brand' : 'text-[#7A837D]'
                          }`}
                        >
                          {student.score}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-extrabold ${
                            isActive
                              ? 'bg-brand-light text-brand'
                              : 'bg-[#EEF0ED] text-[#7A837D]'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? 'bg-brand' : 'bg-[#9BA29D]'
                            }`}
                          />
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => window.alert(`Open student profile: ${student.name}`)}
                          className="rounded-lg p-2 text-[#7A837D] hover:bg-[#EEF3ED] hover:text-brand"
                          aria-label={`Actions for ${student.name}`}
                        >
                          <svg
                            width="20" height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-[15px] font-bold text-[#8A928C]">
                      No students match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E7EBE4] px-5 py-4 sm:flex-row">
            <div className="text-[13px] font-semibold text-[#8A928C]">
              Showing <strong className="text-dark">1–{filtered.length}</strong> of{' '}
              <strong className="text-dark">2,450</strong> students
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E1E6DF] bg-white text-[#9AA19C]"
                aria-label="Previous page"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-[13px] font-extrabold text-white"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[13px] font-bold text-[#59635D] hover:bg-[#F0F3EE]"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[13px] font-bold text-[#59635D] hover:bg-[#F0F3EE]"
              >
                3
              </button>
              <span className="px-1 text-[13px] text-[#9AA19C]">...</span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[13px] font-bold text-[#59635D] hover:bg-[#F0F3EE]"
              >
                408
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E1E6DF] bg-white text-[#59635D]"
                aria-label="Next page"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="pb-2 pt-8 text-center">
          <span className="text-[12px] font-extrabold tracking-[0.18em] text-[#A3AAA5]">
            ELYTEDU · ENGLISH ASSESSMENT · ADMIN PORTAL
          </span>
        </div>
      </div>
    </div>
  )
}
