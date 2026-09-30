import { Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackButton } from '../components/BackButton'
import { useTheme } from '../context/ThemeContext'
import type { PracticeSkill, RootStackParamList } from '../navigation/types'

const COPY: Record<Exclude<PracticeSkill, 'listening'>, { title: string; body: string; points: string[] }> = {
  speaking: {
    title: 'Speaking',
    body: 'Pronunciation, fluency, and short spoken responses will live here.',
    points: ['Read a sentence aloud', 'Repeat a phrase', 'Retell a short story'],
  },
  reading: {
    title: 'Reading',
    body: 'Passages and sentence completion will live here.',
    points: ['Read a short passage', 'Complete the sentence', 'Find the main idea'],
  },
  writing: {
    title: 'Writing',
    body: 'Typing, dictation, and email writing will live here.',
    points: ['Type a response', 'Write a short email', 'Rebuild a passage'],
  },
}

export function StaticSkillScreen({ skill }: { skill: Exclude<PracticeSkill, 'listening'> }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { colors } = useTheme()
  const copy = COPY[skill]

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="px-5 pt-3">
          <BackButton />
          <Text className="mt-4 text-[11px] font-bold uppercase tracking-[1px]" style={{ color: colors.muted }}>
            Practice
          </Text>
          <Text className="mt-1 text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
            {copy.title}
          </Text>
          <Text className="mt-2 text-sm leading-6" style={{ color: colors.muted }}>
            {copy.body}
          </Text>
        </View>

        <View className="mt-6 gap-3 px-5">
          {copy.points.map(point => (
            <View
              key={point}
              className="rounded-[20px] border px-4 py-4"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
              <Text className="text-[15px] font-extrabold" style={{ color: colors.text }}>
                {point}
              </Text>
            </View>
          ))}
        </View>

        <View className="mx-5 mt-6 rounded-[24px] p-5" style={{ backgroundColor: colors.brandLight }}>
          <Text className="text-base font-extrabold" style={{ color: colors.text }}>
            Listening is ready
          </Text>
          <Text className="mt-2 text-sm leading-5" style={{ color: colors.muted }}>
            The activity you can practice now is listening to a clip and answering the questions.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('PracticeSkill', { skill: 'listening' })}
            className="mt-4 h-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.brand }}>
            <Text className="text-sm font-extrabold text-white">Open listening</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
