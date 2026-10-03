import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'
import { ActivityIndicator, Animated, NativeEventEmitter, NativeModules, Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import { BackButton } from '../../components/BackButton'
import { useTheme } from '../../context/ThemeContext'
import { formatSeconds } from '../../listening/content'
import { ENV } from '../../config/env'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'
import { api } from '../../services/client'
import type { RootStackParamList } from '../../navigation/types'

const WAVE = [16, 28, 20, 36, 24, 32, 20, 28, 18, 30]

type VersantAudio = {
  play: (url: string) => Promise<number>
  pause: () => void
  resume: () => Promise<number>
  stop: () => void
  seek: (positionMs: number) => Promise<number>
  position: () => Promise<number>
  addListener: (eventName: string) => void
  removeListeners: (count: number) => void
}

type RemoteActivity = {
  id: string
  title: string
  audioLabel: string
  headline: string
  subtitle: string
  audioSeconds: number
  audioUrl: string | null
  maxListens: number
  questionSeconds: number
  tip: string
  questions: { id: string; prompt: string; options: { id: string; text: string }[] }[]
}

export function ListeningSessionScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ListeningSession'>>()
  const { colors } = useTheme()
  const [activity, setActivity] = useState<RemoteActivity | null>(null)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    const data = await api<{ activity: RemoteActivity }>(`/practice/listening/${route.params.activityId}`)
    setActivity(data.activity)
    setError('')
  }, [route.params.activityId])
  const refreshControl = usePullToRefresh(reload)

  useEffect(() => {
    let active = true
    reload()
      .catch(err => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load this activity')
      })
    return () => {
      active = false
    }
  }, [reload])

  if (!activity) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
        <View className="flex-row items-center gap-3 px-5 pt-3">
          <BackButton />
          <View>
            <Text className="text-[11px] font-semibold" style={{ color: colors.muted }}>
              Listening
            </Text>
            <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
              {error ? 'Could not open' : 'Loading'}
            </Text>
          </View>
        </View>
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

  return <SessionPlayer key={activity.id} activity={activity} refreshControl={refreshControl} />
}

function SessionPlayer({ activity, refreshControl }: { activity: RemoteActivity; refreshControl: ReactElement }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'ListeningSession'>>()
  const { colors } = useTheme()
  const mode = route.params.mode
  const testId = route.params.testId
  const exam = mode === 'assessment'

  const [isPlaying, setIsPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [audioSeconds, setAudioSeconds] = useState(0)
  const [clipSeconds, setClipSeconds] = useState(activity.audioSeconds)
  const [listenCount, setListenCount] = useState(0)
  const [audioFinished, setAudioFinished] = useState(false)
  const [playError, setPlayError] = useState('')
  const seekAt = useRef(0)
  const playback = useRef<'idle' | 'playing'>('idle')
  const question = activity.questions[0]
  const total = activity.questions.length
  const player = NativeModules.VersantAudio as VersantAudio | undefined
  const hasAudio = Boolean(activity.audioUrl && player)
  const atEnd = audioFinished && audioSeconds >= Math.max(clipSeconds - 0.4, 0)
  const unlimited = !exam
  const playsAllowed = unlimited ? Number.POSITIVE_INFINITY : Math.max(1, Number(activity.maxListens) || 1)
  const canStart = hasAudio && listenCount < playsAllowed
  const canResume = Boolean(paused && loaded && !atEnd)
  const replaysAllowed = unlimited ? Number.POSITIVE_INFINITY : Math.max(0, playsAllowed - 1)
  const playDisabled = isPlaying ? false : !(canStart || canResume)
  const audioProgress = Math.min(audioSeconds / Math.max(clipSeconds, 1), 1)

  useEffect(() => {
    if (!player) return undefined
    const emitter = new NativeEventEmitter(player)
    const ended = emitter.addListener('versantAudioEnded', () => {
      if (playback.current !== 'playing') return
      playback.current = 'idle'
      setIsPlaying(false)
      setPaused(true)
      setAudioFinished(true)
      player.position().then((ms: number) => setAudioSeconds(ms / 1000))
    })
    const failed = emitter.addListener('versantAudioError', () => {
      setIsPlaying(false)
      setPlayError('The recording stopped unexpectedly.')
    })
    return () => {
      ended.remove()
      failed.remove()
      player.stop()
    }
  }, [player])

  useEffect(() => {
    if (!isPlaying || !player) return undefined
    const timer = setInterval(() => {
      player.position().then((ms: number) => setAudioSeconds(ms / 1000))
    }, 250)
    return () => clearInterval(timer)
  }, [isPlaying, player])

  async function startFresh() {
    if (!canStart || !activity.audioUrl || !player) return
    setPlayError('')
    setPaused(false)
    setAudioFinished(false)
    setAudioSeconds(0)
    setListenCount(count => count + 1)
    playback.current = 'playing'
    setIsPlaying(true)
    try {
      const duration = await player.play(`${ENV.API_ROOT}${activity.audioUrl}`)
      if (typeof duration === 'number' && duration > 0) setClipSeconds(duration / 1000)
      setLoaded(true)
    } catch (err) {
      playback.current = 'idle'
      setIsPlaying(false)
      setLoaded(false)
      setListenCount(count => Math.max(0, count - 1))
      setPlayError(err instanceof Error ? err.message : 'Could not play the recording')
    }
  }

  function pause() {
    if (!isPlaying || !player) return
    player.pause?.()
    player.position().then(ms => setAudioSeconds(ms / 1000))
    setIsPlaying(false)
    setPaused(true)
  }

  async function resume() {
    if (!player) return
    setPlayError('')
    setPaused(false)
    setIsPlaying(true)
    try {
      if (typeof player.resume !== 'function') {
        setLoaded(false)
        setIsPlaying(false)
        await startFresh()
        return
      }
      await player.resume()
    } catch (err) {
      setIsPlaying(false)
      setPaused(true)
      setPlayError(err instanceof Error ? err.message : 'Could not resume the recording')
    }
  }

  function stopPlayback() {
    playback.current = 'idle'
    player?.stop()
    setIsPlaying(false)
    setPaused(false)
    setLoaded(false)
    setAudioSeconds(0)
  }

  function seek(ratio: number, force = false) {
    if (!loaded || !player || typeof player.seek !== 'function') return
    const ms = Math.round(ratio * clipSeconds * 1000)
    setAudioSeconds(ms / 1000)
    const now = Date.now()
    if (!force && now - seekAt.current < 80) return
    seekAt.current = now
    player.seek(ms).catch(() => {})
  }

  function onPlayPress() {
    if (isPlaying) {
      pause()
      return
    }
    if (canResume) {
      resume()
      return
    }
    startFresh()
  }

  function startQuestions() {
    if (!question || !audioFinished) return
    player?.stop()
    const openQuestions = exam ? navigation.replace : navigation.navigate
    openQuestions('ListeningQuestions', {
      activityId: activity.id,
      title: activity.title,
      headline: activity.headline,
      questionSeconds: activity.questionSeconds,
      questions: activity.questions,
      testId,
      carryCorrect: route.params.carryCorrect,
      carryTotal: route.params.carryTotal,
    })
  }

  const status = playError
    ? playError
    : !activity.audioUrl
      ? 'No recording has been added for this activity yet.'
      : !player
        ? 'This app build cannot play audio yet.'
      : isPlaying
        ? `Playing ${activity.audioLabel.toLowerCase()}...`
        : paused
          ? 'Paused'
        : audioFinished
          ? `${activity.audioLabel} finished`
          : listenCount >= playsAllowed
            ? 'This clip has already been played.'
            : 'Listen once, then start the questions when you are ready'

  const listenBadge = formatSeconds(Math.round(clipSeconds))

  if (!question) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-sm font-semibold" style={{ color: colors.muted }}>
            This activity has no questions yet.
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
                This section
              </Text>
              <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
                {total} questions
              </Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 }} alwaysBounceVertical refreshControl={refreshControl}>
          <Text className="mt-6 text-center text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.accent }}>
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
                <View className="flex-row items-center gap-3">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
                    onPress={onPlayPress}
                    disabled={playDisabled}
                    className="h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.brand, opacity: playDisabled ? 0.55 : 1 }}>
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
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Stop"
                    onPress={stopPlayback}
                    disabled={!loaded && !isPlaying}
                    className="h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: colors.cream,
                      opacity: loaded || isPlaying ? 1 : 0.45,
                    }}>
                    <Svg width={16} height={16} viewBox="0 0 16 16">
                      <Path d="M3 3h10v10H3z" fill={colors.brand} />
                    </Svg>
                  </Pressable>
                  <View className="flex-1">
                    <View className="mb-1 flex-row items-center justify-between">
                      <Text className="text-xs font-bold" style={{ color: colors.muted }}>
                        {formatSeconds(audioSeconds)}
                      </Text>
                      <Text className="text-xs" style={{ color: colors.label }}>
                        {formatSeconds(Math.round(clipSeconds))}
                      </Text>
                    </View>
                    <ClipBar
                      progress={audioProgress}
                      enabled={loaded}
                      color={colors.brand}
                      track={colors.divider}
                      onSeek={seek}
                    />
                  </View>
                </View>
                <WaveBars playing={isPlaying} color={colors.brand} />
                <Text className="mt-4 border-t pt-4 text-xs" style={{ borderColor: colors.divider, color: colors.muted }} numberOfLines={1}>
                  {unlimited
                    ? 'Replay as often as you like.'
                    : replaysAllowed === 0
                      ? 'This clip plays once.'
                      : `${replaysAllowed} ${replaysAllowed === 1 ? 'replay' : 'replays'} left.`}
                </Text>
              </View>
            </View>
          </View>

        </ScrollView>

        <View className="border-t px-5 py-4" style={{ borderColor: colors.divider, backgroundColor: colors.canvas }}>
          <Pressable
            accessibilityRole="button"
            disabled={!question || !audioFinished}
            onPress={startQuestions}
            className="h-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: audioFinished ? colors.brand : colors.brandLight }}>
            <Text className="text-[15px] font-extrabold" style={{ color: audioFinished ? '#FFFFFF' : colors.label }}>
              Start questions
            </Text>
          </Pressable>
          <Text className="mt-2 text-center text-xs font-semibold leading-5" style={{ color: colors.muted }}>
            {audioFinished
              ? exam
                ? 'The clip is finished. You cannot come back to it after you start.'
                : 'The clip is finished. You can still go back and listen again from the questions.'
              : 'Finish the clip, then start the questions.'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

function WaveBars({ playing, color }: { playing: boolean; color: string }) {
  const bars = useRef(WAVE.map(() => new Animated.Value(0.35))).current

  useEffect(() => {
    if (!playing) {
      bars.forEach(bar => bar.setValue(0.35))
      return undefined
    }
    const loops = bars.map((bar, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: 1,
            duration: 260 + (index % 4) * 50,
            useNativeDriver: true,
          }),
          Animated.timing(bar, {
            toValue: 0.28,
            duration: 260 + (index % 3) * 40,
            useNativeDriver: true,
          }),
        ]),
      ),
    )
    const timers = loops.map((loop, index) => setTimeout(() => loop.start(), index * 70))
    return () => {
      timers.forEach(clearTimeout)
      loops.forEach(loop => loop.stop())
    }
  }, [playing, bars])

  return (
    <View className="mt-4 h-10 flex-row items-center justify-center gap-1">
      {WAVE.map((height, index) => (
        <Animated.View
          key={index}
          style={{
            width: 4,
            height,
            borderRadius: 4,
            backgroundColor: playing ? color : '#AFC6B7',
            transform: [{ scaleY: bars[index] }],
          }}
        />
      ))}
    </View>
  )
}

function ClipBar({
  progress,
  enabled,
  color,
  track,
  onSeek,
}: {
  progress: number
  enabled: boolean
  color: string
  track: string
  onSeek: (ratio: number, force?: boolean) => void
}) {
  const width = useRef(0)

  function seekAt(locationX: number, force = false) {
    if (!enabled || width.current <= 0) return
    onSeek(Math.min(1, Math.max(0, locationX / width.current)), force)
  }

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel="Audio position"
      onLayout={event => {
        width.current = event.nativeEvent.layout.width
      }}
      onStartShouldSetResponder={() => enabled}
      onMoveShouldSetResponder={() => enabled}
      onResponderGrant={event => seekAt(event.nativeEvent.locationX)}
      onResponderMove={event => seekAt(event.nativeEvent.locationX)}
      onResponderRelease={event => seekAt(event.nativeEvent.locationX, true)}
      className="h-8 justify-center">
      <View className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: track }}>
        <View className="h-full rounded-full" style={{ width: `${Math.min(progress, 1) * 100}%`, backgroundColor: color }} />
      </View>
    </View>
  )
}
