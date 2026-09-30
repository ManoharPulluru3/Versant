import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BG_OPTIONS, useTheme } from '../context/ThemeContext'

const DEFAULT_TEST_ID = 'english-communication'

const PROFILE_FIELDS = [
  {
    label: 'Full name',
    value: 'Emma Wilson',
    meta: 'Student',
    icon: 'user',
  },
  {
    label: 'Email',
    value: 'emma.wilson@college.edu',
    icon: 'email',
  },
  {
    label: 'Student ID',
    value: 'EW20260421',
    icon: 'id',
  },
  {
    label: 'Institution',
    value: 'ElytEdu College',
    icon: 'college',
  },
]

function FieldIcon({ name }) {
  if (name === 'user') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M5 20C5.8 16.9 8.1 15 12 15C15.9 15 18.2 16.9 19 20"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (name === 'email') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4.5 7L12 13L19.5 7" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    )
  }

  if (name === 'id') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 9H16M8 13H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 20H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6 20V9L12 5L18 9V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12H15M9 15H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#9AA19C]">
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Toggle({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${
        active ? 'bg-brand' : 'bg-[#D6DBD4]'
      }`}
    >
      <span
        className={`block h-5 w-5 rounded-full bg-white shadow-sm transition ${
          active ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { darkMode, background, setBackground, toggleDarkMode } = useTheme()
  const [rememberDevice, setRememberDevice] = useState(true)
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)

  function signOut() {
    if (window.confirm('Are you sure you want to sign out?')) {
      navigate('/login')
    }
  }

  return (
    <div className="hide-scrollbar relative h-full overflow-y-auto bg-transparent font-nunito text-dark">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-52 w-52 rounded-full bg-brand-light opacity-70 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-56 w-56 rounded-full bg-[#F4D7BE] opacity-50 blur-3xl" />
      </div>

      <header className="relative z-10 px-5 pb-2 pt-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="type-label text-[#9AA19B]">Account & settings</p>
            <h1 className="type-title mt-1 text-dark">Profile</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-cream"
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5 text-[#39443E]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.4-1.5A2 2 0 0 1 18 14.1V11a6 6 0 1 0-12 0v3.1c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
      </header>

      <div className="relative z-10 px-5 pb-8 pt-5">
        <section className="mb-7 overflow-hidden rounded-[25px] bg-brand p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[18px] font-extrabold tracking-wide text-white">
              EW
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="type-title truncate text-white">Emma Wilson</h2>
              <p className="type-caption mt-1 text-white/70">Student · English Communication</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 type-label font-extrabold text-white">
              B2
            </span>
            <span className="type-caption text-white/70">Upper Intermediate</span>
            <span className="text-white/35">·</span>
            <span className="type-caption text-white/70">Active today</span>
          </div>

          <button
            type="button"
            onClick={() => window.alert('Open Edit Profile')}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white type-meta font-extrabold text-brand transition hover:bg-white/95"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 20H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path
                d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L8 18L3 19L4 14L16.5 3.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Edit profile
          </button>
        </section>

        <section className="mb-7">
          <p className="type-label text-[#9AA19B]">Profile information</p>
          <h3 className="type-section mt-1 text-dark">Student details</h3>
          <p className="type-caption mt-1 text-muted">Your student and academic information.</p>

          <div className="mt-3 overflow-hidden rounded-[22px] border border-[#E5E8E2] bg-white">
            {PROFILE_FIELDS.map((field, index) => (
              <div
                key={field.label}
                className={`flex items-center justify-between gap-5 px-5 py-4 transition hover:bg-[#F7F8F2] ${
                  index < PROFILE_FIELDS.length - 1 ? 'border-b border-[#ECEEE9]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                    <FieldIcon name={field.icon} />
                  </div>
                  <div>
                    <p className="type-caption text-[#8A928D]">{field.label}</p>
                    <p className="type-meta mt-0.5 font-bold">{field.value}</p>
                  </div>
                </div>
                {field.meta && <span className="type-caption text-[#9AA19C]">{field.meta}</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-7">
          <p className="type-label text-[#9AA19B]">Appearance</p>
          <h3 className="type-section mt-1 text-dark">Theme & background</h3>
          <p className="type-caption mt-1 text-muted">
            Switch dark mode and pick an app background.
          </p>

          <div className="mt-3 overflow-hidden rounded-[22px] border border-[#E5E8E2] bg-white">
            <div className="flex items-center justify-between gap-5 border-b border-[#ECEEE9] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    {darkMode ? (
                      <path
                        d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                        <path
                          d="M12 2.5V4.5M12 19.5V21.5M4.5 12H2.5M21.5 12H19.5M5.6 5.6L4.2 4.2M19.8 19.8L18.4 18.4M18.4 5.6L19.8 4.2M4.2 19.8L5.6 18.4"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </>
                    )}
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Dark mode</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">
                    {darkMode ? 'On — easier on the eyes' : 'Off — light appearance'}
                  </p>
                </div>
              </div>
              <Toggle
                active={darkMode}
                onClick={toggleDarkMode}
                label="Toggle dark mode"
              />
            </div>

            <div className="px-5 py-4">
              <p className="type-meta font-bold">Background</p>
              <p className="type-caption mt-0.5 text-[#8A928D]">
                Applies across the whole app
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {BG_OPTIONS.map((option) => {
                  const selected = background === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setBackground(option.id)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        selected
                          ? 'border-brand bg-brand-light/60 ring-1 ring-brand'
                          : 'border-[#E5E8E2] bg-white hover:bg-[#F7F8F2]'
                      }`}
                    >
                      <div
                        className={`h-10 w-full rounded-xl border border-black/5 ${
                          option.id === 'plain'
                            ? 'bg-white'
                            : option.id === 'mint'
                              ? 'bg-[linear-gradient(135deg,#dff0e0,#f2f7f0)]'
                              : option.id === 'warm'
                                ? 'bg-[linear-gradient(135deg,#f6ebe0,#faf6f1)]'
                                : 'bg-[linear-gradient(135deg,#e8f0e4,#faf6f1)]'
                        } ${darkMode && option.id === 'plain' ? '!bg-[#121916]' : ''} ${
                          darkMode && option.id !== 'plain'
                            ? 'opacity-90 brightness-75'
                            : ''
                        }`}
                      />
                      <div className="mt-2.5 type-caption font-extrabold text-dark">
                        {option.label}
                      </div>
                      <div className="mt-0.5 type-label font-semibold normal-case tracking-normal text-[#8A928D]">
                        {option.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-7">
          <p className="type-label text-[#9AA19B]">Account settings</p>
          <h3 className="type-section mt-1 text-dark">Preferences & security</h3>
          <p className="type-caption mt-1 text-muted">
            Manage your account preferences and security.
          </p>

          <div className="mt-3 overflow-hidden rounded-[22px] border border-[#E5E8E2] bg-white">
            <button
              type="button"
              onClick={() => window.alert('Open Change Password')}
              className="flex w-full items-center justify-between gap-4 border-b border-[#ECEEE9] px-5 py-4 text-left transition hover:bg-[#F7F8F2]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Change password</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">Update your account password</p>
                </div>
              </div>
              <Chevron />
            </button>

            <button
              type="button"
              onClick={() => navigate('/notifications')}
              className="flex w-full items-center justify-between gap-4 border-b border-[#ECEEE9] px-5 py-4 text-left transition hover:bg-[#F7F8F2]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 9C18 5.69 15.31 3 12 3C8.69 3 6 5.69 6 9C6 14 4 16 4 16H20C20 16 18 14 18 9Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path d="M10 20H14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Notifications</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">
                    Assessment and learning updates
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#FDEBDD] px-2 py-1 type-label font-extrabold text-[#B86B32]">
                  4 unread
                </span>
                <Chevron />
              </div>
            </button>

            <div className="flex items-center justify-between gap-4 border-b border-[#ECEEE9] px-5 py-4 transition hover:bg-[#F7F8F2]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M3.8 12H20.2M12 3.5C14.2 5.8 15.3 8.63 15.3 12C15.3 15.37 14.2 18.2 12 20.5C9.8 18.2 8.7 15.37 8.7 12C8.7 8.63 9.8 5.8 12 3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Language</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">Interface language</p>
                </div>
              </div>
              <span className="flex items-center gap-2 type-meta font-bold text-brand">
                English
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
            </div>

            <div className="flex items-center justify-between gap-5 px-5 py-4 transition hover:bg-[#F7F8F2]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M8 9H16M8 13H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Remember this device</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">Stay signed in on this device</p>
                </div>
              </div>
              <Toggle
                active={rememberDevice}
                onClick={() => setRememberDevice((value) => !value)}
                label="Toggle remember device"
              />
            </div>
          </div>
        </section>

        <section className="mb-7">
          <p className="type-label text-[#9AA19B]">Assessment preferences</p>
          <h3 className="type-section mt-1 text-dark">Test setup</h3>
          <p className="type-caption mt-1 text-muted">
            Preferences that help you prepare for assessments.
          </p>

          <div className="mt-3 overflow-hidden rounded-[22px] border border-[#E5E8E2] bg-white">
            <div className="flex items-center justify-between gap-5 border-b border-[#ECEEE9] px-5 py-4 transition hover:bg-[#F7F8F2]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 9V15H9L14 19V5L9 9H5Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 9C18 10 18 14 17 15"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Assessment audio</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">Use headphones when available</p>
                </div>
              </div>
              <span className="rounded-full bg-brand-light px-2.5 py-1 type-label font-extrabold text-brand">
                Recommended
              </span>
            </div>

            <div className="flex items-center justify-between gap-5 border-b border-[#ECEEE9] px-5 py-4 transition hover:bg-[#F7F8F2]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="8" y="3" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M5 11C5 14.87 8.13 18 12 18C15.87 18 19 14.87 19 11"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 18V21M9 21H15"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Microphone</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">Default microphone</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/tests/${DEFAULT_TEST_ID}/device-check`)}
                className="rounded-lg border border-[#DDE2DA] bg-white px-3 py-2 type-caption font-extrabold text-brand transition hover:bg-[#F6F8F3]"
              >
                Check device
              </button>
            </div>

            <div className="flex items-center justify-between gap-5 px-5 py-4 transition hover:bg-[#F7F8F2]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 5L18 12L8 19V5Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Auto-play practice audio</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">
                    Automatically play audio during practice
                  </p>
                </div>
              </div>
              <Toggle
                active={autoPlayAudio}
                onClick={() => setAutoPlayAudio((value) => !value)}
                label="Toggle auto-play audio"
              />
            </div>
          </div>
        </section>

        <section className="mb-7">
          <p className="type-label text-[#9AA19B]">Support</p>
          <h3 className="type-section mt-1 text-dark">Help & privacy</h3>

          <div className="mt-3 overflow-hidden rounded-[22px] border border-[#E5E8E2] bg-white">
            <button
              type="button"
              onClick={() => window.alert('Open Help & Support')}
              className="flex w-full items-center justify-between gap-4 border-b border-[#ECEEE9] px-5 py-4 text-left transition hover:bg-[#F7F8F2]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M9.7 9C9.95 7.9 10.8 7.2 12 7.2C13.4 7.2 14.3 8.1 14.3 9.25C14.3 10.4 13.6 11.05 12.65 11.65C11.8 12.2 11.5 12.7 11.5 13.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                    <circle cx="11.5" cy="16.5" r="0.8" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Help & support</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">
                    Get help with your account or assessment
                  </p>
                </div>
              </div>
              <Chevron />
            </button>

            <button
              type="button"
              onClick={() => window.alert('Open Privacy & Data')}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#F7F8F2]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5ED] text-brand">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3L19 6V11C19 15.5 16.2 19 12 21C7.8 19 5 15.5 5 11V6L12 3Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12L11 14L15 10"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="type-meta font-bold">Privacy & data</p>
                  <p className="type-caption mt-0.5 text-[#8A928D]">
                    Manage your data and privacy preferences
                  </p>
                </div>
              </div>
              <Chevron />
            </button>
          </div>
        </section>

        <section className="mb-8">
          <button
            type="button"
            onClick={signOut}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border border-[#E9D8CF] bg-[#FFF9F5] type-meta font-extrabold text-[#B65F39] transition hover:bg-[#FFF3EC]"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 5H6.5C5.67 5 5 5.67 5 6.5V17.5C5 18.33 5.67 19 6.5 19H10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M14 8L18 12L14 16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M18 12H10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            Sign out
          </button>
        </section>

        <footer className="pb-2 pt-1 text-center">
          <p className="type-caption text-[#B0B6B1]">Version 1.0.0</p>
        </footer>
      </div>
    </div>
  )
}
