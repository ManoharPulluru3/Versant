import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginScreen() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSignIn(e) {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent font-nunito">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-light" />
      <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-[#FFF0DF]" />

      <header className="relative px-6 pt-7">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cream"
          aria-label="Back"
        >
          <svg
            className="h-5 w-5 text-dark"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 12H5M11 18l-6-6 6-6"
            />
          </svg>
        </button>
      </header>

      <div className="relative flex flex-1 flex-col overflow-y-auto px-6 pt-12 hide-scrollbar">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-brand">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.5A5.5 5.5 0 0 1 14.5 7h19A5.5 5.5 0 0 1 39 12.5v13A5.5 5.5 0 0 1 33.5 31H23l-8.5 7v-7A5.5 5.5 0 0 1 9 25.5v-13Z"
              />
              <path strokeLinecap="round" d="M17 18h14M17 23h9" />
            </svg>
          </div>

          <div>
            <h1 className="type-section text-dark">
              Elyt<span className="text-brand">Edu</span>
            </h1>
            <p className="type-label mt-0.5 text-[#9AA19B]">English Assessment</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="type-display text-dark">Welcome back.</h2>
          <p className="type-body mt-2 max-w-[300px] text-muted">
            Sign in to continue your English assessment and practice.
          </p>
        </div>

        <form className="mt-9" onSubmit={handleSignIn}>
          <div>
            <label className="type-meta mb-2 block text-[#39443E]">Student ID / Email</label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center">
                <svg
                  className="h-[18px] w-[18px] text-[#8E9790]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path strokeLinecap="round" d="M5 20a7 7 0 0 1 14 0" />
                </svg>
              </div>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID or email"
                className="type-meta h-[54px] w-full rounded-[17px] border border-[#E7EBE3] bg-[#F7F8F3] pl-12 pr-4 text-dark outline-none transition placeholder:text-[#A1A8A2] focus:border-brand focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="type-meta block text-[#39443E]">Password</label>
              <button type="button" className="type-link text-brand">
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center">
                <svg
                  className="h-[18px] w-[18px] text-[#8E9790]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path strokeLinecap="round" d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="type-meta h-[54px] w-full rounded-[17px] border border-[#E7EBE3] bg-[#F7F8F3] pl-12 pr-12 text-dark outline-none transition placeholder:text-[#A1A8A2] focus:border-brand focus:bg-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg
                  className="h-[18px] w-[18px] text-[#8E9790]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                  />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-[#D7DED5] accent-brand"
            />
            <label htmlFor="remember" className="type-caption text-muted">
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            className="type-btn mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-[17px] bg-brand text-white shadow-[0_8px_20px_rgba(31,107,79,0.16)] transition active:scale-[0.98]"
          >
            Sign In
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#EAEDE7]" />
          <span className="type-label text-[#A0A69F]">College Access</span>
          <div className="h-px flex-1 bg-[#EAEDE7]" />
        </div>

        <button
          type="button"
          onClick={() => navigate('/home')}
          className="type-btn mt-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-[16px] border border-[#E5EAE2] bg-white text-[#39443E]"
        >
          <svg
            className="h-4 w-4 text-brand"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 20V8l8-5 8 5v12M2 20h20"
            />
            <path strokeLinecap="round" d="M8 12h1M12 12h1M16 12h1M8 16h1M12 16h1M16 16h1" />
          </svg>
          Sign in with College ID
        </button>

        <div className="mt-auto pb-9 pt-10 text-center">
          <p className="type-caption text-[#9AA19B]">Having trouble signing in?</p>
          <button type="button" className="type-link mt-1 text-brand">
            Contact your college administrator
          </button>
        </div>
      </div>
    </div>
  )
}
