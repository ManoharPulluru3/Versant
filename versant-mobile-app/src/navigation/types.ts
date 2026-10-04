import type { NavigatorScreenParams } from '@react-navigation/native'

export type PracticeSkill = 'speaking' | 'listening' | 'reading' | 'writing'
export type ListeningMode = 'practice' | 'assessment'
export type ListeningTaskId = 'mcq' | 'blank' | 'match' | 'truefalse' | 'repeat' | 'type' | 'respond' | 'recall' | 'identify'

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
  ForgotPassword: { identifier?: string } | undefined
  Main: NavigatorScreenParams<MainTabParamList> | undefined
  Notifications: undefined
  PracticeSkill: { skill: PracticeSkill }
  ListeningPractice: { task: ListeningTaskId }
  ListeningSession: {
    activityId: string
    mode: ListeningMode
    testId?: string
    carryCorrect?: number
    carryTotal?: number
    task?: ListeningTaskId
  }
  ListeningQuestions: {
    activityId: string
    title: string
    headline: string
    questionSeconds: number
    questions: { id: string; prompt: string; options: { id: string; text: string }[] }[]
    testId?: string
    carryCorrect?: number
    carryTotal?: number
    task?: ListeningTaskId
  }
  ListeningTask: {
    activityId: string
    mode: ListeningMode
    testId?: string
    carryCorrect?: number
    carryTotal?: number
    task?: ListeningTaskId
  }
  ListeningResult: {
    title: string
    correct: number
    total: number
    mode: ListeningMode
    score?: number | null
    pending?: boolean
    summary?: string
    task?: ListeningTaskId
  }
  AssessmentDetails: { testId: string }
  DeviceCheck: undefined
}
