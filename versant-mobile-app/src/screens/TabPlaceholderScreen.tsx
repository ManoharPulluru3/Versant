import { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Pressable, ScrollView, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '../context/ThemeContext'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import type { CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { MainTabParamList, PracticeSkill, RootStackParamList } from '../navigation/types'
import { noReload, usePullToRefresh } from '../hooks/usePullToRefresh'
import { api } from '../services/client'

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>

const PRACTICE: {
  skill: PracticeSkill
  title: string
  blurb: string
  live: boolean
  color: string
  chip: string
}[] = [
  { skill: 'listening', title: 'Listening', blurb: 'Hear a clip, then answer the questions', live: true, color: '#E58A45', chip: '#FFF0DF' },
  { skill: 'speaking', title: 'Speaking', blurb: 'Pronunciation and fluency', live: false, color: '#1F6B4F', chip: '#DCEBDD' },
  { skill: 'reading', title: 'Reading', blurb: 'Comprehension and speed', live: false, color: '#5C63A8', chip: '#E8EAF7' },
  { skill: 'writing', title: 'Writing', blurb: 'Typing, email, and dictation', live: false, color: '#9A5792', chip: '#F2E5F1' },
]

function SoonBadge() {
  return (
    <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: '#F4F1EA' }}>
      <Text className="text-[10px] font-extrabold uppercase tracking-[0.4px]" style={{ color: '#8A7760' }}>
        Coming soon
      </Text>
    </View>
  )
}

function SkillMark({ skill, color }: { skill: PracticeSkill; color: string }) {
  if (skill === 'listening') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M4 14a8 8 0 0 1 16 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M4 14v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2ZM20 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    )
  }
  if (skill === 'speaking') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M12 14a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v3a4 4 0 0 0 4 4Z" stroke={color} strokeWidth={1.8} />
        <Path d="M19 10a7 7 0 0 1-14 0M12 17v4M9 21h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    )
  }
  if (skill === 'reading') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
        <Path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    )
  }
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  )
}

export function PracticeScreen() {
  const navigation = useNavigation<Nav>()
  const { colors } = useTheme()
  const refreshControl = usePullToRefresh(noReload)

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" contentContainerClassName="grow px-5 pb-8 pt-6" alwaysBounceVertical refreshControl={refreshControl}>
        <Text className="text-xs font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
          Improve your English
        </Text>
        <Text className="mt-1 text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
          Practice
        </Text>
        <Text className="mt-1 text-sm leading-5" style={{ color: colors.muted }}>
          Listening is open. The other skills are on the way.
        </Text>

        <View className="mt-6 gap-3">
          {PRACTICE.map(item => {
            const open = item.live
              ? () => navigation.navigate('PracticeSkill', { skill: item.skill })
              : undefined
            return (
              <Pressable
                key={item.skill}
                accessibilityRole="button"
                disabled={!item.live}
                onPress={open}
                className="rounded-[24px] p-4"
                style={{ backgroundColor: colors.card }}>
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: item.chip }}>
                    <SkillMark skill={item.skill} color={item.color} />
                  </View>
                  <View className="min-w-0 flex-1">
                    <View className="flex-row items-center justify-between gap-2">
                      <Text className="text-[16px] font-extrabold" style={{ color: colors.text }}>
                        {item.title}
                      </Text>
                      {item.live ? null : <SoonBadge />}
                    </View>
                    <Text className="mt-1 text-[13px] leading-5" style={{ color: colors.muted }}>
                      {item.blurb}
                    </Text>
                  </View>
                  {item.live ? (
                    <Text className="text-lg font-black" style={{ color: colors.brand }}>
                      ›
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const TEST_TABS = [
  { id: 'assigned', label: 'Assigned', empty: 'No tests are waiting. A new listening test will show up here.' },
  { id: 'in_progress', label: 'Active', empty: 'You have not started a test yet.' },
  { id: 'completed', label: 'Done', empty: 'Finished tests will be listed here.' },
] as const

type TestTabId = (typeof TEST_TABS)[number]['id']

type TestItem = {
  testId: string
  title: string
  description: string
  badge: string
  durationMinutes: number
  dueLabel: string
  status: 'assigned' | 'in_progress' | 'completed'
  questionCount: number
  score?: number | null
  correct?: number | null
  total?: number | null
  completedLabel?: string | null
}

type ScoreHistory = {
  name: string
  date: string
  score: number
  kind?: string
  testId?: string
  correct?: number
  total?: number
}

function withSavedScore(test: TestItem, history: ScoreHistory[]) {
  if (test.status !== 'completed' || (test.correct != null && test.total != null)) return test
  const matches = history.filter(item => {
    if (item.kind && item.kind !== 'assessment') return false
    if (item.testId) return item.testId === test.testId
    return item.name === test.title
  })
  const hasCounts = matches.length > 0 && matches.every(item => item.correct != null && item.total != null)
  const completedOn = matches[0]?.date?.replace(/, \d{4}$/, '')
  if (hasCounts) {
    const correct = matches.reduce((sum, item) => sum + Number(item.correct), 0)
    const total = matches.reduce((sum, item) => sum + Number(item.total), 0)
    return {
      ...test,
      score: total ? Math.round((correct / total) * 100) : null,
      correct,
      total,
      completedLabel: test.completedLabel || (completedOn ? `Completed ${completedOn}` : 'Completed'),
    }
  }
  const percent = test.score ?? (matches.length === 1 ? matches[0].score : null)
  const total = test.questionCount
  if (percent == null || !total) return test
  return {
    ...test,
    score: percent,
    correct: Math.round((percent / 100) * total),
    total,
    completedLabel: test.completedLabel || (completedOn ? `Completed ${completedOn}` : 'Completed'),
  }
}

function resultLabel(test: TestItem) {
  if (test.correct == null || test.total == null) return '—'
  return `${test.correct} / ${test.total}`
}

function countFor(tab: TestTabId, counts: { assigned: number; inProgress: number; completed: number }) {
  if (tab === 'assigned') return counts.assigned
  if (tab === 'in_progress') return counts.inProgress
  return counts.completed
}

export function TestsScreen() {
  const navigation = useNavigation<Nav>()
  const { colors } = useTheme()
  const [tab, setTab] = useState<TestTabId>('assigned')
  const [items, setItems] = useState<TestItem[]>([])
  const [counts, setCounts] = useState({ assigned: 0, inProgress: 0, completed: 0 })
  const [error, setError] = useState('')
  const [trackWidth, setTrackWidth] = useState(0)
  const slide = useRef(new Animated.Value(0)).current
  const listOpacity = useRef(new Animated.Value(1)).current
  const listShift = useRef(new Animated.Value(0)).current

  const load = useCallback(async () => {
    try {
      const [data, progress] = await Promise.all([
        api<{ counts: { assigned: number; inProgress: number; completed: number }; items: TestItem[] }>('/tests'),
        api<{ history: ScoreHistory[] }>('/progress').catch(() => ({ history: [] as ScoreHistory[] })),
      ])
      setItems(data.items.map(item => withSavedScore(item, progress.history ?? [])))
      setCounts(data.counts)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load tests')
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const refreshControl = usePullToRefresh(load)
  const tabIndex = TEST_TABS.findIndex(item => item.id === tab)

  useEffect(() => {
    Animated.spring(slide, {
      toValue: tabIndex,
      useNativeDriver: true,
      friction: 8,
      tension: 90,
    }).start()
  }, [slide, tabIndex])

  function selectTab(next: TestTabId) {
    if (next === tab) return
    const nextIndex = TEST_TABS.findIndex(item => item.id === next)
    const direction = nextIndex > tabIndex ? 1 : -1
    Animated.parallel([
      Animated.timing(listOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(listShift, { toValue: direction * 16, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setTab(next)
      listShift.setValue(direction * -16)
      Animated.parallel([
        Animated.timing(listOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(listShift, { toValue: 0, useNativeDriver: true, friction: 8, tension: 80 }),
      ]).start()
    })
  }

  const visible = items.filter(item => item.status === tab)
  const currentTab = TEST_TABS[tabIndex]
  const tabWidth = trackWidth > 0 ? trackWidth / TEST_TABS.length : 0
  const underline = tabWidth * 0.46

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" contentContainerClassName="grow px-5 pb-8 pt-6" alwaysBounceVertical refreshControl={refreshControl}>
        <Text className="text-xs font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
          English assessment
        </Text>
        <Text className="mt-1 text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
          Tests
        </Text>
        <Text className="mt-1 text-sm leading-5" style={{ color: colors.muted }}>
          Listening tests assigned to you.
        </Text>

        <View onLayout={event => setTrackWidth(event.nativeEvent.layout.width)} className="mt-6">
          <View className="flex-row">
            {TEST_TABS.map(item => {
              const active = tab === item.id
              const count = countFor(item.id, counts)
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectTab(item.id)}
                  className="flex-1 flex-row items-center justify-center gap-2 py-2">
                  <Text className="text-[15px] font-extrabold" style={{ color: active ? colors.text : colors.muted }}>
                    {item.label}
                  </Text>
                  <View
                    className="min-w-[22px] items-center justify-center rounded-full px-1.5"
                    style={{ height: 22, backgroundColor: active ? colors.brand : colors.iconBg }}>
                    <Text className="text-[11px] font-extrabold" style={{ color: active ? '#FFFFFF' : colors.muted }}>
                      {count}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </View>
          <View className="mt-2 h-[2px]" style={{ backgroundColor: colors.divider }}>
            {tabWidth > 0 ? (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: -1,
                  height: 3,
                  width: underline,
                  borderRadius: 3,
                  backgroundColor: colors.brand,
                  transform: [
                    {
                      translateX: Animated.add(Animated.multiply(slide, tabWidth), (tabWidth - underline) / 2),
                    },
                  ],
                }}
              />
            ) : null}
          </View>
        </View>

        {error ? <Text className="mt-4 text-sm font-semibold text-[#B65F39]">{error}</Text> : null}

        <Animated.View style={{ marginTop: 20, gap: 12, opacity: listOpacity, transform: [{ translateX: listShift }] }}>
          {visible.length === 0 && !error ? (
            <View className="items-center rounded-[24px] border border-dashed px-6 py-10" style={{ borderColor: colors.cardBorder, backgroundColor: colors.card }}>
              <Text className="text-[16px] font-extrabold" style={{ color: colors.text }}>
                Nothing here
              </Text>
              <Text className="mt-1 text-center text-sm leading-5" style={{ color: colors.muted }}>
                {currentTab.empty}
              </Text>
            </View>
          ) : null}
          {visible.map(test => {
            const done = test.status === 'completed'
            return (
              <Pressable
                key={test.testId}
                accessibilityRole="button"
                onPress={() => navigation.navigate('AssessmentDetails', { testId: test.testId })}
                className="rounded-[24px] p-4"
                style={{ backgroundColor: colors.card }}>
                <View className="flex-row items-start justify-between gap-3">
                  <View className="min-w-0 flex-1">
                    <View className="self-start rounded-full px-2.5 py-1" style={{ backgroundColor: test.status === 'in_progress' ? '#FFF0E2' : colors.brandLight }}>
                      <Text className="text-[11px] font-extrabold uppercase tracking-[0.6px]" style={{ color: test.status === 'in_progress' ? '#C96D2F' : colors.brand }}>
                        {test.badge}
                      </Text>
                    </View>
                    <Text className="mt-3 text-[18px] font-extrabold leading-6" style={{ color: colors.text }}>
                      {test.title}
                    </Text>
                    {test.description ? (
                      <Text className="mt-1 text-sm leading-5" style={{ color: colors.muted }} numberOfLines={2}>
                        {test.description}
                      </Text>
                    ) : null}
                    <Text className="mt-3 text-[12px] font-bold" style={{ color: colors.muted }}>
                      {done ? test.completedLabel || 'Completed' : test.dueLabel}
                    </Text>
                  </View>
                  {done ? (
                    <View className="items-end rounded-2xl px-3 py-2" style={{ backgroundColor: colors.brandLight }}>
                      <Text className="text-[22px] font-black" style={{ color: colors.brand }}>
                        {resultLabel(test)}
                      </Text>
                      <Text className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.4px]" style={{ color: colors.brand }}>
                        Correct
                      </Text>
                    </View>
                  ) : (
                    <View className="items-end">
                      <Text className="text-[13px] font-extrabold" style={{ color: colors.text }}>
                        {test.questionCount} questions
                      </Text>
                      <Text className="mt-1 text-[12px] font-bold" style={{ color: colors.muted }}>
                        {test.durationMinutes} min
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            )
          })}
        </Animated.View>
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
  correct?: number
  total?: number
  passed?: boolean
  kind?: string
}

type ReviewStats = {
  attempts: number
  successes: number
  failures: number
  successRate: number
  failureRate: number
  passMark: number
}

function reviewFromHistory(history: HistoryItem[], passMark = 60): ReviewStats {
  const successes = history.filter(item => item.passed ?? item.score >= passMark).length
  const attempts = history.length
  const failures = attempts - successes
  return {
    attempts,
    successes,
    failures,
    successRate: attempts ? Math.round((successes / attempts) * 100) : 0,
    failureRate: attempts ? Math.round((failures / attempts) * 100) : 0,
    passMark,
  }
}

export function ProgressScreen() {
  const { colors } = useTheme()
  const [data, setData] = useState<{
    score: number
    level: { code: string; label: string }
    delta: number | null
    review?: ReviewStats
    history: HistoryItem[]
  } | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const next = await api<{ score: number; level: { code: string; label: string }; delta: number | null; review?: ReviewStats; history: HistoryItem[] }>('/progress')
      setData(next)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load progress')
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const refreshControl = usePullToRefresh(load)
  const review = data?.review ?? (data ? reviewFromHistory(data.history) : null)

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" contentContainerClassName="grow px-5 pb-8 pt-6" alwaysBounceVertical refreshControl={refreshControl}>
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
          Your attempts
        </Text>
        <View className="mt-3 flex-row gap-3">
          {[
            { label: 'Attempts', value: String(review?.attempts ?? 0) },
            { label: 'Success', value: review ? `${review.successRate}%` : '—' },
            { label: 'Failure', value: review ? `${review.failureRate}%` : '—' },
          ].map(item => (
            <View key={item.label} className="flex-1 rounded-[20px] px-3 py-4" style={{ backgroundColor: colors.card }}>
              <Text className="text-[11px] font-bold uppercase tracking-[0.4px]" style={{ color: colors.label }}>
                {item.label}
              </Text>
              <Text className="mt-1 text-[22px] font-black" style={{ color: colors.text }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
        {review ? (
          <Text className="mt-2 text-xs leading-5" style={{ color: colors.muted }}>
            {review.successes} passed and {review.failures} failed. A pass is {review.passMark}% or higher.
          </Text>
        ) : null}

        <Text className="mt-7 text-xs font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
          Score history
        </Text>
        <View className="mt-3">
          {(data?.history ?? []).map(item => {
            const passed = item.passed ?? item.score >= (review?.passMark ?? 60)
            return (
            <View key={item.id} className="flex-row items-center justify-between border-b py-4" style={{ borderColor: colors.divider }}>
              <View className="flex-1 pr-3">
                <Text className="text-[14px] font-extrabold" style={{ color: colors.text }}>
                  {item.name}
                </Text>
                <Text className="mt-1 text-xs" style={{ color: colors.muted }}>
                  {item.date}
                  {item.correct != null && item.total != null ? ` · ${item.correct} / ${item.total}` : ''}
                </Text>
              </View>
              <Text className="text-[13px] font-extrabold" style={{ color: passed ? colors.brand : '#B65F39' }}>
                {passed ? 'Passed' : 'Failed'}
              </Text>
            </View>
            )
          })}
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
