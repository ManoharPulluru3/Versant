import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, AppState, PermissionsAndroid, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackButton } from '../../components/BackButton'
import { ENV } from '../../config/env'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../services/client'
import type { ListeningMode, RootStackParamList } from '../../navigation/types'
import { NativeEventEmitter, NativeModules } from 'react-native'

type Option = { id: string; text: string }
type PairSide = { id: string; text: string }
type RecallField = { id: string; label: string }
type TaskQuestion = {
  id: string
  type: string
  prompt: string
  prepareSeconds?: number
  audioUrl?: string | null
  options?: Option[]
  left?: PairSide[]
  right?: PairSide[]
  fields?: RecallField[]
}
type TaskActivity = {
  id: string
  title: string
  kind: string
  headline: string
  audioUrl: string | null
  maxListens: number
  questionSeconds: number
  questions: TaskQuestion[]
}
type Draft = {
  text?: string
  optionId?: string | null
  pairs?: Record<string, string>
  fields?: Record<string, string>
  responseAudioId?: string | null
  localPath?: string | null
}
type AttemptResponse = {
  correct: number
  total: number
  score: number | null
  pending?: boolean
  review?: { accuracy?: number; words?: { word: string; ok: boolean }[]; extra?: string[] }[]
  nextActivityId?: string | null
  testCorrect?: number
  testTotal?: number
}

const TITLES: Record<string, string> = {
  blank: 'Fill in the blanks',
  match: 'Match the following',
  truefalse: 'True or false',
  repeat: 'Listening & Repeat',
  type: 'Listen & Type',
  respond: 'Listen & Respond',
  recall: 'Listen & Recall',
  identify: 'Listen & Identify',
}

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }
  return next
}

function summaryFrom(review: AttemptResponse['review']) {
  const item = review?.[0]
  if (!item?.words?.length) return undefined
  const missed = item.words.filter(word => !word.ok).map(word => word.word)
  const extra = item.extra ?? []
  const parts = [`Listening accuracy ${item.accuracy ?? 0}%`]
  if (missed.length) parts.push(`Missing: ${missed.join(', ')}`)
  if (extra.length) parts.push(`Extra: ${extra.join(', ')}`)
  return parts.join('. ')
}

export function ListeningTaskScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'ListeningTask'>>()
  const { colors } = useTheme()
  const { activityId, mode, testId } = route.params
  const exam = mode === 'assessment'
  const [activity, setActivity] = useState<TaskActivity | null>(null)
  const [error, setError] = useState('')
  const [index, setIndex] = useState(0)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [answers, setAnswers] = useState<Record<string, unknown>[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState('')
  const [recording, setRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [playing, setPlaying] = useState<'clip' | 'take' | null>(null)
  const [rights, setRights] = useState<PairSide[]>([])
  const started = useRef(Date.now())
  const ready = useRef(false)
  const player = NativeModules.VersantAudio as
    | { play: (url: string) => Promise<number>; stop: () => void; addListener: (event: string) => void; removeListeners: (count: number) => void }
    | undefined
  const recorder = NativeModules.VersantRecorder as { start: () => Promise<string>; stop: () => Promise<string>; cancel: () => void } | undefined

  const load = useCallback(async () => {
    const data = await api<{ activity: TaskActivity }>(`/practice/listening/${activityId}`)
    setActivity(data.activity)
    const saved = await AsyncStorage.getItem(`listening-task:${activityId}`)
    if (saved) {
      const parsed = JSON.parse(saved) as { index?: number; drafts?: Record<string, Draft> }
      if (parsed.drafts) setDrafts(parsed.drafts)
      if (typeof parsed.index === 'number') setIndex(parsed.index)
    }
    ready.current = true
  }, [activityId])

  useEffect(() => {
    load().catch(err => setError(err instanceof Error ? err.message : 'Could not open this activity'))
  }, [load])

  useEffect(() => {
    if (!ready.current) return
    AsyncStorage.setItem(`listening-task:${activityId}`, JSON.stringify({ index, drafts })).catch(() => undefined)
  }, [activityId, drafts, index])

  const question = activity?.questions[index]
  const draft = question ? drafts[question.id] ?? {} : {}

  useEffect(() => {
    setRights(question?.right ? shuffle(question.right) : [])
    setNotice('')
    setRecordSeconds(0)
  }, [question?.id])

  useEffect(() => {
    if (!recording) return undefined
    const timer = setInterval(() => setRecordSeconds(value => value + 1), 1000)
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active') stopRecording().catch(() => undefined)
    })
    return () => {
      clearInterval(timer)
      sub.remove()
    }
  }, [recording])

  useEffect(() => {
    if (!player) return undefined
    const emitter = new NativeEventEmitter(player)
    const ended = emitter.addListener('versantAudioEnded', () => setPlaying(null))
    return () => {
      ended.remove()
      player.stop()
      recorder?.cancel()
    }
  }, [player, recorder])

  function patchDraft(patch: Draft) {
    if (!question) return
    setDrafts(current => ({ ...current, [question.id]: { ...current[question.id], ...patch } }))
  }

  async function playUrl(url: string, which: 'clip' | 'take') {
    if (!player) {
      setNotice('This app build cannot play audio yet.')
      return
    }
    try {
      player.stop()
      setPlaying(which)
      await player.play(url.startsWith('http') || url.startsWith('file') ? url : `${ENV.API_ROOT}${url}`)
    } catch (err) {
      setPlaying(null)
      setNotice(err instanceof Error ? err.message : 'Could not play the audio')
    }
  }

  async function startRecording() {
    if (!recorder) {
      setNotice('Recording needs a new app build with the microphone module.')
      return
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setNotice('Microphone permission is required to record.')
        return
      }
    }
    try {
      player?.stop()
      setPlaying(null)
      await recorder.start()
      setRecordSeconds(0)
      setRecording(true)
      setNotice('')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not start recording')
    }
  }

  async function stopRecording() {
    if (!recorder) return
    try {
      const path = await recorder.stop()
      setRecording(false)
      patchDraft({ localPath: path, responseAudioId: null })
    } catch (err) {
      setRecording(false)
      setNotice(err instanceof Error ? err.message : 'Could not stop the recording')
    }
  }

  function currentAnswer() {
    if (!question) return null
    const spoken = question.type === 'repeat' || question.type === 'respond'
    if (spoken && !draft.responseAudioId) return null
    if ((question.type === 'identify' || question.type === 'truefalse') && !draft.optionId) return null
    if ((question.type === 'type' || question.type === 'blank') && !String(draft.text ?? '').trim()) return null
    if (question.type === 'match') {
      const pairs = question.left ?? []
      if (pairs.some(item => !draft.pairs?.[item.id])) return null
    }
    if (question.type === 'recall' && (question.fields ?? []).some(field => !String(draft.fields?.[field.id] ?? '').trim())) return null
    return {
      questionId: question.id,
      optionId: draft.optionId ?? null,
      text: draft.text ?? '',
      responseAudioId: draft.responseAudioId ?? null,
      pairs: Object.entries(draft.pairs ?? {}).map(([leftId, rightId]) => ({ leftId, rightId })),
      fields: (question.fields ?? []).map(field => ({ id: field.id, text: draft.fields?.[field.id] ?? '' })),
    }
  }

  async function uploadTake() {
    if (!question || !draft.localPath) return draft.responseAudioId
    if (draft.responseAudioId) return draft.responseAudioId
    const body = new FormData()
    body.append('questionId', question.id)
    body.append('audio', {
      uri: draft.localPath.startsWith('file') ? draft.localPath : `file://${draft.localPath}`,
      name: 'response.m4a',
      type: 'audio/mp4',
    } as unknown as Blob)
    const saved = await api<{ responseId: string }>(`/practice/listening/${activityId}/speech`, { method: 'POST', body })
    patchDraft({ responseAudioId: saved.responseId })
    return saved.responseId
  }

  async function finish(nextAnswers: Record<string, unknown>[]) {
    const result = await api<AttemptResponse>(testId ? `/tests/${testId}/attempts` : `/practice/listening/${activityId}/attempts`, {
      method: 'POST',
      body: JSON.stringify({
        activityId,
        durationSeconds: Math.round((Date.now() - started.current) / 1000),
        answers: nextAnswers,
      }),
    })
    await AsyncStorage.removeItem(`listening-task:${activityId}`)
    if (result.nextActivityId && testId) {
      navigation.replace('ListeningSession', {
        activityId: result.nextActivityId,
        mode: 'assessment' as ListeningMode,
        testId,
        carryCorrect: result.testCorrect,
        carryTotal: result.testTotal,
      })
      return
    }
    navigation.replace('ListeningResult', {
      title: activity?.title ?? 'Listening',
      correct: result.testCorrect ?? result.correct,
      total: result.testTotal ?? result.total,
      mode,
      score: result.score,
      pending: result.pending,
      summary: summaryFrom(result.review),
      task: route.params.task,
    })
  }

  async function submitItem() {
    if (!question || submitting) return
    setSubmitting(true)
    setNotice('')
    try {
      let responseAudioId = draft.responseAudioId ?? null
      if (question.type === 'repeat' || question.type === 'respond') {
        if (!draft.localPath && !responseAudioId) {
          setNotice('Record your answer before submitting.')
          setSubmitting(false)
          return
        }
        responseAudioId = (await uploadTake()) ?? null
        if (!responseAudioId) {
          setNotice('The recording did not upload. Try again.')
          setSubmitting(false)
          return
        }
      } else if (currentAnswer() == null) {
        setNotice('Complete this item before continuing.')
        setSubmitting(false)
        return
      }
      const answer = {
        ...(currentAnswer() ?? {}),
        questionId: question.id,
        responseAudioId,
      }
      const nextAnswers = [...answers, answer]
      const last = index >= (activity?.questions.length ?? 1) - 1
      if (!last) {
        setAnswers(nextAnswers)
        setIndex(value => value + 1)
        setSubmitting(false)
        return
      }
      await finish(nextAnswers)
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save this answer')
      setSubmitting(false)
    }
  }

  if (!activity || !question) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
        <View className="flex-1 items-center justify-center px-6">
          {error ? <Text className="text-center text-sm font-semibold text-[#B65F39]">{error}</Text> : <ActivityIndicator size="large" color={colors.brand} />}
        </View>
      </SafeAreaView>
    )
  }

  const clip = question.audioUrl || activity.audioUrl
  const title = TITLES[question.type] || TITLES[activity.kind] || 'Listening'
  const progress = Math.round(((index + 1) / activity.questions.length) * 100)
  const spoken = question.type === 'repeat' || question.type === 'respond'
  const last = index >= activity.questions.length - 1

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View className="flex-row items-center gap-3 border-b px-5 py-3" style={{ borderColor: colors.divider }}>
        {exam ? <View className="h-10 w-10" /> : <BackButton />}
        <View className="min-w-0 flex-1">
          <Text className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.muted }}>{title}</Text>
          <Text className="text-sm font-extrabold" style={{ color: colors.text }} numberOfLines={1}>
            Item {index + 1} of {activity.questions.length}
          </Text>
        </View>
      </View>
      <View className="mx-5 mt-3 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: colors.divider }}>
        <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: colors.brand }} />
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
        <Text className="text-[18px] font-extrabold leading-6" style={{ color: colors.text }}>{question.prompt}</Text>
        {clip ? (
          <Pressable
            onPress={() => playUrl(clip, 'clip')}
            className="mt-4 h-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.brand }}>
            <Text className="text-[15px] font-extrabold text-white">{playing === 'clip' ? 'Playing…' : 'Listen'}</Text>
          </Pressable>
        ) : (
          <Text className="mt-4 text-sm font-semibold" style={{ color: colors.muted }}>No clip has been added for this item yet.</Text>
        )}

        {question.type === 'type' || question.type === 'blank' ? (
          <TextInput
            value={draft.text ?? ''}
            onChangeText={text => patchDraft({ text })}
            placeholder={question.type === 'blank' ? 'Type the missing words' : 'Type what you heard'}
            placeholderTextColor={colors.label}
            multiline
            className="mt-4 min-h-28 rounded-[20px] border px-4 py-3 text-[16px] font-semibold"
            style={{ borderColor: '#E6EAE4', color: colors.text, backgroundColor: '#FFFFFF', textAlignVertical: 'top' }}
          />
        ) : null}

        {question.type === 'truefalse' || question.type === 'identify' ? (
          <View className="mt-4 gap-3">
            {(question.options ?? []).map(option => {
              const selected = draft.optionId === option.id
              return (
                <Pressable
                  key={option.id}
                  onPress={() => patchDraft({ optionId: option.id })}
                  className="rounded-[20px] px-4 py-4"
                  style={{ backgroundColor: selected ? colors.brand : '#FFFFFF', borderWidth: 1, borderColor: selected ? colors.brand : '#E6EAE4' }}>
                  <Text className="text-[16px] font-extrabold" style={{ color: selected ? '#FFFFFF' : colors.text }}>{option.text}</Text>
                </Pressable>
              )
            })}
          </View>
        ) : null}

        {question.type === 'match' ? (
          <View className="mt-4 gap-3">
            {(question.left ?? []).map(left => (
              <View key={left.id} className="rounded-[20px] border px-4 py-3" style={{ borderColor: '#E6EAE4', backgroundColor: '#FFFFFF' }}>
                <Text className="text-[15px] font-extrabold" style={{ color: colors.text }}>{left.text}</Text>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {rights.map(right => {
                    const selected = draft.pairs?.[left.id] === right.id
                    return (
                      <Pressable
                        key={right.id}
                        onPress={() => patchDraft({ pairs: { ...draft.pairs, [left.id]: right.id } })}
                        className="rounded-full px-3 py-2"
                        style={{ backgroundColor: selected ? colors.brand : colors.brandLight }}>
                        <Text className="text-[13px] font-extrabold" style={{ color: selected ? '#FFFFFF' : colors.brand }}>{right.text}</Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {question.type === 'recall' ? (
          <View className="mt-4 gap-3">
            {(question.fields ?? []).map(field => (
              <View key={field.id}>
                <Text className="mb-1.5 text-[12px] font-extrabold" style={{ color: colors.muted }}>{field.label}</Text>
                <TextInput
                  value={draft.fields?.[field.id] ?? ''}
                  onChangeText={text => patchDraft({ fields: { ...draft.fields, [field.id]: text } })}
                  placeholder={field.label}
                  placeholderTextColor={colors.label}
                  className="h-12 rounded-2xl border px-4 text-[16px] font-semibold"
                  style={{ borderColor: '#E6EAE4', color: colors.text, backgroundColor: '#FFFFFF' }}
                />
              </View>
            ))}
          </View>
        ) : null}

        {spoken ? (
          <View className="mt-4 rounded-[20px] border px-4 py-4" style={{ borderColor: recording ? colors.brand : '#E6EAE4', backgroundColor: '#FFFFFF' }}>
            <Text className="text-[11px] font-bold uppercase tracking-[1px]" style={{ color: recording ? colors.brand : colors.muted }}>
              {recording ? 'Recording' : draft.localPath ? 'Your recording' : 'Your response'}
            </Text>
            <Text className="mt-1 text-[28px] font-black" style={{ color: colors.text }}>
              {Math.floor(recordSeconds / 60)}:{String(recordSeconds % 60).padStart(2, '0')}
            </Text>
            <View className="mt-3 flex-row gap-2">
              <Pressable
                onPress={recording ? () => stopRecording() : startRecording}
                className="h-11 flex-1 items-center justify-center rounded-xl"
                style={{ backgroundColor: recording ? '#B65F39' : colors.brand }}>
                <Text className="text-[14px] font-extrabold text-white">{recording ? 'Stop' : draft.localPath ? 'Re-record' : 'Start recording'}</Text>
              </Pressable>
              {draft.localPath && !recording ? (
                <Pressable
                  onPress={() => playUrl(draft.localPath || '', 'take')}
                  className="h-11 flex-1 items-center justify-center rounded-xl"
                  style={{ backgroundColor: colors.brandLight }}>
                  <Text className="text-[14px] font-extrabold" style={{ color: colors.brand }}>{playing === 'take' ? 'Playing…' : 'Replay'}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        {notice ? <Text className="mt-4 text-sm font-semibold text-[#B65F39]">{notice}</Text> : null}
      </ScrollView>
      <View className="border-t px-5 py-4" style={{ borderColor: colors.divider }}>
        <Pressable
          disabled={submitting || recording}
          onPress={submitItem}
          className="h-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: colors.brand, opacity: submitting || recording ? 0.6 : 1 }}>
          <Text className="text-[15px] font-extrabold text-white">{submitting ? 'Saving…' : last ? 'Submit' : 'Next'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
