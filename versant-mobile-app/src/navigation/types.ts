import type { NavigatorScreenParams } from '@react-navigation/native'

export type PracticeSkill = 'speaking' | 'listening' | 'reading' | 'writing'
export type ListeningMode = 'practice' | 'assessment'

export type MainTabParamList = {
  Home: undefined
  Practice: undefined
  Tests: undefined
  Progress: undefined
  Profile: undefined
}

export type RootStackParamList = {
  Splash: undefined
  Login: undefined
  Main: NavigatorScreenParams<MainTabParamList> | undefined
  Notifications: undefined
  PracticeSkill: { skill: PracticeSkill }
  ListeningSession: {
    activityId: string
    mode: ListeningMode
    testId?: string
    carryCorrect?: number
    carryTotal?: number
  }
  ListeningResult: {
    title: string
    correct: number
    total: number
    mode: ListeningMode
  }
  AssessmentDetails: { testId: string }
  DeviceCheck: undefined
}
