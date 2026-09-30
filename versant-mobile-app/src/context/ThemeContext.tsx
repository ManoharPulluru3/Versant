import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'nativewind'

const STORAGE_KEY = 'elytedu-theme'

export const BG_OPTIONS = [
  { id: 'soft', label: 'Soft wash', description: 'Light green & warm tint' },
  { id: 'plain', label: 'Plain white', description: 'Clean flat background' },
  { id: 'mint', label: 'Mint glow', description: 'Stronger brand green' },
  { id: 'warm', label: 'Warm cream', description: 'Peach & cream tones' },
] as const

export type BackgroundId = (typeof BG_OPTIONS)[number]['id']

type Palette = {
  canvas: string
  text: string
  muted: string
  label: string
  card: string
  cardBorder: string
  divider: string
  iconBg: string
  cream: string
  brand: string
  brandLight: string
  accent: string
  dangerBg: string
  dangerBorder: string
  dangerText: string
  tabBar: string
  tabBorder: string
}

const LIGHT_CANVAS: Record<BackgroundId, string> = {
  soft: '#F6F7F2',
  plain: '#FFFFFF',
  mint: '#E7F3E8',
  warm: '#F8F3EC',
}

const DARK_CANVAS: Record<BackgroundId, string> = {
  soft: '#101714',
  plain: '#121916',
  mint: '#12201A',
  warm: '#161410',
}

export function buildPalette(darkMode: boolean, background: BackgroundId): Palette {
  return {
    canvas: darkMode ? DARK_CANVAS[background] : LIGHT_CANVAS[background],
    text: darkMode ? '#EEF3EF' : '#17221D',
    muted: darkMode ? '#B4BFB8' : '#7A837D',
    label: darkMode ? '#8E9A93' : '#9AA19B',
    card: darkMode ? '#1C2621' : '#FFFFFF',
    cardBorder: darkMode ? '#3D4C44' : '#E5E8E2',
    divider: darkMode ? '#2C3832' : '#ECEEE9',
    iconBg: darkMode ? '#24382E' : '#F1F5ED',
    cream: darkMode ? '#24382E' : '#F2F5E8',
    brand: '#1F6B4F',
    brandLight: darkMode ? '#24382E' : '#DCEBDD',
    accent: '#E58A45',
    dangerBg: darkMode ? '#2A211C' : '#FFF9F5',
    dangerBorder: darkMode ? '#5A3A30' : '#E9D8CF',
    dangerText: '#B65F39',
    tabBar: darkMode ? '#141C18' : '#FCFBF8',
    tabBorder: darkMode ? '#3D4C44' : '#E5E8E2',
  }
}

type ThemeValue = {
  darkMode: boolean
  background: BackgroundId
  colors: Palette
  ready: boolean
  setBackground: (id: BackgroundId) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useColorScheme()
  const [darkMode, setDarkMode] = useState(false)
  const [background, setBackground] = useState<BackgroundId>('soft')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => {
        if (!raw) return
        const parsed = JSON.parse(raw) as { darkMode?: boolean; background?: string }
        setDarkMode(Boolean(parsed.darkMode))
        if (BG_OPTIONS.some(option => option.id === parsed.background)) {
          setBackground(parsed.background as BackgroundId)
        }
      })
      .catch(() => undefined)
      .finally(() => setReady(true))
  }, [])

  useEffect(() => {
    setColorScheme(darkMode ? 'dark' : 'light')
    if (!ready) return
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ darkMode, background })).catch(() => undefined)
  }, [background, darkMode, ready, setColorScheme])

  const value = useMemo<ThemeValue>(
    () => ({
      darkMode,
      background,
      colors: buildPalette(darkMode, background),
      ready,
      setBackground,
      toggleDarkMode: () => setDarkMode(value => !value),
    }),
    [background, darkMode, ready],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return value
}
