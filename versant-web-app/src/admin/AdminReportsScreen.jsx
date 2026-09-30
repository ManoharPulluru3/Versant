import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const QUICK_REPORTS = [
  {
    title: 'Assessment Results',
    desc: 'Scores, attempts, completion and proficiency.',
    iconBg: 'bg-[#E2EFE4] text-brand',
  },
  {
    title: 'Student Performance',
    desc: 'Individual student scorecards and detailed reports.',
    iconBg: 'bg-[#F5EADF] text-accent',
  },
  {
    title: 'Department Report',
    desc: 'Compare departments, batches and classes.',
    iconBg: 'bg-[#EAE8F3] text-[#69608D]',
  },
  {
    title: 'Skill Analysis',
    desc: 'Speaking, Listening, Reading and Writing analysis.',
    iconBg: 'bg-[#E8EFE9] text-brand',
  },
]

const REPORTS = [
  {
    name: 'September Assessment Results',
    id: 'RPT-SEP-2026-001',
    type: 'Assessment',
    records: '1,024',
    generated: '08 Sep, 6:42 PM',
    format: 'XLSX',
    formatClass: 'bg-[#E9F1EA] text-brand',
    iconBg: 'bg-[#E6EFE7] text-brand',
  },
  {
    name: 'Student Performance — CSE 3A',
    id: 'RPT-CSE3A-090826',
    type: 'Student',
    records: '124',
    generated: '08 Sep, 5:18 PM',
    format: 'PDF',
    formatClass: 'bg-[#F1ECE7] text-[#8A674D]',
    iconBg: 'bg-[#F4EADF] text-accent',
  },
  {
    name: 'Department Performance Report',
    id: 'RPT-DEPT-090826',
    type: 'Department',
    records: '1,248',
    generated: '07 Sep, 4:12 PM',
    format: 'XLSX',
    formatClass: 'bg-[#E9F1EA] text-brand',
    iconBg: 'bg-[#EAE8F3] text-[#69608D]',
  },
  {
    name: 'Skill Performance Analysis',
    id: 'RPT-SKILL-090826',
    type: 'Skill',
    records: '1,436',
    generated: '06 Sep, 2:40 PM',
    format: 'PDF',
    formatClass: 'bg-[#F1ECE7] text-[#8A674D]',
    iconBg: 'bg-[#E6EFE7] text-brand',
  },
  {
    name: 'Monthly Executive Summary',
    id: 'RPT-EXEC-AUG26',
    type: 'Executive',
    records: '1,248',
    generated: '01 Sep, 9:00 AM',
    format: 'PDF',
    formatClass: 'bg-[#F1ECE7] text-[#8A674D]',
    iconBg: 'bg-[#F4EADF] text-accent',
  },
]

const SCHEDULED = [
  {
    title: 'Weekly Performance',
    when: 'Every Monday · 9:00 AM',
    to: 'To: Principal Office',
    active: true,
    action: 'Manage',
  },
  {
    title: 'Monthly Executive Summary',
    when: '1st of every month · 9:00 AM',
    to: 'To: Management',
    active: true,
    action: 'Manage',
  },
  {
    title: 'Assessment Completion',
    when: 'Every Friday · 5:00 PM',
    to: 'Paused',
    active: false,
    action: 'Resume',
  },
]

const EXPORTS = [
  { title: 'Student Data', meta: '1,248 students', format: 'CSV', iconBg: 'bg-[#E7EFE8] text-brand' },
  {
    title: 'Assessment Results',
    meta: '1,436 attempts',
    format: 'XLSX',
    iconBg: 'bg-[#F3EADD] text-accent',
  },
  {
    title: 'Detailed Reports',
    meta: 'Student report bundle',
    format: 'ZIP',
    iconBg: 'bg-[#EAE8F3] text-[#69608D]',
  },
]

const RANGES = ['Last 7 Days', 'Last 30 Days', 'Custom']
const FORMATS = [
  { value: 'PDF', desc: 'Presentation ready' },
  { value: 'XLSX', desc: 'Analysis ready' },
  { value: 'CSV', desc: 'Raw data' },
]

function Toast({ message, visible }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-6 right-6 z-[70] rounded-xl bg-[#183E30] px-4 py-3 text-[14px] font-bold text-white shadow-xl transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      {message}
    </div>
  )
}

export default function AdminReportsScreen() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [reportType, setReportType] = useState('Assessment Results')
  const [assessment, setAssessment] = useState('All Assessments')
  const [department, setDepartment] = useState('All Departments')
  const [range, setRange] = useState('Last 7 Days')
  const [format, setFormat] = useState('PDF')
  const [includeBreakdown, setIncludeBreakdown] = useState(true)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return REPORTS
    return REPORTS.filter((row) =>
      `${row.name} ${row.id} ${row.type} ${row.format}`.toLowerCase().includes(q),
    )
  }, [search])

  useEffect(() => {
    if (!toast) return undefined
    setToastVisible(true)
    const timer = setTimeout(() => {
      setToastVisible(false)
      setTimeout(() => setToast(''), 300)
    }, 2800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setCreateOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function showToast(message) {
    setToast(message)
  }

  function openCreate(type) {
    if (type) setReportType(type)
    setCreateOpen(true)
  }

  function generateReport() {
    setCreateOpen(false)
    setTimeout(() => showToast(`${reportType} generated successfully`), 250)
  }

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#E3EFE5] px-2.5 py-1 text-[13px] font-extrabold uppercase tracking-[1px] text-brand">
              Reporting
            </span>
            <span className="text-[14px] text-muted">Updated 08 Sep 2026</span>
          </div>
          <div className="mb-1 text-[14px] font-semibold text-muted">
            <Link to="/admin/reports" className="hover:text-brand">
              Reports
            </Link>
            <span className="mx-1.5">/</span>
            Export
          </div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.8px]">Reports & Export</h1>
          <p className="mt-1 text-[15px] text-muted">
            Generate, download and schedule academic performance reports.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[15px] font-extrabold text-white shadow-sm hover:opacity-95"
        >
          + Create Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_REPORTS.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => openCreate(card.title === 'Department Report' ? 'Department Performance' : card.title)}
            className="group rounded-2xl border border-[#E2E7DF] bg-surface p-5 text-left shadow-[0_18px_50px_rgba(31,107,79,0.07)] transition hover:-translate-y-0.5 hover:border-[#C9D9CB]"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
                •
              </div>
              <span className="text-[#A7AEA9] transition group-hover:translate-x-1 group-hover:text-brand">
                →
              </span>
            </div>
            <div className="text-[16px] font-extrabold">{card.title}</div>
            <div className="mt-1 text-[14px] leading-5 text-muted">{card.desc}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#E2E7DF] bg-surface shadow-[0_18px_50px_rgba(31,107,79,0.07)]">
            <div className="flex flex-col gap-3 border-b border-[#E7EBE5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[15px] font-extrabold">Recent Reports</div>
                <div className="mt-0.5 text-[14px] text-muted">Previously generated reports</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-2.5 text-muted"
                    width="19" height="19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3-3" strokeLinecap="round" />
                  </svg>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search reports..."
                    className="h-10 w-[190px] rounded-lg border border-[#DDE4DC] bg-white pl-9 pr-3 text-[14px] outline-none focus:border-brand"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Filter options opened')}
                  className="flex h-10 items-center gap-2 rounded-lg border border-[#DDE4DC] bg-white px-3 text-[14px] font-bold text-[#66716A]"
                >
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-[#E7EBE5] bg-[#F7F8F4] text-left">
                    {['Report', 'Type', 'Records', 'Generated', 'Format', 'Action'].map((h, i) => (
                      <th
                        key={h}
                        className={`py-3 text-[13px] font-extrabold uppercase tracking-[.8px] text-muted ${
                          i === 0 ? 'px-6' : i === 5 ? 'px-6 text-right' : 'px-4'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, index) => (
                    <tr
                      key={row.id}
                      className={
                        index < filtered.length - 1 ? 'border-b border-[#EDF0EB]' : ''
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-lg ${row.iconBg}`}
                          >
                            •
                          </div>
                          <div>
                            <div className="text-[15px] font-extrabold">{row.name}</div>
                            <div className="text-[13px] text-muted">{row.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[14px] font-semibold">{row.type}</td>
                      <td className="px-4 py-4 text-[14px] font-semibold">{row.records}</td>
                      <td className="px-4 py-4 text-[14px] text-muted">{row.generated}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-md px-2 py-1 text-[12px] font-extrabold ${row.formatClass}`}
                        >
                          {row.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => showToast(`Preparing "${row.name}" for download`)}
                          className="rounded-lg p-2 text-muted hover:bg-[#EFF3EE] hover:text-brand"
                          title="Download"
                        >
                          ↓
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-[14px] text-muted">
                        No reports match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#E7EBE5] px-6 py-4">
              <div className="text-[13px] text-muted">
                Showing {filtered.length} of 18 reports
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`h-7 w-7 rounded-lg text-[13px] font-bold ${
                      page === n ? 'bg-brand text-white' : 'text-muted hover:bg-[#EFF3EE]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-6 shadow-[0_18px_50px_rgba(31,107,79,0.07)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-extrabold">Export Center</div>
                <div className="mt-0.5 text-[14px] text-muted">
                  Download raw assessment and student data.
                </div>
              </div>
              <span className="rounded-full bg-[#EEF3ED] px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[.8px] text-brand">
                Bulk Export
              </span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {EXPORTS.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => showToast(`${item.title} export started`)}
                  className="rounded-xl border border-[#E1E6DF] bg-white p-4 text-left hover:border-[#C7D7CA] hover:bg-[#FAFCF9]"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.iconBg}`}
                    >
                      •
                    </div>
                    <span className="text-[12px] font-bold text-muted">{item.format}</span>
                  </div>
                  <div className="mt-3 text-[15px] font-extrabold">{item.title}</div>
                  <div className="mt-1 text-[13px] text-muted">{item.meta}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-5 shadow-[0_18px_50px_rgba(31,107,79,0.07)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[16px] font-extrabold">Scheduled Reports</div>
                <div className="mt-0.5 text-[13px] text-muted">Automated delivery</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReportType('Executive Summary')
                  setCreateOpen(true)
                  showToast('Configure the report before scheduling')
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDE4DC] text-muted hover:bg-[#F2F5F0] hover:text-brand"
              >
                +
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {SCHEDULED.map((item) => (
                <div key={item.title} className="rounded-xl border border-[#E5E9E3] bg-white p-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[14px] font-extrabold">{item.title}</div>
                      <div className="mt-1 text-[12px] text-muted">{item.when}</div>
                    </div>
                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${
                        item.active ? 'bg-brand' : 'bg-[#D7DDD7]'
                      }`}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-muted">{item.to}</span>
                    <button
                      type="button"
                      onClick={() =>
                        showToast(
                          item.action === 'Resume'
                            ? 'Schedule resumed'
                            : 'Schedule options opened',
                        )
                      }
                      className="text-[12px] font-extrabold text-brand"
                    >
                      {item.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-5 shadow-[0_18px_50px_rgba(31,107,79,0.07)]">
            <div className="text-[16px] font-extrabold">Report Statistics</div>
            <div className="mt-0.5 text-[13px] text-muted">This month</div>
            <div className="mt-5 space-y-4">
              {[
                ['Reports Generated', '42', '78%', 'bg-brand'],
                ['Exports Downloaded', '128', '86%', 'bg-accent'],
                ['Scheduled Deliveries', '18', '62%', 'bg-[#69608D]'],
              ].map(([label, value, width, bar]) => (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-[13px] font-semibold text-muted">{label}</span>
                    <span className="text-[14px] font-extrabold">{value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#E8ECE7]">
                    <div className={`h-full rounded-full ${bar}`} style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#183E30] p-5 text-white shadow-[0_18px_50px_rgba(31,107,79,0.07)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">i</div>
            <div className="mt-4 text-[15px] font-extrabold">Reports are ready to share</div>
            <div className="mt-1.5 text-[13px] leading-5 text-white/65">
              Generate PDF reports for management or export detailed datasets for further analysis.
            </div>
            <button
              type="button"
              onClick={() => openCreate()}
              className="mt-4 flex items-center gap-2 text-[13px] font-extrabold text-white"
            >
              Create a custom report →
            </button>
          </div>
        </div>
      </div>

      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14231D]/35 px-5 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateOpen(false)
          }}
        >
          <div className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-[#DFE6DE] bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7EBE5] px-6 py-5">
              <div>
                <div className="text-[16px] font-extrabold">Create Report</div>
                <div className="mt-0.5 text-[13px] text-muted">
                  Configure the report you want to generate.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-[#EFF2ED]"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-[13px] font-extrabold uppercase tracking-[.7px] text-muted">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-[15px] font-semibold outline-none focus:border-brand"
                >
                  <option>Assessment Results</option>
                  <option>Student Performance</option>
                  <option>Department Performance</option>
                  <option>Skill Analysis</option>
                  <option>Executive Summary</option>
                  <option>Assessment Completion</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-extrabold uppercase tracking-[.7px] text-muted">
                    Assessment
                  </label>
                  <select
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-[15px] font-semibold outline-none focus:border-brand"
                  >
                    <option>All Assessments</option>
                    <option>English Communication Test</option>
                    <option>Communication Baseline</option>
                    <option>Placement Readiness</option>
                    <option>Business English</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-extrabold uppercase tracking-[.7px] text-muted">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-[15px] font-semibold outline-none focus:border-brand"
                  >
                    <option>All Departments</option>
                    <option>Computer Science</option>
                    <option>ECE</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                    <option>IT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-extrabold uppercase tracking-[.7px] text-muted">
                  Date Range
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RANGES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRange(item)}
                      className={`rounded-xl py-2.5 text-[14px] font-extrabold ${
                        range === item
                          ? 'border border-brand bg-[#E6F0E8] text-brand'
                          : 'border border-[#DDE4DC] bg-white font-bold text-muted'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-extrabold uppercase tracking-[.7px] text-muted">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFormat(item.value)}
                      className={`rounded-xl border p-3 text-center ${
                        format === item.value
                          ? 'border-brand bg-[#EAF2EB]'
                          : 'border-[#DDE4DC] bg-white'
                      }`}
                    >
                      <div className="text-[15px] font-extrabold">{item.value}</div>
                      <div className="mt-0.5 text-[12px] text-muted">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E1E6DF] bg-[#F8F9F5] p-3.5">
                <input
                  type="checkbox"
                  checked={includeBreakdown}
                  onChange={(e) => setIncludeBreakdown(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-brand"
                />
                <div>
                  <div className="text-[14px] font-extrabold">Include detailed breakdown</div>
                  <div className="mt-0.5 text-[12px] text-muted">
                    Include skill scores, question types and proficiency distribution.
                  </div>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#E7EBE5] bg-[#FAFBF8] px-6 py-4">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-xl border border-[#DDE4DC] bg-white px-4 py-2.5 text-[14px] font-bold text-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={generateReport}
                className="rounded-xl bg-brand px-5 py-2.5 text-[14px] font-extrabold text-white"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} visible={toastVisible} />
    </div>
  )
}
