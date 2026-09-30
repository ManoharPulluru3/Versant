import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const QUESTIONS = [
  {
    id: 1,
    prompt: 'Why did the community decide to create the new public garden?',
    options: [
      { id: 'A', text: 'To provide a shared outdoor space for residents.' },
      { id: 'B', text: 'To build a new parking area for visitors.' },
      { id: 'C', text: 'To make room for a larger shopping centre.' },
      { id: 'D', text: 'To replace an old sports stadium.' },
    ],
  },
  {
    id: 2,
    prompt: 'According to the passage, what was one benefit of the project?',
    options: [
      { id: 'A', text: 'It helped neighbors spend more time outdoors together.' },
      { id: 'B', text: 'It removed all traffic from the city centre.' },
      { id: 'C', text: 'It replaced the local school with a museum.' },
      { id: 'D', text: 'It stopped people from using public transport.' },
    ],
  },
  {
    id: 3,
    prompt: 'What does the speaker suggest people should do next?',
    options: [
      { id: 'A', text: 'Join a local event and help maintain the garden.' },
      { id: 'B', text: 'Sell the land to a private company.' },
      { id: 'C', text: 'Close the garden during weekends.' },
      { id: 'D', text: 'Build offices around the garden immediately.' },
    ],
  },
]

const AUDIO_DURATION = 30
const MAX_LISTENS = 2
const QUESTION_TIME = 60
const WAVE_HEIGHTS = [16, 28, 20, 36, 24, 32, 20, 28]

function formatSeconds(total) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function PlayIcon() {
  return (
    <svg className="ml-0.5 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  )
}

export default function ListeningPassageScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [timerKey, setTimerKey] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSeconds, setAudioSeconds] = useState(0)
  const [listenCount, setListenCount] = useState(0)
  const [audioFinished, setAudioFinished] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const totalQuestions = QUESTIONS.length
  const question = QUESTIONS[questionIndex]
  const questionNumber = questionIndex + 1
  const progress = Math.round((questionNumber / totalQuestions) * 100)
  const urgent = timeLeft <= 10
  const canPlay = !isPlaying && listenCount < MAX_LISTENS
  const answersUnlocked = audioFinished

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerKey])

  useEffect(() => {
    if (!isPlaying) return undefined

    const interval = setInterval(() => {
      setAudioSeconds((prev) => {
        const next = prev + 1
        if (next >= AUDIO_DURATION) {
          setIsPlaying(false)
          setAudioFinished(true)
          return AUDIO_DURATION
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  function resetQuestionState() {
    setTimeLeft(QUESTION_TIME)
    setTimerKey((key) => key + 1)
    setIsPlaying(false)
    setAudioSeconds(0)
    setListenCount(0)
    setAudioFinished(false)
    setSelectedAnswer(null)
  }

  function playPassage() {
    if (!canPlay) return
    setAudioSeconds(0)
    setListenCount((prev) => prev + 1)
    setIsPlaying(true)
  }

  function nextQuestion() {
    if (!selectedAnswer) return

    if (questionIndex >= totalQuestions - 1) {
      // Next: Reading — Sentence Completion
      navigate(`/tests/${testId}/assessment/reading-sentence-completion`)
      return
    }

    setQuestionIndex((prev) => prev + 1)
    resetQuestionState()
  }

  const audioProgress = Math.min((audioSeconds / AUDIO_DURATION) * 100, 100)

  const audioStatus = isPlaying
    ? 'Playing passage...'
    : listenCount >= MAX_LISTENS && !isPlaying && !audioFinished
      ? 'You have used both listens.'
      : audioFinished
        ? 'Passage finished'
        : 'Listen carefully before answering'

  const listenBadge =
    listenCount === 0
      ? '2 listens'
      : listenCount === 1
        ? '1 listen used'
        : '2 listens used'

  const bottomHint = selectedAnswer
    ? "Your answer is selected. Continue when you're ready."
    : answersUnlocked
      ? 'Select the answer that best matches the passage.'
      : 'Listen to the passage to continue'

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/tests/${testId}/assessment/listening-conversation`)}
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
                  <path d="M3 10v4" />
                  <path d="M7 8v8" />
                  <path d="M11 6v12" />
                  <path d="M15 9v6" />
                  <path d="M19 11v2" />
                </svg>
              </div>
              <div>
                <p className="type-caption font-semibold text-muted">Listening</p>
                <p className="type-meta font-bold">Passage</p>
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
              <path d="M3 10v4" />
              <path d="M7 8v8" />
              <path d="M11 6v12" />
              <path d="M15 9v6" />
              <path d="M19 11v2" />
            </svg>
          </div>

          <p className="type-label mb-2 text-accent">Listening · Passage</p>
          <h1 className="type-title">Listen and understand</h1>
          <p className="type-body mx-auto mt-3 max-w-[650px] text-muted">
            Listen to the passage carefully, then answer the question based on what you heard.
          </p>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[#E3E8DF] bg-white shadow-[0_10px_35px_rgba(31,107,79,0.05)]">
          <div className="px-5 pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="type-meta font-extrabold">Passage</p>
                <p className="type-caption mt-1 text-muted">{audioStatus}</p>
              </div>
              <span className="rounded-full bg-cream px-3 py-1.5 type-caption font-bold text-brand">
                {listenBadge}
              </span>
            </div>
          </div>

          <div className="px-5 py-7">
            <div className="rounded-[24px] border border-[#E8ECE4] bg-[#F8F9F5] p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <button
                  type="button"
                  onClick={playPassage}
                  disabled={!canPlay}
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-[#18583F] active:scale-95 disabled:opacity-70 ${
                    isPlaying ? '' : 'play-pulse'
                  }`}
                  aria-label="Play passage"
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <div className="w-full flex-1">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="type-caption font-bold text-muted">
                      {formatSeconds(audioSeconds)}
                    </span>
                    <span className="type-caption text-[#9AA19C]">00:30</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#E3E8DF]">
                    <div
                      className="audio-progress h-full rounded-full bg-brand"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>

                  <div className="mt-4 flex h-10 items-center justify-center gap-1">
                    {WAVE_HEIGHTS.map((height, index) => (
                      <span
                        key={index}
                        className={`audio-wave-bar w-1 rounded-full ${
                          isPlaying ? 'bg-brand' : 'bg-[#AFC6B7]'
                        }`}
                        style={{
                          height: `${height}px`,
                          animationPlayState: isPlaying ? 'running' : 'paused',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#E4E9E1] pt-5">
                <p className="type-caption text-muted">You can listen to the passage twice.</p>
                <button
                  type="button"
                  onClick={playPassage}
                  disabled={!canPlay}
                  className={`type-caption font-bold ${
                    listenCount >= MAX_LISTENS
                      ? 'cursor-not-allowed text-[#9AA19C]'
                      : 'text-brand hover:underline'
                  }`}
                >
                  {listenCount >= MAX_LISTENS ? 'No listens remaining' : 'Replay'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`mt-5 overflow-hidden rounded-[28px] border border-[#E3E8DF] bg-white transition-all duration-500 ${
            answersUnlocked ? 'opacity-100' : 'pointer-events-none opacity-50'
          }`}
        >
          <div className="px-5 pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="type-label text-[#9AA19C]">Comprehension</p>
                <p className="type-meta mt-1 font-extrabold">Answer the question</p>
              </div>
              {answersUnlocked ? (
                <div className="flex items-center gap-1.5 type-caption font-bold text-brand">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                  Ready
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-5 py-6">
            <div className="rounded-2xl border border-[#E8ECE4] bg-[#F8F9F5] p-5">
              <p className="text-[17px] font-bold leading-7">{question.prompt}</p>
            </div>

            <div className="mt-5 space-y-3">
              {question.options.map((option) => {
                const selected = selectedAnswer === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (!audioFinished) return
                      setSelectedAnswer(option.id)
                    }}
                    className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                      selected
                        ? 'border-brand bg-[#F2F7F3]'
                        : 'border-[#E3E8DF] bg-white hover:border-[#B9CFC1] hover:bg-[#F8F9F5]'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl type-meta font-extrabold ${
                        selected ? 'bg-brand text-white' : 'bg-cream text-brand'
                      }`}
                    >
                      {option.id}
                    </span>
                    <span className="pt-1 type-meta font-semibold leading-5">{option.text}</span>
                  </button>
                )
              })}
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
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <p className="type-caption leading-5 text-muted">
            Focus on the main idea and important details. You can replay the passage once if needed,
            but try to listen carefully the first time.
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
