import { Pressable, Text, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Path, Rect } from 'react-native-svg'

const BRAND = '#1f6b4f'
const MUTED = '#7a837d'

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function PracticeIcon({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3v18M5 7h14M5 17h14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={8} cy={7} r={2} stroke={color} strokeWidth={1.8} />
      <Circle cx={16} cy={17} r={2} stroke={color} strokeWidth={1.8} />
    </Svg>
  )
}

function TestsIcon({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={3} width={16} height={18} rx={3} stroke={color} strokeWidth={1.8} />
      <Path d="M8 8h8M8 12h8M8 16h4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}

function ProgressIcon({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19V9M10 19V5M16 19v-7M22 19V3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function ProfileIcon({ color }: { color: string }) {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3} stroke={color} strokeWidth={1.8} />
      <Path d="M5 21a7 7 0 0 1 14 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}

const ICONS = {
  Home: HomeIcon,
  Practice: PracticeIcon,
  Tests: TestsIcon,
  Progress: ProgressIcon,
  Profile: ProfileIcon,
} as const

const LABELS: Record<keyof typeof ICONS, string> = {
  Home: 'Home',
  Practice: 'Practice',
  Tests: 'Tests',
  Progress: 'Progress',
  Profile: 'Profile',
}

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()

  return (
    <View
      className="border-t px-4 pt-3"
      style={{
        paddingBottom: Math.max(insets.bottom, 16),
        backgroundColor: colors.tabBar,
        borderTopColor: colors.tabBorder,
      }}>
      <View className="flex-row items-end">
        {state.routes.map((route, index) => {
          const focused = state.index === index
          const color = focused ? BRAND : MUTED
          const Icon = ICONS[route.name as keyof typeof ICONS]
          const label = LABELS[route.name as keyof typeof ICONS] ?? route.name

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                })
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name)
                }
              }}
              className="flex-1 items-center gap-1">
              <View
                className={`h-8 w-12 items-center justify-center ${
                  focused ? 'rounded-full bg-brand-light' : ''
                }`}>
                {Icon ? <Icon color={color} /> : null}
              </View>
              <Text
                className={`text-[11px] ${focused ? 'font-extrabold text-brand' : 'font-bold text-muted'}`}>
                {label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
