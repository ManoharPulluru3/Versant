import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const INSTRUCTIONS = [
  {
    id: 'time',
    title: 'Stay within the time limit',
    description:
      'Each question has its own time limit. When time runs out, the assessment automatically moves forward.',
    tone: 'default',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    id: 'speak',
    title: 'Speak clearly',
    description:
      'For speaking questions, speak naturally and clearly into your microphone. Avoid background noise.',
    tone: 'default',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15a3 3 0 003-3V7a3 3 0 10-6 0v5a3 3 0 003 3z"
        />
        <path strokeLinecap="round" d="M19 11a7 7 0 01-14 0" />
      </svg>
    ),
  },
  {
    id: 'forward',
    title: 'Questions move forward',
    description:
      'You cannot go back to previous questions once you continue to the next one.',
    tone: 'default',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h12M6 20h12" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 4c0 3 4 4 4 8s-4 5-4 8M16 4c0 3-4 4-4 8s4 5 4 8"
        />
      </svg>
    ),
  },
  {
    id: 'yourself',
    title: 'Complete the assessment yourself',
    description:
      'Do not use external websites, translation tools or other assistance while taking the assessment.',
    tone: 'default',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4z" />
        <path strokeLinecap="round" d="M8 9h8M8 13h5" />
      </svg>
    ),
  },
  {
    id: 'refresh',
    title: 'Do not refresh or close the page',
    description:
      'Keep this assessment window open throughout the test. Your progress is saved as you move through the questions.',
    tone: 'warning',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
]

const CHECKS = [
  {
    id: 'check1',
    label: 'I understand that the assessment is timed.',
  },
  {
    id: 'check2',
    label: 'I understand that I cannot return to previous questions.',
  },
  {
    id: 'check3',
    label: 'I am ready to complete the assessment independently.',
  },
]

export default function TestInstructionsScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()
  const [checks, setChecks] = useState({
    check1: false,
    check2: false,
    check3: false,
  })

  const ready = useMemo(
    () => checks.check1 && checks.check2 && checks.check3,
    [checks],
  )

  function toggleCheck(id) {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="flex shrink-0 items-center justify-between px-5 pb-5 pt-6">
        <button
          type="button"
          onClick={() => navigate(`/tests/${testId}/device-check`)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white text-dark shadow-sm transition active:scale-95"
          aria-label="Go back"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand text-white">
            <svg className="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18l-1.5 3L9 19h7a4 4 0 004-4V7a4 4 0 00-4-4H8a4 4 0 00-4 4v7a4 4 0 002 4z"
              />
            </svg>
          </div>
          <span className="type-meta font-extrabold">ElytEdu</span>
        </div>

        <div className="text-right">
          <p className="type-label text-muted">Step</p>
          <p className="type-meta font-extrabold text-dark">2 of 4</p>
        </div>
      </header>

      <div className="px-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
          <div className="h-full w-1/2 rounded-full bg-brand" />
        </div>
      </div>

      <section className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-7">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-brand-light text-brand">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 3v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <h1 className="type-title mt-5">Before you begin</h1>
          <p className="type-body mx-auto mt-2 max-w-[315px] text-muted">
            Please read these instructions carefully. Your responses will be recorded and evaluated
            as part of your assessment.
          </p>
        </div>

        <div className="mt-7 rounded-[22px] border border-black/[0.05] bg-white p-4 soft-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="type-label text-brand">Your assessment</p>
              <h2 className="type-section mt-1">English Communication Test</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path strokeLinecap="round" d="M8 7h8M8 11h8M8 15h5" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-black/[0.05] border-t border-black/[0.05] pt-4">
            <div className="text-center">
              <p className="type-caption text-muted">Duration</p>
              <p className="type-meta mt-1 font-extrabold">30 min</p>
            </div>
            <div className="text-center">
              <p className="type-caption text-muted">Questions</p>
              <p className="type-meta mt-1 font-extrabold">40</p>
            </div>
            <div className="text-center">
              <p className="type-caption text-muted">Skills</p>
              <p className="type-meta mt-1 font-extrabold">4</p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <h3 className="type-section">Important instructions</h3>

          <div className="mt-3 space-y-2.5">
            {INSTRUCTIONS.map((item) => (
              <div
                key={item.id}
                className={`flex gap-3 rounded-[18px] border p-4 ${
                  item.tone === 'warning'
                    ? 'border-accent/10 bg-accent/[0.06]'
                    : 'border-black/[0.05] bg-white'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    item.tone === 'warning'
                      ? 'bg-accent/10 text-accent'
                      : 'bg-brand-light text-brand'
                  }`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="type-meta font-extrabold">{item.title}</p>
                  <p className="type-caption mt-1 leading-5 text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[20px] bg-brand-light/50 p-4">
          <p className="type-caption font-extrabold text-dark">Before continuing</p>
          <div className="mt-3 space-y-2">
            {CHECKS.map((item) => (
              <label key={item.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checks[item.id]}
                  onChange={() => toggleCheck(item.id)}
                  className="h-4 w-4 accent-brand"
                />
                <span className="type-caption text-muted">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="shrink-0 border-t border-black/[0.05] bg-surface/95 px-5 py-4 backdrop-blur-xl">
        <button
          type="button"
          disabled={!ready}
          onClick={() => navigate(`/tests/${testId}/overview`)}
          className={`type-btn flex h-[52px] w-full items-center justify-center gap-2 rounded-[18px] transition ${
            ready
              ? 'bg-brand text-white shadow-[0_8px_20px_rgba(31,107,79,0.20)] active:scale-[0.98]'
              : 'cursor-not-allowed bg-black/10 text-muted'
          }`}
        >
          Continue
          <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <p
          className={`mt-2 text-center type-caption font-semibold ${
            ready ? 'text-brand' : 'text-muted'
          }`}
        >
          {ready ? "You're ready to continue" : 'Confirm the instructions above to continue'}
        </p>
      </div>
    </div>
  )
}
