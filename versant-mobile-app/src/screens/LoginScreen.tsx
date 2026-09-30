import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path, Rect } from 'react-native-svg'
import { LogoMark } from '../components/LogoMark'
import { useTheme } from '../context/ThemeContext'
import type { RootStackParamList } from '../navigation/RootNavigator'
import { api } from '../services/client'
import { setSession } from '../services/session'

const ICON = '#8E9790'

function UserIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.5} stroke={ICON} strokeWidth={1.7} />
      <Path d="M5 20a7 7 0 0 1 14 0" stroke={ICON} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  )
}

function LockIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={10} width={14} height={11} rx={2} stroke={ICON} strokeWidth={1.7} />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={ICON} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  )
}

function EyeIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke={ICON}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={2.5} stroke={ICON} strokeWidth={1.7} />
    </Svg>
  )
}

function ArrowRightIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h13M13 6l6 6-6 6" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [showPassword, setShowPassword] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [focused, setFocused] = useState<'id' | 'password' | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { colors } = useTheme()

  async function goHome() {
    setBusy(true)
    setError('')
    try {
      const data = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: studentId.trim(), password }),
      })
      await setSession(data.token, remember)
      navigation.replace('Main')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <View pointerEvents="none" className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-brand-light" />
      <View pointerEvents="none" className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#FFF0DF]" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}>
          <View className="w-full px-6 py-8">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand">
                <LogoMark size={24} />
              </View>
              <View>
                <Text className="text-lg font-extrabold tracking-tight text-dark dark:text-[#EEF3EF]">
                  Elyt<Text className="text-brand">Edu</Text>
                </Text>
                <Text className="mt-0.5 text-xs font-bold uppercase tracking-[1.2px] text-[#9AA19B]">
                  English Assessment
                </Text>
              </View>
            </View>

            <View className="mt-10">
              <Text className="mb-2 text-[13px] font-semibold text-[#39443E]">
                Student ID / Email
              </Text>
              <View
                className={`h-[54px] flex-row items-center rounded-[17px] border px-4 ${
                  focused === 'id' ? 'border-brand bg-white' : 'border-[#E7EBE3] bg-[#F7F8F3]'
                }`}>
                <UserIcon />
                <TextInput
                  value={studentId}
                  onChangeText={setStudentId}
                  onFocus={() => setFocused('id')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your student ID or email"
                  placeholderTextColor="#A1A8A2"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="ml-3 flex-1 text-[13px] font-semibold text-dark dark:text-[#EEF3EF]"
                />
              </View>
            </View>

            <View className="mt-5">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-[13px] font-semibold text-[#39443E]">Password</Text>
                <Pressable accessibilityRole="button">
                  <Text className="text-[13px] font-bold text-brand">Forgot password?</Text>
                </Pressable>
              </View>
              <View
                className={`h-[54px] flex-row items-center rounded-[17px] border px-4 ${
                  focused === 'password' ? 'border-brand bg-white' : 'border-[#E7EBE3] bg-[#F7F8F3]'
                }`}>
                <LockIcon />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your password"
                  placeholderTextColor="#A1A8A2"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="ml-3 flex-1 text-[13px] font-semibold text-dark dark:text-[#EEF3EF]"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  onPress={() => setShowPassword(prev => !prev)}
                  className="ml-2">
                  <EyeIcon />
                </Pressable>
              </View>
            </View>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: remember }}
              onPress={() => setRemember(prev => !prev)}
              className="mt-5 flex-row items-center gap-2">
              <View
                className={`h-4 w-4 items-center justify-center rounded border ${
                  remember ? 'border-brand bg-brand' : 'border-[#D7DED5] bg-white'
                }`}>
                {remember ? <Text className="text-[10px] font-bold text-white">✓</Text> : null}
              </View>
              <Text className="text-xs font-semibold text-muted dark:text-[#B4BFB8]">Keep me signed in</Text>
            </Pressable>

            {error ? (
              <Text className="mt-4 text-sm font-semibold text-[#B65F39]">{error}</Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={goHome}
              className="mt-7 h-[54px] flex-row items-center justify-center gap-2 rounded-[17px] bg-brand active:opacity-90"
              style={{
                shadowColor: '#1f6b4f',
                shadowOpacity: 0.16,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 8 },
                elevation: 4,
              }}>
              <Text className="text-sm font-extrabold text-white">{busy ? 'Signing in…' : 'Sign In'}</Text>
              <ArrowRightIcon />
            </Pressable>
          </View>
        </ScrollView>

        <View className="items-center px-6 pb-6">
          <Text className="text-xs font-semibold text-[#9AA19B]">
            Having trouble signing in?
          </Text>
          <Pressable accessibilityRole="button" className="mt-1">
            <Text className="text-[13px] font-bold text-brand">
              Contact your college administrator
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
