import { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { MainTabParamList, PracticeSkill, RootStackParamList } from '../navigation/types'
import { api } from '../services/client'

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

const PRACTICE: { skill: PracticeSkill; title: string; blurb: string }[] = [
  { skill: 'listening', title: 'Listening', blurb: 'Listen, then answer the questions' },
  { skill: 'speaking', title: 'Speaking', blurb: 'Pronunciation and fluency' },
  { skill: 'reading', title: 'Reading', blurb: 'Comprehension and speed' },
  { skill: 'writing', title: 'Writing', blurb: 'Typing, email, and dictation' },
]

export function PracticeScreen() {
  const navigation = useNavigation<Nav>()
  const { colors } = useTheme()

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8 pt-6">
        <Text className="text-xs font-bold uppercase tracking-[1px] text-[#9AA19B]">Practice</Text>
        <Text className="mt-1 text-lg font-extrabold text-dark dark:text-[#EEF3EF]">Choose a skill</Text>
        <Text className="mt-2 text-sm text-muted dark:text-[#B4BFB8]">
          Listening is the activity you can complete now.
        </Text>
        <View className="mt-5 gap-3">
          {PRACTICE.map(item => (
            <Pressable
              key={item.skill}
              onPress={() => navigation.navigate('PracticeSkill', { skill: item.skill })}
              className="rounded-[20px] border border-[#EEF0E9] bg-white dark:bg-[#1C2621] px-4 py-4">
              <Text className="text-[15px] font-extrabold text-dark dark:text-[#EEF3EF]">{item.title}</Text>
              <Text className="mt-1 text-xs text-muted dark:text-[#B4BFB8]">{item.blurb}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const TEST_TABS = [
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
] as const

type TestItem = {
  testId: string
  title: string
  description: string
  badge: string
  durationMinutes: number
  dueLabel: string
  status: 'assigned' | 'in_progress' | 'completed'
  questionCount: number
}

export function TestsScreen() {
  const navigation = useNavigation<Nav>()
  const { colors } = useTheme()
  const [tab, setTab] = useState<(typeof TEST_TABS)[number]['id']>('assigned')
  const [items, setItems] = useState<TestItem[]>([])
  const [counts, setCounts] = useState({ assigned: 0, inProgress: 0, completed: 0 })
  const [error, setError] = useState('')

  useFocusEffect(
    useCallback(() => {
      let active = true
      api<{ counts: { assigned: number; inProgress: number; completed: number }; items: TestItem[] }>('/tests')
        .then(data => {
          if (!active) return
          setItems(data.items)
          setCounts(data.counts)
          setError('')
        })
        .catch(err => {
          if (active) setError(err instanceof Error ? err.message : 'Could not load tests')
        })
      return () => {
        active = false
      }
    }, []),
  )

  const visible = items.filter(item => item.status === tab)

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8 pt-6">
        <Text className="text-xs font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
          English assessment
        </Text>
        <Text className="mt-1 text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
          Tests
        </Text>

        <View className="mt-5 flex-row gap-3">
          {[
            [String(counts.assigned), 'Assigned', colors.brandLight],
            [String(counts.inProgress), 'In Progress', '#FFF0E2'],
            [String(counts.completed), 'Completed', colors.cream],
          ].map(([value, label, bg]) => (
            <View key={label} className="flex-1 rounded-2xl p-4" style={{ backgroundColor: bg }}>
              <Text className="text-2xl font-extrabold" style={{ color: colors.text }}>
                {value}
              </Text>
              <Text className="mt-1 text-xs" style={{ color: colors.muted }}>
                {label}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-5 flex-row rounded-full p-1" style={{ backgroundColor: colors.card }}>
          {TEST_TABS.map(item => {
            const active = tab === item.id
            return (
              <Pressable key={item.id} onPress={() => setTab(item.id)} className="flex-1 items-center rounded-full py-2">
                <Text className="text-xs font-extrabold" style={{ color: active ? colors.brand : colors.muted }}>
                  {item.label}
                </Text>
                {active ? <View className="mt-1 h-0.5 w-8 rounded-full" style={{ backgroundColor: colors.brand }} /> : null}
              </Pressable>
            )
          })}
        </View>

        {error ? <Text className="mt-4 text-sm font-semibold text-[#B65F39]">{error}</Text> : null}

        <View className="mt-5 gap-3">
          {visible.length === 0 && !error ? (
            <Text className="text-sm" style={{ color: colors.muted }}>
              Nothing in this list yet.
            </Text>
          ) : null}
          {visible.map(test => (
            <Pressable
              key={test.testId}
              onPress={() => navigation.navigate('AssessmentDetails', { testId: test.testId })}
              className="rounded-[22px] border p-5"
              style={{
                backgroundColor: test.status === 'assigned' ? colors.brand : colors.card,
                borderColor: test.status === 'assigned' ? colors.brand : colors.cardBorder,
              }}>
              <Text
                className="text-[11px] font-bold uppercase tracking-[1px]"
                style={{ color: test.status === 'assigned' ? 'rgba(255,255,255,0.7)' : colors.accent }}>
                {test.badge}
              </Text>
              <Text
                className="mt-2 text-lg font-extrabold"
                style={{ color: test.status === 'assigned' ? '#FFFFFF' : colors.text }}>
                {test.title}
              </Text>
              <Text className="mt-2 text-sm" style={{ color: test.status === 'assigned' ? 'rgba(255,255,255,0.8)' : colors.muted }}>
                {test.questionCount} questions · {test.durationMinutes} min · {test.dueLabel}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type HistoryItem = {
  id: string
  name: string
  date: string
  score: number
  level: string
}

export function ProgressScreen() {
  const { colors } = useTheme()
  const [data, setData] = useState<{
    score: number
    level: { code: string; label: string }
    delta: number | null
    history: HistoryItem[]
  } | null>(null)
  const [error, setError] = useState('')

  useFocusEffect(
    useCallback(() => {
      let active = true
      api<{ score: number; level: { code: string; label: string }; delta: number | null; history: HistoryItem[] }>('/progress')
        .then(next => {
          if (!active) return
          setData(next)
          setError('')
        })
        .catch(err => {
          if (active) setError(err instanceof Error ? err.message : 'Could not load progress')
        })
      return () => {
        active = false
      }
    }, []),
  )

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8 pt-6">
        <Text className="text-xs font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
          Your scores over time
        </Text>
        <Text className="mt-1 text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
          Progress
        </Text>
        {error ? <Text className="mt-4 text-sm font-semibold text-[#B65F39]">{error}</Text> : null}

        <View className="mt-5 rounded-[25px] p-5" style={{ backgroundColor: colors.brand }}>
          <Text className="text-[11px] font-bold uppercase tracking-[1px] text-white/70">Listening score</Text>
          <View className="mt-2 flex-row items-end justify-between">
            <View>
              <Text className="text-[44px] font-black leading-none text-white">{data?.score ?? '—'}</Text>
              <Text className="mt-2 text-sm text-white/70">
                {data ? `${data.level.code} · ${data.level.label}` : 'Loading'}
              </Text>
            </View>
            <View className="items-end rounded-2xl bg-white/10 px-3 py-3">
              <Text className="text-[11px] text-white/70">Change</Text>
              <Text className="mt-1 text-2xl font-black text-white">
                {data?.delta == null ? '—' : `${data.delta > 0 ? '+' : ''}${data.delta}`}
              </Text>
            </View>
          </View>
        </View>

        <Text className="mt-7 text-xs font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
          Score history
        </Text>
        <View className="mt-3">
          {(data?.history ?? []).map(item => (
            <View key={item.id} className="flex-row items-center justify-between border-b py-4" style={{ borderColor: colors.divider }}>
              <View className="flex-1 pr-3">
                <Text className="text-[14px] font-extrabold" style={{ color: colors.text }}>
                  {item.name}
                </Text>
                <Text className="mt-1 text-xs" style={{ color: colors.muted }}>
                  {item.date} · {item.level}
                </Text>
              </View>
              <Text className="text-lg font-black" style={{ color: colors.brand }}>
                {item.score}
              </Text>
            </View>
          ))}
          {data && data.history.length === 0 ? (
            <Text className="text-sm" style={{ color: colors.muted }}>
              Finish a listening activity to see a score here.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
