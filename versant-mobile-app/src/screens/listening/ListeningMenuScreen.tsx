import { useCallback, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import { BackButton } from '../../components/BackButton'
import { useTheme } from '../../context/ThemeContext'
import { LISTENING_TASKS, listeningTaskOf } from '../../listening/tasks'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'
import { api } from '../../services/client'
import type { RootStackParamList } from '../../navigation/types'

type Row = { kind?: string; questions?: { type?: string }[] }

export function ListeningMenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { colors } = useTheme()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await api<{ activities: Row[] }>('/practice/listening')
      const next: Record<string, number> = {}
      for (const item of data.activities) {
        const task = listeningTaskOf(item)
        next[task] = (next[task] ?? 0) + 1
      }
      setCounts(next)
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

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View className="flex-row items-center justify-between border-b px-5 pb-3 pt-3" style={{ borderColor: colors.divider, backgroundColor: colors.canvas }}>
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
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 28 }} alwaysBounceVertical refreshControl={refreshControl}>
        <Text className="text-[13px] font-semibold leading-5" style={{ color: colors.muted }}>
          Choose an activity. Each one opens its own list of exercises.
        </Text>
        {error ? <Text className="mt-4 text-sm font-semibold text-[#B65F39]">{error}</Text> : null}
        {loading && Object.keys(counts).length === 0 ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="large" color={colors.brand} />
          </View>
        ) : (
          <View className="mt-4 gap-3">
            {LISTENING_TASKS.map(task => {
              const count = counts[task.id] ?? 0
              return (
                <Pressable
                  key={task.id}
                  accessibilityRole="button"
                  onPress={() => navigation.navigate('ListeningPractice', { task: task.id })}
                  className="flex-row items-center rounded-[20px] px-4 py-3.5"
                  style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EAE4' }}>
                  <View className="min-w-0 flex-1 pr-3">
                    <Text className="text-[16px] font-extrabold" style={{ color: colors.text }} numberOfLines={1}>
                      {task.title}
                    </Text>
                    <Text className="mt-1.5 text-[12px] font-semibold" style={{ color: colors.muted }} numberOfLines={1}>
                      {task.blurb}
                    </Text>
                  </View>
                  <View className="mr-3 h-6 min-w-6 items-center justify-center rounded-full px-1.5" style={{ backgroundColor: colors.brandLight }}>
                    <Text className="text-[11px] font-extrabold" style={{ color: colors.brand }}>
                      {count}
                    </Text>
                  </View>
                  <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: colors.brandLight }}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path d="M9 6l6 6-6 6" stroke={colors.brand} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </View>
                </Pressable>
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
