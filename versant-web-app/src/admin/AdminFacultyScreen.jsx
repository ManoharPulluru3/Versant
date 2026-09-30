import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FACULTY = [
  {
    id: 'FAC2026001',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@college.edu',
    initials: 'PS',
    avatar: 'bg-brand-light text-brand',
    department: 'Computer Science',
    deptCode: 'CSE',
    assessments: '12 assigned',
    assessmentsMeta: '8 managed',
    lastActive: '18 min ago',
    status: 'Active',
  },
  {
    id: 'FAC2026002',
    name: 'Prof. Rahul Reddy',
    email: 'rahul.reddy@college.edu',
    initials: 'RR',
    avatar: 'bg-[#e8e6f1] text-[#5e587e]',
    department: 'Electronics',
    deptCode: 'ECE',
    assessments: '9 assigned',
    assessmentsMeta: '5 managed',
    lastActive: '1 hr ago',
    status: 'Active',
  },
  {
    id: 'FAC2026003',
    name: 'Dr. Ananya Rao',
    email: 'ananya.rao@college.edu',
    initials: 'AR',
    avatar: 'bg-[#f5e5d7] text-[#a86535]',
    department: 'Information Technology',
    deptCode: 'IT',
    assessments: '4 assigned',
    assessmentsMeta: 'Not started',
    lastActive: 'Never',
    status: 'Pending',
  },
  {
    id: 'FAC2026004',
    name: 'Prof. Arjun Kumar',
    email: 'arjun.kumar@college.edu',
    initials: 'AK',
    avatar: 'bg-[#e4edf1] text-[#496a79]',
    department: 'Mechanical',
    deptCode: 'MECH',
    assessments: '7 assigned',
    assessmentsMeta: '7 managed',
    lastActive: '3 hrs ago',
    status: 'Active',
  },
  {
    id: 'FAC2026005',
    name: 'Dr. Sneha Patel',
    email: 'sneha.patel@college.edu',
    initials: 'SP',
    avatar: 'bg-[#eee9e4] text-[#766c64]',
    department: 'Management',
    deptCode: 'MBA',
    assessments: '3 assigned',
    assessmentsMeta: '2 managed',
    lastActive: 'Sep 2, 2026',
    status: 'Inactive',
  },
  {
    id: 'FAC2026006',
    name: 'Prof. Vikram Singh',
    email: 'vikram.singh@college.edu',
    initials: 'VS',
    avatar: 'bg-[#e8e6f1] text-[#5e587e]',
    department: 'Computer Science',
    deptCode: 'CSE',
    assessments: '10 assigned',
    assessmentsMeta: '6 managed',
    lastActive: '5 hrs ago',
    status: 'Active',
  },
]

const STATS = [
  {
    label: 'Total Faculty',
    value: '186',
    meta: '+8 this month',
    metaTone: 'brand',
    iconBg: 'bg-[#e8f1e8] text-brand',
    icon: 'users',
  },
  {
    label: 'Active Faculty',
    value: '174',
    meta: '93.5% of faculty',
    metaTone: 'muted',
    iconBg: 'bg-[#e8f1e8] text-brand',
    icon: 'check',
  },
  {
    label: 'Pending',
    value: '7',
    meta: 'Requires attention',
    metaTone: 'accent',
    iconBg: 'bg-[#fff0e4] text-accent',
    icon: 'clock',
  },
  {
    label: 'Inactive',
    value: '5',
    meta: 'Currently disabled',
    metaTone: 'muted',
    iconBg: 'bg-[#f0f1ed] text-[#737a75]',
    icon: 'x',
  },
]

const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Information Technology',
  'Mechanical',
  'Management',
]

const BULK_COLUMNS = [
  'Faculty ID',
  'First Name',
  'Last Name',
  'Email',
  'Department',
  'Designation',
]

const STATUS_STYLES = {
  Active: 'bg-[#e7f3e8] text-[#287047]',
  Pending: 'bg-[#fff1e7] text-[#b8682e]',
  Inactive: 'bg-[#f0f1ed] text-[#737a75]',
}

const STATUS_DOT = {
  Active: 'bg-[#287047]',
  Pending: 'bg-accent',
  Inactive: 'bg-[#737a75]',
}

function StatIcon({ name }) {
  const props = {
    className: 'h-5 w-5',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  }
  if (name === 'users') {
    return (
      <svg {...props}>
        <circle cx="9" cy="7" r="4" />
        <path strokeLinecap="round" d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
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
        <path strokeLinecap="round" d="M12 8v4l2 2" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="M8 8l8 8M16 8l-8 8" />
    </svg>
  )
}

function downloadFacultyTemplate() {
  const headers = [...BULK_COLUMNS, 'Status']
  const example = [
    'FAC2026007',
    'Priya',
    'Sharma',
    'priya.sharma@college.edu',
    'Computer Science',
    'Assistant Professor',
    'Active',
  ]
  const csv = `${headers.join(',')}\n${example.join(',')}\n`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'elytedu_faculty_upload_template.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function AdminFacultyScreen() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [addOpen, setAddOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [menu, setMenu] = useState(null)
  const menuRef = useRef(null)
  const fileRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return FACULTY.filter((row) => {
      const hay = `${row.name} ${row.id} ${row.email}`.toLowerCase()
      const matchesSearch = !q || hay.includes(q)
      const matchesDept = !department || row.department === department
      const matchesStatus = !status || row.status === status
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [query, department, status])

  const allSelected =
    filtered.length > 0 && filtered.every((row) => selected.has(row.id))

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(null)
      }
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

  function clearFilters() {
    setQuery('')
    setDepartment('')
    setStatus('')
  }

  function openMenu(e, faculty) {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setMenu({
      faculty,
      left: Math.max(8, rect.right - 176),
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
              <span className="font-semibold text-brand">Faculty</span>
            </div>
            <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
              Faculty
            </h1>
            <p className="mt-1 text-sm text-[#7A837D]">
              Manage faculty accounts, departments and assessment access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setBulkOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-[#dce2d8] bg-surface px-4 py-2.5 text-sm font-bold text-[#344139] hover:bg-[#f5f6f1]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M12 16V4m0 0-4 4m4-4 4 4" />
                <path strokeLinecap="round" d="M5 20h14" />
              </svg>
              Bulk Upload
            </button>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#185a42]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
              Add Faculty
            </button>
          </div>
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
                  <StatIcon name={stat.icon} />
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
            <div className="relative w-full xl:w-[340px]">
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
                placeholder="Search by name, ID or email..."
                className="w-full rounded-xl border border-[#dce2d8] bg-[#fafbf8] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="rounded-xl border border-[#dce2d8] bg-[#fafbf8] px-3 py-2.5 text-sm text-[#59625c] outline-none"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-[#dce2d8] bg-[#fafbf8] px-3 py-2.5 text-sm text-[#59625c] outline-none"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-[#dce2d8] px-3 py-2.5 text-sm font-bold text-[#68716b] hover:bg-[#f4f6f1]"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="bg-[#f7f8f4] text-left">
                  <th className="w-10 px-6 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="h-4 w-4 accent-brand"
                      aria-label="Select all faculty"
                    />
                  </th>
                  {['Faculty', 'Faculty ID', 'Department', 'Assessments', 'Last Active', 'Status'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-[14px] font-bold uppercase tracking-wider text-[#8a928c] first:px-3 [&:nth-child(n+3)]:px-4"
                      >
                        {h}
                      </th>
                    ),
                  )}
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
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-extrabold ${row.avatar}`}
                        >
                          {row.initials}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{row.name}</div>
                          <div className="text-[13px] text-[#89918b]">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">{row.id}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold">{row.department}</div>
                      <div className="text-[14px] text-[#89918b]">{row.deptCode}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold">{row.assessments}</div>
                      <div className="text-[14px] text-[#89918b]">{row.assessmentsMeta}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#68716b]">{row.lastActive}</td>
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
                    <td colSpan={8} className="px-6 py-12 text-center text-sm font-bold text-[#8a928c]">
                      No faculty match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#e7ebe4] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[13px] text-[#7A837D]">
              Showing <span className="font-bold text-[#344139]">1–{filtered.length}</span> of{' '}
              <span className="font-bold text-[#344139]">186</span> faculty
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
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
                31
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
      </div>

      {menu && (
        <div
          ref={menuRef}
          className="fixed z-[60] w-44 rounded-xl border border-[#e1e6de] bg-surface p-1 shadow-xl"
          style={{ left: menu.left, top: menu.top }}
        >
          <button
            type="button"
            onClick={() => {
              setMenu(null)
              window.alert('Open Faculty Profile')
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f1f4ec]"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setMenu(null)
              window.alert('Open Edit Faculty')
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f1f4ec]"
          >
            Edit Faculty
          </button>
          <button
            type="button"
            onClick={() => {
              setMenu(null)
              navigate('/admin/assessments/assign')
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f1f4ec]"
          >
            Assign Assessment
          </button>
          <div className="my-1 h-px bg-[#e8ebe4]" />
          <button
            type="button"
            onClick={() => {
              setMenu(null)
              if (window.confirm('Are you sure you want to disable this faculty account?')) {
                window.alert('Faculty account disabled.')
              }
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#a75f32] hover:bg-[#fff3eb]"
          >
            Disable Account
          </button>
        </div>
      )}

      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221d]/30 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddOpen(false)
          }}
        >
          <div className="w-full max-w-xl rounded-3xl border border-[#e1e6de] bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e6eae3] p-6">
              <div>
                <h2 className="text-xl font-extrabold">Add Faculty</h2>
                <p className="mt-1 text-[13px] text-[#7A837D]">Create a new faculty account.</p>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xl text-[#69736d] hover:bg-[#f1f3ed]"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[13px] font-bold text-[#59625c]">First Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya"
                    className="mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-[#59625c]">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma"
                    className="mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[13px] font-bold text-[#59625c]">Email Address</label>
                  <input
                    type="email"
                    placeholder="faculty@college.edu"
                    className="mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-[#59625c]">Faculty ID</label>
                  <input
                    type="text"
                    placeholder="FAC2026007"
                    className="mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-bold text-[#59625c]">Department</label>
                  <select className="mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand">
                    <option>Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-bold text-[#59625c]">Designation</label>
                  <select className="mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand">
                    <option>Select designation</option>
                    <option>Professor</option>
                    <option>Associate Professor</option>
                    <option>Assistant Professor</option>
                    <option>Lecturer</option>
                    <option>HOD</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-bold text-[#59625c]">Status</label>
                  <select className="mt-1.5 w-full rounded-xl border border-[#dce2d8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand">
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-[#f3f5ef] p-4">
                <div className="flex gap-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-brand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
                  </svg>
                  <p className="text-[13px] leading-5 text-[#68716b]">
                    The faculty member will receive an invitation to set up their account after
                    creation.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="rounded-xl border border-[#dce2d8] px-4 py-2.5 text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.alert(
                      'Faculty account created successfully.\n\nIn the production application, this will call the faculty creation API.',
                    )
                    setAddOpen(false)
                  }}
                  className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white"
                >
                  Create Faculty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bulkOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221d]/30 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBulkOpen(false)
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#e1e6de] bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e6eae3] p-6">
              <div>
                <h2 className="text-xl font-extrabold">Bulk Faculty Upload</h2>
                <p className="mt-1 text-[13px] text-[#7A837D]">
                  Add multiple faculty accounts using a CSV file.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBulkOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xl text-[#69736d] hover:bg-[#f1f3ed]"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border-2 border-dashed border-[#cfd8cd] bg-[#f8faf5] p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M12 16V4m0 0-4 4m4-4 4 4" />
                    <path strokeLinecap="round" d="M5 20h14" />
                  </svg>
                </div>
                <div className="mt-4 text-sm font-bold">Upload faculty CSV</div>
                <div className="mt-1 text-[13px] text-[#7A837D]">CSV format · Maximum 10 MB</div>
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white"
                >
                  Choose File
                </button>
              </div>

              <button
                type="button"
                onClick={downloadFacultyTemplate}
                className="mt-4 w-full rounded-xl border border-[#dce2d8] py-2.5 text-sm font-bold hover:bg-[#f5f6f1]"
              >
                Download Faculty Template
              </button>

              <div className="mt-5 rounded-xl bg-[#f3f5ef] p-4">
                <div className="text-[13px] font-extrabold">Required columns</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BULK_COLUMNS.map((col) => (
                    <span
                      key={col}
                      className="rounded-lg bg-white px-2.5 py-1 text-[14px] font-semibold"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
