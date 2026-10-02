import { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useFocusEffect, useNavigation, type CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path, Rect } from 'react-native-svg'
import { useTheme } from '../context/ThemeContext'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import type { MainTabParamList, RootStackParamList } from '../navigation/types'
import { api } from '../services/client'

type HomeData = {
  greeting: string
  student: { name: string }
  unread: number
  upcoming: { id: string; title: string; description: string; durationMinutes: number; dueLabel: string } | null
  score: number
  level: { code: string; label: string }
  practice: { id: string; title: string; description: string; duration: string }[]
  recent: { id: string; title: string; meta: string; score: number }[]
  todayMinutes: number
  goalMinutes: number
}

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>

const SKILL_STYLE = [
  { name: 'Speaking' as const, color: '#1f6b4f', chip: '#dcebdd' },
  { name: 'Listening' as const, color: '#e58a45', chip: '#FFF0DF' },
  { name: 'Reading' as const, color: '#5C63A8', chip: '#E8EAF7' },
  { name: 'Writing' as const, color: '#9A5792', chip: '#F2E5F1' },
]

function BellIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 17h5l-1.4-1.5A2 2 0 0 1 18 14.1V11a6 6 0 1 0-12 0v3.1c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
        stroke="#26342D"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function SkillGlyph({
  name,
  color,
  size = 18,
}: {
  name: 'Speaking' | 'Listening' | 'Reading' | 'Writing' | 'Check'
  color: string
  size?: number
}) {
  if (name === 'Speaking') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 14a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v3a4 4 0 0 0 4 4Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <Path
          d="M19 10a7 7 0 0 1-14 0M12 17v4M9 21h6"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    )
  }
  if (name === 'Listening') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 14a8 8 0 0 1 16 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path
          d="M4 14v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2ZM20 14v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    )
  }
  if (name === 'Reading') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    )
  }
  if (name === 'Check') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M5 12l4 4L19 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    )
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function ClockIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8} stroke="rgba(255,255,255,0.7)" strokeWidth={1.8} />
      <Path d="M12 8v4l2.5 2" stroke="rgba(255,255,255,0.7)" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}

function CalendarIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function DocIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={4} width={16} height={16} rx={3} stroke="#ffffff" strokeWidth={1.8} />
      <Path d="M8 9h8M8 13h5M8 17h3" stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}

function ArrowIcon({ color = '#1f6b4f' }: { color?: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function HomeScreen() {
  const navigation = useNavigation<Nav>()
  const { colors } = useTheme()
  const [home, setHome] = useState<HomeData | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await api<HomeData>('/home')
      setHome(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load home')
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const refreshControl = usePullToRefresh(load)

  const score = home?.score ?? 0
  const ring = 264 * (1 - score / 100)
  const skills = SKILL_STYLE.map(skill => ({
    ...skill,
    score: skill.name === 'Listening' ? score : null,
  }))

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} alwaysBounceVertical refreshControl={refreshControl}>
        <View className="flex-row items-center justify-between px-5 pt-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#E5EBD9]">
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={8} r={3.2} stroke="#1f6b4f" strokeWidth={1.8} />
                <Path d="M5.5 20a6.5 6.5 0 0 1 13 0" stroke="#1f6b4f" strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
            </View>
            <View>
              <Text className="text-xs font-semibold text-[#8A918B]">{home?.greeting ?? 'Hello'}</Text>
              <Text className="mt-0.5 text-[15px] font-extrabold text-dark dark:text-[#EEF3EF]">
                {home?.student.name ?? 'Student'}
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => navigation.navigate('Notifications')}
            className="h-11 w-11 items-center justify-center rounded-full bg-cream dark:bg-[#24382E]">
            <BellIcon />
            {home && home.unread > 0 ? (
              <View className="absolute right-1.5 top-1.5 h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1">
                <Text className="text-[11px] font-extrabold text-white">{home.unread}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View className="px-5 pb-8 pt-6">
          <View className="overflow-hidden rounded-[28px] bg-brand p-5">
            <View className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[22px] border-white/10" />
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View
                  className="mb-3 self-start flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <View className="h-1.5 w-1.5 rounded-full bg-[#F7B267]" />
                  <Text className="text-xs font-bold uppercase tracking-[1px] text-white">
                    Upcoming Assessment
                  </Text>
                </View>
                <Text className="text-[22px] font-extrabold leading-7 text-white">
                  {home?.upcoming?.title ?? 'No listening test yet'}
                </Text>
                <Text className="mt-2 text-sm text-white/80">
                  {error || home?.upcoming?.description || 'Assigned listening tests will show up here.'}
                </Text>
              </View>
              <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <DocIcon />
              </View>
            </View>
            <View className="mt-5 flex-row items-center gap-4">
              <View className="flex-row items-center gap-1.5">
                <ClockIcon />
                <Text className="text-xs font-semibold text-white/80">
                  {home?.upcoming ? `${home.upcoming.durationMinutes} min` : '—'}
                </Text>
              </View>
              <View className="h-1 w-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
              <View className="flex-row items-center gap-1.5">
                <CalendarIcon />
                <Text className="text-xs font-semibold text-white/80">{home?.upcoming?.dueLabel ?? 'Not assigned'}</Text>
              </View>
            </View>
            <Pressable
              disabled={!home?.upcoming}
              onPress={() =>
                home?.upcoming && navigation.navigate('AssessmentDetails', { testId: home.upcoming.id })
              }
              className="mt-5 h-[52px] flex-row items-center justify-center gap-2 rounded-2xl bg-white">
              <Text className="text-sm font-extrabold text-brand">Start Assessment</Text>
              <ArrowIcon />
            </Pressable>
          </View>

          <View className="mt-7 flex-row items-end justify-between">
            <View>
              <Text className="text-xs font-bold uppercase tracking-[1px] text-[#9AA19B]">
                Your English
              </Text>
              <Text className="mt-1 text-lg font-extrabold text-dark dark:text-[#EEF3EF]">Communication Level</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Progress')}>
              <Text className="text-[13px] font-bold text-brand">View report</Text>
            </Pressable>
          </View>

          <View className="mt-4 flex-row items-center gap-5 rounded-[24px] bg-cream dark:bg-[#24382E] p-4">
            <View className="h-[82px] w-[82px] items-center justify-center">
              <Svg width={82} height={82} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx={50} cy={50} r={42} stroke="#DDE3D5" strokeWidth={8} fill="none" />
                <Circle
                  cx={50}
                  cy={50}
                  r={42}
                  stroke="#1F6B4F"
                  strokeWidth={8}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="264"
                  strokeDashoffset={ring}
                />
              </Svg>
              <View className="absolute items-center">
                <Text className="text-xl font-black text-dark dark:text-[#EEF3EF]">{score}</Text>
                <Text className="text-[10px] font-bold uppercase tracking-wide text-muted dark:text-[#B4BFB8]">Score</Text>
              </View>
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-[15px] font-extrabold text-dark dark:text-[#EEF3EF]">
                {home ? `${home.level.code} — ${home.level.label}` : 'Listening level'}
              </Text>
              <Text className="mt-1 text-xs leading-4 text-muted dark:text-[#B4BFB8]">
                You communicate confidently in everyday and academic situations.
              </Text>
              <View className="mt-3 flex-row items-center gap-2">
                <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#D8DED2]">
                  <View className="h-full rounded-full bg-brand" style={{ width: `${score}%` }} />
                </View>
                <Text className="text-xs font-extrabold text-brand">{score}%</Text>
              </View>
            </View>
          </View>

          <View className="mt-7 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-dark dark:text-[#EEF3EF]">Your Skills</Text>
            <Pressable onPress={() => navigation.navigate('Progress')}>
              <Text className="text-[13px] font-bold text-muted dark:text-[#B4BFB8]">Details</Text>
            </Pressable>
          </View>
          <View className="mt-4 flex-row flex-wrap justify-between gap-y-3">
            {skills.map(skill => (
              <View
                key={skill.name}
                className="w-[48%] rounded-[22px] border border-[#EEF0E9] dark:border-[#3D4C44] bg-white dark:bg-[#1C2621] p-4">
                <View className="flex-row items-center justify-between">
                  <View
                    className="h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: skill.chip }}>
                    <SkillGlyph name={skill.name} color={skill.color} />
                  </View>
                  {skill.name === 'Listening' ? (
                    <Text className="text-[15px] font-extrabold" style={{ color: skill.color }}>
                      {skill.score ?? '—'}
                    </Text>
                  ) : (
                    <View className="rounded-full px-2 py-1" style={{ backgroundColor: '#F4F1EA' }}>
                      <Text className="text-[10px] font-extrabold uppercase tracking-[0.3px]" style={{ color: '#8A7760' }}>
                        Soon
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="mt-3 text-[13px] font-extrabold text-dark dark:text-[#EEF3EF]">{skill.name}</Text>
                {skill.name === 'Listening' ? (
                  <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E9ECE6]">
                    <View
                      className="h-full rounded-full"
                      style={{ width: `${skill.score ?? 0}%`, backgroundColor: skill.color }}
                    />
                  </View>
                ) : (
                  <Text className="mt-2 text-[11px] font-semibold" style={{ color: '#8A7760' }}>
                    Coming soon
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View className="mt-7 flex-row items-end justify-between">
            <View>
              <Text className="text-xs font-bold uppercase tracking-[1px] text-[#9AA19B]">
                Improve your skills
              </Text>
              <Text className="mt-1 text-lg font-extrabold text-dark dark:text-[#EEF3EF]">Quick Practice</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Practice')}>
              <Text className="text-[13px] font-bold text-brand">See all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-5 mt-4"
            contentContainerClassName="gap-3 px-5">
            {(home?.practice ?? []).map(item => (
              <PracticeCard
                key={item.id}
                title={item.title}
                body={item.description}
                time={item.duration}
                bg="#FFF2E4"
                iconBg="#ffffff"
                color="#e58a45"
                icon="Listening"
                onPress={() => navigation.navigate('ListeningSession', { activityId: item.id, mode: 'practice' })}
              />
            ))}
          </ScrollView>

          <View className="mt-7 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-dark dark:text-[#EEF3EF]">Recent Activity</Text>
            <Pressable onPress={() => navigation.navigate('Progress')}>
              <Text className="text-[13px] font-bold text-muted dark:text-[#B4BFB8]">View all</Text>
            </Pressable>
          </View>
          {(home?.recent ?? []).map(item => (
            <View key={item.id} className="flex-row items-center gap-3 border-b border-[#EEF0E9] dark:border-[#3D4C44] py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: '#FFF0DF' }}>
                <SkillGlyph name="Listening" color="#e58a45" size={16} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-[13px] font-extrabold text-dark dark:text-[#EEF3EF]">{item.title}</Text>
                <Text className="mt-0.5 text-xs text-[#8A918B]">{item.meta}</Text>
              </View>
              <Text className="text-[13px] font-black" style={{ color: '#e58a45' }}>
                {item.score}
              </Text>
            </View>
          ))}

          <View className="mt-5 rounded-[24px] border border-[#EEF0E9] dark:border-[#3D4C44] bg-white dark:bg-[#1C2621] p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0DF]">
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={8} stroke="#e58a45" strokeWidth={1.8} />
                    <Circle cx={12} cy={12} r={4} stroke="#e58a45" strokeWidth={1.8} />
                    <Circle cx={12} cy={12} r={1.2} fill="#e58a45" />
                  </Svg>
                </View>
                <View>
                  <Text className="text-[13px] font-extrabold text-dark dark:text-[#EEF3EF]">Daily Practice Goal</Text>
                  <Text className="mt-0.5 text-xs text-[#8A918B]">Keep your English improving</Text>
                </View>
              </View>
              <Text className="text-[13px] font-black text-accent">
                {home?.todayMinutes ?? 0} / {home?.goalMinutes ?? 15} min
              </Text>
            </View>
            <View className="mt-4 h-2 overflow-hidden rounded-full bg-[#EEF0E9]">
              <View
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.min(100, ((home?.todayMinutes ?? 0) / (home?.goalMinutes || 15)) * 100)}%` }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function PracticeCard({
  title,
  body,
  time,
  bg,
  iconBg,
  color,
  icon,
  onPress,
}: {
  title: string
  body: string
  time: string
  bg: string
  iconBg: string
  color: string
  icon: 'Speaking' | 'Listening' | 'Reading'
  onPress: () => void
}) {
  return (
    <View className="w-[190px] rounded-[23px] p-4" style={{ backgroundColor: bg }}>
      <View className="flex-row items-center justify-between">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}>
          <SkillGlyph name={icon} color={color} size={20} />
        </View>
        <View className="rounded-full bg-white dark:bg-[#1C2621] px-2.5 py-1">
          <Text className="text-xs text-muted dark:text-[#B4BFB8]">{time}</Text>
        </View>
      </View>
      <Text className="mt-4 text-[15px] font-extrabold text-dark dark:text-[#EEF3EF]">{title}</Text>
      <Text className="mt-1 text-xs text-muted dark:text-[#B4BFB8]">{body}</Text>
      <Pressable onPress={onPress} className="mt-4 flex-row items-center gap-1">
        <Text className="text-[13px] font-bold" style={{ color }}>
          Practice now
        </Text>
        <ArrowIcon color={color} />
      </Pressable>
    </View>
  )
}
