import { Pressable, Text, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Path, Rect } from 'react-native-svg'

const BRAND = '#1f6b4f'
const MUTED = '#7a837d'

type IconProps = { color: string; filled: boolean }

function HomeIcon({ color, filled }: IconProps) {
  if (filled) {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path
          d="M11.15 3.35a1.25 1.25 0 0 1 1.7 0l7.7 6.7c.4.35.65.85.65 1.38V20a1.7 1.7 0 0 1-1.7 1.7h-4.15v-5.6a1.1 1.1 0 0 0-1.1-1.1h-2.5a1.1 1.1 0 0 0-1.1 1.1v5.6H4.5A1.7 1.7 0 0 1 2.8 20v-8.57c0-.53.25-1.03.65-1.38l7.7-6.7Z"
          fill={color}
        />
      </Svg>
    )
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function PracticeIcon({ color, filled }: IconProps) {
  if (filled) {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path d="M12 6.4C10.3 5 8.1 4.2 5.2 4.2H3v14.2h2.6c2.4 0 4.3.6 6.4 1.9V6.4Z" fill={color} />
        <Path d="M12 6.4c1.7-1.4 3.9-2.2 6.8-2.2H21v14.2h-2.6c-2.4 0-4.3.6-6.4 1.9V6.4Z" fill={color} />
      </Svg>
    )
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7c-1.6-1.3-3.6-2-6.2-2H3.8v13h2.4c2.2 0 4 .6 5.8 1.8V7Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <Path
        d="M12 7c1.6-1.3 3.6-2 6.2-2h2.2v13h-2.4c-2.2 0-4 .6-5.8 1.8V7Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function TestsIcon({ color, filled }: IconProps) {
  if (filled) {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path
          fill={color}
          fillRule="evenodd"
          d="M7 2.8h10a3.2 3.2 0 0 1 3.2 3.2v12a3.2 3.2 0 0 1-3.2 3.2H7A3.2 3.2 0 0 1 3.8 18V6A3.2 3.2 0 0 1 7 2.8Zm1.3 5h7.4v1.5H8.3V7.8Zm0 4h7.4V13.3H8.3V11.8Zm0 4h4.4v1.5H8.3V15.8Z"
        />
      </Svg>
    )
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={3} width={16} height={18} rx={3} stroke={color} strokeWidth={1.7} />
      <Path d="M8 8h8M8 12h8M8 16h4" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  )
}

function ProgressIcon({ color, filled }: IconProps) {
  if (filled) {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path d="M3.2 19.6V10.2h3.3v9.4H3.2Zm5.5 0V5.4h3.3v14.2H8.7Zm5.5 0v-7.6h3.3v7.6h-3.3Zm5.5 0V3.2h3.1v16.4h-3.1Z" fill={color} />
      </Svg>
    )
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19V9M10 19V5M16 19v-7M22 19V3"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  )
}

function ProfileIcon({ color, filled }: IconProps) {
  if (filled) {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path
          d="M12 12.4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6.1 8.1c.45-3.7 3.15-6.1 6.1-6.1s5.65 2.4 6.1 6.1c.12.85-.52 1.6-1.35 1.6H7.25c-.83 0-1.47-.75-1.35-1.6Z"
          fill={color}
        />
      </Svg>
    )
  }
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.2} stroke={color} strokeWidth={1.7} />
      <Path d="M5 21a7 7 0 0 1 14 0" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
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
              className="flex-1 items-center gap-1.5">
              {Icon ? <Icon color={color} filled={focused} /> : null}
              <Text className={`text-[11px] ${focused ? 'font-bold text-brand' : 'font-light text-muted'}`}>
                {label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
