import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SENTENCES = [
  {
    id: 1,
    label: 'Everyday sentence',
    hint: 'Listen carefully to the full sentence before you type.',
  },
  {
    id: 2,
    label: 'Workplace sentence',
    hint: 'Pay attention to small words and verb endings.',
  },
]

const AUDIO_DURATION = 12
const MAX_LISTENS = 2
const QUESTION_TIME = 60
const MAX_CHARS = 300
const MIN_WORDS = 3

function formatSeconds(total) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function countWords(text) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0
}

function PlayIcon() {
  return (
    <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
      <rect x="7" y="5" width="3.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </svg>
  )
}

export default function WritingDictationScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [timerKey, setTimerKey] = useState(0)

  const [listensRemaining, setListensRemaining] = useState(MAX_LISTENS)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSeconds, setAudioSeconds] = useState(0)
  const [audioFinishedOnce, setAudioFinishedOnce] = useState(false)

  const [response, setResponse] = useState('')
  const [completed, setCompleted] = useState(false)

  const totalSentences = SENTENCES.length
  const sentence = SENTENCES[sentenceIndex]
  const questionNumber = sentenceIndex + 1
  const progress = Math.round((questionNumber / totalSentences) * 100)
  const urgent = timeLeft <= 15

  const responseEnabled = audioFinishedOnce && !completed
  const characters = response.length
  const words = countWords(response)
  const canPlay = !isPlaying && listensRemaining > 0 && !completed
  const canContinue =
    response.trim().length > 0 && (completed || words >= MIN_WORDS)

  const audioProgress = Math.min((audioSeconds / AUDIO_DURATION) * 100, 100)
  const audioRemaining = Math.max(AUDIO_DURATION - audioSeconds, 0)

  let statusLabel = 'Locked'
  let statusClass = 'text-accent'
  let bottomHint = 'Listen to the sentence first'
  let inputHint = 'Listen before typing'

  if (completed) {
    statusLabel = 'Completed'
    statusClass = 'text-brand'
    bottomHint = 'Response saved'
    inputHint = 'Time ended'
  } else if (!audioFinishedOnce) {
    statusLabel = 'Locked'
    statusClass = 'text-accent'
    bottomHint = 'Listen to the sentence first'
    inputHint = 'Listen before typing'
  } else if (characters === 0) {
    statusLabel = 'Ready'
    statusClass = 'text-accent'
    bottomHint = 'Type the sentence to continue'
    inputHint = 'Type what you heard'
  } else if (words < MIN_WORDS) {
    statusLabel = 'In progress'
    statusClass = 'text-accent'
    bottomHint = 'Continue typing'
    inputHint = 'Type what you heard'
  } else {
    statusLabel = 'Ready'
    statusClass = 'text-brand'
    bottomHint = 'Response is ready'
    inputHint = 'Type what you heard'
  }

  const audioStatus = completed
    ? 'Response time ended'
    : isPlaying
      ? 'Playing sentence...'
      : audioFinishedOnce
        ? 'Sentence played'
        : 'Listen to the sentence'

  const audioSubtext = completed
    ? 'You can continue when ready'
    : isPlaying
      ? 'Listen carefully'
      : listensRemaining > 0
        ? audioFinishedOnce
          ? 'You can listen once more'
          : "Tap play when you're ready"
        : 'No listens remaining'

  const listenBadge =
    listensRemaining === MAX_LISTENS && !audioFinishedOnce && !isPlaying
      ? '2 listens'
      : `${listensRemaining} ${listensRemaining === 1 ? 'listen' : 'listens'} left`

  useEffect(() => {
    if (completed) return undefined

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsPlaying(false)
          setCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerKey, completed])

  useEffect(() => {
    if (!isPlaying) return undefined

    const interval = setInterval(() => {
      setAudioSeconds((prev) => {
        const next = prev + 1
        if (next >= AUDIO_DURATION) {
          setIsPlaying(false)
          setAudioFinishedOnce(true)
          return AUDIO_DURATION
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  function resetSentenceState() {
    setTimeLeft(QUESTION_TIME)
    setTimerKey((key) => key + 1)
    setListensRemaining(MAX_LISTENS)
    setIsPlaying(false)
    setAudioSeconds(0)
    setAudioFinishedOnce(false)
    setResponse('')
    setCompleted(false)
  }

  function playAudio() {
    if (!canPlay) return
    setListensRemaining((prev) => prev - 1)
    setAudioSeconds(0)
    setIsPlaying(true)
  }

  function goBack() {
    if (
      response.trim() &&
      !window.confirm('Your response may be lost. Are you sure you want to go back?')
    ) {
      return
    }
    navigate(`/tests/${testId}/assessment/writing-typing`)
  }

  function continueAssessment() {
    if (!canContinue) return

    if (sentenceIndex >= totalSentences - 1) {
      navigate(`/tests/${testId}/assessment/writing-passage-reconstruction`)
      return
    }

    setSentenceIndex((prev) => prev + 1)
    resetSentenceState()
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7v10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 10v4" />
                </svg>
              </div>
              <div>
                <p className="type-label font-bold uppercase tracking-[0.12em] text-muted">
                  Writing
                </p>
                <p className="type-meta font-bold">Dictation</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="type-caption font-semibold text-muted">Question</p>
            <p className="type-meta font-extrabold">
              {questionNumber} of {totalSentences}
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
            Writing · Dictation
          </div>
          <h1 className="type-title mt-4 tracking-tight">Listen and type</h1>
          <p className="type-body mt-2 leading-relaxed text-muted">
            Listen carefully to the sentence and type exactly what you hear. Focus on spelling,
            punctuation and accuracy.
          </p>
        </div>

        <div className="mt-7 rounded-[28px] border border-[#E6EAE2] bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream">
                <svg
                  className="h-5 w-5 text-brand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H3v6h3l5 4V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5a5 5 0 010 7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 6a8 8 0 010 12" />
                </svg>
              </div>
              <span className="type-meta font-extrabold">Listen</span>
            </div>
            <span className="rounded-full bg-[#F5F2EC] px-2.5 py-1 type-caption font-bold text-muted">
              {listenBadge}
            </span>
          </div>

          <div className="mt-6 rounded-[24px] border border-[#E8ECE4] bg-[#F8F9F5] p-5">
            <div className="flex flex-col items-center gap-5">
              <button
                type="button"
                onClick={playAudio}
                disabled={!canPlay}
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white transition ${
                  canPlay ? 'play-pulse bg-brand hover:bg-[#18583F]' : 'bg-[#18583F] opacity-90'
                } ${!canPlay && !isPlaying ? 'cursor-not-allowed opacity-60' : ''}`}
                aria-label={isPlaying ? 'Playing' : 'Play sentence'}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <div className="w-full">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="type-meta font-extrabold">{audioStatus}</p>
                    <p className="type-caption mt-0.5 text-muted">{audioSubtext}</p>
                  </div>
                  <span className="type-caption font-bold text-muted">
                    {formatSeconds(isPlaying || audioSeconds > 0 ? audioRemaining : AUDIO_DURATION)}
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E2E7DF]">
                  <div
                    className="audio-progress h-full rounded-full bg-brand"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>

                <div className="mt-4 flex h-8 items-center justify-center gap-1">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span
                      key={index}
                      className={`w-1 rounded-full bg-[#B7C8BA] ${
                        isPlaying ? 'wave-bar' : 'h-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#E5E9E1] pt-4">
              <p className="type-caption text-muted">You can listen up to two times.</p>
              <span
                className={`type-caption font-bold ${
                  listensRemaining === 0 ? 'text-muted' : 'text-accent'
                }`}
              >
                {listensRemaining} remaining
              </span>
            </div>
          </div>

          <p className="type-caption mt-4 text-center text-muted">{sentence.hint}</p>
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
              rows={6}
              maxLength={MAX_CHARS}
              value={response}
              disabled={!responseEnabled}
              onChange={(event) => setResponse(event.target.value)}
              placeholder={
                audioFinishedOnce
                  ? 'Type exactly what you heard...'
                  : 'Listen to the sentence first...'
              }
              className={`w-full resize-none bg-transparent px-5 py-5 type-body leading-7 text-dark placeholder:text-[#A2AAA4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(31,107,79,0.10)] disabled:bg-[#F8F9F5] ${
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h10" />
                </svg>
                <span className="type-caption text-muted">{inputHint}</span>
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
              <p className="type-meta font-extrabold">Dictation tip</p>
              <p className="type-body mt-1 leading-relaxed text-[#66706A]">
                Listen for the complete sentence before typing. Pay attention to small words, verb
                endings, spelling and punctuation.
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
