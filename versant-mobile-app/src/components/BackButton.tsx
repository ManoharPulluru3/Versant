import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '../context/ThemeContext'

export function BackButton() {
  const navigation = useNavigation()
  const { colors } = useTheme()

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={() => navigation.goBack()}
      className="h-10 w-10 items-center justify-center rounded-full"
      style={{ backgroundColor: colors.cream }}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M19 12H5M11 18l-6-6 6-6"
          stroke={colors.text}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  )
}
