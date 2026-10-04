import { Pressable, ScrollView, Text, View } from 'react-native'
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext'
import { noReload, usePullToRefresh } from '../../hooks/usePullToRefresh'
import type { RootStackParamList } from '../../navigation/types'

export function ListeningResultScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'ListeningResult'>>()
  const { colors } = useTheme()
  const { title, correct, total, mode, score: givenScore, pending, summary, task } = route.params
  const score = pending && givenScore == null ? null : givenScore != null ? givenScore : total === 0 ? 0 : Math.round((correct / total) * 100)
  const refreshControl = usePullToRefresh(noReload)

  function done() {
    if (mode === 'assessment') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'Tests' } }],
        }),
      )
      return
    }
    navigation.dispatch(
      CommonActions.reset({
        index: task ? 2 : 1,
        routes: task
          ? [
              { name: 'Main', params: { screen: 'Practice' } },
              { name: 'PracticeSkill', params: { skill: 'listening' } },
              { name: 'ListeningPractice', params: { task } },
            ]
          : [
              { name: 'Main', params: { screen: 'Practice' } },
              { name: 'PracticeSkill', params: { skill: 'listening' } },
            ],
      }),
    )
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        alwaysBounceVertical
        refreshControl={refreshControl}>
      <View className="justify-center px-6">
        <Text className="text-center text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.accent }}>
          Listening
        </Text>
        <Text className="mt-2 text-center text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
          {title}
        </Text>
        <View className="mt-8 items-center rounded-[28px] px-6 py-8" style={{ backgroundColor: colors.brand }}>
          <Text className="text-xs font-bold uppercase tracking-[1px] text-white/70">
            {pending && score == null ? 'Response saved' : 'Your score'}
          </Text>
          <Text className="mt-2 text-[56px] font-black leading-none text-white">{score == null ? '—' : score}</Text>
          <Text className="mt-2 text-center text-sm font-semibold text-white/80">
            {pending && score == null
              ? 'Speech evaluation is not available yet. Your recording is saved.'
              : `${correct} of ${total} correct`}
          </Text>
          {summary ? <Text className="mt-3 text-center text-sm leading-5 text-white/80">{summary}</Text> : null}
        </View>
      </View>
      </ScrollView>
      <View className="px-6 pb-4">
        <Pressable
          onPress={done}
          className="h-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: colors.brand }}>
          <Text className="text-[15px] font-extrabold text-white">Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
