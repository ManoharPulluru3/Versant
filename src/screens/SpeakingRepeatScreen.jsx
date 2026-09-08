import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const QUESTIONS = [
  'The students are preparing for their final examination.',
  'Please leave your bags near the entrance of the building.',
  'The conference will begin shortly after the guests arrive.',
  'She prefers to study in the library during the afternoon.',
  'Traffic was heavy because of the unexpected morning rain.',
  'The teacher asked everyone to submit their homework today.',
  'We decided to take a short break before continuing the meeting.',
  'His explanation helped the team understand the new process.',
  'They walked through the park on their way to the station.',
  'A quiet workspace can make it easier to focus on writing.',
]

const WAVE_HEIGHTS = [12, 20, 12, 24, 16, 28, 16, 24, 12, 20, 12, 16]
const AUDIO_DURATION = 6
const RECORDING_MAX = 10
const QUESTION_TIME = 20

function formatSeconds(total) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function PlayIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v4" />
      <path d="M8 22h8" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor">
      <rect x="7" y="7" width="10" height="10" rx="2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

export default function SpeakingRepeatScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const [questionIndex, setQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [timerKey, setTimerKey] = useState(0)

  const [audioPlayed, setAudioPlayed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSeconds, setAudioSeconds] = useState(0)

  const [recording, setRecording] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  const totalQuestions = QUESTIONS.length
  const questionNumber = questionIndex + 1
  const progress = (questionNumber / totalQuestions) * 100
  const urgent = timeLeft <= 5
  const micEnabled = audioPlayed && !completed

  useEffect(() => {
    if (completed) return undefined

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsPlaying(false)
          setRecording(false)
          setCompleted(true)
          setTimedOut(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [completed, timerKey])

  useEffect(() => {
    if (!isPlaying) return undefined

    const interval = setInterval(() => {
      setAudioSeconds((prev) => {
        const next = prev + 1
        if (next >= AUDIO_DURATION) {
          setIsPlaying(false)
          setAudioPlayed(true)
          return AUDIO_DURATION
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    if (!recording) return undefined

    const interval = setInterval(() => {
      setRecordingSeconds((prev) => {
        const next = prev + 1
        if (next >= RECORDING_MAX) {
          setRecording(false)
          setCompleted(true)
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [recording])

  function resetQuestionState() {
    setTimeLeft(QUESTION_TIME)
    setTimerKey((key) => key + 1)
    setAudioPlayed(false)
    setIsPlaying(false)
    setAudioSeconds(0)
    setRecording(false)
    setCompleted(false)
    setTimedOut(false)
    setRecordingSeconds(0)
  }

  function toggleAudio() {
    if (completed) return

    if (isPlaying) {
      setIsPlaying(false)
      return
    }

    if (audioPlayed && audioSeconds >= AUDIO_DURATION) {
      setAudioSeconds(0)
    }

    setIsPlaying(true)
  }

  function toggleRecording() {
    if (completed || !audioPlayed) return

    if (recording) {
      setRecording(false)
      setCompleted(true)
      return
    }

    setRecordingSeconds(0)
    setRecording(true)
  }

  function nextQuestion() {
    if (!completed) return

    if (questionIndex >= totalQuestions - 1) {
      // Next: Speaking — Story Retelling
      navigate(`/tests/${testId}/assessment/story-retelling`)
      return
    }

    setQuestionIndex((prev) => prev + 1)
    resetQuestionState()
  }

  const audioProgress = Math.min((audioSeconds / AUDIO_DURATION) * 100, 100)

  const listenLabel = isPlaying
    ? audioPlayed
      ? 'Replay'
      : 'Listening'
    : audioPlayed
      ? 'Listened'
      : '1 listen'

  const audioStatus = isPlaying
    ? 'Playing sentence…'
    : audioPlayed && audioSeconds >= AUDIO_DURATION
      ? 'Sentence played'
      : audioSeconds > 0 && !isPlaying
        ? 'Audio paused'
        : 'Listen to the sentence'

  const statusText = recording
    ? 'Recording your response…'
    : timedOut
      ? 'Time is up — response saved'
      : completed
        ? 'Response recorded'
        : audioPlayed
          ? 'Ready for your response'
          : 'Listen first, then tap the microphone'

  const statusClass = recording
    ? 'text-accent'
    : completed
      ? 'text-brand'
      : 'text-dark'

  const micHint = !audioPlayed
    ? 'Listen to the sentence before recording'
    : recording
      ? 'Tap the button when you have finished speaking'
      : completed
        ? 'Your response has been recorded'
        : 'Tap the microphone to repeat the sentence'

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="flex shrink-0 items-center justify-between px-5 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18 6a8.5 8.5 0 0 1 0 12" />
            </svg>
          </div>
          <div>
            <p className="type-label text-muted">Speaking</p>
            <p className="type-meta font-bold text-dark">Repeat</p>
          </div>
        </div>

        <div className="text-right">
          <p className="type-label text-muted">Question</p>
          <p className="type-meta font-extrabold text-dark">
            {questionNumber} <span className="font-medium text-muted">of</span> {totalQuestions}
          </p>
        </div>
      </header>

      <div className="px-5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E9ECE5]">
          <div className="progress-fill h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-6">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E6E8E2] bg-white px-4 py-2 shadow-sm">
            <span className={`h-2 w-2 rounded-full ${urgent ? 'bg-accent' : 'bg-brand'}`} />
            <span className="type-caption font-bold text-muted">Time remaining</span>
            <span className={`type-caption font-extrabold tabular-nums ${urgent ? 'text-accent' : 'text-dark'}`}>
              {formatSeconds(timeLeft)}
            </span>
          </div>
        </div>

        <div className="mb-7 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="type-label text-brand">Repeat</span>
          </div>
          <h1 className="type-title tracking-[-0.025em]">Listen and repeat</h1>
          <p className="type-body mx-auto mt-3 max-w-[560px] text-muted">
            Listen carefully to the sentence, then repeat it as naturally and accurately as you can.
          </p>
        </div>

        <div className="rounded-[24px] border border-[#E7E9E3] bg-white p-5 shadow-[0_8px_30px_rgba(23,34,29,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                </svg>
              </div>
              <span className="type-label text-muted">Listen</span>
            </div>
            <span className="rounded-full bg-[#F5F6F2] px-3 py-1 type-caption font-bold text-muted">
              {listenLabel}
            </span>
          </div>

          <div className="mt-7 rounded-2xl border border-[#ECEDE8] bg-[#F7F8F4] p-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleAudio}
                disabled={completed}
                className="play-button flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(31,107,79,0.14)] disabled:opacity-70"
                aria-label={isPlaying ? 'Pause sentence' : 'Play sentence'}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="type-meta font-extrabold text-dark">{audioStatus}</p>
                  <span className="type-caption font-bold tabular-nums text-muted">
                    0:{String(audioSeconds).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E3E6E0]">
                  <div
                    className="audio-progress h-full rounded-full bg-brand"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="type-caption font-semibold text-muted">Sentence</span>
                  <span className="type-caption font-semibold text-muted">Tap play to listen</span>
                </div>
              </div>
            </div>
          </div>

          {audioPlayed ? (
            <div className="mt-5 rounded-2xl border border-[#E8EAE4] bg-brand-light/40 px-4 py-4">
              <p className="type-label text-brand">Sentence</p>
              <p className="type-section mt-2 text-base leading-7">{QUESTIONS[questionIndex]}</p>
              <p className="type-caption mt-2 text-muted">
                The sentence is shown here for review after listening.
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-5 rounded-[24px] border border-[#E7E9E3] bg-[#F8F9F5] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="type-label text-muted">Your response</p>
              <p className={`type-meta mt-1 font-bold ${statusClass}`}>{statusText}</p>
            </div>

            {recording ? (
              <div className="flex items-center gap-2 rounded-full bg-[#FFF1E7] px-3 py-1.5">
                <span className="recording-pulse h-2 w-2 rounded-full bg-accent" />
                <span className="type-label text-accent">Recording</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-center pt-7">
            {(recording || (completed && recordingSeconds > 0)) && (
              <div className="mb-4 type-caption font-extrabold tabular-nums text-muted">
                {formatSeconds(recordingSeconds)}
              </div>
            )}

            <button
              type="button"
              onClick={toggleRecording}
              disabled={!micEnabled && !recording}
              aria-label={recording ? 'Stop recording' : completed ? 'Recording completed' : 'Record response'}
              className={`flex h-20 w-20 items-center justify-center rounded-full transition-all ${
                recording
                  ? 'recording-pulse bg-accent text-white'
                  : completed
                    ? 'bg-brand text-white'
                    : audioPlayed
                      ? 'cursor-pointer bg-brand text-white shadow-[0_12px_30px_rgba(31,107,79,0.16)]'
                      : 'cursor-not-allowed bg-[#DDE1DA] text-[#9BA39C]'
              }`}
            >
              {recording ? <StopIcon /> : completed ? <CheckIcon /> : <MicIcon />}
            </button>

            <div
              className={`mt-6 flex h-7 items-center justify-center gap-[3px] ${
                recording ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {WAVE_HEIGHTS.map((height, index) => (
                <span
                  key={index}
                  className="wave-bar w-[3px] rounded-full bg-brand"
                  style={{ height: `${height}px`, animationPlayState: recording ? 'running' : 'paused' }}
                />
              ))}
            </div>

            <p className="type-caption mt-3 text-center text-muted">{micHint}</p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#E8EAE4] bg-white/70 px-4 py-4">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F1F3ED] text-muted">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <p className="type-caption leading-5 text-muted">
            Listen carefully before responding. Your pronunciation, fluency and accuracy may be
            evaluated from your recorded response.
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#E8EAE4] bg-surface/95 px-5 py-4 backdrop-blur-xl">
        <button
          type="button"
          disabled={!completed}
          onClick={nextQuestion}
          className={`type-btn flex h-12 w-full items-center justify-center gap-2 rounded-2xl transition-all ${
            completed
              ? 'cursor-pointer bg-brand text-white shadow-[0_8px_20px_rgba(31,107,79,0.15)] hover:bg-[#18583F]'
              : 'cursor-not-allowed bg-[#E4E7E0] text-[#A0A69F]'
          }`}
        >
          <span>{questionIndex >= totalQuestions - 1 ? 'Finish Section' : 'Continue'}</span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
        <p className={`type-caption mt-2 text-center font-semibold ${completed ? 'text-brand' : 'text-muted'}`}>
          {completed
            ? 'Your response is ready'
            : 'Listen to the sentence and complete your response'}
        </p>
      </div>
    </div>
  )
}
