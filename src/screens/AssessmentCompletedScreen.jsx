import { useNavigate, useParams } from 'react-router-dom'

export default function AssessmentCompletedScreen() {
  const navigate = useNavigate()
  const { testId = 'english-communication' } = useParams()
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent font-nunito text-dark">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand-light opacity-70 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-52 w-52 rounded-full bg-[#F5DCC7] opacity-50 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-brand-light opacity-50 blur-3xl" />
      </div>

      <header className="relative z-10 flex h-[64px] shrink-0 items-center justify-between border-b border-[#ECEFE9] px-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
              <path
                d="M5 6.5C5 5.12 6.12 4 7.5 4h9C17.88 4 19 5.12 19 6.5v6c0 1.38-1.12 2.5-2.5 2.5H12l-4.5 3v-3H7.5C6.12 15 5 13.88 5 12.5v-6Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M9 9h6M9 12h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-surface bg-accent" />
          </div>
          <div>
            <div className="type-card tracking-[-0.3px]">ElytEdu</div>
            <div className="type-label font-bold tracking-[1.5px] text-muted">ENGLISH ASSESSMENT</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="type-caption font-semibold text-muted">Assessment submitted</span>
        </div>
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto px-5 py-8">
        <div className="w-full max-w-[720px] text-center">
          <div className="relative mx-auto mb-7 w-fit">
            <div className="absolute inset-0 scale-125 rounded-full bg-brand-light opacity-80 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-light">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand shadow-[0_12px_30px_rgba(31,107,79,0.18)]">
                <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-white">
                  <path
                    d="M5 12.5 9.2 17 19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <span className="absolute -right-1 top-2 h-4 w-4 rounded-full border-[3px] border-surface bg-accent" />
          </div>

          <div className="mx-auto max-w-[600px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2EAE3] bg-[#F1F5F0] px-3 py-1.5 type-label font-extrabold uppercase tracking-[1.2px] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Assessment submitted
            </div>

            <h1 className="type-display tracking-[-1.5px]">Assessment completed.</h1>

            <p className="type-body mt-4 leading-7 text-muted">
              Well done, Emma! Your English Communication Test has been submitted successfully.
            </p>
          </div>

          <div className="mt-9 overflow-hidden rounded-[24px] border border-[#E7EBE5] bg-white text-left shadow-[0_12px_40px_rgba(23,34,29,0.05)]">
            <div className="flex items-center justify-between border-b border-[#ECEFE9] px-5 py-4">
              <div>
                <p className="type-label font-extrabold uppercase tracking-[1px] text-muted">
                  Completed assessment
                </p>
                <h2 className="type-card mt-1">English Communication Test</h2>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-brand">
                  <path
                    d="M7 3.8h7.5L19 8.3V20H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3.8V9h5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m8.5 14 2.2 2.2 4.8-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[#ECEFE9]">
              <div className="px-3 py-5">
                <p className="type-caption font-bold text-muted">Questions</p>
                <p className="mt-1 text-[21px] font-extrabold leading-none">12</p>
                <p className="type-label mt-0.5 text-muted">Completed</p>
              </div>
              <div className="px-3 py-5">
                <p className="type-caption font-bold text-muted">Time spent</p>
                <p className="mt-1 text-[21px] font-extrabold leading-none">27:42</p>
                <p className="type-label mt-0.5 text-muted">Minutes</p>
              </div>
              <div className="px-3 py-5">
                <p className="type-caption font-bold text-muted">Skills</p>
                <p className="mt-1 text-[21px] font-extrabold leading-none">4</p>
                <p className="type-label mt-0.5 text-muted">Assessed</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-[20px] border border-[#E7ECE4] bg-[#F5F7F2] px-5 py-4 text-left">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-brand">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 10.5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <circle cx="12" cy="7.5" r="1" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="type-meta font-extrabold">Your results are being prepared</p>
              <p className="type-caption mt-1 leading-5 text-muted">
                Your speaking, listening, reading and writing responses will be evaluated. Your
                detailed score and skill report will be available shortly.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate(`/tests/${testId}/results`)}
              className="type-btn flex h-12 w-full items-center justify-center rounded-xl bg-brand text-white shadow-[0_8px_20px_rgba(31,107,79,0.16)] transition hover:bg-[#195A42] active:scale-[0.98]"
            >
              View Results
            </button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="type-btn flex h-12 w-full items-center justify-center rounded-xl border border-[#DDE3DC] bg-white text-dark transition hover:bg-[#F7F8F5] active:scale-[0.98]"
            >
              Back to Home
            </button>
          </div>

          <p className="type-caption mt-7 text-[#9AA19C]">
            You can safely leave this page. Your assessment has been submitted.
          </p>
        </div>
      </section>

      <footer className="relative z-10 flex shrink-0 items-center justify-center border-t border-[#ECEFE9] px-5 py-4">
        <p className="type-label font-bold tracking-[1.4px] text-[#9AA19C]">POWERED BY ELYTEDU</p>
      </footer>
    </div>
  )
}
