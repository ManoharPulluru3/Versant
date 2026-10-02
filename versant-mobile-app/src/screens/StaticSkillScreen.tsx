import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackButton } from '../components/BackButton'
import { useTheme } from '../context/ThemeContext'
import { noReload, usePullToRefresh } from '../hooks/usePullToRefresh'
import type { PracticeSkill } from '../navigation/types'

const COPY: Record<Exclude<PracticeSkill, 'listening'>, { title: string; body: string }> = {
  speaking: {
    title: 'Speaking',
    body: 'Pronunciation, fluency, and short spoken responses will open here.',
  },
  reading: {
    title: 'Reading',
    body: 'Passages and sentence completion will open here.',
  },
  writing: {
    title: 'Writing',
    body: 'Typing, dictation, and email writing will open here.',
  },
}

export function StaticSkillScreen({ skill }: { skill: Exclude<PracticeSkill, 'listening'> }) {
  const { colors } = useTheme()
  const copy = COPY[skill]
  const refreshControl = usePullToRefresh(noReload)

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28, flexGrow: 1 }} alwaysBounceVertical refreshControl={refreshControl}>
        <View className="px-5 pt-3">
          <BackButton />
          <View className="mt-5 self-start rounded-full px-2.5 py-1" style={{ backgroundColor: '#F4F1EA' }}>
            <Text className="text-[10px] font-extrabold uppercase tracking-[0.4px]" style={{ color: '#8A7760' }}>
              Coming soon
            </Text>
          </View>
          <Text className="mt-3 text-[28px] font-black tracking-tight" style={{ color: colors.text }}>
            {copy.title}
          </Text>
          <Text className="mt-2 text-sm leading-6" style={{ color: colors.muted }}>
            {copy.body}
          </Text>
        </View>

        <View className="mx-5 mt-8 items-center rounded-[28px] px-6 py-10" style={{ backgroundColor: colors.card }}>
          <Text className="text-[22px] font-black" style={{ color: colors.text }}>
            Soon
          </Text>
          <Text className="mt-2 text-center text-sm leading-5" style={{ color: colors.muted }}>
            This skill is not open yet. Listening is the one you can practice now.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
