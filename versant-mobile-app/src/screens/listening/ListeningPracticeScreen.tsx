import { useCallback, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path } from 'react-native-svg'
import { BackButton } from '../../components/BackButton'
import { useTheme } from '../../context/ThemeContext'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'
import { api } from '../../services/client'
import type { RootStackParamList } from '../../navigation/types'

type ActivityCard = {
  id: string
  title: string
  description: string
  duration: string
  level?: string | null
  iconBg: string
  iconColor: string
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
  const { colors } = useTheme()
  const [activities, setActivities] = useState<ActivityCard[]>([])
  const [today, setToday] = useState({ done: 0, goal: 15 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await api<{ todayMinutes: number; goalMinutes: number; activities: ActivityCard[] }>('/practice/listening')
      setActivities(data.activities)
      setToday({ done: data.todayMinutes, goal: data.goalMinutes })
      setError('')
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
    navigation.navigate('ListeningSession', { activityId, mode: 'practice' })
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28, flexGrow: 1 }} alwaysBounceVertical refreshControl={refreshControl}>
        <View className="flex-row items-center justify-between px-5 pt-3">
          <BackButton />
          <View className="items-center">
            <Text className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.muted }}>
              Practice
            </Text>
            <Text className="text-lg font-extrabold" style={{ color: colors.text }}>
              Listening
            </Text>
          </View>
          <View className="h-10 w-10" />
        </View>

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

        <View className="mt-7 px-5">
          <Text className="text-lg font-extrabold" style={{ color: colors.text }}>
            Activities
          </Text>
          <Text className="mt-1 text-xs" style={{ color: colors.muted }}>
            Pick one and answer the questions after the clip.
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
          {!loading && !error && activities.length === 0 ? (
            <View className="mt-4 items-center rounded-[24px] px-6 py-10" style={{ backgroundColor: colors.card }}>
              <Text className="text-[16px] font-extrabold" style={{ color: colors.text }}>
                Nothing to practice yet
              </Text>
              <Text className="mt-1 text-center text-sm leading-5" style={{ color: colors.muted }}>
                Listening activities will show up here when they are published.
              </Text>
            </View>
          ) : null}
          <View className="mt-4 gap-3">
            {activities.map((item, index) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => openActivity(item.id)}
                className="rounded-[24px] p-4"
                style={{ backgroundColor: index === 0 ? colors.brand : colors.card }}>
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: index === 0 ? 'rgba(255,255,255,0.16)' : item.iconBg }}>
                    <ActivityIcon id={item.id} color={index === 0 ? '#FFFFFF' : item.iconColor} />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-[16px] font-extrabold" style={{ color: index === 0 ? '#FFFFFF' : colors.text }}>
                      {item.title}
                    </Text>
                    <Text className="mt-1 text-[13px] leading-5" style={{ color: index === 0 ? 'rgba(255,255,255,0.75)' : colors.muted }} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text className="mt-2 text-[12px] font-bold" style={{ color: index === 0 ? 'rgba(255,255,255,0.8)' : colors.muted }}>
                      {[item.level, item.duration].filter(Boolean).join(' · ')}
                    </Text>
                  </View>
                </View>
                <View
                  className="mt-4 h-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: index === 0 ? '#FFFFFF' : colors.brand }}>
                  <Text className="text-[14px] font-extrabold" style={{ color: index === 0 ? colors.brand : '#FFFFFF' }}>
                    Start
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
