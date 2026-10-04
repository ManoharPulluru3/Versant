import { useEffect, useRef, useState } from 'react'
import { BackHandler, Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path } from 'react-native-svg'
import { useTheme } from '../../context/ThemeContext'
import { formatSeconds } from '../../listening/content'
import { api } from '../../services/client'
import type { RootStackParamList } from '../../navigation/types'

type AttemptResponse = {
  correct: number
  total: number
  score: number
  testCorrect?: number
  testTotal?: number
  nextActivityId?: string | null
}

export function ListeningQuestionsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'ListeningQuestions'>>()
  const { colors } = useTheme()
  const { activityId, title, headline, questionSeconds, questions, testId } = route.params
  const practice = !testId
  const leaving = useRef(false)
  const [leaveWarning, setLeaveWarning] = useState(false)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: string; optionId: string }[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(questionSeconds)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const question = questions[questionIndex]
  const total = questions.length
  const progress = total ? Math.round(((questionIndex + 1) / total) * 100) : 0
  const urgent = timeLeft <= 10
  const isLast = questionIndex >= total - 1

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [questionIndex])

  function askToLeave() {
    setLeaveWarning(true)
  }

  function confirmLeave() {
    leaving.current = true
    setLeaveWarning(false)
    navigation.goBack()
  }

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!practice) return true
      askToLeave()
      return true
    })
    const block = navigation.addListener('beforeRemove', event => {
      if (leaving.current || !practice) {
        if (!practice && !leaving.current) event.preventDefault()
        return
      }
      event.preventDefault()
      setLeaveWarning(true)
    })
    return () => {
      back.remove()
      block()
    }
  }, [navigation, practice])

  async function continueNext() {
    if (!question || !selected || submitting) return
    const nextAnswers = [...answers, { questionId: question.id, optionId: selected }]
    if (!isLast) {
      setAnswers(nextAnswers)
      setSelected(null)
      setQuestionIndex(index => index + 1)
      setTimeLeft(questionSeconds)
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      const result = await api<AttemptResponse>(
        testId ? `/tests/${testId}/attempts` : `/practice/listening/${activityId}/attempts`,
        {
          method: 'POST',
          body: JSON.stringify(testId ? { activityId, answers: nextAnswers } : { answers: nextAnswers }),
        },
      )
      leaving.current = true
      if (result.nextActivityId && testId) {
        navigation.replace('ListeningSession', {
          activityId: result.nextActivityId,
          mode: 'assessment',
          testId,
          carryCorrect: result.testCorrect,
          carryTotal: result.testTotal,
        })
        return
      }
      navigation.replace('ListeningResult', {
        title: practice ? title : 'Listening assessment',
        correct: result.testCorrect ?? result.correct,
        total: result.testTotal ?? result.total,
        mode: practice ? 'practice' : 'assessment',
        task: route.params.task,
      })
    } catch (err) {
      leaving.current = false
      setSubmitError(err instanceof Error ? err.message : 'Could not save answers')
      setSubmitting(false)
    }
  }

  if (!question) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-sm font-semibold" style={{ color: colors.muted }}>
            This section has no questions yet.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View style={{ flex: 1 }}>
        <View className="px-5 pt-3">
          <View className="flex-row items-center justify-between">
            <View className="min-w-0 flex-1 flex-row items-center gap-3">
              {practice ? (
                <Pressable accessibilityRole="button" accessibilityLabel="Back to the recording" onPress={askToLeave} className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: colors.cream }}>
                  <Text className="text-lg font-black" style={{ color: colors.brand }}>
                    ‹
                  </Text>
                </Pressable>
              ) : null}
              <View className="min-w-0 flex-1">
              <Text className="text-[11px] font-semibold" style={{ color: colors.muted }}>
                {practice ? 'Practice' : 'Listening test'}
              </Text>
              <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
                {headline || title}
              </Text>
              </View>
            </View>
            <View
              className="flex-row items-center gap-2 rounded-full border px-3 py-2"
              style={{
                backgroundColor: urgent ? '#FDEFE7' : colors.cream,
                borderColor: urgent ? '#F5D5C0' : colors.cardBorder,
              }}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={9} stroke={urgent ? '#C96D2F' : colors.brand} strokeWidth={1.8} />
                <Path d="M12 7v5l3 2" stroke={urgent ? '#C96D2F' : colors.brand} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
              <Text className="text-xs font-bold" style={{ color: urgent ? '#C96D2F' : colors.brand }}>
                {formatSeconds(timeLeft)}
              </Text>
            </View>
          </View>
          <View className="mt-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-[11px] font-semibold" style={{ color: colors.muted }}>
                Question {questionIndex + 1} of {total}
              </Text>
              <Text className="text-[11px] font-bold" style={{ color: colors.brand }}>
                {progress}%
              </Text>
            </View>
            <View className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: colors.divider }}>
              <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: colors.brand }} />
            </View>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 }}>
          <View className="mt-5 rounded-2xl px-4 py-3" style={{ backgroundColor: colors.brandLight }}>
            <Text className="text-[13px] font-bold leading-5" style={{ color: colors.brand }}>
              {practice
                ? 'You can go back to the recording. Answers on this screen are saved only when you submit.'
                : 'These questions stay on this screen. You cannot go back to the recording.'}
            </Text>
          </View>

          <View className="mt-4 overflow-hidden rounded-[28px] border" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <View className="px-5 pt-5">
              <Text className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
                Question {questionIndex + 1}
              </Text>
              <Text className="mt-2 text-[18px] font-extrabold leading-7" style={{ color: colors.text }}>
                {question.prompt}
              </Text>
            </View>
            <View className="gap-3 px-5 py-5">
              {question.options.map(option => {
                const active = selected === option.id
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setSelected(option.id)}
                    className="flex-row items-start gap-3 rounded-2xl border p-4"
                    style={{
                      backgroundColor: active ? colors.brandLight : colors.canvas,
                      borderColor: active ? colors.brand : colors.cardBorder,
                    }}>
                    <View
                      className="h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: active ? colors.brand : colors.cream }}>
                      <Text className="text-sm font-extrabold" style={{ color: active ? '#FFFFFF' : colors.brand }}>
                        {option.id}
                      </Text>
                    </View>
                    <Text className="flex-1 pt-1 text-sm font-semibold leading-5" style={{ color: colors.text }}>
                      {option.text}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

        </ScrollView>

        <View className="border-t px-5 py-4" style={{ borderColor: colors.divider, backgroundColor: colors.canvas }}>
          {submitError ? <Text className="mb-2 text-center text-xs font-semibold text-[#B65F39]">{submitError}</Text> : null}
          {timeLeft === 0 ? (
            <Text className="mb-2 text-center text-xs font-semibold text-[#C96D2F]">Time is up. Choose an answer and continue.</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            disabled={!selected || submitting}
            onPress={continueNext}
            className="h-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: selected && !submitting ? colors.brand : colors.brandLight }}>
            <Text className="text-[15px] font-extrabold" style={{ color: selected && !submitting ? '#FFFFFF' : colors.label }}>
              {submitting ? 'Saving…' : isLast ? 'Submit answers' : 'Next question'}
            </Text>
          </Pressable>
          <Text className="mt-2 text-center text-xs font-semibold" style={{ color: colors.muted }}>
            {selected ? 'You cannot change this after you continue.' : 'Select one answer to continue.'}
          </Text>
        </View>
      </View>
      <Modal visible={leaveWarning} transparent animationType="fade" onRequestClose={() => setLeaveWarning(false)}>
        <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: 'rgba(23,34,29,0.45)' }}>
          <View className="w-full rounded-[24px] p-5" style={{ backgroundColor: colors.card }}>
            <Text className="text-[18px] font-black" style={{ color: colors.text }}>
              Go back to the recording?
            </Text>
            <Text className="mt-2 text-sm leading-5" style={{ color: colors.muted }}>
              The answers on this screen will not be saved. You can listen again, then start the questions once more.
            </Text>
            <Pressable accessibilityRole="button" onPress={confirmLeave} className="mt-5 h-12 items-center justify-center rounded-2xl" style={{ backgroundColor: colors.brand }}>
              <Text className="text-[15px] font-extrabold text-white">Go back</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setLeaveWarning(false)} className="mt-2 h-12 items-center justify-center rounded-2xl" style={{ backgroundColor: colors.cream }}>
              <Text className="text-[15px] font-extrabold" style={{ color: colors.text }}>
                Stay here
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
