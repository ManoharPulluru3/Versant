import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TASKS = [
  {
    level: 'Upper Intermediate',
    to: 'faculty.coordinator@college.edu',
    situation:
      'You were unable to attend an important college workshop because you were unwell. Write an email to your faculty coordinator explaining the situation and asking whether you can receive the workshop materials.',
    requirements: [
      'Explain why you missed the workshop.',
      'Ask politely for the materials.',
      'Use an appropriate email tone.',
    ],
  },
]

const QUESTION_TIME = 180
const MAX_CHARS = 1200
const MIN_WORDS = 15

function formatSeconds(total) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function countWords(text) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 6" />
    </svg>
  )
}

export default function WritingEmailWritingScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const task = TASKS[0]
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [emailTo, setEmailTo] = useState(task.to)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [completed, setCompleted] = useState(false)

  const progress = 100
  const urgent = timeLeft <= 20
  const characters = body.length
  const words = countWords(body)
  const hasSubject = subject.trim().length > 0
  const hasBody = body.trim().length > 0
  const canContinue =
    hasSubject && hasBody && (completed || words >= MIN_WORDS)

  let statusLabel = 'Not started'
  let statusClass = 'text-accent'
  let bottomHint = 'Complete your email to continue'

  if (completed) {
    statusLabel = 'Completed'
    statusClass = 'text-brand'
    bottomHint = 'Your response has been saved'
  } else if (!hasSubject || !hasBody) {
    statusLabel = 'Not started'
    statusClass = 'text-accent'
    bottomHint = 'Complete your email to continue'
  } else if (words < MIN_WORDS) {
    statusLabel = 'In progress'
    statusClass = 'text-accent'
    bottomHint = 'Add more detail to your email'
  } else {
    statusLabel = 'Ready'
    statusClass = 'text-brand'
    bottomHint = 'Your email is ready to submit'
  }

  useEffect(() => {
    if (completed) return undefined

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [completed])

  function goBack() {
    if (
      (body.trim() || subject.trim()) &&
      !window.confirm('Your email may be lost. Are you sure you want to go back?')
    ) {
      return
    }
    navigate(`/tests/${testId}/assessment/writing-passage-reconstruction`)
  }

  function finishAssessment() {
    if (!canContinue) return
    navigate(`/tests/${testId}/completed`)
  }

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E9E0] bg-white transition hover:bg-[#F5F7F1]"
              aria-label="Go back"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light">
                <svg
                  className="h-5 w-5 text-brand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <div>
                <p className="type-label font-bold uppercase tracking-[0.12em] text-muted">
                  Writing
                </p>
                <p className="type-meta font-bold">Email Writing</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="type-caption font-semibold text-muted">Question</p>
            <p className="type-meta font-extrabold">1 of 1</p>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#E8ECE4]">
          <div
            className="progress-fill h-full rounded-full bg-brand"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 pt-7">
        <div className="mb-5 flex justify-end">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 ${
              urgent
                ? 'border-[#F5D5C0] bg-[#FFF1E8] timer-warning'
                : 'border-[#E9E5DD] bg-[#F5F2EC]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${urgent ? 'bg-[#C76A2A]' : 'bg-accent'}`} />
            <span
              className={`type-meta tabular-nums font-bold ${
                urgent ? 'text-[#C76A2A]' : 'text-dark'
              }`}
            >
              {formatSeconds(timeLeft)}
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 type-caption font-bold text-brand">
            Writing · Email Writing
          </div>
          <h1 className="type-title mt-4 tracking-tight">Write a professional email</h1>
          <p className="type-body mt-2 leading-relaxed text-muted">
            Read the situation carefully and write a clear, polite and well-organized email that
            addresses the task.
          </p>
        </div>

        <div className="mt-7 rounded-[28px] border border-[#E6EAE2] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream">
                <svg
                  className="h-5 w-5 text-brand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path strokeLinecap="round" d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <span className="type-meta font-extrabold">Email Task</span>
            </div>
            <span className="rounded-full bg-[#F5F2EC] px-2.5 py-1 type-caption font-bold text-muted">
              {task.level}
            </span>
          </div>

          <div className="mt-6">
            <p className="type-label font-bold uppercase tracking-[0.12em] text-muted">Situation</p>
            <p className="type-section mt-3 leading-7">{task.situation}</p>
          </div>

          <div className="mt-5 rounded-[22px] border border-[#E8ECE4] bg-[#F8F9F5] p-4">
            <p className="type-label font-bold uppercase tracking-[0.12em] text-muted">
              Your email should
            </p>
            <div className="mt-3 space-y-3">
              {task.requirements.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                    <CheckIcon />
                  </div>
                  <p className="type-body text-[#66706A]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span className="type-meta font-extrabold">Your email</span>
            </div>
            <span className="type-caption font-bold text-muted">
              {words} {words === 1 ? 'word' : 'words'}
            </span>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-[#DDE4DB] bg-white">
            <div className="flex items-center gap-4 border-b border-[#EDF0EA] px-5 py-3.5">
              <span className="w-12 shrink-0 type-meta font-bold text-muted">To</span>
              <input
                type="text"
                value={emailTo}
                disabled={completed}
                onChange={(event) => setEmailTo(event.target.value)}
                className="flex-1 bg-transparent type-meta text-dark focus:outline-none focus:shadow-[0_0_0_3px_rgba(31,107,79,0.10)] disabled:opacity-70"
              />
            </div>

            <div className="flex items-center gap-4 border-b border-[#EDF0EA] px-5 py-3.5">
              <span className="w-12 shrink-0 type-meta font-bold text-muted">Subject</span>
              <input
                type="text"
                value={subject}
                disabled={completed}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Enter a clear subject"
                className="flex-1 bg-transparent type-meta text-dark placeholder:text-[#A2AAA4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(31,107,79,0.10)] disabled:opacity-70"
              />
            </div>

            <textarea
              rows={10}
              maxLength={MAX_CHARS}
              value={body}
              disabled={completed}
              onChange={(event) => setBody(event.target.value)}
              placeholder={`Dear Sir/Madam,\n\nWrite your email here...`}
              className={`w-full resize-none bg-transparent px-5 py-5 type-body leading-7 text-dark placeholder:text-[#A2AAA4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(31,107,79,0.10)] ${
                completed ? 'bg-[#F8F9F5]' : ''
              }`}
            />

            <div className="flex items-center justify-between border-t border-[#EDF0EA] bg-surface px-4 py-3.5">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" d="M4 6h16" />
                  <path strokeLinecap="round" d="M4 12h16" />
                  <path strokeLinecap="round" d="M4 18h10" />
                </svg>
                <span className="type-caption text-muted">Write clearly and professionally</span>
              </div>
              <span className="type-caption font-semibold text-muted">
                {characters} / {MAX_CHARS}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl border border-[#E8ECE4] bg-[#F8F9F5] px-3 py-3">
              <p className="type-label font-bold uppercase tracking-wide text-[#9AA29C]">Words</p>
              <p className="type-meta mt-1 font-extrabold">{words}</p>
            </div>
            <div className="rounded-2xl border border-[#E8ECE4] bg-[#F8F9F5] px-3 py-3">
              <p className="type-label font-bold uppercase tracking-wide text-[#9AA29C]">
                Characters
              </p>
              <p className="type-meta mt-1 font-extrabold">{characters}</p>
            </div>
            <div className="rounded-2xl border border-[#E8ECE4] bg-[#F8F9F5] px-3 py-3">
              <p className="type-label font-bold uppercase tracking-wide text-[#9AA29C]">Status</p>
              <p className={`type-meta mt-1 font-extrabold ${statusClass}`}>{statusLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-brand-light bg-cream p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
              <svg
                className="h-4 w-4 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 10v6" />
                <path strokeLinecap="round" d="M12 7h.01" />
              </svg>
            </div>
            <div>
              <p className="type-meta font-extrabold">Email writing tip</p>
              <p className="type-body mt-1 leading-relaxed text-[#66706A]">
                Use a suitable greeting, explain the situation clearly, make your request politely,
                and finish with an appropriate closing.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="shrink-0 border-t border-[#E8ECE4] bg-surface/95 px-5 py-4 backdrop-blur-md">
        <button
          type="button"
          disabled={!canContinue}
          onClick={finishAssessment}
          className={`type-btn flex h-12 w-full items-center justify-center rounded-2xl transition ${
            canContinue
              ? 'cursor-pointer bg-brand text-white hover:bg-[#18583F] active:scale-[0.98]'
              : 'cursor-not-allowed bg-[#E3E7E1] text-[#9AA29C]'
          }`}
        >
          Finish Assessment
        </button>
        <p
          className={`type-caption mt-2 text-center font-semibold ${
            canContinue ? 'text-brand' : 'text-muted'
          }`}
        >
          {bottomHint}
        </p>
      </div>
    </div>
  )
}
