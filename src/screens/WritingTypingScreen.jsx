import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const PROMPTS = [
  {
    topic: 'Everyday Life',
    prompt:
      'Describe how you usually spend your weekends and explain what you enjoy most about them.',
  },
  {
    topic: 'Work & Study',
    prompt:
      'Explain a challenge you faced while learning something new and how you handled it.',
  },
]

const QUESTION_TIME = 90
const MAX_CHARS = 600
const MIN_WORDS = 5

function formatSeconds(total) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function countWords(text) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0
}

export default function WritingTypingScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const [promptIndex, setPromptIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [timerKey, setTimerKey] = useState(0)
  const [response, setResponse] = useState('')
  const [completed, setCompleted] = useState(false)

  const totalPrompts = PROMPTS.length
  const current = PROMPTS[promptIndex]
  const questionNumber = promptIndex + 1
  const progress = Math.round((questionNumber / totalPrompts) * 100)
  const urgent = timeLeft <= 20

  const characters = response.length
  const words = countWords(response)
  const canContinue =
    response.trim().length > 0 && (completed || words >= MIN_WORDS)

  let statusLabel = 'Not started'
  let statusClass = 'text-accent'
  let bottomHint = 'Write your response to continue'

  if (completed) {
    statusLabel = 'Completed'
    statusClass = 'text-brand'
    bottomHint = 'Response saved. You can continue.'
  } else if (characters === 0) {
    statusLabel = 'Not started'
    statusClass = 'text-accent'
    bottomHint = 'Write your response to continue'
  } else if (words < MIN_WORDS) {
    statusLabel = 'In progress'
    statusClass = 'text-accent'
    bottomHint = 'Continue writing your response'
  } else {
    statusLabel = 'Ready'
    statusClass = 'text-brand'
    bottomHint = 'Your response is ready'
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
  }, [timerKey, completed])

  function resetPromptState() {
    setTimeLeft(QUESTION_TIME)
    setTimerKey((key) => key + 1)
    setResponse('')
    setCompleted(false)
  }

  function goBack() {
    if (response.trim() && !window.confirm('Your response may be lost. Are you sure you want to go back?')) {
      return
    }
    navigate(`/tests/${testId}/assessment/reading-sentence-completion`)
  }

  function continueAssessment() {
    if (!canContinue) return

    if (promptIndex >= totalPrompts - 1) {
      navigate(`/tests/${testId}/assessment/writing-dictation`)
      return
    }

    setPromptIndex((prev) => prev + 1)
    resetPromptState()
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
                  />
                </svg>
              </div>
              <div>
                <p className="type-label font-bold uppercase tracking-[0.12em] text-muted">Writing</p>
                <p className="type-meta font-bold">Typing</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="type-caption font-semibold text-muted">Question</p>
            <p className="type-meta font-extrabold">
              {questionNumber} of {totalPrompts}
            </p>
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
              urgent ? 'border-[#F5D5C0] bg-[#FFF1E8]' : 'border-[#E9E5DD] bg-[#F5F2EC]'
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
            Writing · Typing
          </div>
          <h1 className="type-title mt-4 tracking-tight">Type your response</h1>
          <p className="type-body mt-2 leading-relaxed text-muted">
            Read the prompt carefully and type a clear, complete response. Focus on grammar,
            vocabulary and sentence structure.
          </p>
        </div>

        <div className="mt-7 rounded-[28px] border border-[#E6EAE2] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream">
                <svg
                  className="h-4 w-4 text-brand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
                </svg>
              </div>
              <span className="type-meta font-extrabold">Writing Prompt</span>
            </div>
            <span className="rounded-full bg-[#F5F2EC] px-2.5 py-1 type-caption font-bold text-muted">
              {current.topic}
            </span>
          </div>

          <div className="mt-6">
            <p className="type-label font-bold uppercase tracking-[0.12em] text-muted">Prompt</p>
            <p className="type-section mt-3 leading-relaxed">{current.prompt}</p>
          </div>

          <div className="mt-5 rounded-2xl border border-[#E8ECE4] bg-[#F8F9F5] p-4">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 10v6" />
                <path strokeLinecap="round" d="M12 7h.01" />
              </svg>
              <p className="type-body leading-relaxed text-[#66706A]">
                Write in complete sentences. Organize your ideas clearly and use your own words.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span className="type-meta font-extrabold">Your response</span>
            </div>
            <span className="type-caption font-bold text-muted">
              {words} {words === 1 ? 'word' : 'words'}
            </span>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-[#DDE4DB] bg-white">
            <textarea
              rows={8}
              maxLength={MAX_CHARS}
              value={response}
              disabled={completed}
              onChange={(event) => setResponse(event.target.value)}
              placeholder="Start typing your response here..."
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
                  />
                </svg>
                <span className="type-caption text-muted">Type naturally</span>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 18h5M10 21h4" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.5 14.5C7.55 13.7 7 12.45 7 11a5 5 0 1110 0c0 1.45-.55 2.7-1.5 3.5-.7.6-1 1.05-1 1.5h-5c0-.45-.3-.9-1-1.5z"
                />
              </svg>
            </div>
            <div>
              <p className="type-meta font-extrabold">Writing tip</p>
              <p className="type-body mt-1 leading-relaxed text-[#66706A]">
                Focus on clear communication. Use a simple structure: introduce your idea, add
                supporting details, and finish with a clear point.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="shrink-0 border-t border-[#E8ECE4] bg-surface/95 px-5 py-4 backdrop-blur-md">
        <button
          type="button"
          disabled={!canContinue}
          onClick={continueAssessment}
          className={`type-btn flex h-12 w-full items-center justify-center rounded-2xl transition ${
            canContinue
              ? 'cursor-pointer bg-brand text-white hover:bg-[#18583F] active:scale-[0.98]'
              : 'cursor-not-allowed bg-[#E3E7E1] text-[#9AA29C]'
          }`}
        >
          Continue
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
