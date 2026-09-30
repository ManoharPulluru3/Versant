import { useCallback, useState, type ReactNode } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useFocusEffect, useNavigation, type CompositeNavigationProp } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Path, Rect } from 'react-native-svg'
import { BG_OPTIONS, useTheme, type BackgroundId } from '../context/ThemeContext'
import { resetToLogin } from '../navigation/navigationRef'
import type { MainTabParamList, RootStackParamList } from '../navigation/types'
import { api } from '../services/client'
import { clearSession } from '../services/session'

type ProfileUser = {
  name: string
  email: string
  studentId: string | null
  college: string | null
  program: string | null
  settings: { rememberDevice?: boolean; autoPlayAudio?: boolean }
}

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>

function IconWrap({ children, bg }: { children: ReactNode; bg: string }) {
  return (
    <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
      {children}
    </View>
  )
}

function Chevron({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function Toggle({ active, onPress, label }: { active: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: active }}
      onPress={onPress}
      className={`h-6 w-11 justify-center rounded-full p-0.5 ${active ? 'bg-brand' : 'bg-[#D6DBD4]'}`}>
      <View className={`h-5 w-5 rounded-full bg-white ${active ? 'self-end' : 'self-start'}`} />
    </Pressable>
  )
}

function FieldIcon({ name, color }: { name: string; color: string }) {
  if (name === 'user') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={8} r={3.5} stroke={color} strokeWidth={1.7} />
        <Path d="M5 20C5.8 16.9 8.1 15 12 15C15.9 15 18.2 16.9 19 20" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
    )
  }
  if (name === 'email') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Rect x={3.5} y={5} width={17} height={14} rx={2} stroke={color} strokeWidth={1.7} />
        <Path d="M4.5 7L12 13L19.5 7" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      </Svg>
    )
  }
  if (name === 'id') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Rect x={4} y={5} width={16} height={14} rx={2} stroke={color} strokeWidth={1.7} />
        <Path d="M8 9H16M8 13H13" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
    )
  }
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20H20" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M6 20V9L12 5L18 9V20" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M9 12H15M9 15H15" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  )
}


const SWATCH: Record<BackgroundId, string> = {
  soft: '#E8F0E4',
  plain: '#FFFFFF',
  mint: '#DFF0E0',
  warm: '#F6EBE0',
}

export function ProfileScreen() {
  const navigation = useNavigation<Nav>()
  const { darkMode, background, colors, toggleDarkMode, setBackground } = useTheme()
  const [user, setUser] = useState<ProfileUser | null>(null)
  const [unread, setUnread] = useState(0)
  const [supportEmail, setSupportEmail] = useState('')
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftEmail, setDraftEmail] = useState('')
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [notice, setNotice] = useState('')

  useFocusEffect(
    useCallback(() => {
      let active = true
      api<{ user: ProfileUser }>('/auth/me')
        .then(data => {
          if (!active) return
          setUser(data.user)
          setDraftName(data.user.name)
          setDraftEmail(data.user.email)
        })
        .catch(() => undefined)
      api<{ unread: number }>('/notifications')
        .then(data => {
          if (active) setUnread(data.unread)
        })
        .catch(() => undefined)
      api<{ supportEmail: string }>('/support')
        .then(data => {
          if (active) setSupportEmail(data.supportEmail)
        })
        .catch(() => undefined)
      return () => {
        active = false
      }
    }, []),
  )

  const rememberDevice = Boolean(user?.settings.rememberDevice)
  const autoPlayAudio = Boolean(user?.settings.autoPlayAudio)
  const initials = (user?.name || 'Student')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const fields = [
    { label: 'Full name', value: user?.name ?? '—', meta: 'Student', icon: 'user' },
    { label: 'Email', value: user?.email ?? '—', icon: 'email' },
    { label: 'Student ID', value: user?.studentId ?? '—', icon: 'id' },
    { label: 'Institution', value: user?.college ?? '—', icon: 'college' },
  ]

  async function saveSettings(patch: { rememberDevice?: boolean; autoPlayAudio?: boolean }) {
    const data = await api<{ user: ProfileUser }>('/me', {
      method: 'PATCH',
      body: JSON.stringify({
        settings: {
          rememberDevice: patch.rememberDevice ?? rememberDevice,
          autoPlayAudio: patch.autoPlayAudio ?? autoPlayAudio,
        },
      }),
    })
    setUser(data.user)
  }

  async function saveProfile() {
    try {
      const data = await api<{ user: ProfileUser }>('/me', {
        method: 'PATCH',
        body: JSON.stringify({ name: draftName, email: draftEmail }),
      })
      setUser(data.user)
      setEditing(false)
      setNotice('Profile saved.')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save profile')
    }
  }

  async function savePassword() {
    try {
      await api('/me/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword: nextPassword }),
      })
      setCurrentPassword('')
      setNextPassword('')
      setPasswordOpen(false)
      setNotice('Password updated.')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not update password')
    }
  }

  function confirmSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          clearSession().finally(resetToLogin)
        },
      },
    ])
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']} style={{ backgroundColor: colors.canvas }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
          <View>
            <Text className="text-xs font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>
              Account & settings
            </Text>
            <Text className="mt-1 text-[22px] font-extrabold" style={{ color: colors.text }}>
              Profile
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Notifications"
            onPress={() => navigation.navigate('Notifications')}
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.cream }}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 17h5l-1.4-1.5A2 2 0 0 1 18 14.1V11a6 6 0 1 0-12 0v3.1c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
                stroke={colors.text}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </Pressable>
        </View>

        <View className="px-5 pb-8 pt-5">
          <View className="mb-7 rounded-[25px] bg-brand p-5">
            <View className="flex-row items-center gap-4">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Text className="text-lg font-extrabold tracking-wide text-white">{initials}</Text>
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-[22px] font-extrabold text-white">{user?.name ?? 'Student'}</Text>
                <Text className="mt-1 text-xs text-white/70">Student · {user?.program ?? 'Listening'}</Text>
              </View>
            </View>
            <View className="mt-4 flex-row flex-wrap items-center gap-2">
              <View className="rounded-full bg-white/20 px-2.5 py-1">
                <Text className="text-xs font-extrabold text-white">{user?.program ? 'Listening' : 'Student'}</Text>
              </View>
              <Text className="text-xs text-white/70">{user?.college ?? 'College'}</Text>
              <Text className="text-white/40">·</Text>
              <Text className="text-xs text-white/70">Active today</Text>
            </View>
            {notice ? <Text className="mt-3 text-xs font-semibold text-white">{notice}</Text> : null}
            <Pressable
              onPress={() => setEditing(value => !value)}
              className="mt-5 h-11 flex-row items-center justify-center gap-2 rounded-2xl bg-white">
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <Path d="M12 20H21" stroke="#1F6B4F" strokeWidth={1.8} strokeLinecap="round" />
                <Path
                  d="M16.5 3.5C17.33 2.67 18.67 2.67 19.5 3.5C20.33 4.33 20.33 5.67 19.5 6.5L8 18L3 19L4 14L16.5 3.5Z"
                  stroke="#1F6B4F"
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
              </Svg>
              <Text className="text-[13px] font-extrabold text-brand">Edit profile</Text>
            </Pressable>
          </View>

          <SectionLabel kicker="Profile information" title="Student details" body="Your student and academic information." colors={colors} />
          <View className="mt-3 overflow-hidden rounded-[22px] border" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            {editing ? (
              <View className="gap-3 px-5 py-4">
                <TextInput
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder="Full name"
                  placeholderTextColor={colors.label}
                  className="h-12 rounded-xl border px-3 text-sm font-semibold"
                  style={{ borderColor: colors.cardBorder, color: colors.text }}
                />
                <TextInput
                  value={draftEmail}
                  onChangeText={setDraftEmail}
                  autoCapitalize="none"
                  placeholder="Email"
                  placeholderTextColor={colors.label}
                  className="h-12 rounded-xl border px-3 text-sm font-semibold"
                  style={{ borderColor: colors.cardBorder, color: colors.text }}
                />
                <Pressable onPress={saveProfile} className="h-11 items-center justify-center rounded-xl" style={{ backgroundColor: colors.brand }}>
                  <Text className="text-sm font-extrabold text-white">Save profile</Text>
                </Pressable>
              </View>
            ) : null}
            {fields.map((field, index) => (
              <View
                key={field.label}
                className="flex-row items-center justify-between gap-4 px-5 py-4"
                style={index < fields.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.divider } : undefined}>
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <IconWrap bg={colors.iconBg}>
                    <FieldIcon name={field.icon} color={colors.brand} />
                  </IconWrap>
                  <View className="min-w-0 flex-1">
                    <Text className="text-xs" style={{ color: colors.label }}>{field.label}</Text>
                    <Text className="mt-0.5 text-[13px] font-bold" style={{ color: colors.text }}>{field.value}</Text>
                  </View>
                </View>
                {field.meta ? <Text className="text-xs" style={{ color: colors.label }}>{field.meta}</Text> : null}
              </View>
            ))}
          </View>

          <SectionLabel
            kicker="Appearance"
            title="Theme & background"
            body="Switch dark mode and pick an app background."
            colors={colors}
          />
          <View className="mt-3 overflow-hidden rounded-[22px] border" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <View className="flex-row items-center justify-between px-5 py-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.divider }}>
              <View className="flex-1 flex-row items-center gap-3 pr-3">
                <IconWrap bg={colors.iconBg}>
                  {darkMode ? (
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z" stroke={colors.brand} strokeWidth={1.7} strokeLinejoin="round" />
                    </Svg>
                  ) : (
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Circle cx={12} cy={12} r={4} stroke={colors.brand} strokeWidth={1.7} />
                      <Path d="M12 2.5V4.5M12 19.5V21.5M4.5 12H2.5M21.5 12H19.5M5.6 5.6L4.2 4.2M19.8 19.8L18.4 18.4M18.4 5.6L19.8 4.2M4.2 19.8L5.6 18.4" stroke={colors.brand} strokeWidth={1.7} strokeLinecap="round" />
                    </Svg>
                  )}
                </IconWrap>
                <View className="flex-1">
                  <Text className="text-[13px] font-bold" style={{ color: colors.text }}>Dark mode</Text>
                  <Text className="mt-0.5 text-xs" style={{ color: colors.label }}>
                    {darkMode ? 'On — easier on the eyes' : 'Off — light appearance'}
                  </Text>
                </View>
              </View>
              <Toggle active={darkMode} onPress={toggleDarkMode} label="Toggle dark mode" />
            </View>
            <View className="px-5 py-4">
              <Text className="text-[13px] font-bold" style={{ color: colors.text }}>Background</Text>
              <Text className="mt-0.5 text-xs" style={{ color: colors.label }}>Applies across the whole app</Text>
              <View className="mt-3 flex-row flex-wrap justify-between gap-y-2.5">
                {BG_OPTIONS.map(option => {
                  const selected = background === option.id
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => setBackground(option.id)}
                      className="w-[48%] rounded-2xl border p-3"
                      style={{
                        borderColor: selected ? colors.brand : colors.cardBorder,
                        backgroundColor: selected ? colors.brandLight : colors.card,
                      }}>
                      <View
                        className="h-10 w-full rounded-xl border"
                        style={{
                          backgroundColor: darkMode && option.id === 'plain' ? '#121916' : SWATCH[option.id],
                          borderColor: colors.cardBorder,
                          opacity: darkMode && option.id !== 'plain' ? 0.75 : 1,
                        }}
                      />
                      <Text className="mt-2.5 text-xs font-extrabold" style={{ color: colors.text }}>{option.label}</Text>
                      <Text className="mt-0.5 text-[11px]" style={{ color: colors.label }}>{option.description}</Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          </View>

          <SectionLabel kicker="Account settings" title="Preferences & security" body="Manage your account preferences and security." colors={colors} />
          <Card colors={colors}>
            <Row
              colors={colors}
              title="Change password"
              body="Update your account password"
              onPress={() => setPasswordOpen(value => !value)}
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Rect x={5} y={10} width={14} height={10} rx={2} stroke={colors.brand} strokeWidth={1.7} />
                  <Path d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10" stroke={colors.brand} strokeWidth={1.7} />
                </Svg>
              }
              trailing={<Chevron color={colors.label} />}
              border
            />
            <Row
              colors={colors}
              title="Notifications"
              body="Assessment and learning updates"
              onPress={() => navigation.navigate('Notifications')}
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M18 9C18 5.69 15.31 3 12 3C8.69 3 6 5.69 6 9C6 14 4 16 4 16H20C20 16 18 14 18 9Z" stroke={colors.brand} strokeWidth={1.7} strokeLinejoin="round" />
                  <Path d="M10 20H14" stroke={colors.brand} strokeWidth={1.7} strokeLinecap="round" />
                </Svg>
              }
              trailing={
                <View className="flex-row items-center gap-2">
                  <View className="rounded-full bg-[#FDEBDD] px-2 py-1">
                    <Text className="text-[11px] font-extrabold text-[#B86B32]">{unread} unread</Text>
                  </View>
                  <Chevron color={colors.label} />
                </View>
              }
              border
            />
            <Row
              colors={colors}
              title="Language"
              body="Interface language"
              onPress={() => Alert.alert('Language', 'English is the only language for now.')}
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Circle cx={12} cy={12} r={8.5} stroke={colors.brand} strokeWidth={1.7} />
                  <Path d="M3.8 12H20.2M12 3.5C14.2 5.8 15.3 8.63 15.3 12C15.3 15.37 14.2 18.2 12 20.5C9.8 18.2 8.7 15.37 8.7 12C8.7 8.63 9.8 5.8 12 3.5Z" stroke={colors.brand} strokeWidth={1.5} />
                </Svg>
              }
              trailing={
                <View className="flex-row items-center gap-1">
                  <Text className="text-[13px] font-bold text-brand">English</Text>
                  <Chevron color={colors.brand} />
                </View>
              }
              border
            />
            <Row
              colors={colors}
              title="Remember this device"
              body="Stay signed in on this device"
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Rect x={4} y={5} width={16} height={14} rx={2} stroke={colors.brand} strokeWidth={1.7} />
                  <Path d="M8 9H16M8 13H13" stroke={colors.brand} strokeWidth={1.7} strokeLinecap="round" />
                </Svg>
              }
              trailing={<Toggle active={rememberDevice} onPress={() => saveSettings({ rememberDevice: !rememberDevice }).catch(() => undefined)} label="Toggle remember device" />}
            />
          </Card>

          <SectionLabel kicker="Assessment preferences" title="Test setup" body="Preferences that help you prepare for assessments." colors={colors} />
          <Card colors={colors}>
            <Row
              colors={colors}
              title="Assessment audio"
              body="Use headphones when available"
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M5 9V15H9L14 19V5L9 9H5Z" stroke={colors.brand} strokeWidth={1.7} strokeLinejoin="round" />
                  <Path d="M17 9C18 10 18 14 17 15" stroke={colors.brand} strokeWidth={1.7} strokeLinecap="round" />
                </Svg>
              }
              trailing={
                <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: colors.brandLight }}>
                  <Text className="text-[11px] font-extrabold text-brand">Recommended</Text>
                </View>
              }
              border
            />
            <Row
              colors={colors}
              title="Microphone"
              body="Default microphone"
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Rect x={8} y={3} width={8} height={12} rx={4} stroke={colors.brand} strokeWidth={1.7} />
                  <Path d="M5 11C5 14.87 8.13 18 12 18C15.87 18 19 14.87 19 11" stroke={colors.brand} strokeWidth={1.7} strokeLinecap="round" />
                  <Path d="M12 18V21M9 21H15" stroke={colors.brand} strokeWidth={1.7} strokeLinecap="round" />
                </Svg>
              }
              trailing={
                <Pressable
                  onPress={() => navigation.navigate('DeviceCheck')}
                  className="rounded-lg border px-3 py-2"
                  style={{ borderColor: colors.cardBorder, backgroundColor: colors.card }}>
                  <Text className="text-xs font-extrabold text-brand">Check device</Text>
                </Pressable>
              }
              border
            />
            <Row
              colors={colors}
              title="Auto-play practice audio"
              body="Automatically play audio during practice"
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M8 5L18 12L8 19V5Z" stroke={colors.brand} strokeWidth={1.7} strokeLinejoin="round" />
                </Svg>
              }
              trailing={<Toggle active={autoPlayAudio} onPress={() => saveSettings({ autoPlayAudio: !autoPlayAudio }).catch(() => undefined)} label="Toggle auto-play audio" />}
            />
          </Card>

          <SectionLabel kicker="Support" title="Help & privacy" colors={colors} />
          <Card colors={colors}>
            <Row
              colors={colors}
              title="Help & support"
              body="Get help with your account or assessment"
              onPress={() => Alert.alert('Help & support', supportEmail ? `Contact ${supportEmail}` : 'Contact your college administrator.')}
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Circle cx={12} cy={12} r={8.5} stroke={colors.brand} strokeWidth={1.7} />
                  <Path d="M9.7 9C9.95 7.9 10.8 7.2 12 7.2C13.4 7.2 14.3 8.1 14.3 9.25C14.3 10.4 13.6 11.05 12.65 11.65C11.8 12.2 11.5 12.7 11.5 13.5" stroke={colors.brand} strokeWidth={1.7} strokeLinecap="round" />
                  <Circle cx={11.5} cy={16.5} r={0.8} fill={colors.brand} />
                </Svg>
              }
              trailing={<Chevron color={colors.label} />}
              border
            />
            <Row
              colors={colors}
              title="Privacy & data"
              body="Manage your data and privacy preferences"
              onPress={() => Alert.alert('Privacy & data', 'Your listening answers and profile are stored for your college account.')}
              icon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 3L19 6V11C19 15.5 16.2 19 12 21C7.8 19 5 15.5 5 11V6L12 3Z" stroke={colors.brand} strokeWidth={1.7} strokeLinejoin="round" />
                  <Path d="M9 12L11 14L15 10" stroke={colors.brand} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              }
              trailing={<Chevron color={colors.label} />}
            />
          </Card>

          {passwordOpen ? (
            <View className="mb-4 gap-3 rounded-[22px] border p-4" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Current password"
                placeholderTextColor={colors.label}
                className="h-12 rounded-xl border px-3"
                style={{ borderColor: colors.cardBorder, color: colors.text }}
              />
              <TextInput
                value={nextPassword}
                onChangeText={setNextPassword}
                secureTextEntry
                placeholder="New password"
                placeholderTextColor={colors.label}
                className="h-12 rounded-xl border px-3"
                style={{ borderColor: colors.cardBorder, color: colors.text }}
              />
              <Pressable onPress={savePassword} className="h-11 items-center justify-center rounded-xl" style={{ backgroundColor: colors.brand }}>
                <Text className="text-sm font-extrabold text-white">Update password</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable
            onPress={confirmSignOut}
            className="mb-8 mt-2 h-12 flex-row items-center justify-center gap-2 rounded-2xl border"
            style={{ backgroundColor: colors.dangerBg, borderColor: colors.dangerBorder }}>
            <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
              <Path d="M10 5H6.5C5.67 5 5 5.67 5 6.5V17.5C5 18.33 5.67 19 6.5 19H10" stroke={colors.dangerText} strokeWidth={1.7} strokeLinecap="round" />
              <Path d="M14 8L18 12L14 16" stroke={colors.dangerText} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M18 12H10" stroke={colors.dangerText} strokeWidth={1.7} strokeLinecap="round" />
            </Svg>
            <Text className="text-[13px] font-extrabold" style={{ color: colors.dangerText }}>Sign out</Text>
          </Pressable>

          <Text className="pb-2 text-center text-xs" style={{ color: colors.label }}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function SectionLabel({
  kicker,
  title,
  body,
  colors,
}: {
  kicker: string
  title: string
  body?: string
  colors: { label: string; text: string; muted: string }
}) {
  return (
    <View className="mb-0 mt-7">
      <Text className="text-xs font-bold uppercase tracking-[1px]" style={{ color: colors.label }}>{kicker}</Text>
      <Text className="mt-1 text-lg font-extrabold" style={{ color: colors.text }}>{title}</Text>
      {body ? <Text className="mt-1 text-xs" style={{ color: colors.muted }}>{body}</Text> : null}
    </View>
  )
}

function Card({ children, colors }: { children: ReactNode; colors: { card: string; cardBorder: string } }) {
  return (
    <View className="mt-3 overflow-hidden rounded-[22px] border" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
      {children}
    </View>
  )
}

function Row({
  colors,
  title,
  body,
  icon,
  trailing,
  onPress,
  border,
}: {
  colors: { text: string; label: string; iconBg: string; divider: string }
  title: string
  body: string
  icon: ReactNode
  trailing?: React.ReactNode
  onPress?: () => void
  border?: boolean
}) {
  const content = (
    <View
      className="flex-row items-center justify-between gap-3 px-5 py-4"
      style={border ? { borderBottomWidth: 1, borderBottomColor: colors.divider } : undefined}>
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <IconWrap bg={colors.iconBg}>{icon}</IconWrap>
        <View className="min-w-0 flex-1">
          <Text className="text-[13px] font-bold" style={{ color: colors.text }}>{title}</Text>
          <Text className="mt-0.5 text-xs" style={{ color: colors.label }}>{body}</Text>
        </View>
      </View>
      {trailing}
    </View>
  )
  if (!onPress) return content
  return <Pressable onPress={onPress}>{content}</Pressable>
}
