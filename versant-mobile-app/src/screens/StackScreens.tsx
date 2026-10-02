import { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackButton } from '../components/BackButton'
import { useTheme } from '../context/ThemeContext'
import { ListeningPracticeScreen } from './listening/ListeningPracticeScreen'
import { StaticSkillScreen } from './StaticSkillScreen'
import { noReload, usePullToRefresh } from '../hooks/usePullToRefresh'
import { api } from '../services/client'
import type { RootStackParamList } from '../navigation/types'

type Note = { id: string; title: string; body: string; read: boolean }

export function NotificationsScreen() {
  const { colors } = useTheme()
  const [items, setItems] = useState<Note[]>([])

  const load = useCallback(async () => {
    const data = await api<{ items: Note[] }>('/notifications')
    setItems(data.items)
    await Promise.all(
      data.items
        .filter(item => !item.read)
        .map(item => api(`/notifications/${item.id}/read`, { method: 'POST' }).catch(() => undefined)),
    )
  }, [])

  useFocusEffect(
    useCallback(() => {
      load().catch(() => undefined)
    }, [load]),
  )

  const refreshControl = usePullToRefresh(load)

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']} style={{ backgroundColor: colors.canvas }}>
      <View className="px-5 pt-3">
        <BackButton />
        <Text className="mt-4 text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
          Notifications
        </Text>
      </View>
      <ScrollView className="mt-4 flex-1" contentContainerClassName="grow px-5 pb-8" alwaysBounceVertical refreshControl={refreshControl}>
        {items.length === 0 ? (
          <Text className="text-sm" style={{ color: colors.muted }}>
            No notifications yet.
          </Text>
        ) : null}
        {items.map(item => (
          <View key={item.id} className="border-b py-4" style={{ borderColor: colors.divider }}>
            <Text className="text-[15px] font-extrabold" style={{ color: colors.text }}>
              {item.title}
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
              {item.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export function PracticeSkillScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'PracticeSkill'>>()
  if (route.params.skill === 'listening') return <ListeningPracticeScreen />
  return <StaticSkillScreen skill={route.params.skill} />
}

export function DeviceCheckScreen() {
  const { colors } = useTheme()
  const refreshControl = usePullToRefresh(noReload)

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" contentContainerClassName="grow" alwaysBounceVertical refreshControl={refreshControl}>
      <View className="px-5 pt-3">
        <BackButton />
        <Text className="mt-4 text-[28px] font-black tracking-tight text-dark dark:text-[#EEF3EF]">Device check</Text>
        <Text className="mt-2 text-sm text-muted dark:text-[#B4BFB8]">
          Microphone and headphones will be tested before an assessment.
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type TestDetail = {
  id: string
  title: string
  description: string
  durationMinutes: number
  dueLabel: string
  status: string
  sections: { id: string; title: string; description: string; questionCount: number; completed: boolean }[]
}

export function AssessmentDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'AssessmentDetails'>>()
  const { colors } = useTheme()
  const [test, setTest] = useState<TestDetail | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await api<TestDetail>(`/tests/${route.params.testId}`)
      setTest(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this test')
    }
  }, [route.params.testId])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const refreshControl = usePullToRefresh(load)

  const next = test?.sections.find(section => !section.completed)

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }} alwaysBounceVertical refreshControl={refreshControl}>
          <View className="px-5 pt-3">
            <BackButton />
            <Text className="mt-4 text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.muted }}>
              Assessment
            </Text>
            <Text className="mt-2 text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
              {test?.title ?? 'Listening test'}
            </Text>
            <Text className="mt-2 text-sm leading-5" style={{ color: colors.muted }}>
              {error || (test ? `${test.durationMinutes} min · ${test.dueLabel}. ${test.description}` : 'Loading…')}
            </Text>
          </View>

          <View className="mt-6 gap-3 px-5">
            {test?.sections.map(section => (
              <View
                key={section.id}
                className="rounded-[20px] border px-4 py-4"
                style={{
                  backgroundColor: section.completed ? colors.card : colors.brandLight,
                  borderColor: section.completed ? colors.cardBorder : colors.brand,
                }}>
                <Text className="text-[15px] font-extrabold" style={{ color: colors.text }}>
                  {section.title}
                </Text>
                <Text className="mt-1 text-xs leading-5" style={{ color: colors.muted }}>
                  {section.questionCount} questions · {section.completed ? 'Submitted' : section.description}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <View className="px-5 pb-2">
          <Pressable
            disabled={!next}
            onPress={() =>
              next &&
              navigation.navigate('ListeningSession', {
                activityId: next.id,
                mode: 'assessment',
                testId: route.params.testId,
              })
            }
            className="h-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: next ? colors.brand : colors.brandLight }}>
            <Text className="text-[15px] font-extrabold" style={{ color: next ? '#FFFFFF' : colors.label }}>
              {test?.status === 'completed' ? 'Listening complete' : next ? 'Start listening' : 'Loading…'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
