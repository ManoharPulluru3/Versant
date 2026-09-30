import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function StatusIcon({ status }) {
  if (status === 'checking') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-muted">
        <svg
          className="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" d="M12 3a9 9 0 109 9" />
        </svg>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-muted">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 6" />
      </svg>
    </div>
  )
}

export default function DeviceCheckScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()

  const [micStatus, setMicStatus] = useState('checking')
  const [internetStatus, setInternetStatus] = useState('checking')
  const [speakerStatus] = useState('idle')
  const [micTesting, setMicTesting] = useState(false)
  const [micTested, setMicTested] = useState(false)
  const [levels, setLevels] = useState([20, 35, 15, 10, 5])

  const micReady = micStatus === 'ready'
  const internetReady = internetStatus === 'ready'
  const canContinue = micReady && internetReady

  useEffect(() => {
    const micTimer = setTimeout(() => setMicStatus('ready'), 1200)
    const netTimer = setTimeout(() => {
      setInternetStatus(navigator.onLine ? 'ready' : 'error')
    }, 800)

    return () => {
      clearTimeout(micTimer)
      clearTimeout(netTimer)
    }
  }, [])

  useEffect(() => {
    if (!micTesting) return undefined

    let count = 0
    const interval = setInterval(() => {
      setLevels(Array.from({ length: 5 }, () => Math.floor(Math.random() * 90) + 10))
      count += 1
      if (count > 20) {
        clearInterval(interval)
        setLevels([65, 65, 65, 65, 65])
        setMicTesting(false)
        setMicTested(true)
      }
    }, 120)

    return () => clearInterval(interval)
  }, [micTesting])

  function handleTestMic() {
    if (!micReady) {
      setMicStatus('checking')
      setTimeout(() => setMicStatus('ready'), 800)
      return
    }
    setMicTesting(true)
    setMicTested(false)
  }

  return (
    <div className="relative flex h-full flex-col bg-transparent font-nunito text-dark">
      <header className="flex shrink-0 items-center justify-between px-5 pb-5 pt-6">
        <button
          type="button"
          onClick={() => navigate(`/tests/${testId}`)}
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
          <span className="type-meta font-extrabold tracking-[-0.02em]">ElytEdu</span>
        </div>

        <div className="text-right">
          <p className="type-label text-muted">Step</p>
          <p className="type-meta font-extrabold text-dark">1 of 4</p>
        </div>
      </header>

      <div className="px-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
          <div className="h-full w-1/4 rounded-full bg-brand transition-all" />
        </div>
      </div>

      <section className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-7">
        <div className="text-center">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-brand-light text-brand">
            <div className="pulse-ring absolute inset-0 rounded-[26px] border-2 border-brand/20" />
            <svg className="relative h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
              <rect x="7" y="3" width="10" height="14" rx="5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11a7.5 7.5 0 0015 0M12 18.5V22M8.5 22h7" />
            </svg>
          </div>

          <h1 className="type-title mt-5 text-dark">Check your device</h1>
          <p className="type-body mx-auto mt-2 max-w-[320px] text-muted">
            Let&apos;s make sure your microphone, speakers and connection are ready before you begin.
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-[24px] border border-black/[0.05] bg-white soft-shadow">
          <div className="flex items-center gap-3.5 border-b border-black/[0.05] px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-brand-light text-brand">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15a3 3 0 003-3V7a3 3 0 10-6 0v5a3 3 0 003 3z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0M12 18v3M8.5 21h7" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="type-meta font-extrabold text-dark">Microphone</p>
              <p
                className={`type-caption mt-0.5 ${
                  micStatus === 'ready'
                    ? 'font-semibold text-brand'
                    : micStatus === 'error'
                      ? 'font-semibold text-red-500'
                      : 'text-muted'
                }`}
              >
                {micStatus === 'checking' && 'Checking microphone access...'}
                {micStatus === 'ready' && 'Microphone detected'}
                {micStatus === 'error' && 'Microphone permission is required'}
              </p>
            </div>
            <StatusIcon status={micStatus} />
          </div>

          <div className="flex items-center gap-3.5 border-b border-black/[0.05] px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-brand-light text-brand">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v4h3l4 3V7l-4 3H5z" />
                <path strokeLinecap="round" d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="type-meta font-extrabold text-dark">Speaker</p>
              <p className="type-caption mt-0.5 text-muted">Ready to test</p>
            </div>
            <StatusIcon status={speakerStatus} />
          </div>

          <div className="flex items-center gap-3.5 px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-brand-light text-brand">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 9.5a11 11 0 0114 0M8 13a6.5 6.5 0 018 0M11 16.5a2 2 0 012 0M12 20h.01"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="type-meta font-extrabold text-dark">Internet connection</p>
              <p
                className={`type-caption mt-0.5 ${
                  internetStatus === 'ready'
                    ? 'font-semibold text-brand'
                    : internetStatus === 'error'
                      ? 'font-semibold text-red-500'
                      : 'text-muted'
                }`}
              >
                {internetStatus === 'checking' && 'Checking connection...'}
                {internetStatus === 'ready' && 'Connection looks good'}
                {internetStatus === 'error' && 'No internet connection'}
              </p>
            </div>
            <StatusIcon status={internetStatus} />
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-brand/10 bg-brand-light/50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15a3 3 0 003-3V7a3 3 0 10-6 0v5a3 3 0 003 3z"
                />
                <path strokeLinecap="round" d="M19 11a7 7 0 01-14 0" />
              </svg>
            </div>

            <div className="flex-1">
              <p className="type-meta font-extrabold text-dark">Test your microphone</p>
              <p className="type-caption mt-1 leading-5 text-muted">
                Say a few words when prompted. We&apos;ll check that your voice is being detected
                clearly.
              </p>

              <div className="mt-3 flex items-center gap-1.5">
                {levels.map((level, index) => (
                  <div key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${level}%` }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleTestMic}
                className="type-caption mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 font-extrabold text-brand shadow-sm transition active:scale-95"
              >
                {micTesting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        d="M12 15a3 3 0 003-3V7a3 3 0 10-6 0v5a3 3 0 003 3z"
                      />
                    </svg>
                    Listening...
                  </>
                ) : micTested ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 6" />
                    </svg>
                    Microphone works
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15a3 3 0 003-3V7a3 3 0 10-6 0v5a3 3 0 003 3z"
                      />
                      <path strokeLinecap="round" d="M19 11a7 7 0 01-14 0" />
                    </svg>
                    Test microphone
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 px-1">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
          </svg>
          <p className="type-caption leading-4 text-muted">
            Please use headphones or a quiet environment if possible. Do not close this window or
            switch tabs during the assessment.
          </p>
        </div>
      </section>

      <div className="shrink-0 border-t border-black/[0.05] bg-surface/95 px-5 py-4 backdrop-blur-xl">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => navigate(`/tests/${testId}/instructions`)}
          className={`type-btn flex h-[52px] w-full items-center justify-center gap-2 rounded-[18px] transition ${
            canContinue
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
            canContinue ? 'text-brand' : 'text-muted'
          }`}
        >
          {canContinue ? 'Your device is ready' : 'Complete the device check to continue'}
        </p>
      </div>
    </div>
  )
}
