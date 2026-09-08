import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'elytedu-theme'

export const BG_OPTIONS = [
  {
    id: 'soft',
    label: 'Soft wash',
    description: 'Light green & warm tint',
  },
  {
    id: 'plain',
    label: 'Plain white',
    description: 'Clean flat background',
  },
  {
    id: 'mint',
    label: 'Mint glow',
    description: 'Stronger brand green',
  },
  {
    id: 'warm',
    label: 'Warm cream',
    description: 'Peach & cream tones',
  },
]

const defaults = {
  darkMode: false,
  background: 'soft',
}

const ThemeContext = createContext(null)

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw)
    const background = BG_OPTIONS.some((o) => o.id === parsed.background)
      ? parsed.background
      : defaults.background
    return {
      darkMode: Boolean(parsed.darkMode),
      background,
    }
  } catch {
    return defaults
  }
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('theme') === 'dark') return true
      if (params.get('theme') === 'light') return false
    }
    return readStored().darkMode
  })
  const [background, setBackground] = useState(() => readStored().background)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = darkMode ? 'dark' : 'light'
    root.dataset.bg = background
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ darkMode, background }),
    )
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', darkMode ? '#101714' : '#FCFBF8')
  }, [darkMode, background])

  const value = useMemo(
    () => ({
      darkMode,
      background,
      setDarkMode,
      setBackground,
      toggleDarkMode: () => setDarkMode((v) => !v),
    }),
    [darkMode, background],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
