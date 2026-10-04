import { useCallback, useRef, useState, type ComponentRef } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path } from 'react-native-svg'
import { BackButton } from '../../components/BackButton'
import { useTheme } from '../../context/ThemeContext'
import { LISTENING_TASKS, listeningTaskOf } from '../../listening/tasks'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'
import { api } from '../../services/client'
import type { RootStackParamList } from '../../navigation/types'

type ActivityCard = {
  id: string
  title: string
  description: string
  duration: string
  level?: string | null
  category?: string | null
  audioLabel?: string | null
  iconBg: string
  iconColor: string
  kind?: string
  questions?: { type?: string }[]
  completed?: boolean
  bestCorrect?: number | null
  bestTotal?: number | null
}

type ProgressRow = {
  name: string
  kind?: string
  activityId?: string | null
  correct?: number
  total?: number
}

const KIND_LABEL: Record<string, string> = {
  repeat: 'Listening & Repeat',
  type: 'Listen & Type',
  respond: 'Listen & Respond',
  recall: 'Listen & Recall',
  identify: 'Listen & Identify',
}

const CATEGORIES = ['Conversation', 'Reading', 'Telephone', 'Product explanation', 'Announcement'] as const

const CATEGORY_ALIASES: Record<string, (typeof CATEGORIES)[number]> = {
  conversation: 'Conversation',
  dialogue: 'Conversation',
  reading: 'Reading',
  notice: 'Reading',
  passage: 'Reading',
  telephone: 'Telephone',
  phone: 'Telephone',
  voicemail: 'Telephone',
  call: 'Telephone',
  product: 'Product explanation',
  'product explanation': 'Product explanation',
  announcement: 'Announcement',
}

function practiceCategory(item: ActivityCard) {
  const raw = (item.category || item.audioLabel || '').trim().toLowerCase()
  return CATEGORY_ALIASES[raw] ?? 'Reading'
}

function ActivityIcon({ id, color }: { id: string; color: string }) {
  if (id === 'conversations') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <Path d="M7 10h10M7 13h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    )
  }

  if (id === 'passage') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M6 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <Path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    )
  }

  if (id === 'audio-comprehension') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={8} stroke={color} strokeWidth={1.8} />
        <Path d="M10 9v6l5-3-5-3Z" fill={color} />
      </Svg>
    )
  }

  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M15 9.5a4 4 0 0 1 0 5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M17.5 7a7.5 7.5 0 0 1 0 10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}

export function ListeningPracticeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'ListeningPractice'>>()
  const task = route.params.task
  const taskTitle = LISTENING_TASKS.find(item => item.id === task)?.title ?? 'Listening'
  const { colors } = useTheme()
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null)
  const sectionY = useRef(0)
  const listY = useRef(0)
  const viewportH = useRef(0)
  const cardY = useRef<Record<string, number>>({})
  const cardH = useRef<Record<string, number>>({})
  const scrolledKey = useRef('')
  const [activities, setActivities] = useState<ActivityCard[]>([])
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number] | 'All'>('All')
  const [today, setToday] = useState({ done: 0, goal: 15 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [data, progress] = await Promise.all([
        api<{ todayMinutes: number; goalMinutes: number; activities: ActivityCard[] }>('/practice/listening'),
        api<{ history?: ProgressRow[] }>('/progress').catch(() => ({ history: [] as ProgressRow[] })),
      ])
      const byId = new Map<string, ProgressRow>()
      const byName = new Map<string, ProgressRow>()
      for (const row of progress.history ?? []) {
        if (row.kind !== 'practice') continue
        if (row.activityId && !byId.has(row.activityId)) byId.set(row.activityId, row)
        if (!byName.has(row.name)) byName.set(row.name, row)
      }
      setActivities(
        data.activities.map(item => {
          const match = byId.get(item.id) ?? byName.get(item.title)
          const completed = item.completed === true || Boolean(match)
          return {
            ...item,
            category: practiceCategory(item),
            completed,
            bestCorrect: item.bestCorrect ?? match?.correct ?? null,
            bestTotal: item.bestTotal ?? match?.total ?? null,
          }
        }),
      )
      setToday({ done: data.todayMinutes, goal: data.goalMinutes })
      setError('')
      scrolledKey.current = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load listening')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const refreshControl = usePullToRefresh(load)

  function openActivity(activityId: string) {
    navigation.navigate('ListeningSession', { activityId, mode: 'practice', task })
  }

  const inTask = activities.filter(item => listeningTaskOf(item) === task)
  const visible = inTask.filter(item => filter === 'All' || item.category === filter)
  const nextIndex = visible.findIndex(item => !item.completed)

  function revealNext() {
    if (nextIndex <= 0 || sectionY.current <= 0 || listY.current <= 0 || viewportH.current <= 0) return
    const item = visible[nextIndex]
    const offset = cardY.current[item?.id]
    const height = cardH.current[item?.id]
    if (offset == null || height == null) return
    const key = `${filter}|${visible.map(entry => `${entry.id}:${entry.completed ? 1 : 0}`).join('|')}`
    if (scrolledKey.current === key) return
    scrolledKey.current = key
    const cardTop = sectionY.current + listY.current + offset
    const y = Math.max(0, cardTop - (viewportH.current - height) / 2)
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y, animated: true }))
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View className="flex-row items-center justify-between border-b px-5 pb-3 pt-3" style={{ borderColor: colors.divider, backgroundColor: colors.canvas }}>
        <BackButton />
        <View className="items-center">
          <Text className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.muted }}>
            Listening
          </Text>
          <Text className="max-w-[220px] text-center text-[16px] font-extrabold" style={{ color: colors.text }} numberOfLines={1}>
            {taskTitle}
          </Text>
        </View>
        <View className="h-10 w-10" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          backgroundColor: colors.canvas,
          flexGrow: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, gap: 8 }}>
        {(['All', ...CATEGORIES] as const).map(name => {
          const selected = filter === name
          const count = name === 'All' ? inTask.length : inTask.filter(item => item.category === name).length
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              onPress={() => {
                scrolledKey.current = ''
                setFilter(name)
              }}
              className="flex-row items-center gap-2 rounded-full py-1.5 pl-3.5 pr-1.5"
              style={{
                backgroundColor: selected ? colors.brand : colors.card,
                borderWidth: 1,
                borderColor: selected ? colors.brand : colors.cardBorder,
              }}>
              <Text className="text-[12px] font-extrabold" style={{ color: selected ? '#FFFFFF' : colors.text }}>
                {name}
              </Text>
              <View
                className="h-6 min-w-6 items-center justify-center rounded-full px-1.5"
                style={{ backgroundColor: selected ? '#FFFFFF' : colors.brandLight }}>
                <Text className="text-[11px] font-extrabold" style={{ color: colors.brand }}>
                  {count}
                </Text>
              </View>
            </Pressable>
          )
        })}
      </ScrollView>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 28, flexGrow: 1 }}
        alwaysBounceVertical
        refreshControl={refreshControl}
        onLayout={event => {
          viewportH.current = event.nativeEvent.layout.height
          revealNext()
        }}>
        <View className="mx-5 mt-5 overflow-hidden rounded-[28px] p-6" style={{ backgroundColor: colors.brandLight }}>
          <View
            className="h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.brand }}>
            <ActivityIcon id="listen-respond" color="#FFFFFF" />
          </View>
          <Text className="mt-5 text-[26px] font-black tracking-tight" style={{ color: colors.text }}>
            Listen. Understand. Respond.
          </Text>
          <Text className="mt-2 text-[15px] leading-6" style={{ color: colors.muted }}>
            Train your ability to understand spoken English, then answer the questions below.
          </Text>
          <View className="mt-5">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xs font-bold" style={{ color: colors.muted }}>
                Today’s practice
              </Text>
              <Text className="text-xs font-extrabold" style={{ color: colors.brand }}>
                {today.done} / {today.goal} min
              </Text>
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-white/70">
              <View
                className="h-full rounded-full"
                style={{ width: `${Math.min(100, (today.done / today.goal) * 100)}%`, backgroundColor: colors.brand }}
              />
            </View>
          </View>
        </View>

        <View
          className="mt-7 px-5"
          onLayout={event => {
            sectionY.current = event.nativeEvent.layout.y
            revealNext()
          }}>
          <Text className="text-lg font-extrabold" style={{ color: colors.text }}>
            Activities
          </Text>
          <Text className="mt-1 text-xs" style={{ color: colors.muted }}>
            Pick one and start when you are ready.
          </Text>
          {error ? <Text className="mt-4 text-sm font-semibold text-[#B65F39]">{error}</Text> : null}
          {loading && activities.length === 0 ? (
            <View className="mt-8 items-center py-10">
              <ActivityIndicator size="large" color={colors.brand} />
              <Text className="mt-3 text-sm font-semibold" style={{ color: colors.muted }}>
                Loading practice
              </Text>
            </View>
          ) : null}
          {!loading && !error && inTask.length === 0 ? (
            <View className="mt-4 items-center rounded-[24px] px-6 py-10" style={{ backgroundColor: colors.card }}>
              <Text className="text-[16px] font-extrabold" style={{ color: colors.text }}>
                Nothing to practice yet
              </Text>
              <Text className="mt-1 text-center text-sm leading-5" style={{ color: colors.muted }}>
                Exercises for {taskTitle} will show up here when they are published.
              </Text>
            </View>
          ) : null}
          {!loading && inTask.length > 0 && visible.length === 0 ? (
            <View className="mt-4 items-center rounded-[24px] px-6 py-10" style={{ backgroundColor: colors.card }}>
              <Text className="text-[16px] font-extrabold" style={{ color: colors.text }}>
                Nothing in {filter} yet
              </Text>
            </View>
          ) : null}
          <View
            className="mt-4 gap-3"
            onLayout={event => {
              listY.current = event.nativeEvent.layout.y
              revealNext()
            }}>
            {visible.map((item, index) => {
              const featured = index === nextIndex
              const completed = Boolean(item.completed)
              return (
                <View
                  key={item.id}
                  onLayout={event => {
                    cardY.current[item.id] = event.nativeEvent.layout.y
                    cardH.current[item.id] = event.nativeEvent.layout.height
                    revealNext()
                  }}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openActivity(item.id)}
                    className="flex-row items-center rounded-[20px] px-4 py-3.5"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderWidth: featured ? 1.5 : 1,
                      borderColor: featured ? colors.brand : '#E6EAE4',
                    }}>
                    <View className="min-w-0 flex-1 pr-3">
                      <Text
                        className="text-[16px] font-extrabold"
                        style={{ color: colors.text }}
                        numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text className="mt-1.5 text-[12px] font-semibold" style={{ color: colors.muted }} numberOfLines={1}>
                        {[KIND_LABEL[item.kind || ''], item.category, item.level, item.duration].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                    {completed && item.bestCorrect != null && item.bestTotal != null ? (
                      <View className="mr-3 items-end justify-center">
                        <Text className="text-[10px] font-bold uppercase tracking-[0.8px]" style={{ color: '#C45C26' }}>
                          Marks
                        </Text>
                        <Text className="mt-0.5 text-[15px] font-black leading-5" style={{ color: '#E25B2A' }}>
                          {item.bestCorrect}
                          <Text className="text-[12px] font-bold" style={{ color: '#C9A08A' }}>
                            {' '}
                            of {item.bestTotal}
                          </Text>
                        </Text>
                      </View>
                    ) : null}
                    <View
                      className="h-9 w-9 items-center justify-center rounded-full"
                      style={{ backgroundColor: completed ? colors.brand : colors.brandLight }}>
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        {completed ? (
                          <Path
                            d="M5 12.5 9.5 17 19 7"
                            stroke="#FFFFFF"
                            strokeWidth={2.6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ) : (
                          <Path
                            d="M9 6l6 6-6 6"
                            stroke={colors.brand}
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </Svg>
                    </View>
                  </Pressable>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
