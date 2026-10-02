import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { adminUser, clearAdminSession } from './api'

const NAV = [
  {
    section: 'Overview',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: 'grid', end: true }],
  },
  {
    section: 'People',
    items: [
      { to: '/admin/students', label: 'Students', icon: 'users' },
      { to: '/admin/faculty', label: 'Faculty', icon: 'user' },
    ],
  },
  {
    section: 'Assessments',
    items: [
      { to: '/admin/assessments', label: 'Assessments', icon: 'book' },
      { to: '/admin/assessments/assign', label: 'Assign Assessment', icon: 'book' },
      { to: '/admin/question-bank', label: 'Question Bank', icon: 'bank', end: true },
      { to: '/admin/question-bank/editor', label: 'Question Editor', icon: 'bank' },
      { to: '/admin/monitoring', label: 'Live Monitoring', icon: 'pulse' },
      { to: '/admin/results', label: 'Results', icon: 'chart' },
    ],
  },
  {
    section: 'Insights',
    items: [
      { to: '/admin/analytics', label: 'Analytics', icon: 'bars' },
      { to: '/admin/reports', label: 'Reports & Export', icon: 'file' },
    ],
  },
  {
    section: 'System',
    items: [{ to: '/admin/settings', label: 'Settings', icon: 'gear' }],
  },
]

function NavIcon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (name === 'grid') {
    return (
      <svg {...common}>
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    )
  }
  if (name === 'users') {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }
  if (name === 'user') {
    return (
      <svg {...common}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
  if (name === 'book') {
    return (
      <svg {...common}>
        <path d="M4 19.5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14.5" />
        <path d="M6 18h14" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    )
  }
  if (name === 'bank') {
    return (
      <svg {...common}>
        <path d="M4 5a3 3 0 0 1 3-3h13v18H7a3 3 0 0 0-3 3Z" />
        <path d="M7 2v18" />
        <path d="M11 7h5" />
        <path d="M11 11h5" />
      </svg>
    )
  }
  if (name === 'pulse') {
    return (
      <svg {...common}>
        <path d="M2 12h4l3-8 4 16 3-8h6" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="m7 16 4-5 3 3 6-8" />
      </svg>
    )
  }
  if (name === 'bars') {
    return (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="M7 16V9" />
        <path d="M12 16V5" />
        <path d="M17 16v-3" />
      </svg>
    )
  }
  if (name === 'file') {
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  )
}

const TITLES = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/students': 'Students',
  '/admin/students/bulk-upload': 'Bulk Upload',
  '/admin/faculty': 'Faculty',
  '/admin/assessments': 'Assessments',
  '/admin/assessments/create': 'Create Assessment',
  '/admin/assessments/builder': 'English Communication Test',
  '/admin/assessments/assign': 'Assign Assessment',
  '/admin/question-bank': 'Question Bank',
  '/admin/question-bank/editor': 'Question Editor',
  '/admin/monitoring': 'Live Attempt Monitoring',
  '/admin/results': 'Assessment Results',
  '/admin/results/report': 'Student Detailed Report',
  '/admin/analytics': 'Analytics',
  '/admin/reports': 'Reports & Export',
  '/admin/settings': 'Settings',
}

const EYEBROWS = {
  '/admin/dashboard': 'Tuesday, September 8, 2026',
  '/admin/students': 'People',
  '/admin/students/bulk-upload': 'People',
  '/admin/faculty': 'People',
  '/admin/assessments': 'Assessments',
  '/admin/assessments/create': 'Assessments',
  '/admin/assessments/builder': 'Assessments / Builder',
  '/admin/assessments/assign': 'Assessments',
  '/admin/question-bank': 'Assessments',
  '/admin/question-bank/editor': 'Assessments / Question Bank',
  '/admin/monitoring': 'Assessments',
  '/admin/results': 'Assessments',
  '/admin/results/report': 'Results',
  '/admin/analytics': 'Insights',
  '/admin/reports': 'Insights',
  '/admin/settings': 'System / Settings',
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const title = TITLES[location.pathname] || 'Admin Portal'
  const eyebrow = EYEBROWS[location.pathname] || 'Admin Portal'
  const admin = adminUser()
  const initials = (admin?.name || 'Admin')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function signOut() {
    clearAdminSession()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-shell flex min-h-svh bg-cream font-nunito text-dark">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-[#17221D]/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[#E4E8E1] bg-surface transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center border-b border-[#E7EAE4] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.2 9.2 0 0 1-4-.9L3 21l1.9-4.5A8.5 8.5 0 1 1 21 11.5Z" />
                <path d="M8 10h.01M12 10h.01M16 10h.01" />
              </svg>
            </div>
            <div>
              <div className="text-[17px] font-extrabold tracking-[-0.03em]">ElytEdu</div>
              <div className="mt-0.5 text-[10px] font-extrabold tracking-[0.14em] text-[#8A928C]">
                ADMIN PORTAL
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((group) => (
            <div key={group.section} className="mb-4">
              <div className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#A0A7A2]">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[14px] transition ${
                        isActive
                          ? 'bg-brand-light font-extrabold text-brand'
                          : 'font-semibold text-[#59635D] hover:bg-[#F0F4ED] hover:text-brand'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <NavIcon name={item.icon} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                              isActive
                                ? 'bg-white text-brand'
                                : 'bg-[#EEF2EC] text-[#7A837D]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.meta && (
                          <span className="text-[11px] font-bold text-[#9BA29D]">{item.meta}</span>
                        )}
                        {item.live && (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-[#D36F32]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D36F32]" />
                            {item.live}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#E7EAE4] p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-[11px] font-extrabold text-brand">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-extrabold">{admin?.name || 'Admin'}</div>
              <div className="truncate text-[11px] font-semibold text-[#8A928C]">Administrator</div>
            </div>
            <button type="button" onClick={signOut} className="ml-auto text-[12px] font-extrabold text-brand">
              Exit
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-svh flex-1 flex-col lg:ml-[260px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#E4E8E1] bg-surface/95 px-5 backdrop-blur-md sm:px-7 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E7E0] bg-white lg:hidden"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
            <div>
              <div className="text-[12px] font-semibold text-[#8A928C] sm:text-[13px]">{eyebrow}</div>
              <div className="mt-0.5 text-[19px] font-extrabold tracking-[-0.03em]">{title}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="hidden h-10 items-center gap-2 rounded-xl border border-[#E2E7E0] bg-white px-3.5 text-[13px] font-bold text-[#8A928C] sm:flex"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Search
            </button>
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E7E0] bg-white"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#59635D" strokeWidth="2">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-[#E2E7E0] bg-white px-2.5 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-[11px] font-extrabold text-brand">
                {initials}
              </div>
              <span className="hidden text-[13px] font-extrabold sm:block">{admin?.name?.split(' ')[0] || 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="admin-content flex-1 bg-[#F8F9F5]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
