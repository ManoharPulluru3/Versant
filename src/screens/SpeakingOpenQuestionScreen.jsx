import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const QUESTIONS = [
  {
    topic: 'Everyday Life',
    prompt: 'Describe one skill you would like to improve and explain why.',
    tip: 'Try to give a clear answer with a few supporting details or examples.',
  },
  {
    topic: 'Work & Study',
    prompt: 'Talk about a time you worked with someone to solve a problem.',
    tip: 'Describe what happened and what you learned from the experience.',
  },
  {
    topic: 'Opinions',
    prompt: 'Do you prefer studying alone or with others? Explain your preference.',
    tip: 'Share your reasons and give at least one example from your own experience.',
  },
]

const MAX_RECORDING = 45
const QUESTION_TIME = 60
const WAVE_HEIGHTS = [28, 40, 20, 48, 32, 44, 24, 40, 28]

function formatSeconds(total) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function MicIcon() {
  return (
    <svg
      className="h-8 w-8 sm:h-9 sm:w-9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </svg>
  )
}

export default function SpeakingOpenQuestionScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [timerKey, setTimerKey] = useState(0)

  const [recording, setRecording] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [autoStopped, setAutoStopped] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  const totalQuestions = QUESTIONS.length
  const question = QUESTIONS[questionIndex]
  const questionNumber = questionIndex + 1
  const progress = Math.round((questionNumber / totalQuestions) * 100)
  const urgent = timeLeft <= 10

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setRecording(false)
          setCompleted(true)
          setAutoStopped(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerKey])

  useEffect(() => {
    if (!recording) return undefined

    const interval = setInterval(() => {
      setRecordingSeconds((prev) => {
        const next = prev + 1
        if (next >= MAX_RECORDING) {
          setRecording(false)
          setCompleted(true)
          setAutoStopped(true)
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [recording])

  function resetQuestionState() {
    setTimeLeft(QUESTION_TIME)
    setTimerKey((key) => key + 1)
    setRecording(false)
    setCompleted(false)
    setAutoStopped(false)
    setRecordingSeconds(0)
  }

  function toggleRecording() {
    if (completed) return

    if (recording) {
      setRecording(false)
      setCompleted(true)
      setAutoStopped(false)
      return
    }

    setRecordingSeconds(0)
    setAutoStopped(false)
    setRecording(true)
  }

  function nextQuestion() {
    if (!completed) return

    if (questionIndex >= totalQuestions - 1) {
      navigate(`/tests/${testId}/assessment/listening-conversation`)
      return
    }

    setQuestionIndex((prev) => prev + 1)
    resetQuestionState()
  }

  const statusText = recording
    ? 'Recording your response...'
    : completed
      ? autoStopped
        ? 'Maximum response time reached'
        : 'Response recorded'
      : "Tap the microphone when you're ready"

  const recordingHint = recording
    ? "Speak naturally. Tap the microphone when you're finished."
    : completed
      ? 'Your response has been captured.'
      : 'Maximum response time: 45 seconds'

  const bottomHint = completed
    ? "Your response is ready. Continue when you're ready."
    : 'Complete your response to continue'

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/tests/${testId}/assessment/story-retelling`)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E9E0] bg-white transition hover:bg-[#F5F7F1]"
              aria-label="Go back"
            >
              <svg
                className="h-5 w-5 text-dark"
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
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.8L3 21l1.8-4.4A8.5 8.5 0 1 1 21 11.5Z" />
                  <path d="M8 11h.01" />
                  <path d="M12 11h.01" />
                  <path d="M16 11h.01" />
                </svg>
              </div>
              <div>
                <p className="type-caption font-semibold text-muted">Speaking</p>
                <p className="type-meta font-bold text-dark">Open Question</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="type-caption text-muted">Question</p>
              <p className="type-meta font-bold">
                {questionNumber} of {totalQuestions}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream">
              <svg
                className="h-5 w-5 text-brand"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="type-caption font-semibold text-muted">Assessment progress</span>
            <span className="type-caption font-bold text-brand">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#E9EDE5]">
            <div className="progress-fill h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <main className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-7 pb-4">
        <div className="mb-6 flex justify-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${
              urgent
                ? 'timer-warning border-[#F5D5C0] bg-[#FDEFE7] text-[#C96D2F]'
                : 'border-[#E1E8DD] bg-cream text-brand'
            }`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span className="type-meta font-bold">Time remaining</span>
            <span className="type-meta font-extrabold tracking-wide">{formatSeconds(timeLeft)}</span>
          </div>
        </div>

        <section className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light">
            <svg
              className="h-6 w-6 text-brand"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <path d="M12 19v3" />
              <path d="M8 22h8" />
            </svg>
          </div>

          <p className="type-label mb-2 text-accent">Open Question</p>
          <h1 className="type-title">Share your thoughts</h1>
          <p className="type-body mx-auto mt-3 max-w-[620px] text-muted">
            Speak naturally and explain your answer clearly. There is no single correct answer.
          </p>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[#E3E8DF] bg-white shadow-[0_10px_35px_rgba(31,107,79,0.05)]">
          <div className="px-5 pt-6">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center rounded-full bg-cream px-3 py-1.5 type-caption font-bold text-brand">
                {question.topic}
              </span>
              <span className="type-caption font-semibold text-[#9AA19C]">Speaking</span>
            </div>
          </div>

          <div className="px-5 py-7">
            <p className="type-label mb-4 text-[#9AA19C]">Question</p>
            <h2 className="text-[22px] font-extrabold leading-[1.35] tracking-[-0.015em] text-dark">
              {question.prompt}
            </h2>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#E9EDE5] bg-[#F8F9F5] px-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-light">
                <svg
                  className="h-4 w-4 text-brand"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <p className="type-meta leading-5 text-[#68716B]">{question.tip}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#E3E8DF] bg-white">
          <div className="px-5 pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="type-meta font-extrabold">Your response</p>
                <p
                  className={`mt-1 type-caption ${
                    recording ? 'text-[#C96D2F]' : completed ? 'text-brand' : 'text-muted'
                  }`}
                >
                  {statusText}
                </p>
              </div>

              {recording ? (
                <div className="flex items-center gap-1.5 rounded-full bg-[#FDEFE7] px-3 py-1.5 text-[#C96D2F]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  <span className="type-caption font-bold">Recording</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-5 py-7">
            <div className="rounded-[24px] border border-[#E8ECE4] bg-[#F8F9F5] p-6">
              <div
                className={`mb-7 flex h-16 items-center justify-center gap-1.5 ${
                  recording ? '' : 'opacity-50'
                }`}
              >
                {WAVE_HEIGHTS.map((height, index) => (
                  <span
                    key={index}
                    className={`wave-bar w-1 rounded-full ${
                      recording ? 'bg-brand' : 'bg-[#B8CDBE]'
                    }`}
                    style={{
                      height: `${height}px`,
                      animationPlayState: recording ? 'running' : 'paused',
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={completed}
                  className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-[0_12px_30px_rgba(31,107,79,0.20)] transition active:scale-95 disabled:cursor-default ${
                    recording
                      ? 'bg-[#B94F45]'
                      : completed
                        ? 'bg-brand'
                        : 'recording-pulse bg-brand hover:bg-[#18583F]'
                  }`}
                  aria-label={recording ? 'Stop recording' : 'Start recording'}
                >
                  <MicIcon />
                </button>
              </div>

              <div className="mt-5 text-center">
                <p className="text-lg font-extrabold tracking-wide">
                  {formatSeconds(Math.min(recordingSeconds, MAX_RECORDING))}
                </p>
                <p className="type-caption mt-1 text-[#8A928C]">{recordingHint}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-start gap-3 px-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF2E9]">
            <svg
              className="h-4 w-4 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.7-1.5 1.7-1.5 2.5h-4c0-.8-.6-1.8-1.5-2.5Z" />
            </svg>
          </div>
          <p className="type-caption leading-5 text-muted">
            Focus on expressing your ideas clearly. You don't need complicated words or memorized
            sentences.
          </p>
        </div>
      </main>

      <div className="shrink-0 border-t border-[#E8ECE4] bg-surface/95 px-5 py-4 backdrop-blur-md">
        <button
          type="button"
          disabled={!completed}
          onClick={nextQuestion}
          className={`type-btn flex h-12 w-full items-center justify-center rounded-2xl transition ${
            completed
              ? 'cursor-pointer bg-brand text-white hover:bg-[#18583F]'
              : 'cursor-not-allowed bg-brand-light text-[#9BA59E]'
          }`}
        >
          Continue
        </button>
        <p
          className={`type-caption mt-2 text-center font-semibold ${
            completed ? 'text-brand' : 'text-[#8A928C]'
          }`}
        >
          {bottomHint}
        </p>
      </div>
    </div>
  )
}
