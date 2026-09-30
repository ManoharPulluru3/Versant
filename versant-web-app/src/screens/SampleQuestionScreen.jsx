import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const BAR_HEIGHTS = [2, 4, 6, 3, 5, 2, 4, 6, 3, 5, 2]

export default function SampleQuestionScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [barHeights, setBarHeights] = useState(BAR_HEIGHTS)

  useEffect(() => {
    if (!recording) return undefined

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setRecording(false)
          setRecorded(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [recording])

  useEffect(() => {
    if (!recording) {
      setBarHeights(BAR_HEIGHTS)
      return undefined
    }

    const interval = setInterval(() => {
      setBarHeights(Array.from({ length: 11 }, () => Math.floor(Math.random() * 5) + 2))
    }, 120)

    return () => clearInterval(interval)
  }, [recording])

  function toggleRecording() {
    if (recording) {
      setRecording(false)
      setRecorded(true)
      return
    }

    setRecorded(false)
    setTimeLeft(10)
    setRecording(true)
  }

  const statusText = recording
    ? 'Listening... read the sentence aloud'
    : recorded
      ? 'Response recorded'
      : 'Tap the microphone to try it'

  const statusActive = recording || recorded

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-[11px] bg-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 7.4 7.4 0 0 1-3.2-.7L4 20l1.7-4.2A7.5 7.5 0 1 1 20 11.5Z" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
            </div>

            <div>
              <p className="type-label text-muted">English Assessment</p>
              <p className="type-caption font-extrabold text-dark">Sample Question</p>
            </div>
          </div>

          <div className="text-right">
            <p className="type-caption text-muted">Before the test</p>
            <p className="type-caption font-extrabold text-brand">Sample</p>
          </div>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-brand/10">
          <div className="h-full w-full rounded-full bg-brand" />
        </div>
      </header>

      <section className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-8">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-brand-light text-brand">
            <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
              <path d="M8 21h8" />
            </svg>
          </div>

          <p className="type-label mt-4 text-brand">Speaking · Read Aloud</p>
          <h1 className="type-title mt-1">Let's try one first.</h1>
          <p className="type-body mx-auto mt-2 max-w-[340px] text-muted">
            This sample shows how a speaking question will work during your assessment.
          </p>
        </div>

        <div className="mb-5 rounded-[26px] bg-brand-light p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="type-label text-brand/70">Sample</p>
              <h2 className="type-section mt-1">Read the sentence aloud</h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/70 text-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v18" />
                <path d="M8 8v8" />
                <path d="M16 7v10" />
                <path d="M4 10v4" />
                <path d="M20 9v6" />
              </svg>
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-5">
            <p className="text-center text-[18px] font-bold leading-8 text-dark">
              “The students are preparing for their final examination.”
            </p>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/70 text-brand">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <p className="type-caption leading-5 text-brand/80">
              When you're ready, tap the microphone and read the sentence naturally and clearly.
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="type-caption font-extrabold">Your response</p>
              <p className={`type-caption mt-1 ${statusActive ? 'text-brand' : 'text-muted'}`}>
                {statusText}
              </p>
            </div>

            {recording ? (
              <div className="rounded-full bg-brand-light px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  <span className="type-caption font-extrabold text-brand">
                    00:{String(timeLeft).padStart(2, '0')}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-center py-7">
            <button
              type="button"
              onClick={toggleRecording}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/20 transition hover:bg-[#195C44] active:scale-95 ${
                recording ? 'scale-105' : ''
              }`}
              aria-label={recording ? 'Stop recording' : 'Start recording'}
            >
              {recording ? (
                <span className="absolute inset-0 animate-ping rounded-full border-2 border-brand" />
              ) : null}

              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" />
                <path d="M12 18v3" />
                <path d="M8 21h8" />
              </svg>
            </button>
          </div>

          <div
            className={`flex h-7 items-center justify-center gap-1 ${
              recording ? 'opacity-100' : 'opacity-30'
            }`}
          >
            {barHeights.map((height, index) => (
              <span
                key={index}
                className="w-1 rounded-full bg-brand transition-all duration-100"
                style={{ height: `${height * 4}px` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-[#F7F7F2] text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v18" />
              <path d="M5 8h14" />
              <path d="M5 16h14" />
            </svg>
          </div>
          <p className="type-caption leading-5 text-muted">
            This is only a sample. Your response here will not affect your assessment score.
          </p>
        </div>
      </section>

      <div className="shrink-0 border-t border-black/5 bg-surface/95 px-5 pb-5 pt-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => navigate(`/tests/${testId}/begin`)}
          className="type-btn flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-brand text-white transition hover:bg-[#195C44] active:scale-[0.99]"
        >
          Begin Assessment
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
