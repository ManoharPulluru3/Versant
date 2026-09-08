export default function SplashScreen() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent font-nunito">
      <div className="animate-pulse-soft absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-light" />
      <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#FFF0DF]" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-8">
        <div className="animate-fade-up flex flex-col items-center">
          <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-[30px] bg-brand shadow-lg">
            <div className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-accent" />

            <svg
              className="relative h-11 w-11 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.5A5.5 5.5 0 0 1 14.5 7h19A5.5 5.5 0 0 1 39 12.5v13A5.5 5.5 0 0 1 33.5 31H23l-8.5 7v-7h0A5.5 5.5 0 0 1 9 25.5v-13Z"
              />
              <path strokeLinecap="round" d="M17 18h14" />
              <path strokeLinecap="round" d="M17 23h9" />
            </svg>
          </div>

          <div className="mt-7 text-center">
            <h1 className="type-display text-dark">
              Elyt<span className="text-brand">Edu</span>
            </h1>
            <p className="type-label mt-2 text-[#8A918B]">English Assessment</p>
          </div>
        </div>

        <div
          className="animate-fade-up mt-14 max-w-[300px] text-center opacity-0"
          style={{ animationDelay: '0.2s' }}
        >
          <h2 className="type-title text-dark">
            Measure your English.{' '}
            <span className="text-brand">Improve your communication.</span>
          </h2>
          <p className="type-body mt-3 text-muted">
            AI-powered assessment for Speaking, Listening, Reading and Writing.
          </p>
        </div>

        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-2 opacity-0"
          style={{ animationDelay: '0.35s' }}
        >
          <div className="flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="type-caption font-extrabold text-brand">Speaking</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#FFF0DF] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="type-caption font-extrabold text-[#9B693F]">Listening</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#EEEFFA] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5C63A8]" />
            <span className="type-caption font-extrabold text-[#5C63A8]">Reading</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#F2E5F1] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9A5792]" />
            <span className="type-caption font-extrabold text-[#9A5792]">Writing</span>
          </div>
        </div>
      </div>

      <div className="relative px-8 pb-9">
        <div className="mx-auto mb-4 h-[3px] w-[110px] overflow-hidden rounded-full bg-[#E7EBE2]">
          <div className="loading-bar h-full rounded-full bg-brand" />
        </div>
        <p className="type-label text-center text-[#A0A69F]">Powered by ElytEdu</p>
      </div>
    </div>
  )
}
