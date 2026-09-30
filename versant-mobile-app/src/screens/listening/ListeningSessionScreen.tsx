import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path } from 'react-native-svg'
import { BackButton } from '../../components/BackButton'
import { useTheme } from '../../context/ThemeContext'
import { formatSeconds } from '../../listening/content'
import { api } from '../../services/client'
import type { RootStackParamList } from '../../navigation/types'

const WAVE = [16, 28, 20, 36, 24, 32, 20, 28, 18, 30]

type RemoteActivity = {
  id: string
  title: string
  audioLabel: string
  headline: string
  subtitle: string
  audioSeconds: number
  maxListens: number
  questionSeconds: number
  tip: string
  questions: { id: string; prompt: string; options: { id: string; text: string }[] }[]
}

type AttemptResponse = {
  correct: number
  total: number
  score: number
  testCorrect?: number
  testTotal?: number
  testCompleted?: boolean
  nextActivityId?: string | null
}

export function ListeningSessionScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ListeningSession'>>()
  const { colors } = useTheme()
  const [activity, setActivity] = useState<RemoteActivity | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setActivity(null)
    api<{ activity: RemoteActivity }>(`/practice/listening/${route.params.activityId}`)
      .then(data => {
        if (active) setActivity(data.activity)
      })
      .catch(err => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load this activity')
      })
    return () => {
      active = false
    }
  }, [route.params.activityId])

  if (!activity) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
        <View className="flex-1 items-center justify-center px-6">
          {error ? (
            <Text className="text-center text-sm font-semibold text-[#B65F39]">{error}</Text>
          ) : (
            <ActivityIndicator color={colors.brand} />
          )}
        </View>
      </SafeAreaView>
    )
  }

  return <SessionPlayer key={activity.id} activity={activity} />
}

function SessionPlayer({ activity }: { activity: RemoteActivity }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'ListeningSession'>>()
  const { colors } = useTheme()
  const mode = route.params.mode
  const testId = route.params.testId

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: string; optionId: string }[]>([])
  const [timeLeft, setTimeLeft] = useState(activity.questionSeconds)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSeconds, setAudioSeconds] = useState(0)
  const [listenCount, setListenCount] = useState(0)
  const [audioFinished, setAudioFinished] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const question = activity.questions[questionIndex]
  const total = activity.questions.length
  const progress = Math.round(((questionIndex + 1) / total) * 100)
  const urgent = timeLeft <= 10
  const canPlay = !isPlaying && listenCount < activity.maxListens
  const audioProgress = Math.min(audioSeconds / activity.audioSeconds, 1)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [questionIndex, activity.id])

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = setInterval(() => {
      setAudioSeconds(prev => {
        if (prev + 1 >= activity.audioSeconds) {
          setIsPlaying(false)
          setAudioFinished(true)
          return activity.audioSeconds
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [activity.audioSeconds, isPlaying])

  function play() {
    if (!canPlay) return
    setAudioSeconds(0)
    setListenCount(count => count + 1)
    setIsPlaying(true)
  }

  function resetClip() {
    setTimeLeft(activity.questionSeconds)
    setIsPlaying(false)
    setAudioSeconds(0)
    setListenCount(0)
    setAudioFinished(false)
    setSelected(null)
  }

  async function continueNext() {
    if (!selected || submitting) return
    const nextAnswers = [...answers, { questionId: question.id, optionId: selected }]
    const isLast = questionIndex >= total - 1

    if (!isLast) {
      setAnswers(nextAnswers)
      setQuestionIndex(index => index + 1)
      resetClip()
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      const path =
        mode === 'assessment' && testId
          ? `/tests/${testId}/attempts`
          : `/practice/listening/${activity.id}/attempts`
      const body =
        mode === 'assessment' && testId
          ? { activityId: activity.id, answers: nextAnswers }
          : { answers: nextAnswers }
      const result = await api<AttemptResponse>(path, { method: 'POST', body: JSON.stringify(body) })

      if (mode === 'assessment' && result.nextActivityId && testId) {
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
        title: mode === 'assessment' ? 'Listening assessment' : activity.title,
        correct: mode === 'assessment' ? result.testCorrect ?? result.correct : result.correct,
        total: mode === 'assessment' ? result.testTotal ?? result.total : result.total,
        mode,
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not save answers')
      setSubmitting(false)
    }
  }

  const status = isPlaying
    ? `Playing ${activity.audioLabel.toLowerCase()}...`
    : audioFinished
      ? `${activity.audioLabel} finished`
      : listenCount >= activity.maxListens
        ? 'You have used both listens.'
        : 'Listen carefully before answering'

  const listenBadge =
    listenCount === 0 ? '2 listens' : listenCount === 1 ? '1 listen used' : '2 listens used'

  const hint = selected
    ? 'Your answer is selected. Continue when you’re ready.'
    : audioFinished
      ? 'Select the answer that best matches what you heard.'
      : `Listen to the ${activity.audioLabel.toLowerCase()} to continue`

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View style={{ flex: 1 }}>
        <View className="px-5 pt-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <BackButton />
              <View>
                <Text className="text-[11px] font-semibold" style={{ color: colors.muted }}>
                  Listening
                </Text>
                <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
                  {activity.audioLabel}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-[11px]" style={{ color: colors.muted }}>
                Question
              </Text>
              <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
                {questionIndex + 1} of {total}
              </Text>
            </View>
          </View>
          <View className="mt-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-[11px] font-semibold" style={{ color: colors.muted }}>
                {mode === 'assessment' ? 'Assessment progress' : 'Practice progress'}
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

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <View className="mb-5 mt-6 items-center">
            <View
              className="flex-row items-center gap-2 rounded-full border px-4 py-2"
              style={{
                backgroundColor: urgent ? '#FDEFE7' : colors.cream,
                borderColor: urgent ? '#F5D5C0' : colors.cardBorder,
              }}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={9} stroke={urgent ? '#C96D2F' : colors.brand} strokeWidth={1.8} />
                <Path
                  d="M12 7v5l3 2"
                  stroke={urgent ? '#C96D2F' : colors.brand}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
              <Text className="text-xs font-bold" style={{ color: urgent ? '#C96D2F' : colors.brand }}>
                {formatSeconds(timeLeft)}
              </Text>
            </View>
          </View>

          <Text className="text-center text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.accent }}>
            Listening · {activity.audioLabel}
          </Text>
          <Text className="mt-2 text-center text-[22px] font-black tracking-tight" style={{ color: colors.text }}>
            {activity.headline}
          </Text>
          <Text className="mt-2 text-center text-sm leading-5" style={{ color: colors.muted }}>
            {activity.subtitle}
          </Text>

          <View
            className="mt-6 overflow-hidden rounded-[28px] border"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <View className="flex-row items-start justify-between px-5 pt-5">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
                  {activity.audioLabel}
                </Text>
                <Text className="mt-1 text-xs" style={{ color: colors.muted }}>
                  {status}
                </Text>
              </View>
              <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: colors.cream }}>
                <Text className="text-[11px] font-bold" style={{ color: colors.brand }}>
                  {listenBadge}
                </Text>
              </View>
            </View>

            <View className="px-5 py-5">
              <View className="rounded-[24px] border p-5" style={{ backgroundColor: colors.canvas, borderColor: colors.divider }}>
                <View className="flex-row items-center gap-4">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isPlaying ? 'Playing' : 'Play'}
                    onPress={play}
                    disabled={!canPlay}
                    className="h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.brand, opacity: canPlay || isPlaying ? 1 : 0.55 }}>
                    {isPlaying ? (
                      <Svg width={26} height={26} viewBox="0 0 24 24">
                        <Path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="#FFFFFF" />
                      </Svg>
                    ) : (
                      <Svg width={26} height={26} viewBox="0 0 24 24">
                        <Path d="M8 5v14l11-7z" fill="#FFFFFF" />
                      </Svg>
                    )}
                  </Pressable>
                  <View className="flex-1">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-xs font-bold" style={{ color: colors.muted }}>
                        {formatSeconds(audioSeconds)}
                      </Text>
                      <Text className="text-xs" style={{ color: colors.label }}>
                        {formatSeconds(activity.audioSeconds)}
                      </Text>
                    </View>
                    <View className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: colors.divider }}>
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${audioProgress * 100}%`, backgroundColor: colors.brand }}
                      />
                    </View>
                    <View className="mt-4 h-10 flex-row items-center justify-center gap-1">
                      {WAVE.map((height, index) => (
                        <View
                          key={index}
                          className="w-1 rounded-full"
                          style={{
                            height: isPlaying ? height : Math.max(10, height - 8),
                            backgroundColor: isPlaying ? colors.brand : '#AFC6B7',
                          }}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <View className="mt-5 flex-row items-center justify-between border-t pt-4" style={{ borderColor: colors.divider }}>
                  <Text className="flex-1 pr-3 text-xs" style={{ color: colors.muted }}>
                    You can listen twice.
                  </Text>
                  <Pressable onPress={play} disabled={!canPlay}>
                    <Text className="text-xs font-bold" style={{ color: canPlay ? colors.brand : colors.label }}>
                      {listenCount >= activity.maxListens ? 'No listens left' : 'Replay'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <View
            className="mt-4 overflow-hidden rounded-[28px] border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              opacity: audioFinished ? 1 : 0.5,
            }}>
            <View className="px-5 pt-5">
              <Text className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
                Question
              </Text>
              <Text className="mt-1 text-sm font-extrabold" style={{ color: colors.text }}>
                Choose the best answer
              </Text>
            </View>
            <View className="px-5 py-5">
              <View className="rounded-2xl border p-4" style={{ backgroundColor: colors.canvas, borderColor: colors.divider }}>
                <Text className="text-[16px] font-bold leading-6" style={{ color: colors.text }}>
                  {question.prompt}
                </Text>
              </View>
              <View className="mt-4 gap-3">
                {question.options.map(option => {
                  const active = selected === option.id
                  return (
                    <Pressable
                      key={option.id}
                      disabled={!audioFinished}
                      onPress={() => setSelected(option.id)}
                      className="flex-row items-start gap-3 rounded-2xl border p-4"
                      style={{
                        backgroundColor: active ? colors.brandLight : colors.card,
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
          </View>

          <Text className="mt-4 px-1 text-xs leading-5" style={{ color: colors.muted }}>
            {activity.tip}
          </Text>
        </ScrollView>

        <View className="border-t px-5 py-4" style={{ borderColor: colors.divider, backgroundColor: colors.canvas }}>
          {submitError ? (
            <Text className="mb-2 text-center text-xs font-semibold text-[#B65F39]">{submitError}</Text>
          ) : null}
          <Pressable
            disabled={!selected || submitting}
            onPress={continueNext}
            className="h-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: selected && !submitting ? colors.brand : colors.brandLight }}>
            <Text className="text-[15px] font-extrabold" style={{ color: selected && !submitting ? '#FFFFFF' : colors.label }}>
              {submitting ? 'Saving…' : 'Continue'}
            </Text>
          </Pressable>
          <Text className="mt-2 text-center text-xs font-semibold" style={{ color: selected ? colors.brand : colors.muted }}>
            {hint}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
