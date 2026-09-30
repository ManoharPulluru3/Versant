import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const TABS = [
  {
    group: 'General',
    items: [
      { id: 'college', label: 'College Settings', icon: 'college' },
      { id: 'assessment', label: 'Assessment Settings', icon: 'assessment' },
      { id: 'users', label: 'Users & Roles', icon: 'users' },
    ],
  },
  {
    group: 'Platform',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'bell' },
      { id: 'security', label: 'Security', icon: 'lock' },
      { id: 'integrations', label: 'Integrations', icon: 'link' },
    ],
  },
]

const INITIAL = {
  collegeName: 'ElytEdu Engineering College',
  collegeCode: 'ELT-ENG-001',
  academicYear: '2026 – 2027',
  contactEmail: 'admin@elytedu.com',
  contactPhone: '+91 98765 43210',
  address: 'Hyderabad, Telangana, India',
  duration: '30',
  attempts: '1',
  passScore: '60',
  fullscreen: true,
  allowResume: true,
  micCheck: true,
  preventNav: true,
  facultyCreate: true,
  facultyAllResults: false,
  notifyAssigned: true,
  notifyReminders: true,
  notifyResults: true,
  notifySystem: true,
  reminderTiming: '24 hours before',
  reminderChannels: 'Email + Push',
  sessionTimeout: '30 minutes',
}

function Toast({ message, visible }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-7 right-7 z-[80] rounded-xl bg-[#183E30] px-4 py-3 text-[14px] font-bold text-white shadow-xl transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      {message}
    </div>
  )
}

function TabIcon({ name }) {
  const common = {
    width: 20,
    height: 20,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
  }

  if (name === 'college') {
    return (
      <svg {...common}>
        <path d="M3 14V5l5-2 5 2v9M2 14h12M6 14V9h4v5" />
      </svg>
    )
  }
  if (name === 'assessment') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="10" height="10" rx="2" />
        <path d="M6 6h4M6 9h4M6 12h2" />
      </svg>
    )
  }
  if (name === 'users') {
    return (
      <svg {...common}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="11" cy="7" r="2" />
        <path d="M2.8 13c.3-2 1.3-3 3.2-3s2.9 1 3.2 3M8 13c.3-1.7 1.3-2.6 3-2.6 1.7 0 2.7.9 3 2.6" />
      </svg>
    )
  }
  if (name === 'bell') {
    return (
      <svg {...common}>
        <path d="M12 7a4 4 0 0 0-8 0c0 4-1.5 4.5-1.5 5.5h11C13.5 11.5 12 11 12 7Z" />
        <path d="M6.5 14h3" />
      </svg>
    )
  }
  if (name === 'lock') {
    return (
      <svg {...common}>
        <rect x="3" y="7" width="10" height="7" rx="1.5" />
        <path d="M5 7V5a3 3 0 0 1 6 0v2" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M6 9.5l-2 2a2.1 2.1 0 0 0 3 3l2-2M10 6.5l2-2a2.1 2.1 0 0 1 3 3l-2 2M6.5 10l3-3" />
    </svg>
  )
}

function Toggle({ checked, onChange, title, desc, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between text-left ${className}`}
    >
      <div className="pr-4">
        <div className="text-[14px] font-extrabold">{title}</div>
        {desc ? <div className="mt-0.5 text-[13px] text-muted">{desc}</div> : null}
      </div>
      <span
        className={`relative h-5 w-[38px] shrink-0 rounded-full transition ${
          checked ? 'bg-brand' : 'bg-[#CBD3CC]'
        }`}
      >
        <span
          className={`absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition ${
            checked ? 'translate-x-[18px]' : ''
          }`}
        />
      </span>
    </button>
  )
}

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-[13px] font-extrabold uppercase tracking-[.7px] text-muted">
      {children}
    </label>
  )
}

function TextInput({ value, onChange, suffix }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-[15px] font-semibold outline-none focus:border-brand ${
          suffix ? 'pr-12' : ''
        }`}
      />
      {suffix ? (
        <span className="absolute right-3 top-3 text-[13px] text-muted">{suffix}</span>
      ) : null}
    </div>
  )
}

function SelectInput({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-12 w-full rounded-xl border border-[#DDE4DC] bg-white px-3 text-[15px] font-semibold outline-none focus:border-brand ${className}`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

export default function AdminSettingsScreen() {
  const [tab, setTab] = useState('college')
  const [form, setForm] = useState(INITIAL)
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    if (!toast) return undefined
    setToastVisible(true)
    const timer = setTimeout(() => {
      setToastVisible(false)
      setTimeout(() => setToast(''), 300)
    }, 2600)
    return () => clearTimeout(timer)
  }, [toast])

  function showToast(message) {
    setToast(message)
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function switchTab(id) {
    setTab(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="px-8 py-8 lg:px-10">
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-[#E3EFE5] px-2.5 py-1 text-[13px] font-extrabold uppercase tracking-[1px] text-brand">
            Configuration
          </span>
          <span className="text-[14px] text-muted">Last saved 08 Sep 2026, 6:31 PM</span>
        </div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.8px]">Settings</h1>
        <p className="mt-1 text-[15px] text-muted">
          Manage your college, assessments, users and platform preferences.
        </p>
      </div>

      <div className="grid grid-cols-[270px_1fr] gap-6">
        <div className="h-fit rounded-2xl border border-[#E2E7DF] bg-surface p-2.5 shadow-[0_18px_50px_rgba(31,107,79,.06)]">
          {TABS.map((group, gi) => (
            <div key={group.group}>
              {gi > 0 ? <div className="my-3 h-px bg-[#E8ECE5]" /> : null}
              <div className="px-3 pb-2 pt-2 text-[12px] font-extrabold uppercase tracking-[1.2px] text-[#A1AAA4]">
                {group.group}
              </div>
              {group.items.map((item) => {
                const active = tab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => switchTab(item.id)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] ${
                      active
                        ? 'bg-[#E4EFE6] font-extrabold text-brand'
                        : 'font-semibold text-muted hover:bg-[#F3F5F1]'
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                      <TabIcon name={item.icon} />
                    </span>
                    {item.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="min-w-0">
          {tab === 'college' ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E2E7DF] bg-surface shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="border-b border-[#E7EBE5] px-6 py-5">
                  <div className="text-[15px] font-extrabold">College Information</div>
                  <div className="mt-0.5 text-[14px] text-muted">
                    Basic information displayed across the platform.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 p-6">
                  <div className="col-span-2">
                    <FieldLabel>College Name</FieldLabel>
                    <TextInput
                      value={form.collegeName}
                      onChange={(v) => setField('collegeName', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>College Code</FieldLabel>
                    <TextInput
                      value={form.collegeCode}
                      onChange={(v) => setField('collegeCode', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Academic Year</FieldLabel>
                    <SelectInput
                      value={form.academicYear}
                      onChange={(v) => setField('academicYear', v)}
                      options={['2026 – 2027', '2025 – 2026']}
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact Email</FieldLabel>
                    <TextInput
                      value={form.contactEmail}
                      onChange={(v) => setField('contactEmail', v)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact Phone</FieldLabel>
                    <TextInput
                      value={form.contactPhone}
                      onChange={(v) => setField('contactPhone', v)}
                    />
                  </div>
                  <div className="col-span-2">
                    <FieldLabel>Address</FieldLabel>
                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(e) => setField('address', e.target.value)}
                      className="w-full resize-none rounded-xl border border-[#DDE4DC] bg-white p-3 text-[15px] font-semibold outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-6 shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[16px] font-extrabold">Branding</div>
                    <div className="mt-0.5 text-[13px] text-muted">
                      Customize how your institution appears to students.
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                    <span className="text-[15px] font-extrabold">E</span>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-[120px_1fr] gap-5">
                  <div className="flex h-[100px] w-[120px] items-center justify-center rounded-xl border border-dashed border-[#C9D4CA] bg-[#F6F8F3]">
                    <div className="text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-extrabold text-white">
                        E
                      </div>
                      <div className="mt-2 text-[12px] font-bold text-muted">College Logo</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold">Institution Logo</div>
                    <div className="mt-1 text-[13px] leading-5 text-muted">
                      Recommended size 512 × 512px. PNG or SVG.
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Logo upload opened')}
                      className="mt-3 rounded-lg border border-[#DDE4DC] bg-white px-3 py-2 text-[13px] font-extrabold text-brand"
                    >
                      Upload Logo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'assessment' ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E2E7DF] bg-surface shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="border-b border-[#E7EBE5] px-6 py-5">
                  <div className="text-[15px] font-extrabold">Assessment Defaults</div>
                  <div className="mt-0.5 text-[14px] text-muted">
                    Default behavior for newly created assessments.
                  </div>
                </div>
                <div className="space-y-5 p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <FieldLabel>Default Duration</FieldLabel>
                      <TextInput
                        value={form.duration}
                        onChange={(v) => setField('duration', v)}
                        suffix="min"
                      />
                    </div>
                    <div>
                      <FieldLabel>Attempts Allowed</FieldLabel>
                      <SelectInput
                        value={form.attempts}
                        onChange={(v) => setField('attempts', v)}
                        options={['1', '2', '3']}
                      />
                    </div>
                    <div>
                      <FieldLabel>Pass Score</FieldLabel>
                      <TextInput
                        value={form.passScore}
                        onChange={(v) => setField('passScore', v)}
                        suffix="%"
                      />
                    </div>
                  </div>
                  <div className="h-px bg-[#E7EBE5]" />
                  <div className="space-y-4">
                    <Toggle
                      checked={form.fullscreen}
                      onChange={(v) => setField('fullscreen', v)}
                      title="Fullscreen assessment mode"
                      desc="Open assessments in a distraction-free fullscreen experience."
                    />
                    <Toggle
                      checked={form.allowResume}
                      onChange={(v) => setField('allowResume', v)}
                      title="Allow resume after connection loss"
                      desc="Allow students to continue when their connection temporarily drops."
                    />
                    <Toggle
                      checked={form.micCheck}
                      onChange={(v) => setField('micCheck', v)}
                      title="Require microphone check"
                      desc="Students must verify their microphone before speaking sections."
                    />
                    <Toggle
                      checked={form.preventNav}
                      onChange={(v) => setField('preventNav', v)}
                      title="Prevent question navigation"
                      desc="Students cannot return to a previously submitted question."
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-6 shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="text-[16px] font-extrabold">Evaluation Settings</div>
                <div className="mt-0.5 text-[13px] text-muted">
                  Configure automated evaluation behavior.
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#E1E6DF] bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-extrabold">AI Evaluation</div>
                        <div className="mt-1 text-[12px] text-muted">Automated skill scoring</div>
                      </div>
                      <span className="rounded-full bg-[#E3EFE5] px-2 py-1 text-[12px] font-extrabold text-brand">
                        Enabled
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E1E6DF] bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-extrabold">Manual Review</div>
                        <div className="mt-1 text-[12px] text-muted">Faculty review queue</div>
                      </div>
                      <span className="rounded-full bg-[#F3EBDD] px-2 py-1 text-[12px] font-extrabold text-accent">
                        Optional
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'users' ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E2E7DF] bg-surface shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="border-b border-[#E7EBE5] px-6 py-5">
                  <div className="text-[15px] font-extrabold">Users & Roles</div>
                  <div className="mt-0.5 text-[14px] text-muted">
                    Control permissions and access levels.
                  </div>
                </div>
                <div className="divide-y divide-[#E7EBE5]">
                  {[
                    {
                      title: 'Administrators',
                      desc: 'Full platform access',
                      count: '4 users',
                      to: '/admin/faculty',
                      iconBg: 'bg-[#E6EFE7] text-brand',
                    },
                    {
                      title: 'Faculty',
                      desc: 'Assessment and student management',
                      count: '68 users',
                      to: '/admin/faculty',
                      iconBg: 'bg-[#EAE8F3] text-[#69608D]',
                    },
                    {
                      title: 'Students',
                      desc: 'Assessment participants',
                      count: '1,248 users',
                      to: '/admin/students',
                      iconBg: 'bg-[#F3EBDD] text-accent',
                    },
                  ].map((role) => (
                    <div key={role.title} className="flex items-center justify-between px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-lg ${role.iconBg}`}
                        >
                          <svg
                            width="20" height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <circle cx="8" cy="5" r="2" />
                            <path d="M4 13c.4-2.1 1.7-3.2 4-3.2s3.6 1.1 4 3.2" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-[15px] font-extrabold">{role.title}</div>
                          <div className="text-[13px] text-muted">{role.desc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-[14px] font-extrabold">{role.count}</span>
                        <Link to={role.to} className="text-[13px] font-extrabold text-brand">
                          Manage
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-6 shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="text-[16px] font-extrabold">Access Controls</div>
                <div className="mt-5 space-y-4">
                  <Toggle
                    checked={form.facultyCreate}
                    onChange={(v) => setField('facultyCreate', v)}
                    title="Allow faculty to create assessments"
                    desc="Faculty can create and manage their own assessments."
                  />
                  <Toggle
                    checked={form.facultyAllResults}
                    onChange={(v) => setField('facultyAllResults', v)}
                    title="Allow faculty to view all results"
                    desc="Faculty can access results beyond their assigned batches."
                  />
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'notifications' ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E2E7DF] bg-surface shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="border-b border-[#E7EBE5] px-6 py-5">
                  <div className="text-[15px] font-extrabold">Notification Preferences</div>
                  <div className="mt-0.5 text-[14px] text-muted">
                    Choose which platform events should trigger notifications.
                  </div>
                </div>
                <div className="divide-y divide-[#E7EBE5]">
                  <Toggle
                    className="px-6 py-5"
                    checked={form.notifyAssigned}
                    onChange={(v) => setField('notifyAssigned', v)}
                    title="Assessment assigned"
                    desc="Notify students when a new assessment is assigned."
                  />
                  <Toggle
                    className="px-6 py-5"
                    checked={form.notifyReminders}
                    onChange={(v) => setField('notifyReminders', v)}
                    title="Assessment reminders"
                    desc="Send reminders before an assessment deadline."
                  />
                  <Toggle
                    className="px-6 py-5"
                    checked={form.notifyResults}
                    onChange={(v) => setField('notifyResults', v)}
                    title="Results published"
                    desc="Notify students when results become available."
                  />
                  <Toggle
                    className="px-6 py-5"
                    checked={form.notifySystem}
                    onChange={(v) => setField('notifySystem', v)}
                    title="System alerts"
                    desc="Important platform and service notifications."
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-6 shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="text-[16px] font-extrabold">Default Reminder</div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Reminder timing</FieldLabel>
                    <SelectInput
                      value={form.reminderTiming}
                      onChange={(v) => setField('reminderTiming', v)}
                      options={[
                        '24 hours before',
                        '12 hours before',
                        '2 hours before',
                        '1 hour before',
                      ]}
                    />
                  </div>
                  <div>
                    <FieldLabel>Channels</FieldLabel>
                    <SelectInput
                      value={form.reminderChannels}
                      onChange={(v) => setField('reminderChannels', v)}
                      options={['Email + Push', 'Email only', 'Push only']}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'security' ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E2E7DF] bg-surface shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="border-b border-[#E7EBE5] px-6 py-5">
                  <div className="text-[15px] font-extrabold">Security</div>
                  <div className="mt-0.5 text-[14px] text-muted">
                    Protect administrator accounts and platform access.
                  </div>
                </div>
                <div className="space-y-5 p-6">
                  <div className="rounded-xl border border-[#E1E6DF] bg-[#F7F9F5] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-extrabold">Two-factor authentication</div>
                        <div className="mt-1 text-[13px] text-muted">
                          Require an additional verification step for administrators.
                        </div>
                      </div>
                      <span className="rounded-full bg-[#E3EFE5] px-2.5 py-1 text-[12px] font-extrabold text-brand">
                        Enabled
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[14px] font-extrabold">Session timeout</div>
                    <div className="mt-1 text-[13px] text-muted">
                      Automatically sign out inactive administrators.
                    </div>
                    <div className="mt-3 w-[260px]">
                      <SelectInput
                        value={form.sessionTimeout}
                        onChange={(v) => setField('sessionTimeout', v)}
                        options={['30 minutes', '1 hour', '4 hours', 'Never']}
                      />
                    </div>
                  </div>

                  <div className="h-px bg-[#E7EBE5]" />

                  <div>
                    <div className="text-[14px] font-extrabold">Password Policy</div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[#E1E6DF] bg-white p-4">
                        <div className="text-[13px] font-extrabold">Minimum length</div>
                        <div className="mt-3 text-[20px] font-extrabold">8</div>
                        <div className="text-[12px] text-muted">characters</div>
                      </div>
                      <div className="rounded-xl border border-[#E1E6DF] bg-white p-4">
                        <div className="text-[13px] font-extrabold">Password expiry</div>
                        <div className="mt-3 text-[20px] font-extrabold">90</div>
                        <div className="text-[12px] text-muted">days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-6 shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[16px] font-extrabold">Recent Security Activity</div>
                    <div className="mt-0.5 text-[13px] text-muted">Latest administrator events</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Security activity refreshed')}
                    className="text-[13px] font-extrabold text-brand"
                  >
                    Refresh
                  </button>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    {
                      title: 'Admin Manager signed in',
                      when: 'Today · 6:14 PM',
                      status: 'Successful',
                      statusClass: 'text-brand',
                      dot: 'bg-brand',
                    },
                    {
                      title: 'Password policy updated',
                      when: '07 Sep · 3:22 PM',
                      status: 'System',
                      statusClass: 'text-muted',
                      dot: 'bg-brand',
                    },
                    {
                      title: 'Failed login attempt',
                      when: '07 Sep · 11:08 AM',
                      status: 'Blocked',
                      statusClass: 'text-accent',
                      dot: 'bg-accent',
                    },
                  ].map((event) => (
                    <div key={event.title} className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${event.dot}`} />
                      <div className="flex-1">
                        <div className="text-[13px] font-extrabold">{event.title}</div>
                        <div className="text-[12px] text-muted">{event.when}</div>
                      </div>
                      <span className={`text-[12px] font-bold ${event.statusClass}`}>
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'integrations' ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E2E7DF] bg-surface shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="border-b border-[#E7EBE5] px-6 py-5">
                  <div className="text-[15px] font-extrabold">Integrations</div>
                  <div className="mt-0.5 text-[14px] text-muted">
                    Connect services used by the assessment platform.
                  </div>
                </div>
                <div className="divide-y divide-[#E7EBE5]">
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6EFE7] font-extrabold text-brand">
                        AI
                      </div>
                      <div>
                        <div className="text-[15px] font-extrabold">AI Evaluation Engine</div>
                        <div className="mt-0.5 text-[13px] text-muted">
                          Automated language evaluation service
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#E3EFE5] px-2.5 py-1 text-[12px] font-extrabold text-brand">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EBDD] text-accent">
                        <svg
                          width="22" height="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M3 5h12v8H3z" />
                          <path d="M6 16h6M9 13v3" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[15px] font-extrabold">Email Service</div>
                        <div className="mt-0.5 text-[13px] text-muted">
                          Assessment and notification emails
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#E3EFE5] px-2.5 py-1 text-[12px] font-extrabold text-brand">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE8F3] text-[#69608D]">
                        <svg
                          width="22" height="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M4 4h10v10H4z" />
                          <path d="M7 7h4M7 10h3" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[15px] font-extrabold">Cloud Storage</div>
                        <div className="mt-0.5 text-[13px] text-muted">
                          Audio, media and report storage
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Cloud storage configuration opened')}
                      className="rounded-lg border border-[#DDE4DC] bg-white px-3 py-2 text-[13px] font-extrabold text-brand"
                    >
                      Configure
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E7DF] bg-surface p-6 shadow-[0_18px_50px_rgba(31,107,79,.06)]">
                <div className="text-[16px] font-extrabold">API Access</div>
                <div className="mt-0.5 text-[13px] text-muted">
                  API credentials for approved external integrations.
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl border border-[#E1E6DF] bg-[#F7F9F5] p-4">
                  <div>
                    <div className="text-[13px] font-extrabold">Production API</div>
                    <div className="mt-1 text-[13px] text-muted">
                      elt_live_••••••••••••••••••42
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('API key management opened')}
                    className="rounded-lg border border-[#DDE4DC] bg-white px-3 py-2 text-[13px] font-extrabold text-brand"
                  >
                    Manage Keys
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="sticky bottom-5 mt-6 flex items-center justify-between rounded-2xl border border-[#DDE5DC] bg-[#FCFBF8]/95 px-5 py-3.5 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-brand" />
              <span className="text-[13px] font-semibold text-muted">
                Changes are saved automatically as you edit.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setForm(INITIAL)
                  showToast('Changes reset')
                }}
                className="rounded-xl border border-[#DDE4DC] bg-white px-4 py-2.5 text-[13px] font-extrabold text-muted hover:bg-[#F4F6F2]"
              >
                Reset Changes
              </button>
              <button
                type="button"
                onClick={() => showToast('Settings saved successfully')}
                className="rounded-xl bg-brand px-5 py-2.5 text-[13px] font-extrabold text-white hover:opacity-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} visible={toastVisible && Boolean(toast)} />
    </div>
  )
}
