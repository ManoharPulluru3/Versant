import { useEffect, useRef } from 'react'
import { Animated, Easing, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LogoMark } from '../components/LogoMark'
import { useTheme } from '../context/ThemeContext'
import type { RootStackParamList } from '../navigation/RootNavigator'
import { getToken } from '../services/session'

export function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { colors } = useTheme()
  const enter = useRef(new Animated.Value(1)).current
  const bar = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()

    Animated.timing(bar, {
      toValue: 1,
      duration: 1800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start()

    const timer = setTimeout(() => {
      getToken()
        .then(token => navigation.replace(token ? 'Main' : 'Login'))
        .catch(() => navigation.replace('Login'))
    }, 1600)

    return () => clearTimeout(timer)
  }, [bar, enter, navigation])

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View
        pointerEvents="none"
        className="absolute top-[22%] h-64 w-64 rounded-full bg-brand-light opacity-80"
        style={{ left: '50%', marginLeft: -128 }}
      />

      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          style={{
            opacity: enter,
            transform: [
              {
                translateY: enter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}>
          <View className="items-center">
            <View className="h-[108px] w-[108px] items-center justify-center rounded-full bg-brand-light">
              <View className="h-[84px] w-[84px] items-center justify-center rounded-[28px] bg-brand">
                <LogoMark size={40} />
              </View>
            </View>

            <Text className="mt-8 text-[32px] font-black tracking-tight" style={{ color: colors.text }}>
              Elyt<Text style={{ color: colors.brand }}>Edu</Text>
            </Text>
            <Text className="mt-2 text-[15px] font-medium" style={{ color: colors.muted }}>
              English Assessment
            </Text>
          </View>
        </Animated.View>
      </View>

      <View className="items-center pb-8">
        <View className="h-[3px] w-16 overflow-hidden rounded-full bg-[#E4E8E0]">
          <Animated.View
            style={{
              height: 3,
              borderRadius: 999,
              backgroundColor: '#1f6b4f',
              width: bar.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 64],
              }),
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
