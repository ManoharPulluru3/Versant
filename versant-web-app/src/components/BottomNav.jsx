import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  {
    id: 'home',
    to: '/home',
    label: 'Home',
    icon: (
      <svg
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
        />
      </svg>
    ),
  },
  {
    id: 'practice',
    to: '/practice',
    label: 'Practice',
    icon: (
      <svg
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v18M5 7h14M5 17h14"
        />
        <circle cx="8" cy="7" r="2" />
        <circle cx="16" cy="17" r="2" />
      </svg>
    ),
  },
  {
    id: 'tests',
    to: '/tests',
    label: 'Tests',
    icon: (
      <svg
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h4" />
      </svg>
    ),
  },
  {
    id: 'progress',
    to: '/progress',
    label: 'Progress',
    icon: (
      <svg
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 19V9M10 19V5M16 19v-7M22 19V3"
        />
      </svg>
    ),
  },
  {
    id: 'profile',
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg
        className="h-[19px] w-[19px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="8" r="3" />
        <path strokeLinecap="round" d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav shrink-0 border-t px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
      <div className="grid grid-cols-5 items-end">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.to}
            end={tab.id !== 'practice'}
            className="flex flex-col items-center gap-1"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex h-8 w-12 items-center justify-center ${
                    isActive ? 'rounded-full bg-brand-light' : ''
                  }`}
                >
                  <span className={isActive ? 'text-brand' : 'text-muted'}>{tab.icon}</span>
                </div>
                <span
                  className={`type-nav ${
                    isActive ? 'font-extrabold text-brand' : 'text-muted'
                  }`}
                >
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function MainLayout() {
  return (
    <div className="flex h-full flex-col bg-transparent font-nunito">
      <div className="min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
