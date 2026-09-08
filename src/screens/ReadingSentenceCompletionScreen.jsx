import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const QUESTIONS = [
  {
    id: 1,
    tag: 'Vocabulary & Grammar',
    before: 'The university introduced a new digital library so that students could',
    after: 'research materials from anywhere.',
    options: [
      { id: 'A', text: 'access' },
      { id: 'B', text: 'arrive' },
      { id: 'C', text: 'remove' },
      { id: 'D', text: 'divide' },
    ],
  },
  {
    id: 2,
    tag: 'Vocabulary & Grammar',
    before: 'She decided to leave early because she wanted to',
    after: 'the heavy evening traffic.',
    options: [
      { id: 'A', text: 'avoid' },
      { id: 'B', text: 'invite' },
      { id: 'C', text: 'repair' },
      { id: 'D', text: 'collect' },
    ],
  },
  {
    id: 3,
    tag: 'Vocabulary & Grammar',
    before: 'The manager asked everyone to',
    after: 'their reports before Friday afternoon.',
    options: [
      { id: 'A', text: 'submit' },
      { id: 'B', text: 'forget' },
      { id: 'C', text: 'borrow' },
      { id: 'D', text: 'cancel' },
    ],
  },
]

const QUESTION_TIME = 45

function formatSeconds(total) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function ReadingSentenceCompletionScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [timerKey, setTimerKey] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

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
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerKey])

  function resetQuestionState() {
    setTimeLeft(QUESTION_TIME)
    setTimerKey((key) => key + 1)
    setSelectedAnswer(null)
  }

  function nextQuestion() {
    if (!selectedAnswer) return

    if (questionIndex >= totalQuestions - 1) {
      // Next: Writing — Typing (Reading Comprehension HTML not yet provided)
      navigate(`/tests/${testId}/assessment/writing-typing`)
      return
    }

    setQuestionIndex((prev) => prev + 1)
    resetQuestionState()
  }

  const blankText =
    selectedAnswer != null
      ? question.options.find((option) => option.id === selectedAnswer)?.text
      : '______'

  const bottomHint = selectedAnswer
    ? "Your answer is selected. Continue when you're ready."
    : 'Select an answer to continue'

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/tests/${testId}/assessment/listening-passage`)}
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
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
                  <path d="M4 5.5v16" />
                  <path d="M8 7h8" />
                  <path d="M8 11h8" />
                  <path d="M8 15h5" />
                </svg>
              </div>
              <div>
                <p className="type-caption font-semibold text-muted">Reading</p>
                <p className="type-meta font-bold">Sentence Completion</p>
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
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
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
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
              <path d="M4 5.5v16" />
            </svg>
          </div>

          <p className="type-label mb-2 text-accent">Reading · Sentence Completion</p>
          <h1 className="type-title">Complete the sentence</h1>
          <p className="type-body mx-auto mt-3 max-w-[650px] text-muted">
            Choose the word or phrase that best completes the sentence.
          </p>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[#E3E8DF] bg-white shadow-[0_10px_35px_rgba(31,107,79,0.05)]">
          <div className="px-5 pt-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-cream px-3 py-1.5 type-caption font-bold text-brand">
                {question.tag}
              </span>
              <span className="type-caption font-semibold text-[#9AA19C]">Reading</span>
            </div>
          </div>

          <div className="px-5 py-8">
            <p className="type-label mb-5 text-[#9AA19C]">Choose the best answer</p>

            <div className="rounded-[24px] border border-[#E8ECE4] bg-[#F8F9F5] p-6">
              <p className="text-[21px] font-extrabold leading-[1.55]">
                {question.before}{' '}
                <span
                  className={`mx-1 inline-block min-w-[120px] border-b-2 border-brand text-center text-brand ${
                    selectedAnswer ? '' : ''
                  }`}
                >
                  {blankText}
                </span>{' '}
                {question.after}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="type-meta font-extrabold">Select one answer</p>
            <p className="type-caption text-[#9AA19C]">1 answer</p>
          </div>

          <div className="space-y-3">
            {question.options.map((option) => {
              const selected = selectedAnswer === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedAnswer(option.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    selected
                      ? 'border-brand bg-[#F2F7F3]'
                      : 'border-[#E3E8DF] bg-white hover:border-[#B9CFC1] hover:bg-[#F8F9F5]'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl type-meta font-extrabold ${
                      selected ? 'bg-brand text-white' : 'bg-cream text-brand'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span className="type-meta font-semibold">{option.text}</span>
                </button>
              )
            })}
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
            Read the entire sentence before choosing. Look for the word that makes the sentence
            grammatically and logically complete.
          </p>
        </div>
      </main>

      <div className="shrink-0 border-t border-[#E8ECE4] bg-surface/95 px-5 py-4 backdrop-blur-md">
        <button
          type="button"
          disabled={!selectedAnswer}
          onClick={nextQuestion}
          className={`type-btn flex h-12 w-full items-center justify-center rounded-2xl transition ${
            selectedAnswer
              ? 'cursor-pointer bg-brand text-white hover:bg-[#18583F]'
              : 'cursor-not-allowed bg-brand-light text-[#9BA59E]'
          }`}
        >
          Continue
        </button>
        <p
          className={`type-caption mt-2 text-center font-semibold ${
            selectedAnswer ? 'text-brand' : 'text-[#8A928C]'
          }`}
        >
          {bottomHint}
        </p>
      </div>
    </div>
  )
}
