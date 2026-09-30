import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SKILL_CARDS = [
  { name: 'Speaking', score: 97, label: 'Excellent', brand: true },
  { name: 'Listening', score: 96, label: 'Strong', brand: false },
  { name: 'Reading', score: 98, label: 'Excellent', brand: true },
  { name: 'Writing', score: 99, label: 'Strong', brand: false },
]

const SKILL_BREAKDOWN = [
  {
    name: 'Speaking',
    score: 97,
    brand: true,
    metrics: [
      ['Fluency', 96],
      ['Pronunciation', 98],
      ['Vocabulary', 95],
      ['Grammar', 97],
    ],
  },
  {
    name: 'Listening',
    score: 96,
    brand: false,
    metrics: [
      ['Main Idea', 98],
      ['Key Details', 95],
      ['Context', 96],
      ['Accuracy', 94],
    ],
  },
  {
    name: 'Reading',
    score: 98,
    brand: true,
    metrics: [
      ['Comprehension', 99],
      ['Vocabulary', 97],
      ['Inference', 98],
      ['Accuracy', 98],
    ],
  },
  {
    name: 'Writing',
    score: 99,
    brand: false,
    metrics: [
      ['Grammar', 99],
      ['Vocabulary', 98],
      ['Clarity', 100],
      ['Organization', 99],
    ],
  },
]

const QUESTION_TYPES = [
  { type: 'Read Aloud', skill: 'Speaking', brand: true, q: 2, accuracy: '100%', score: 98, status: 'EXCELLENT' },
  { type: 'Repeat', skill: 'Speaking', brand: true, q: 2, accuracy: '96%', score: 95, status: 'EXCELLENT' },
  { type: 'Passage Comprehension', skill: 'Listening', brand: false, q: 2, accuracy: '95%', score: 94, status: 'STRONG' },
  { type: 'Reading Comprehension', skill: 'Reading', brand: true, q: 2, accuracy: '100%', score: 99, status: 'EXCELLENT' },
  { type: 'Email Writing', skill: 'Writing', brand: false, q: 2, accuracy: '98%', score: 98, status: 'EXCELLENT' },
]

const STRENGTHS = [
  'Clear and consistent pronunciation.',
  'Strong comprehension of spoken content.',
  'Excellent reading accuracy and vocabulary.',
  'Well-structured written responses.',
]

const DEVELOPMENT = [
  'Continue expanding advanced vocabulary.',
  'Practice spontaneous responses under time pressure.',
  'Maintain consistency in extended speaking tasks.',
]

const FOCUS = [
  {
    n: 1,
    title: 'Advanced speaking practice',
    desc: 'Focus on spontaneous and extended responses.',
    brand: true,
  },
  {
    n: 2,
    title: 'Expand academic vocabulary',
    desc: 'Continue building advanced vocabulary range.',
    brand: false,
  },
  {
    n: 3,
    title: 'Maintain current level',
    desc: 'Continue regular communication practice.',
    brand: true,
  },
]

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-7 right-7 z-[100] transition-all duration-300 print:hidden ${
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

export default function AdminStudentDetailedReportScreen() {
  const navigate = useNavigate()
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (!toast) return undefined
    setToastVisible(true)
    const timer = setTimeout(() => {
      setToastVisible(false)
      setTimeout(() => setToast(''), 300)
    }, 2600)
    return () => clearTimeout(timer)
  }, [toast])

  function showToast(message) {
    setToast(message)
  }

  return (
    <div className="w-full p-6 sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[14px] text-muted">
            <Link to="/admin/results" className="hover:text-brand">
              Results
            </Link>
            <span>/</span>
            <span>Student Detailed Report</span>
          </div>
          <h1 className="text-[27px] font-extrabold tracking-tight">Student Detailed Report</h1>
          <p className="mt-1 text-sm text-muted">
            Detailed evaluation of communication skills and assessment performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => navigate('/admin/results')}
            className="h-10 rounded-xl border border-[#E1E6DE] bg-white px-3 text-[13px] font-bold hover:bg-[#F4F6F1]"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => showToast('Previous student')}
            className="h-11 w-11 rounded-xl border border-[#E1E6DE] bg-surface text-muted"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => showToast('Next student')}
            className="h-11 w-11 rounded-xl border border-[#E1E6DE] bg-surface text-muted"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#E1E6DE] bg-white px-3 text-[13px] font-bold hover:bg-[#F4F6F1]"
          >
            Print
          </button>
          <button
            type="button"
            onClick={() => showToast('PDF report prepared')}
            className="flex h-10 items-center gap-2 rounded-xl bg-brand px-3 text-[13px] font-bold text-white hover:bg-[#195A43]"
          >
            Export PDF
          </button>
        </div>
      </div>

      <section className="mb-6 overflow-hidden rounded-3xl border border-[#E1E7DD] bg-surface">
        <div className="h-2 bg-brand" />
        <div className="p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-[#DCEBDD] text-xl font-extrabold text-brand">
                EW
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[23px] font-extrabold">Emma Wilson</h2>
                  <span className="rounded-md bg-[#E5F0E5] px-2 py-1 text-[12px] font-extrabold uppercase text-brand">
                    Passed
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                  <span>
                    Student ID: <strong className="text-dark">24CS001</strong>
                  </span>
                  <span>
                    Batch: <strong className="text-dark">CSE 3A</strong>
                  </span>
                  <span>
                    Department: <strong className="text-dark">Computer Science</strong>
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                  <span>
                    Attempted: <strong className="text-dark">08 Sep 2026</strong>
                  </span>
                  <span>
                    Duration: <strong className="text-dark">27m 42s</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-7">
              <div className="text-right">
                <div className="text-[13px] font-bold uppercase tracking-[1.3px] text-muted">
                  Proficiency
                </div>
                <div className="mt-1 text-[24px] font-extrabold text-brand">C2</div>
                <div className="text-[13px] text-muted">Proficient</div>
              </div>
              <div className="hidden h-16 w-px bg-[#E3E8DE] sm:block" />
              <div className="min-w-[110px] text-center">
                <div className="text-[13px] font-bold uppercase tracking-[1.3px] text-muted">
                  Overall Score
                </div>
                <div className="mt-2 text-[48px] font-extrabold leading-none text-brand">98</div>
                <div className="mt-1 text-[13px] text-muted">out of 100</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {SKILL_CARDS.map((skill) => (
          <div key={skill.name} className="rounded-2xl border border-[#E1E7DD] bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold">{skill.name}</span>
              <span className="text-[13px] font-bold text-[#4C8A67]">{skill.label}</span>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-[34px] font-extrabold leading-none">{skill.score}</span>
              <span className="mb-1 text-[13px] text-muted">/ 100</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E9EDE6]">
              <div
                className={`h-full rounded-full ${skill.brand ? 'bg-brand' : 'bg-accent'}`}
                style={{ width: `${skill.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-extrabold">Skill Breakdown</h2>
                <p className="mt-1 text-[13px] text-muted">
                  Detailed performance across evaluated communication dimensions.
                </p>
              </div>
              <span className="rounded-lg bg-[#E5F0E5] px-2.5 py-1 text-[12px] font-extrabold text-brand">
                AI EVALUATED
              </span>
            </div>

            {SKILL_BREAKDOWN.map((skill, index) => (
              <div
                key={skill.name}
                className={
                  index < SKILL_BREAKDOWN.length - 1
                    ? 'border-b border-[#E7EBE4] py-6 first:pb-6 first:pt-0'
                    : 'pt-6'
                }
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-extrabold">{skill.name}</span>
                  <span
                    className={`text-lg font-extrabold ${skill.brand ? 'text-brand' : 'text-accent'}`}
                  >
                    {skill.score}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {skill.metrics.map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-[13px]">
                        <span className="font-semibold">{label}</span>
                        <span className="font-bold">{value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#E9EDE6]">
                        <div
                          className={`h-full rounded-full ${skill.brand ? 'bg-brand' : 'bg-accent'}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6">
            <div className="mb-5">
              <h2 className="text-[16px] font-extrabold">Performance by Question Type</h2>
              <p className="mt-1 text-[13px] text-muted">
                How the student performed across different assessment activities.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-[#E5EAE2]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left">
                  <thead className="border-b border-[#E5EAE2] bg-[#F5F7F2]">
                    <tr className="text-[12px] font-extrabold uppercase tracking-[1px] text-muted">
                      {['Question Type', 'Skill', 'Questions', 'Accuracy', 'Score', 'Status'].map(
                        (h) => (
                          <th key={h} className="px-4 py-3">
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EDE6]">
                    {QUESTION_TYPES.map((row) => (
                      <tr key={row.type} className="hover:bg-[#FAFBF8]">
                        <td className="px-4 py-3 text-[13px] font-bold">{row.type}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[12px] font-bold ${
                              row.brand ? 'text-brand' : 'text-accent'
                            }`}
                          >
                            {row.skill}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px]">{row.q}</td>
                        <td className="px-4 py-3 text-[13px] font-bold">{row.accuracy}</td>
                        <td className="px-4 py-3 text-[13px] font-extrabold">{row.score}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-[#E5F0E5] px-2 py-1 text-[12px] font-extrabold text-brand">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-6">
            <div className="mb-5">
              <h2 className="text-[16px] font-extrabold">Evaluation Insights</h2>
              <p className="mt-1 text-[13px] text-muted">
                Key observations generated from the student&apos;s responses.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F0F5EE] p-4">
                <div className="mb-2 text-[13px] font-extrabold">Strengths</div>
                <ul className="space-y-2 text-[14px] leading-relaxed text-muted">
                  {STRENGTHS.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-brand">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-[#FBF3EC] p-4">
                <div className="mb-2 text-[13px] font-extrabold">Development Areas</div>
                <ul className="space-y-2 text-[14px] leading-relaxed text-muted">
                  {DEVELOPMENT.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-5">
            <h2 className="text-[15px] font-extrabold">Assessment</h2>
            <p className="mt-1 text-[13px] text-muted">Attempt information</p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-wide text-muted">
                  Assessment
                </div>
                <div className="mt-1 text-[13px] font-bold">English Communication Test</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Questions', '40'],
                  ['Duration', '30 min'],
                  ['Attempt', '1 of 1'],
                  ['Completed', '08 Sep 2026'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[12px] font-bold uppercase tracking-wide text-muted">
                      {label}
                    </div>
                    <div className="mt-1 text-[13px] font-extrabold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-5">
            <h2 className="text-[15px] font-extrabold">Score Benchmark</h2>
            <p className="mt-1 text-[13px] text-muted">Student vs batch performance</p>
            <div className="mt-5 space-y-5">
              {[
                ['Emma Wilson', 98, 'bg-brand', 'text-brand'],
                ['CSE 3A Average', 82, 'bg-[#9DBCA5]', ''],
                ['College Average', 79, 'bg-[#C7D3C9]', ''],
              ].map(([label, score, bar, text]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-bold">{label}</span>
                    <span className={`text-[13px] font-extrabold ${text}`}>{score}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E9EDE6]">
                    <div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#E7EBE4] pt-4">
              <span className="text-[13px] text-muted">Above batch average</span>
              <span className="text-[13px] font-extrabold text-brand">+16 pts</span>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-extrabold">Proficiency Level</h2>
                <p className="mt-1 text-[13px] text-muted">Overall language proficiency</p>
              </div>
              <span className="rounded-md bg-[#E5F0E5] px-2 py-1 text-[12px] font-extrabold text-brand">
                C2
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-[#E8ECE6]">
              <div className="absolute left-0 top-0 h-full w-[16%] bg-[#D5DDD5]" />
              <div className="absolute left-[16%] top-0 h-full w-[17%] bg-[#C3D2C5]" />
              <div className="absolute left-[33%] top-0 h-full w-[17%] bg-[#AFC5B3]" />
              <div className="absolute left-[50%] top-0 h-full w-[17%] bg-[#89AA91]" />
              <div className="absolute left-[67%] top-0 h-full w-[17%] bg-[#609176]" />
              <div className="absolute left-[84%] top-0 h-full w-[16%] bg-brand" />
              <div className="absolute right-[1px] top-[-3px] h-5 w-5 rounded-full border-[3px] border-brand bg-white shadow" />
            </div>
            <div className="mt-3 flex justify-between text-[12px] font-bold text-muted">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-[#F0F5EE] p-4">
              <div className="text-[13px] font-bold uppercase tracking-wide text-muted">
                Interpretation
              </div>
              <div className="mt-1 text-sm font-extrabold text-brand">Proficient English User</div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Can communicate effectively and precisely in academic and professional contexts.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E1E7DD] bg-surface p-5">
            <h2 className="text-[15px] font-extrabold">Recommended Focus</h2>
            <p className="text-[13px] text-muted">Suggested next steps</p>
            <div className="mt-4 space-y-3">
              {FOCUS.map((item) => (
                <div key={item.n} className="flex items-start gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg text-[12px] font-extrabold ${
                      item.brand
                        ? 'bg-[#E5F0E5] text-brand'
                        : 'bg-[#F7EDE4] text-accent'
                    }`}
                  >
                    {item.n}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">{item.title}</div>
                    <div className="mt-0.5 text-[13px] text-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-[#17221D] p-5 text-white print:hidden">
            <div className="text-sm font-extrabold">Report Actions</div>
            <p className="mt-1 text-[13px] text-[#B7C3BC]">Share or manage this student&apos;s report.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => showToast('Report shared')}
                className="h-10 rounded-xl bg-white/10 text-[13px] font-bold hover:bg-white/15"
              >
                Share Report
              </button>
              <button
                type="button"
                onClick={() => showToast('Report downloaded')}
                className="h-10 rounded-xl bg-white text-[13px] font-bold text-dark"
              >
                Download
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2 border-t border-[#DDE4DA] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[12px] text-muted">
          Generated by ElytEdu Assessment Platform
          <span className="mx-2">•</span>
          08 Sep 2026
        </div>
        <div className="text-[12px] text-muted">
          Report ID: <span className="font-bold text-dark">RPT-24CS001-090826</span>
        </div>
      </div>

      <Toast message={toast} visible={toastVisible} />
    </div>
  )
}
