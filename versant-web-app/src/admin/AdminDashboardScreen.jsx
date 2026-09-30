import { useNavigate } from 'react-router-dom'

const KPIS = [
  {
    label: 'Active students',
    value: '2,450',
    meta: '+12.4%',
    metaTone: 'brand',
    iconBg: 'bg-brand-light text-brand',
    icon: 'users',
  },
  {
    label: 'Total assessments',
    value: '18',
    meta: '4 active',
    metaTone: 'muted',
    iconBg: 'bg-[#FBE9DC] text-accent',
    icon: 'file',
  },
  {
    label: 'Attempts this month',
    value: '1,824',
    meta: '+8.2%',
    metaTone: 'brand',
    iconBg: 'bg-[#E8EAF6] text-[#5865A8]',
    icon: 'chart',
  },
  {
    label: 'Average score',
    value: '76.4',
    meta: '+3.6',
    metaTone: 'brand',
    iconBg: 'bg-brand-light text-brand',
    icon: 'star',
  },
]

const SKILLS = [
  { name: 'Speaking', score: 81.2, tone: 'brand' },
  { name: 'Listening', score: 74.8, tone: 'brand' },
  { name: 'Reading', score: 78.6, tone: 'brand' },
  { name: 'Writing', score: 70.9, tone: 'accent' },
]

const ASSESSMENTS = [
  {
    title: 'English Communication Test',
    meta: 'Full assessment · 4 skills',
    assigned: '1,240',
    completed: '1,086',
    average: '78.2',
    status: 'Active',
    statusTone: 'brand',
  },
  {
    title: 'English Placement Test',
    meta: 'Placement · 4 skills',
    assigned: '650',
    completed: '612',
    average: '72.6',
    status: 'Active',
    statusTone: 'brand',
  },
  {
    title: 'Speaking Evaluation',
    meta: 'Speaking · 10 questions',
    assigned: '420',
    completed: '326',
    average: '81.4',
    status: 'Active',
    statusTone: 'brand',
  },
  {
    title: 'Business Communication',
    meta: 'Writing · 8 questions',
    assigned: '280',
    completed: '241',
    average: '76.8',
    status: 'Due soon',
    statusTone: 'accent',
  },
]

const LIVE = [
  { initials: 'EW', name: 'Emma Wilson', test: 'English Communication Test', progress: '68%', skill: 'Speaking', skillTone: 'accent' },
  { initials: 'RK', name: 'Rahul Kumar', test: 'English Communication Test', progress: '42%', skill: 'Listening', skillTone: 'brand' },
  { initials: 'AS', name: 'Ananya Sharma', test: 'Speaking Evaluation', progress: '31%', skill: 'Speaking', skillTone: 'brand' },
  { initials: 'VS', name: 'Vikram Singh', test: 'Business Communication', progress: '82%', skill: 'Writing', skillTone: 'brand' },
]

function KpiIcon({ name }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }
  if (name === 'users') {
    return (
      <svg {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
  if (name === 'file') {
    return (
      <svg {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg {...props}>
        <path d="M3 3v18h18" />
        <path d="m7 16 4-5 3 3 6-8" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <path d="m12 2 3 7h7l-5.5 4.2L18.5 21 12 16.8 5.5 21l2-7.8L2 9h7Z" />
    </svg>
  )
}

export default function AdminDashboardScreen() {
  const navigate = useNavigate()

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="w-full">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-[12px] font-extrabold tracking-[0.1em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              OVERVIEW
            </div>
            <h1 className="mt-3 text-[27px] font-extrabold tracking-[-0.04em] sm:text-[32px]">
              Good evening, Admin.
            </h1>
            <p className="mt-1 text-[15px] text-muted">
              Here's what's happening across your English assessment program.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/students')}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#DDE3DB] bg-white px-4 text-[14px] font-extrabold"
            >
              Students
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/assessments/create')}
              className="flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-[14px] font-extrabold text-white"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Assessment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[20px] border border-[#E6EAE3] bg-surface p-5 shadow-[0_20px_60px_rgba(31,107,79,0.06)]"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconBg}`}>
                  <KpiIcon name={kpi.icon} />
                </div>
                <span
                  className={`text-[13px] font-extrabold ${
                    kpi.metaTone === 'brand' ? 'text-brand' : 'text-muted'
                  }`}
                >
                  {kpi.meta}
                </span>
              </div>
              <div className="mt-5 text-[27px] font-extrabold tracking-[-0.04em]">{kpi.value}</div>
              <div className="mt-0.5 text-[14px] font-bold text-muted">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
          <div className="rounded-[24px] border border-[#E6EAE3] bg-surface p-5 shadow-[0_20px_60px_rgba(31,107,79,0.06)] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#8B938D]">
                  PERFORMANCE
                </div>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em]">
                  Average score trend
                </h2>
              </div>
              <select className="rounded-xl border border-[#E2E7E0] bg-white px-3 py-2 text-[13px] font-extrabold text-[#59635D] outline-none">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>This year</option>
              </select>
            </div>

            <div className="mt-6 flex h-[250px]">
              <div className="flex w-8 flex-col justify-between pb-5 text-[12px] font-bold text-[#A0A7A2]">
                <span>100</span>
                <span>90</span>
                <span>80</span>
                <span>70</span>
                <span>60</span>
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-0 flex flex-col justify-between pb-5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-dashed border-[#E9EDE7]" />
                  ))}
                </div>
                <svg viewBox="0 0 700 220" preserveAspectRatio="none" className="absolute inset-0 h-[220px] w-full">
                  <defs>
                    <linearGradient id="adminAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1F6B4F" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#1F6B4F" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 180 L 150 158 L 280 145 L 410 115 L 540 92 L 680 68 L 680 220 L 20 220 Z"
                    fill="url(#adminAreaGradient)"
                  />
                  <path
                    d="M 20 180 L 150 158 L 280 145 L 410 115 L 540 92 L 680 68"
                    fill="none"
                    stroke="#1F6B4F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {[
                    [20, 180],
                    [150, 158],
                    [280, 145],
                    [410, 115],
                    [540, 92],
                    [680, 68],
                  ].map(([cx, cy]) => (
                    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#FCFBF8" stroke="#1F6B4F" strokeWidth="3" />
                  ))}
                </svg>
                <div className="absolute right-0 top-[20px] rounded-lg bg-dark px-2 py-1 text-[12px] font-extrabold text-white">
                  76.4
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[12px] font-bold text-[#A0A7A2]">
                  {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#F3F6F0] px-3.5 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light text-brand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 17 6-6 4 4 8-8" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-[#69736C]">
                Average performance has improved by{' '}
                <strong className="text-brand">8.4 points</strong> over the last 6 months.
              </span>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E6EAE3] bg-surface p-5 shadow-[0_20px_60px_rgba(31,107,79,0.06)] sm:p-6">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#8B938D]">
              SKILL PERFORMANCE
            </div>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em]">
              College-wide skill scores
            </h2>

            <div className="mt-6 space-y-5">
              {SKILLS.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-extrabold">{skill.name}</span>
                    <span className="text-[15px] font-extrabold">{skill.score}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EEF1EB]">
                    <div
                      className={`h-full rounded-full ${
                        skill.tone === 'accent' ? 'bg-accent' : 'bg-brand'
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#F0E4D9] bg-[#FFF9F4] p-3.5">
              <div className="text-[14px] font-extrabold text-accent">Focus area</div>
              <p className="mt-0.5 text-[13px] leading-4 text-muted">
                Writing currently has the lowest average score. Consider creating more
                writing-focused assessments and practice.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[24px] border border-[#E6EAE3] bg-surface shadow-[0_20px_60px_rgba(31,107,79,0.06)]">
            <div className="flex items-center justify-between border-b border-[#E9EDE7] px-5 py-5 sm:px-6">
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#8B938D]">
                  ASSESSMENTS
                </div>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em]">
                  Active assessments
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/assessments')}
                className="text-[13px] font-extrabold text-brand"
              >
                View all →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-[#EEF1EB] bg-[#FAFBF8] text-left">
                    {['Assessment', 'Assigned', 'Completed', 'Average', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#9AA19C] first:px-5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ASSESSMENTS.map((row) => (
                    <tr key={row.title} className="border-b border-[#EEF1EB] last:border-0 hover:bg-[#F7F9F5]">
                      <td className="px-5 py-4">
                        <div className="text-[15px] font-extrabold">{row.title}</div>
                        <div className="mt-0.5 text-[12px] font-semibold text-[#929A95]">{row.meta}</div>
                      </td>
                      <td className="px-4 py-4 text-[14px] font-bold">{row.assigned}</td>
                      <td className="px-4 py-4 text-[14px] font-bold">{row.completed}</td>
                      <td className="px-4 py-4 text-[14px] font-extrabold text-brand">{row.average}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[12px] font-extrabold ${
                            row.statusTone === 'accent'
                              ? 'bg-[#FBE9DC] text-[#B96528]'
                              : 'bg-brand-light text-brand'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E6EAE3] bg-surface p-5 shadow-[0_20px_60px_rgba(31,107,79,0.06)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#8B938D]">
                  LIVE NOW
                </div>
                <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em]">Live attempts</h2>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#FFF1E7] px-2.5 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                <span className="text-[12px] font-extrabold text-[#B96528]">18 active</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {LIVE.map((item) => (
                <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-[#F7F9F5] p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-[13px] font-extrabold text-brand">
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-extrabold">{item.name}</div>
                    <div className="mt-0.5 text-[12px] font-semibold text-[#8A928C]">{item.test}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-extrabold">{item.progress}</div>
                    <div
                      className={`mt-0.5 text-[12px] font-bold ${
                        item.skillTone === 'accent' ? 'text-accent' : 'text-brand'
                      }`}
                    >
                      {item.skill}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin/monitoring')}
              className="mt-5 flex h-10 w-full items-center justify-center rounded-xl border border-[#DDE3DB] bg-white text-[13px] font-extrabold text-brand"
            >
              Open Live Monitoring
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[24px] border border-[#E6EAE3] bg-surface p-5 shadow-[0_20px_60px_rgba(31,107,79,0.06)]">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#8B938D]">
              RECENT ACTIVITY
            </div>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em]">Latest updates</h2>
            <div className="mt-5 space-y-4 text-[13px]">
              <div>
                <div className="font-extrabold">120 students added</div>
                <div className="mt-0.5 text-[#929A95]">via bulk upload · 24 min ago</div>
              </div>
              <div>
                <div className="font-extrabold">Assessment published</div>
                <div className="mt-0.5 text-[#929A95]">Business Communication · 1 hr ago</div>
              </div>
              <div>
                <div className="font-extrabold">Results generated</div>
                <div className="mt-0.5 text-[#929A95]">English Communication Test · 2 hrs ago</div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E6EAE3] bg-surface p-5 shadow-[0_20px_60px_rgba(31,107,79,0.06)]">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#8B938D]">
              QUICK ACTIONS
            </div>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em]">Common tasks</h2>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {[
                ['Bulk Upload', '/admin/students/bulk-upload'],
                ['New Assessment', '/admin/assessments/create'],
                ['Question Bank', '/admin/question-bank'],
                ['Export Report', '/admin/reports'],
              ].map(([label, to]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(to)}
                  className="rounded-2xl border border-[#E5E9E2] bg-white p-3 text-left transition hover:border-[#C8D8CA] hover:bg-[#F7F9F5]"
                >
                  <div className="mt-1 text-[13px] font-extrabold">{label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E6EAE3] bg-surface p-5 shadow-[0_20px_60px_rgba(31,107,79,0.06)]">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#8B938D]">
              COMPLETION
            </div>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em]">
              Assessment activity
            </h2>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-[34px] font-extrabold leading-none tracking-[-0.05em]">87.6%</span>
              <span className="mb-1 text-[13px] font-extrabold text-brand">+5.2%</span>
            </div>
            <p className="mt-1 text-[13px] font-semibold text-muted">
              Students completing assigned assessments
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#EEF1EB]">
              <div className="h-full w-[87.6%] rounded-full bg-brand" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ['1,086', 'Completed', false],
                ['154', 'Pending', false],
                ['42', 'Overdue', true],
              ].map(([value, label, warn]) => (
                <div
                  key={label}
                  className={`rounded-xl p-2.5 text-center ${warn ? 'bg-[#FFF7F0]' : 'bg-[#F6F8F3]'}`}
                >
                  <div className={`text-[16px] font-extrabold ${warn ? 'text-[#B96528]' : ''}`}>
                    {value}
                  </div>
                  <div className="mt-0.5 text-[12px] font-bold text-[#929A95]">{label}</div>
                </div>
              ))}
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
