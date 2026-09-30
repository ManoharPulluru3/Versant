import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_TEST_ID = 'english-communication'

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Assessment due soon',
    body: 'Your English Communication Test is due on September 14. Make sure you complete it before the deadline.',
    time: '2h ago',
    read: false,
    type: 'assessment',
    tone: 'accent',
    icon: 'shield',
    primary: { label: 'View assessment', route: '/tests' },
  },
  {
    id: 2,
    title: 'Your assessment results are ready',
    bodyParts: [
      { text: 'Your English Communication Test has been evaluated. You scored ' },
      { text: '82/100', bold: true },
      { text: ' and your current level is B2.' },
    ],
    time: 'Yesterday',
    read: false,
    type: 'result',
    tone: 'brand',
    icon: 'trend',
    primary: { label: 'View results', route: `/tests/${DEFAULT_TEST_ID}/results` },
  },
  {
    id: 3,
    title: 'New practice recommendation',
    bodyParts: [
      { text: 'Based on your latest assessment, we recommend focusing on ' },
      { text: 'grammar and email writing', bold: true },
      { text: ' this week.' },
    ],
    time: '2 days ago',
    read: false,
    type: 'practice',
    tone: 'brand',
    icon: 'star',
    primary: {
      label: 'View plan',
      route: `/tests/${DEFAULT_TEST_ID}/improvement-plan`,
    },
  },
  {
    id: 4,
    title: "You're making progress",
    bodyParts: [
      { text: 'Your overall English score has improved by ' },
      { text: '8 points', bold: true },
      { text: ' since your first assessment. Keep going!' },
    ],
    time: '3 days ago',
    read: false,
    type: 'progress',
    tone: 'brand',
    icon: 'check-circle',
    primary: { label: 'View progress', route: '/progress' },
  },
  {
    id: 5,
    title: 'Daily practice goal completed',
    body: 'You completed 15 minutes of English practice today. Great consistency!',
    time: 'Sep 4',
    read: true,
    type: 'practice',
    tone: 'muted',
    icon: 'plus',
    primary: { label: 'Practice again', route: '/practice' },
  },
  {
    id: 6,
    title: 'Welcome to ElytEdu English Assessment',
    body: 'Your English assessment profile is ready. Explore practice activities and start building your communication skills.',
    time: 'Sep 1',
    read: true,
    type: 'system',
    tone: 'muted',
    icon: 'clock',
    primary: { label: 'Explore practice', route: '/practice' },
  },
]

function NotificationIcon({ icon, tone }) {
  const stroke = tone === 'accent' ? '#E58A45' : tone === 'muted' ? '#7A837D' : '#1F6B4F'

  if (icon === 'shield') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L20 7V12C20 16.5 16.9 19.8 12 21C7.1 19.8 4 16.5 4 12V7L12 3Z"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12L11 14.5L15.5 10"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (icon === 'trend') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 17L10 12L13.5 15.5L20 9"
          stroke={stroke}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 9H20V13"
          stroke={stroke}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (icon === 'star') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L14.8 8.6L21 9.5L16.5 13.8L17.6 20L12 17.1L6.4 20L7.5 13.8L3 9.5L9.2 8.6L12 3Z"
          stroke={stroke}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (icon === 'check-circle') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth="1.8" />
        <path
          d="M8.5 12L11 14.5L15.5 10"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (icon === 'plus') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 5V19" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth="1.8" />
      <path d="M12 8V12L14.5 14" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function NotificationBody({ item }) {
  if (item.bodyParts) {
    return (
      <p className="type-body mt-1.5 leading-6 text-[#68736C]">
        {item.bodyParts.map((part) =>
          part.bold ? (
            <strong key={part.text} className="text-dark">
              {part.text}
            </strong>
          ) : (
            <span key={part.text}>{part.text}</span>
          ),
        )}
      </p>
    )
  }

  return <p className="type-body mt-1.5 leading-6 text-[#68736C]">{item.body}</p>
}

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  )

  const visibleNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter((item) => !item.read)
    return notifications
  }, [filter, notifications])

  function markRead(id) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    )
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-transparent font-nunito text-dark">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-brand-light opacity-70 blur-3xl" />
        <div className="absolute -right-16 top-40 h-44 w-44 rounded-full bg-[#F4D7BE] opacity-55 blur-3xl" />
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-[#E8EBE4] px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E8E0] transition hover:bg-[#F4F6F0]"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="#17221D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div>
            <p className="type-meta font-semibold">Notifications</p>
            <p className="type-caption text-muted">Account updates</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-brand">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 6.5C5 5.67 5.67 5 6.5 5H17.5C18.33 5 19 5.67 19 6.5V14.5C19 15.33 18.33 16 17.5 16H12L8.5 19V16H6.5C5.67 16 5 15.33 5 14.5V6.5Z"
                stroke="white"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
          </div>
          <span className="font-extrabold tracking-[-0.5px] text-brand">ElytEdu</span>
        </div>
      </header>

      <section className="relative z-10 flex-1 overflow-y-auto px-5 py-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 type-label font-bold uppercase tracking-[0.08em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Updates
            </div>
            <h1 className="type-display tracking-[-1.3px]">Notifications</h1>
            <p className="type-body mt-3 leading-7 text-muted">
              Stay updated with your assessments, results and learning activities.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="mb-6 flex h-10 items-center justify-center rounded-[12px] border border-[#E2E6DF] bg-surface px-4 type-caption font-extrabold text-brand transition hover:bg-[#F4F6F0] disabled:cursor-default disabled:opacity-70"
        >
          {unreadCount === 0 ? 'All caught up' : 'Mark all as read'}
        </button>

        <div className="mb-6 rounded-[24px] border border-[#D8E6D9] bg-[#F5F8F2] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-brand">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 9C18 5.69 15.31 3 12 3C8.69 3 6 5.69 6 9C6 13.5 4.5 15 4.5 16.5H19.5C19.5 15 18 13.5 18 9Z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 20C10.1 20.62 11 21 12 21C13 21 13.9 20.62 14.5 20"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="type-meta font-extrabold">
                {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
              </p>
              <p className="type-caption mt-1 text-muted">
                You have a few updates that may need your attention.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
          ].map((item) => {
            const active = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`flex h-9 items-center rounded-full border px-4 type-caption font-extrabold transition ${
                  active
                    ? 'border-brand bg-brand text-white'
                    : 'border-[#E2E6DF] bg-surface text-muted'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {visibleNotifications.length === 0 ? (
          <div className="rounded-[28px] border border-[#E7E9E3] bg-surface p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-brand-light">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 9C18 5.69 15.31 3 12 3C8.69 3 6 5.69 6 9C6 13.5 4.5 15 4.5 16.5H19.5C19.5 15 18 13.5 18 9Z"
                  stroke="#1F6B4F"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 20C10.1 20.62 11 21 12 21C13 21 13.9 20.62 14.5 20"
                  stroke="#1F6B4F"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="type-section mt-4">You're all caught up</h3>
            <p className="type-body mt-2 text-muted">
              There are no unread notifications right now.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-[#E7E9E3] bg-surface">
            {visibleNotifications.map((item, index) => (
              <div
                key={item.id}
                className={`${index > 0 ? 'border-t border-[#ECEEE9]' : ''} ${
                  item.read ? 'bg-surface' : 'bg-[#F5F8F2]'
                }`}
              >
                <div className="flex gap-4 p-5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${
                      item.tone === 'accent'
                        ? 'bg-[#F8E8DA]'
                        : item.tone === 'muted'
                          ? 'bg-[#F4F5F0]'
                          : 'bg-brand-light'
                    }`}
                  >
                    <NotificationIcon icon={item.icon} tone={item.tone} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`type-meta ${
                            item.read ? 'font-bold' : 'font-extrabold'
                          }`}
                        >
                          {item.title}
                        </h3>
                        {!item.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                        )}
                      </div>
                      <span className="shrink-0 type-label text-[#9AA19B]">{item.time}</span>
                    </div>

                    <NotificationBody item={item} />

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(item.primary.route)}
                        className="type-caption font-extrabold text-brand"
                      >
                        {item.primary.label}
                      </button>
                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => markRead(item.id)}
                          className="type-caption font-bold text-muted"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-7 flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21Z"
              stroke="#9AA19B"
              strokeWidth="1.7"
            />
            <path d="M12 11V16" stroke="#9AA19B" strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="12" cy="7.5" r="1" fill="#9AA19B" />
          </svg>
          <p className="type-caption text-[#9AA19B]">
            Important assessment updates will appear here.
          </p>
        </div>

        <div className="pb-3 pt-8 text-center">
          <p className="type-label font-bold tracking-[0.16em] text-[#9AA19B]">
            ELYTEDU · ENGLISH ASSESSMENT
          </p>
        </div>
      </section>
    </div>
  )
}
