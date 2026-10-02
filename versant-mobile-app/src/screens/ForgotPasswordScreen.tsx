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
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackButton } from '../components/BackButton'
import { useTheme } from '../context/ThemeContext'
import type { RootStackParamList } from '../navigation/types'
import { noReload, usePullToRefresh } from '../hooks/usePullToRefresh'
import { api } from '../services/client'

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'ForgotPassword'>>()
  const { colors } = useTheme()
  const refreshControl = usePullToRefresh(noReload)
  const [identifier, setIdentifier] = useState(route.params?.identifier ?? '')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [sent, setSent] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function sendCode() {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const data = await api<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ identifier: identifier.trim() }),
      })
      setSent(true)
      setNotice(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the reset code')
    } finally {
      setBusy(false)
    }
  }

  async function updatePassword() {
    if (password !== confirm) {
      setError('Those passwords do not match')
      return
    }
    setBusy(true)
    setError('')
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          identifier: identifier.trim(),
          code: code.trim(),
          password,
        }),
      })
      setDone(true)
      setNotice('Your password is updated. Sign in with the new one.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.canvas }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical
          refreshControl={refreshControl}>
          <View className="px-6 py-4">
            <BackButton />
            <Text className="mt-6 text-[26px] font-extrabold tracking-tight" style={{ color: colors.text }}>
              Reset password
            </Text>
            <Text className="mt-2 text-sm leading-5" style={{ color: colors.muted }}>
              {sent
                ? 'Enter the 6-digit code from your email, then choose a new password.'
                : 'Enter the student ID or email on your account. We will email a reset code.'}
            </Text>

            <Text className="mb-2 mt-8 text-[13px] font-semibold text-[#39443E]">Student ID / Email</Text>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              editable={!sent}
              placeholder="Enter your student ID or email"
              placeholderTextColor="#A1A8A2"
              autoCapitalize="none"
              autoCorrect={false}
              className="h-[54px] rounded-[17px] border border-[#E7EBE3] bg-[#F7F8F3] px-4 text-[13px] font-semibold text-dark"
            />

            {sent && !done ? (
              <>
                <Text className="mb-2 mt-5 text-[13px] font-semibold text-[#39443E]">Reset code</Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="6-digit code"
                  placeholderTextColor="#A1A8A2"
                  keyboardType="number-pad"
                  maxLength={6}
                  className="h-[54px] rounded-[17px] border border-[#E7EBE3] bg-[#F7F8F3] px-4 text-[13px] font-semibold tracking-[4px] text-dark"
                />
                <Text className="mb-2 mt-5 text-[13px] font-semibold text-[#39443E]">New password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#A1A8A2"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="h-[54px] rounded-[17px] border border-[#E7EBE3] bg-[#F7F8F3] px-4 text-[13px] font-semibold text-dark"
                />
                <Text className="mb-2 mt-5 text-[13px] font-semibold text-[#39443E]">Confirm password</Text>
                <TextInput
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="Repeat the new password"
                  placeholderTextColor="#A1A8A2"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="h-[54px] rounded-[17px] border border-[#E7EBE3] bg-[#F7F8F3] px-4 text-[13px] font-semibold text-dark"
                />
                <Pressable accessibilityRole="button" onPress={() => setShowPassword(value => !value)} className="mt-3">
                  <Text className="text-[13px] font-bold text-brand">{showPassword ? 'Hide password' : 'Show password'}</Text>
                </Pressable>
              </>
            ) : null}

            {notice ? <Text className="mt-4 text-sm font-semibold text-brand">{notice}</Text> : null}
            {error ? <Text className="mt-4 text-sm font-semibold text-[#B65F39]">{error}</Text> : null}

            {done ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.goBack()}
                className="mt-7 h-[54px] items-center justify-center rounded-[17px] bg-brand">
                <Text className="text-sm font-extrabold text-white">Back to sign in</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                disabled={busy || !identifier.trim()}
                onPress={sent ? updatePassword : sendCode}
                className="mt-7 h-[54px] items-center justify-center rounded-[17px] bg-brand"
                style={{ opacity: busy || !identifier.trim() ? 0.55 : 1 }}>
                <Text className="text-sm font-extrabold text-white">
                  {busy ? 'Please wait…' : sent ? 'Update password' : 'Send reset code'}
                </Text>
              </Pressable>
            )}

            {sent && !done ? (
              <Pressable accessibilityRole="button" disabled={busy} onPress={sendCode} className="mt-4 items-center">
                <Text className="text-[13px] font-bold text-brand">Resend code</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
