import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const KPIS = [
  { label: 'Students Tested', value: '1,248', delta: '+12.8%', note: 'vs previous period' },
  { label: 'Assessments', value: '1,436', delta: '+8.4%', note: 'completed attempts' },
  { label: 'Avg. Score', value: '78.6', delta: '+3.2 pts', note: 'vs previous period' },
  { label: 'Completion', value: '91.4%', delta: '+4.1%', note: 'completion rate' },
  { label: 'Avg. Proficiency', value: 'B2', delta: '+0.3', note: 'level improvement' },
]

const SKILLS = [
  { name: 'Speaking', score: 81, delta: '+5.2 pts', note: 'Above benchmark', brand: true },
  { name: 'Listening', score: 76, delta: '+2.1 pts', note: 'Near benchmark', brand: false },
  { name: 'Reading', score: 82, delta: '+4.8 pts', note: 'Strong', brand: true },
  { name: 'Writing', score: 75, delta: '+1.6 pts', note: 'Focus area', brand: false },
]

const PROFICIENCY = [
  { level: 'A1', count: 42, height: '28%', color: 'bg-[#D7DED7]', highlight: false },
  { level: 'A2', count: 86, height: '42%', color: 'bg-[#C6D2C8]', highlight: false },
  { level: 'B1', count: 218, height: '68%', color: 'bg-[#AFC4B4]', highlight: false },
  { level: 'B2', count: 482, height: '100%', color: 'bg-[#7FA38A]', highlight: true },
  { level: 'C1', count: 336, height: '78%', color: 'bg-[#56856B]', highlight: false },
  { level: 'C2', count: 84, height: '32%', color: 'bg-brand', highlight: false },
]

const DEPARTMENTS = [
  { name: 'Computer Science', students: 382, score: '82.4', completion: '94.2%', trend: '↑ 4.8', brand: true },
  { name: 'Electronics & Communication', students: 246, score: '79.8', completion: '92.1%', trend: '↑ 3.2', brand: true },
  { name: 'Mechanical Engineering', students: 198, score: '76.1', completion: '89.7%', trend: '↑ 2.7', brand: true },
  { name: 'Civil Engineering', students: 164, score: '74.8', completion: '87.5%', trend: '↑ 1.4', brand: false },
  { name: 'Information Technology', students: 258, score: '80.7', completion: '93.6%', trend: '↑ 4.1', brand: true },
]

const QUESTION_TYPES = [
  { name: 'Read Aloud', pct: 86, brand: true },
  { name: 'Reading Comprehension', pct: 84, brand: true },
  { name: 'Repeat', pct: 81, brand: true },
  { name: 'Passage Comprehension', pct: 76, brand: false },
  { name: 'Email Writing', pct: 74, brand: false },
  { name: 'Story Retelling', pct: 69, brand: false },
]

const ASSESSMENTS = [
  { n: '01', name: 'English Communication Test', meta: '1,024 completed', score: '81.2', note: '+4.6 pts', brand: true },
  { n: '02', name: 'Communication Baseline', meta: '812 completed', score: '76.8', note: '+2.8 pts', brand: false },
  { n: '03', name: 'Placement Readiness', meta: '643 completed', score: '79.4', note: '+3.7 pts', brand: true },
  { n: '04', name: 'Business English', meta: '418 completed', score: '73.6', note: 'Focus area', brand: false, warn: true },
]

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-7 right-7 z-50 transition-all duration-300 ${
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

export default function AdminAnalyticsScreen() {
  const [range, setRange] = useState('30')
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (!toast) return undefined
    setToastVisible(true)
    const timer = setTimeout(() => {
      setToastVisible(false)
      setTimeout(() => setToast(''), 300)
    }, 2400)
    return () => clearTimeout(timer)
  }, [toast])

  function showToast(message) {
    setToast(message)
  }

  function changeRange(next) {
    setRange(next)
    const label = next === '7' ? '7 days' : next === '30' ? '30 days' : '90 days'
    showToast(`Analytics updated for last ${label}`)
  }

  return (
    <div className="w-full p-6 sm:p-8 lg:p-10">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1 text-[14px] text-muted">
            <Link to="/admin/analytics" className="hover:text-brand">
              Analytics
            </Link>
          </div>
          <h1 className="text-[27px] font-extrabold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted">
            Understand student performance, skill trends and assessment outcomes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-[#E1E6DE] bg-white px-3 text-[14px] font-bold">
            Aug 01 – Sep 08, 2026
          </div>
          {['7', '30', '90'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => changeRange(value)}
              className={`h-8 rounded-lg px-3 text-[13px] font-bold ${
                range === value
                  ? 'bg-brand text-white'
                  : 'border border-[#E1E6DE] bg-white'
              }`}
            >
              {value} days
            </button>
          ))}
          <button
            type="button"
            onClick={() => showToast('Analytics exported')}
            className="flex h-10 items-center gap-2 rounded-xl bg-brand px-3 text-[13px] font-bold text-white hover:bg-[#195A43]"
          >
            Export
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-[#E1E7DD] bg-surface p-5">
            <div className="text-[13px] font-bold uppercase tracking-[1px] text-muted">{kpi.label}</div>
            <div className="mt-4 text-[31px] font-extrabold">{kpi.value}</div>
            <div className="mt-2 flex items-center gap-1 text-[13px]">
              <span className="font-extrabold text-brand">{kpi.delta}</span>
              <span className="text-muted">{kpi.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6 xl:col-span-2">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold">Average Score Trend</h2>
              <p className="mt-1 text-[13px] text-muted">
                Average student score over the selected period.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[13px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand" />
                Average score
              </div>
              <div className="flex items-center gap-1.5 text-muted">
                <span className="h-2 w-2 rounded-full bg-[#C7D3C9]" />
                Benchmark 75
              </div>
            </div>
          </div>

          <div className="relative h-[250px]">
            <div className="absolute inset-0 flex flex-col justify-between">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-t border-dashed border-[#E4E9E1]" />
              ))}
            </div>
            <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-[12px] text-muted">
              {['90', '85', '80', '75', '70'].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <svg
              className="absolute left-8 top-0 h-[220px] w-[calc(100%-32px)]"
              viewBox="0 0 760 220"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1F6B4F" stopOpacity=".14" />
                  <stop offset="100%" stopColor="#1F6B4F" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 165 L125 148 L250 137 L375 126 L500 101 L625 83 L760 63 L760 220 L0 220 Z"
                fill="url(#scoreFill)"
              />
              <path
                d="M0 143 L760 143"
                stroke="#C7D3C9"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
              <path
                d="M0 165 L125 148 L250 137 L375 126 L500 101 L625 83 L760 63"
                fill="none"
                stroke="#1F6B4F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {[
                [0, 165],
                [125, 148],
                [250, 137],
                [375, 126],
                [500, 101],
                [625, 83],
              ].map(([cx, cy]) => (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#FCFBF8"
                  stroke="#1F6B4F"
                  strokeWidth="3"
                />
              ))}
              <circle cx="760" cy="63" r="5" fill="#1F6B4F" stroke="#FCFBF8" strokeWidth="3" />
            </svg>
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[12px] text-muted">
              {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#E7EBE4] pt-4">
            <div>
              <span className="text-[13px] text-muted">Current average</span>
              <span className="ml-2 text-sm font-extrabold text-brand">78.6</span>
            </div>
            <div className="text-[13px] font-bold text-brand">↑ Consistent improvement</div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6">
          <h2 className="text-[16px] font-extrabold">Skill Performance</h2>
          <p className="mt-1 text-[13px] text-muted">Average score by communication skill.</p>
          <div className="mt-6 space-y-6">
            {SKILLS.map((skill) => (
              <div key={skill.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-bold">{skill.name}</span>
                  <span
                    className={`text-sm font-extrabold ${
                      skill.brand ? 'text-brand' : 'text-accent'
                    }`}
                  >
                    {skill.score}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#E9EDE6]">
                  <div
                    className={`h-full rounded-full ${skill.brand ? 'bg-brand' : 'bg-accent'}`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[12px] text-muted">
                  <span>{skill.delta}</span>
                  <span>{skill.note}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6">
          <h2 className="text-[16px] font-extrabold">Proficiency Distribution</h2>
          <p className="mt-1 text-[13px] text-muted">Students grouped by current English level.</p>
          <div className="mt-6 flex h-[185px] items-end justify-between px-2">
            {PROFICIENCY.map((item) => (
              <div key={item.level} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="text-[13px] font-bold">{item.count}</span>
                <div className={`w-9 rounded-t-lg ${item.color}`} style={{ height: item.height }} />
                <span
                  className={`text-[13px] font-bold ${
                    item.highlight ? 'text-brand' : 'text-muted'
                  }`}
                >
                  {item.level}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-[#E7EBE4] pt-4">
            <span className="text-[13px] text-muted">Largest group</span>
            <span className="text-[13px] font-extrabold text-brand">B2 · 38.6%</span>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6 xl:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-extrabold">Department Performance</h2>
              <p className="mt-1 text-[13px] text-muted">Average assessment score by department.</p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Department details opened')}
              className="text-[13px] font-extrabold text-brand"
            >
              View all →
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#E5EAE2]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead className="border-b border-[#E5EAE2] bg-[#F5F7F2]">
                  <tr className="text-[12px] font-extrabold uppercase tracking-[1px] text-muted">
                    {['Department', 'Students', 'Avg. Score', 'Completion', 'Trend'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EDE6]">
                  {DEPARTMENTS.map((row) => (
                    <tr key={row.name} className="hover:bg-[#FAFBF8]">
                      <td className="px-4 py-3 text-[13px] font-bold">{row.name}</td>
                      <td className="px-4 py-3 text-[13px]">{row.students}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[13px] font-extrabold ${
                            row.brand ? 'text-brand' : ''
                          }`}
                        >
                          {row.score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold">{row.completion}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[13px] font-extrabold ${
                            row.brand ? 'text-brand' : 'text-accent'
                          }`}
                        >
                          {row.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6">
          <h2 className="text-[16px] font-extrabold">Question Type Performance</h2>
          <p className="mt-1 text-[13px] text-muted">
            Identify which activities students find easiest or hardest.
          </p>
          <div className="mt-6 space-y-4">
            {QUESTION_TYPES.map((item) => (
              <div key={item.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        item.brand ? 'bg-brand' : 'bg-accent'
                      }`}
                    />
                    <span className="text-[13px] font-bold">{item.name}</span>
                  </div>
                  <span className="text-[13px] font-extrabold">{item.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#E9EDE6]">
                  <div
                    className={`h-full rounded-full ${item.brand ? 'bg-brand' : 'bg-accent'}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-extrabold">Assessment Performance</h2>
              <p className="mt-1 text-[13px] text-muted">Most recent assessments across the college.</p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Assessment analytics opened')}
              className="text-[13px] font-extrabold text-brand"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {ASSESSMENTS.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-xl border border-[#E7EBE4] p-3"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg text-[13px] font-extrabold ${
                    item.brand
                      ? 'bg-[#E5F0E5] text-brand'
                      : 'bg-[#F7EDE4] text-accent'
                  }`}
                >
                  {item.n}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-extrabold">{item.name}</div>
                  <div className="mt-0.5 text-[12px] text-muted">{item.meta}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold">{item.score}</div>
                  <div
                    className={`text-[12px] font-bold ${
                      item.warn ? 'text-accent' : 'text-brand'
                    }`}
                  >
                    {item.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mb-6 rounded-2xl bg-[#17221D] p-6 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 text-[13px] font-bold uppercase tracking-[1.5px] text-[#B7C3BC]">
              Performance Insights
            </div>
            <h2 className="text-[19px] font-extrabold">Students are improving steadily</h2>
            <p className="mt-1 max-w-[650px] text-[13px] text-[#B7C3BC]">
              Overall performance has improved across the last 30 days, with Speaking and Reading
              showing the strongest gains.
            </p>
          </div>
          <span className="rounded-lg bg-[#315E4C] px-2.5 py-1 text-[12px] font-extrabold text-[#DCEBDD]">
            AI INSIGHT
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ['Strongest Skill', 'Reading', '82 average · +4.8 pts'],
            ['Priority Area', 'Writing', '75 average · lowest skill'],
            ['Biggest Improvement', 'Speaking', '+5.2 points this period'],
          ].map(([label, title, meta]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-[12px] font-bold uppercase tracking-wide text-[#9EACA4]">
                {label}
              </div>
              <div className="mt-1 text-lg font-extrabold">{title}</div>
              <div className="mt-1 text-[13px] text-[#9EACA4]">{meta}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-2 border-t border-[#DDE4DA] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[12px] text-muted">
          ElytEdu Analytics
          <span className="mx-2">•</span>
          Data updated 08 Sep 2026, 6:42 PM
        </div>
        <div className="text-[12px] text-muted">
          Based on <span className="font-bold text-dark">1,436 completed attempts</span>
        </div>
      </div>

      <Toast message={toast} visible={toastVisible} />
    </div>
  )
}
