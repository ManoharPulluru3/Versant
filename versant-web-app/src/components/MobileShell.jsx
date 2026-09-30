import { useTheme } from '../context/ThemeContext'

export default function MobileShell({ children, mode = 'app' }) {
  const { darkMode, background } = useTheme()

  if (mode === 'workflow') {
    return (
      <div className="h-svh w-full overflow-hidden bg-[#E8ECE2]">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-stretch justify-center md:items-center md:p-4">
      <div
        className="
          app-canvas relative h-svh w-full overflow-hidden
          md:h-[900px] md:max-h-[92svh] md:w-full md:max-w-[430px]
          md:rounded-[40px] md:soft-shadow
        "
        data-theme={darkMode ? 'dark' : 'light'}
        data-bg={background}
      >
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  )
}
