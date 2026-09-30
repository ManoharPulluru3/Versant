import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const STUDENTS = [
  {
    id: '24CS001',
    name: 'Emma Wilson',
    email: 'emma.wilson@college.edu',
    initials: 'EW',
    badge: 'CSE · 3A',
    avatar: 'bg-[#DCEBDD] text-brand',
    search: 'emma wilson 24cs001 emma.wilson@college.edu',
    count: 1,
  },
  {
    id: '24CS002',
    name: 'Liam Parker',
    email: 'liam.parker@college.edu',
    initials: 'LP',
    badge: 'CSE · 3A',
    avatar: 'bg-[#FCEBDD] text-[#B96B2E]',
    search: 'liam parker 24cs002 liam.parker@college.edu',
    count: 1,
  },
  {
    id: '24CS003',
    name: 'Olivia Martin',
    email: 'olivia.martin@college.edu',
    initials: 'OM',
    badge: 'CSE · 3A',
    avatar: 'bg-[#E9E8F5] text-[#64618B]',
    search: 'olivia martin 24cs003 olivia.martin@college.edu',
    count: 1,
  },
  {
    id: '24CS004',
    name: 'Noah Brown',
    email: 'noah.brown@college.edu',
    initials: 'NB',
    badge: 'CSE · 3A',
    avatar: 'bg-[#DCEBDD] text-brand',
    search: 'noah brown 24cs004 noah.brown@college.edu',
    count: 1,
  },
  {
    id: '24CS005',
    name: 'Sophia Lee',
    email: 'sophia.lee@college.edu',
    initials: 'SL',
    badge: 'CSE · 3A',
    avatar: 'bg-[#FCEBDD] text-[#B96B2E]',
    search: 'sophia lee 24cs005 sophia.lee@college.edu',
    count: 1,
  },
  {
    id: '24CS006',
    name: 'Ethan Davis',
    email: 'ethan.davis@college.edu',
    initials: 'ED',
    badge: 'CSE · 3A',
    avatar: 'bg-[#E9E8F5] text-[#64618B]',
    search: 'ethan davis 24cs006 ethan.davis@college.edu',
    count: 1,
  },
]

const BATCHES = [
  { id: 'b1', name: 'CSE - 3rd Year A', meta: 'CSE Department', count: 62, search: 'cse - 3rd year a cse' },
  { id: 'b2', name: 'CSE - 3rd Year B', meta: 'CSE Department', count: 58, search: 'cse - 3rd year b cse' },
  { id: 'b3', name: 'ECE - 3rd Year', meta: 'ECE Department', count: 46, search: 'ece - 3rd year ece' },
  { id: 'b4', name: 'MBA - 1st Year', meta: 'MBA Department', count: 38, search: 'mba - 1st year mba' },
]

const DEPARTMENTS = [
  {
    id: 'd1',
    name: 'Computer Science & Engineering',
    meta: 'CSE Department',
    count: 420,
    search: 'computer science & engineering cse',
  },
  {
    id: 'd2',
    name: 'Electronics & Communication',
    meta: 'ECE Department',
    count: 360,
    search: 'electronics & communication ece',
  },
  {
    id: 'd3',
    name: 'Mechanical Engineering',
    meta: 'MECH Department',
    count: 310,
    search: 'mechanical engineering mech',
  },
  {
    id: 'd4',
    name: 'Civil Engineering',
    meta: 'CIVIL Department',
    count: 280,
    search: 'civil engineering civil',
  },
  {
    id: 'd5',
    name: 'Master of Business Administration',
    meta: 'MBA Department',
    count: 180,
    search: 'master of business administration mba',
  },
]

const TARGET_TYPES = [
  { id: 'students', label: 'Students' },
  { id: 'batches', label: 'Batches' },
  { id: 'departments', label: 'Departments' },
  { id: 'college', label: 'Entire College' },
]

const DEFAULT_INSTRUCTIONS = `Please complete the English Communication Test in a quiet environment with a stable internet connection. Make sure your microphone is working correctly before you begin. The assessment should be completed independently.`

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
      <div className={`h-6 w-[42px] rounded-full transition ${checked ? 'bg-brand' : 'bg-[#d8ddd9]'}`} />
      <div
        className={`absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition ${
          checked ? 'translate-x-[18px]' : ''
        }`}
      />
    </button>
  )
}

function RadioCard({ checked, onSelect, children }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border p-3.5 text-left transition ${
        checked
          ? 'border-brand bg-[#F1F7F2] shadow-[0_0_0_2px_rgba(31,107,79,0.08)]'
          : 'border-[#dfe4df] bg-white'
      }`}
    >
      {children}
    </button>
  )
}

function Toast({ title, message, visible }) {
  return (
    <div
      className={`fixed bottom-24 right-6 z-[200] flex items-center gap-3 rounded-xl bg-[#17221D] px-4 py-3 text-white shadow-xl transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[120px] opacity-0'
      }`}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DCEBDD] text-brand">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m5 12 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div className="text-[14px] font-extrabold">{title}</div>
        <div className="text-[13px] text-white/60">{message}</div>
      </div>
    </div>
  )
}

export default function AdminAssignAssessmentScreen() {
  const navigate = useNavigate()
  const [targetType, setTargetType] = useState('students')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [scheduleType, setScheduleType] = useState('later')
  const [startDate, setStartDate] = useState('2026-09-08')
  const [startTime, setStartTime] = useState('09:00')
  const [endDate, setEndDate] = useState('2026-09-14')
  const [endTime, setEndTime] = useState('23:59')
  const [attempts, setAttempts] = useState('1 attempt')
  const [accessCode, setAccessCode] = useState('')
  const [allowResume, setAllowResume] = useState(true)
  const [requireFullscreen, setRequireFullscreen] = useState(true)
  const [allowLate, setAllowLate] = useState(false)
  const [emailStudents, setEmailStudents] = useState(true)
  const [pushNotify, setPushNotify] = useState(true)
  const [notifyFaculty, setNotifyFaculty] = useState(true)
  const [reminder, setReminder] = useState('24 hours before')
  const [instructions, setInstructions] = useState(DEFAULT_INSTRUCTIONS)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)

  const targetItems = useMemo(() => {
    if (targetType === 'batches') return BATCHES
    if (targetType === 'departments') return DEPARTMENTS
    return STUDENTS
  }, [targetType])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return targetItems
    return targetItems.filter((item) => item.search.includes(q))
  }, [search, targetItems])

  const recipientCount = useMemo(() => {
    if (targetType === 'college') return 2450
    return [...selected].reduce((sum, id) => {
      const item = targetItems.find((t) => t.id === id)
      return sum + (item?.count || 0)
    }, 0)
  }, [selected, targetItems, targetType])

  const searchPlaceholder =
    targetType === 'batches'
      ? 'Search batches...'
      : targetType === 'departments'
        ? 'Search departments...'
        : 'Search students by name, ID or email...'

  const eligibleLabel =
    targetType === 'college'
      ? 'Eligible: 2,450'
      : targetType === 'students'
        ? 'Eligible: 186'
        : targetType === 'batches'
          ? 'Eligible: 204'
          : 'Eligible: 1,550'

  const progressMax = targetType === 'college' ? 2450 : targetType === 'students' ? 186 : 1550
  const progress = Math.min((recipientCount / progressMax) * 100, 100)

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
      if (e.key === 'Escape') setConfirmOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function showToast(title, message) {
    setToast({ title, message })
  }

  function changeTargetType(next) {
    setTargetType(next)
    setSearch('')
    setSelected(new Set())
  }

  function toggleItem(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectVisible() {
    setSelected((prev) => {
      const next = new Set(prev)
      filtered.forEach((item) => next.add(item.id))
      return next
    })
  }

  function openConfirm() {
    if (recipientCount === 0) {
      showToast('Select recipients first', 'Choose at least one student, batch or department.')
      return
    }
    setConfirmOpen(true)
  }

  function confirmAssignment() {
    setConfirmOpen(false)
    showToast('Assessment assigned', 'Students have been notified successfully.')
  }

  return (
    <div className="relative pb-28">
      <div className="w-full p-6 sm:p-8 lg:p-10">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-[#DCEBDD] px-2.5 py-1 text-[13px] font-extrabold tracking-wide text-brand">
                ASSESSMENT
              </span>
              <span className="text-[14px] text-muted">Step 1 of 1</span>
            </div>
            <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
              <Link to="/admin/assessments" className="text-muted hover:text-brand">
                Assessments
              </Link>
              <span className="text-[#A0A8A2]">/</span>
              <span className="font-bold text-dark">Assign Assessment</span>
            </div>
            <h1 className="text-[30px] font-extrabold tracking-tight">Assign Assessment</h1>
            <p className="mt-1 text-[16px] text-muted">
              Assign an assessment to students, batches or departments.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/assessments')}
            className="flex items-center gap-2 rounded-xl border border-[#DDE2DD] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#F6F8F5]"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M19 12H5M10 7l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>

        <section className="mb-6 rounded-2xl border border-[#E3E8E3] bg-surface p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCEBDD] text-brand">
                <svg width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[17px] font-extrabold">English Communication Test</h2>
                  <span className="rounded bg-[#FCEBDD] px-2 py-0.5 text-[12px] font-extrabold text-[#B96B2E]">
                    COLLEGE ASSESSMENT
                  </span>
                </div>
                <p className="mt-0.5 text-[15px] text-muted">Formal English communication assessment</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast('Change Assessment', 'Assessment picker would open here.')}
              className="text-[15px] font-bold text-brand hover:underline"
            >
              Change Assessment
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#E9EDE9] pt-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              ['Skills', '4 Skills'],
              ['Duration', '30 minutes'],
              ['Questions', '40 Questions'],
              ['Level', 'Intermediate'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-[13px] font-bold uppercase tracking-wide text-muted">{label}</div>
                <div className="mt-1 text-sm font-bold">{value}</div>
              </div>
            ))}
            <div>
              <div className="text-[13px] font-bold uppercase tracking-wide text-muted">Status</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand" />
                <span className="text-sm font-bold">Published</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#E3E8E3] bg-surface">
              <div className="border-b border-[#E7EBE7] px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[16px] font-extrabold">Assignment Target</h2>
                    <p className="mt-0.5 text-[15px] text-muted">
                      Choose who should receive this assessment.
                    </p>
                  </div>
                  <span className="rounded-lg bg-[#DCEBDD] px-3 py-1.5 text-[14px] font-extrabold text-brand">
                    {recipientCount.toLocaleString()} selected
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {TARGET_TYPES.map((type) => (
                    <RadioCard
                      key={type.id}
                      checked={targetType === type.id}
                      onSelect={() => changeTargetType(type.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[15px] font-bold">{type.label}</span>
                        <span
                          className={`relative h-4 w-4 shrink-0 rounded-full border ${
                            targetType === type.id ? 'border-brand' : 'border-[#CBD2CC]'
                          }`}
                        >
                          {targetType === type.id && (
                            <span className="absolute inset-[3px] rounded-full bg-brand" />
                          )}
                        </span>
                      </div>
                    </RadioCard>
                  ))}
                </div>

                {targetType === 'college' ? (
                  <div className="rounded-xl border border-[#DCEBDD] bg-[#F4F8F3] p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCEBDD] text-brand">
                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <path d="m2 9 10-5 10 5-10 5-10-5Z" />
                          <path d="M5 11v6c4 2.5 10 2.5 14 0v-6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-extrabold">Entire College</div>
                        <div className="mt-0.5 text-[14px] text-muted">
                          This assessment will be assigned to all eligible students.
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-[22px] font-extrabold text-brand">2,450</div>
                        <div className="text-[13px] font-bold text-muted">Eligible students</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                          placeholder={searchPlaceholder}
                          className="h-11 w-full rounded-xl border border-[#DDE3DE] bg-white pl-10 pr-4 text-[15px] outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(31,107,79,0.08)]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={selectVisible}
                        className="h-11 rounded-xl border border-[#DDE3DE] bg-white px-4 text-[15px] font-bold hover:bg-[#F5F7F4]"
                      >
                        Select All
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#E3E8E3]">
                      {filtered.map((item, index) => {
                        const checked = selected.has(item.id)
                        const isStudent = targetType === 'students'
                        return (
                          <label
                            key={item.id}
                            className={`flex cursor-pointer items-center gap-4 px-4 py-3.5 hover:bg-[#F8FAF7] ${
                              index < filtered.length - 1 ? 'border-b border-[#EEF1EE]' : ''
                            } ${checked ? 'bg-[#F5F9F5]' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleItem(item.id)}
                              className="h-4 w-4 accent-brand"
                            />
                            {isStudent ? (
                              <div
                                className={`flex h-11 w-11 items-center justify-center rounded-full text-[14px] font-extrabold ${item.avatar}`}
                              >
                                {item.initials}
                              </div>
                            ) : (
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                  targetType === 'batches'
                                    ? 'bg-[#DCEBDD] text-brand'
                                    : 'bg-[#FCEBDD] text-[#B96B2E]'
                                }`}
                              >
                                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                  {targetType === 'batches' ? (
                                    <>
                                      <rect x="4" y="4" width="20" height="20" rx="2" />
                                      <path d="M9 4v16M15 4v16" />
                                    </>
                                  ) : (
                                    <>
                                      <path d="M3 20V7l7-4 7 4v13" />
                                      <path d="M8 20v-7h6v7" />
                                    </>
                                  )}
                                </svg>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-[15px] font-bold">{item.name}</div>
                              <div className="text-[13px] text-muted">
                                {isStudent ? `${item.id} · ${item.email}` : item.meta}
                              </div>
                            </div>
                            {isStudent ? (
                              <span className="rounded-md bg-[#F1F3F0] px-2 py-1 text-[13px] font-bold text-muted">
                                {item.badge}
                              </span>
                            ) : (
                              <div className="text-right">
                                <div className="text-[15px] font-extrabold">{item.count}</div>
                                <div className="text-[12px] text-muted">students</div>
                              </div>
                            )}
                          </label>
                        )
                      })}
                      {filtered.length === 0 && (
                        <div className="px-4 py-8 text-center text-[15px] text-muted">
                          No matches found.
                        </div>
                      )}
                    </div>

                    {targetType === 'students' && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[14px] text-muted">Showing {filtered.length} of 186 eligible students</span>
                        <button
                          type="button"
                          onClick={() => navigate('/admin/students')}
                          className="text-[14px] font-bold text-brand hover:underline"
                        >
                          View all students →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#E3E8E3] bg-surface">
              <div className="border-b border-[#E7EBE7] px-6 py-5">
                <h2 className="text-[16px] font-extrabold">Schedule</h2>
                <p className="mt-0.5 text-[15px] text-muted">
                  Decide when students can access the assessment.
                </p>
              </div>
              <div className="p-6">
                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      id: 'later',
                      title: 'Schedule for later',
                      desc: 'Set a specific opening and closing time.',
                    },
                    {
                      id: 'now',
                      title: 'Start immediately',
                      desc: 'Students can start as soon as assigned.',
                    },
                  ].map((opt) => (
                    <RadioCard
                      key={opt.id}
                      checked={scheduleType === opt.id}
                      onSelect={() => setScheduleType(opt.id)}
                    >
                      <div className="flex gap-3 p-0.5">
                        <span
                          className={`relative mt-0.5 h-4 w-4 shrink-0 rounded-full border ${
                            scheduleType === opt.id ? 'border-brand' : 'border-[#CBD2CC]'
                          }`}
                        >
                          {scheduleType === opt.id && (
                            <span className="absolute inset-[3px] rounded-full bg-brand" />
                          )}
                        </span>
                        <div>
                          <div className="text-[15px] font-bold">{opt.title}</div>
                          <div className="mt-0.5 text-[13px] text-muted">{opt.desc}</div>
                        </div>
                      </div>
                    </RadioCard>
                  ))}
                </div>

                {scheduleType === 'later' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[14px] font-bold">Start Date & Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-11 rounded-xl border border-[#DDE3DE] bg-white px-3 text-[15px] outline-none focus:border-brand"
                        />
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="h-11 rounded-xl border border-[#DDE3DE] bg-white px-3 text-[15px] outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-[14px] font-bold">End Date & Time</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-11 rounded-xl border border-[#DDE3DE] bg-white px-3 text-[15px] outline-none focus:border-brand"
                        />
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="h-11 rounded-xl border border-[#DDE3DE] bg-white px-3 text-[15px] outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-[14px] text-muted">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" />
                  </svg>
                  Timezone: <span className="font-bold text-dark">Asia/Kolkata (IST)</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E3E8E3] bg-surface">
              <div className="border-b border-[#E7EBE7] px-6 py-5">
                <h2 className="text-[16px] font-extrabold">Access & Attempts</h2>
                <p className="mt-0.5 text-[15px] text-muted">
                  Configure how students can access and complete the test.
                </p>
              </div>
              <div className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[14px] font-bold">Attempts Allowed</label>
                    <select
                      value={attempts}
                      onChange={(e) => setAttempts(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#DDE3DE] bg-white px-3 text-[15px] outline-none focus:border-brand"
                    >
                      <option>1 attempt</option>
                      <option>2 attempts</option>
                      <option>3 attempts</option>
                      <option>Unlimited</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[14px] font-bold">
                      Access Code <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <input
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="e.g. ENG2026"
                      className="h-11 w-full rounded-xl border border-[#DDE3DE] bg-white px-3 text-[15px] outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-[#E9EDE9] pt-4">
                  {[
                    {
                      title: 'Allow Resume',
                      desc: 'Students can continue if they leave the assessment.',
                      value: allowResume,
                      set: setAllowResume,
                    },
                    {
                      title: 'Require Fullscreen',
                      desc: 'Keep students in assessment mode during the test.',
                      value: requireFullscreen,
                      set: setRequireFullscreen,
                    },
                    {
                      title: 'Allow Late Submission',
                      desc: 'Students may finish after the closing time.',
                      value: allowLate,
                      set: setAllowLate,
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[15px] font-bold">{item.title}</div>
                        <div className="mt-0.5 text-[13px] text-muted">{item.desc}</div>
                      </div>
                      <Toggle checked={item.value} onChange={item.set} label={item.title} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E3E8E3] bg-surface">
              <div className="border-b border-[#E7EBE7] px-6 py-5">
                <h2 className="text-[16px] font-extrabold">Notifications</h2>
                <p className="mt-0.5 text-[15px] text-muted">Choose how recipients should be notified.</p>
              </div>
              <div className="space-y-4 p-6">
                {[
                  {
                    title: 'Email students',
                    desc: 'Send assignment details to student email.',
                    value: emailStudents,
                    set: setEmailStudents,
                  },
                  {
                    title: 'Push / In-app notification',
                    desc: 'Show the assignment in the student portal.',
                    value: pushNotify,
                    set: setPushNotify,
                  },
                  {
                    title: 'Notify faculty',
                    desc: 'Notify assigned faculty members.',
                    value: notifyFaculty,
                    set: setNotifyFaculty,
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[15px] font-bold">{item.title}</div>
                      <div className="text-[13px] text-muted">{item.desc}</div>
                    </div>
                    <Toggle checked={item.value} onChange={item.set} label={item.title} />
                  </div>
                ))}

                <div className="border-t border-[#E9EDE9] pt-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-[15px] font-bold">Reminder before due date</div>
                      <div className="mt-0.5 text-[13px] text-muted">
                        Automatically remind students who haven&apos;t completed the test.
                      </div>
                    </div>
                    <select
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value)}
                      className="h-10 w-full rounded-xl border border-[#DDE3DE] bg-white px-3 text-[14px] outline-none sm:w-36"
                    >
                      <option>24 hours before</option>
                      <option>48 hours before</option>
                      <option>3 days before</option>
                      <option>No reminder</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E3E8E3] bg-surface">
              <div className="border-b border-[#E7EBE7] px-6 py-5">
                <h2 className="text-[16px] font-extrabold">Student Instructions</h2>
                <p className="mt-0.5 text-[15px] text-muted">
                  Add instructions or a message students will see before starting.
                </p>
              </div>
              <div className="p-6">
                <textarea
                  rows={5}
                  maxLength={500}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full resize-none rounded-xl border border-[#DDE3DE] bg-white p-4 text-[15px] outline-none focus:border-brand"
                />
                <div className="mt-2 flex justify-between">
                  <span className="text-[13px] text-muted">
                    Students will see this before starting the assessment.
                  </span>
                  <span className="text-[13px] text-muted">{instructions.length} / 500</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-[100px] xl:self-start">
            <section className="overflow-hidden rounded-2xl border border-[#E3E8E3] bg-surface">
              <div className="border-b border-[#E7EBE7] px-5 py-4">
                <h3 className="text-[15px] font-extrabold">Assignment Summary</h3>
              </div>
              <div className="p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCEBDD] text-brand">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="5" y="3" width="14" height="18" rx="2" />
                      <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-extrabold">English Communication Test</div>
                    <div className="text-[13px] text-muted">30 min · 40 questions</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ['Assignment target', `${recipientCount.toLocaleString()} students`],
                    [
                      'Start',
                      scheduleType === 'now' ? 'Immediately' : 'Sep 8 · 9:00 AM',
                    ],
                    ['Due', scheduleType === 'now' ? 'Open window' : 'Sep 14 · 11:59 PM'],
                    ['Attempts', attempts],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <span className="text-[14px] text-muted">{label}</span>
                      <span className="text-[14px] font-bold">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-muted">Resume</span>
                    <span className="flex items-center gap-1.5 text-[14px] font-bold text-brand">
                      <span className={`h-1.5 w-1.5 rounded-full ${allowResume ? 'bg-brand' : 'bg-[#C8CEC9]'}`} />
                      {allowResume ? 'Allowed' : 'Off'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#E8ECE8] pt-5">
                  <div className="mb-3 text-[13px] font-bold uppercase tracking-wide text-muted">
                    Notifications
                  </div>
                  <div className="space-y-2">
                    {[
                      emailStudents && 'Email students',
                      pushNotify && 'Push notification',
                      notifyFaculty && 'Faculty notification',
                    ]
                      .filter(Boolean)
                      .map((label) => (
                        <div key={label} className="flex items-center gap-2 text-[14px]">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#DCEBDD] text-brand">
                            ✓
                          </span>
                          {label}
                        </div>
                      ))}
                    {!emailStudents && !pushNotify && !notifyFaculty && (
                      <div className="text-[14px] text-muted">No notifications enabled</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-brand p-5 text-white">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 -right-4 h-32 w-32 rounded-full bg-white/5" />
              <div className="relative">
                <div className="text-[13px] font-bold uppercase tracking-[1.3px] text-white/60">
                  Estimated Recipients
                </div>
                <div className="mt-1 text-[34px] font-extrabold">{recipientCount.toLocaleString()}</div>
                <div className="text-[14px] text-white/70">students will receive this assessment</div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[12px] text-white/60">
                  <span>Selected</span>
                  <span>{eligibleLabel}</span>
                </div>
              </div>
            </section>

            <div className="rounded-2xl border border-[#EDE4D4] bg-[#F8F4EA] p-4">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F2E7D4] text-[#A8733F]">
                  i
                </div>
                <div>
                  <div className="text-[14px] font-extrabold">Before assigning</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#8A7960]">
                    Students will receive the assignment according to the notification settings above.
                    Once assigned, changes to attempts and timing may affect active students.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E1E6E1] bg-[#FCFBF8]/95 px-5 py-4 backdrop-blur sm:px-8 lg:left-[255px]">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[14px] text-muted">Ready to assign?</div>
            <div className="mt-0.5 text-[15px] font-bold">
              {recipientCount.toLocaleString()} students selected
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                showToast('Draft saved', 'Your assignment configuration has been saved.')
              }
              className="rounded-xl border border-[#DDE3DE] bg-white px-5 py-2.5 text-[15px] font-bold hover:bg-[#F5F7F4]"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={openConfirm}
              className="rounded-xl bg-brand px-5 py-2.5 text-[15px] font-extrabold text-white shadow-sm hover:bg-[#185A42]"
            >
              Assign Assessment
            </button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17221D]/35 p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmOpen(false)
          }}
        >
          <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7EBE7] px-6 py-5">
              <div>
                <h3 className="text-[17px] font-extrabold">Confirm Assignment</h3>
                <p className="mt-0.5 text-[14px] text-muted">Review the assignment before publishing.</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-[#F1F3F0]"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="mb-5 rounded-xl bg-[#F3F7F2] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCEBDD] text-brand">
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="5" y="3" width="14" height="18" rx="2" />
                      <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-extrabold">English Communication Test</div>
                    <div className="text-[13px] text-muted">30 minutes · 40 questions · 4 skills</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E4E8E4] bg-white p-3.5">
                  <div className="text-[13px] font-bold text-muted">RECIPIENTS</div>
                  <div className="mt-1 text-[18px] font-extrabold">
                    {recipientCount.toLocaleString()} students
                  </div>
                </div>
                <div className="rounded-xl border border-[#E4E8E4] bg-white p-3.5">
                  <div className="text-[13px] font-bold text-muted">ATTEMPTS</div>
                  <div className="mt-1 text-[18px] font-extrabold">{attempts}</div>
                </div>
                <div className="rounded-xl border border-[#E4E8E4] bg-white p-3.5">
                  <div className="text-[13px] font-bold text-muted">STARTS</div>
                  <div className="mt-1 text-[15px] font-extrabold">
                    {scheduleType === 'now' ? 'Immediately' : 'Sep 8, 9:00 AM'}
                  </div>
                </div>
                <div className="rounded-xl border border-[#E4E8E4] bg-white p-3.5">
                  <div className="text-[13px] font-bold text-muted">DUE</div>
                  <div className="mt-1 text-[15px] font-extrabold">
                    {scheduleType === 'now' ? 'Open window' : 'Sep 14, 11:59 PM'}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#EDE4D4] bg-[#F8F4EA] p-3.5">
                <p className="text-[13px] leading-relaxed text-[#806F57]">
                  Students will be notified by email and in-app notification. Faculty members will also
                  receive an assignment notification.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#E7EBE7] px-6 py-4">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl border border-[#DDE3DE] bg-white px-5 py-2.5 text-[15px] font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAssignment}
                className="rounded-xl bg-brand px-5 py-2.5 text-[15px] font-extrabold text-white"
              >
                Confirm & Assign
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast title={toast?.title || ''} message={toast?.message || ''} visible={toastVisible} />
    </div>
  )
}
