import { useEffect, useState } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import MobileShell from './components/MobileShell'
import { MainLayout } from './components/BottomNav'
import AdminLayout from './admin/AdminLayout'
import ActivityEditor from './admin/dynamic/ActivityEditor'
import Activities from './admin/dynamic/Activities'
import AdminLogin from './admin/dynamic/AdminLogin'
import Analytics from './admin/dynamic/Analytics'
import AssessmentForm from './admin/dynamic/AssessmentForm'
import Assessments from './admin/dynamic/Assessments'
import Assign from './admin/dynamic/Assign'
import BulkUpload from './admin/dynamic/BulkUpload'
import Dashboard from './admin/dynamic/Dashboard'
import Faculty from './admin/dynamic/Faculty'
import Monitoring from './admin/dynamic/Monitoring'
import Report from './admin/dynamic/Report'
import Reports from './admin/dynamic/Reports'
import RequireAdmin from './admin/dynamic/RequireAdmin'
import Results from './admin/dynamic/Results'
import Settings from './admin/dynamic/Settings'
import Students from './admin/dynamic/Students'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import PracticeScreen from './screens/PracticeScreen'
import SpeakingPracticeScreen from './screens/SpeakingPracticeScreen'
import ListeningPracticeScreen from './screens/ListeningPracticeScreen'
import ReadingPracticeScreen from './screens/ReadingPracticeScreen'
import WritingPracticeScreen from './screens/WritingPracticeScreen'
import TestsScreen from './screens/TestsScreen'
import AssessmentDetailsScreen from './screens/AssessmentDetailsScreen'
import DeviceCheckScreen from './screens/DeviceCheckScreen'
import TestInstructionsScreen from './screens/TestInstructionsScreen'
import TestOverviewScreen from './screens/TestOverviewScreen'
import SampleQuestionScreen from './screens/SampleQuestionScreen'
import BeginAssessmentScreen from './screens/BeginAssessmentScreen'
import AssessmentScreen from './screens/AssessmentScreen'
import SpeakingRepeatScreen from './screens/SpeakingRepeatScreen'
import SpeakingStoryRetellingScreen from './screens/SpeakingStoryRetellingScreen'
import SpeakingOpenQuestionScreen from './screens/SpeakingOpenQuestionScreen'
import ListeningConversationScreen from './screens/ListeningConversationScreen'
import ListeningPassageScreen from './screens/ListeningPassageScreen'
import ReadingSentenceCompletionScreen from './screens/ReadingSentenceCompletionScreen'
import WritingTypingScreen from './screens/WritingTypingScreen'
import WritingDictationScreen from './screens/WritingDictationScreen'
import WritingPassageReconstructionScreen from './screens/WritingPassageReconstructionScreen'
import WritingEmailWritingScreen from './screens/WritingEmailWritingScreen'
import AssessmentCompletedScreen from './screens/AssessmentCompletedScreen'
import ResultsScreen from './screens/ResultsScreen'
import DetailedReportScreen from './screens/DetailedReportScreen'
import ImprovementPlanScreen from './screens/ImprovementPlanScreen'
import ProgressScreen from './screens/ProgressScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import ProfileScreen from './screens/ProfileScreen'

function StudentRoutes({ showSplash }) {
  if (showSplash) return <SplashScreen />

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/notifications" element={<NotificationsScreen />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/practice" element={<PracticeScreen />} />
        <Route path="/practice/speaking" element={<SpeakingPracticeScreen />} />
        <Route path="/practice/listening" element={<ListeningPracticeScreen />} />
        <Route path="/practice/reading" element={<ReadingPracticeScreen />} />
        <Route path="/practice/writing" element={<WritingPracticeScreen />} />
        <Route path="/tests" element={<TestsScreen />} />
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      <Route path="/tests/:testId" element={<AssessmentDetailsScreen />} />
      <Route path="/tests/:testId/device-check" element={<DeviceCheckScreen />} />
      <Route path="/tests/:testId/instructions" element={<TestInstructionsScreen />} />
      <Route path="/tests/:testId/overview" element={<TestOverviewScreen />} />
      <Route path="/tests/:testId/sample" element={<SampleQuestionScreen />} />
      <Route path="/tests/:testId/begin" element={<BeginAssessmentScreen />} />
      <Route path="/tests/:testId/assessment" element={<AssessmentScreen />} />
      <Route path="/tests/:testId/assessment/repeat" element={<SpeakingRepeatScreen />} />
      <Route
        path="/tests/:testId/assessment/story-retelling"
        element={<SpeakingStoryRetellingScreen />}
      />
      <Route
        path="/tests/:testId/assessment/open-question"
        element={<SpeakingOpenQuestionScreen />}
      />
      <Route
        path="/tests/:testId/assessment/listening-conversation"
        element={<ListeningConversationScreen />}
      />
      <Route
        path="/tests/:testId/assessment/listening-passage"
        element={<ListeningPassageScreen />}
      />
      <Route
        path="/tests/:testId/assessment/reading-sentence-completion"
        element={<ReadingSentenceCompletionScreen />}
      />
      <Route path="/tests/:testId/assessment/writing-typing" element={<WritingTypingScreen />} />
      <Route
        path="/tests/:testId/assessment/writing-dictation"
        element={<WritingDictationScreen />}
      />
      <Route
        path="/tests/:testId/assessment/writing-passage-reconstruction"
        element={<WritingPassageReconstructionScreen />}
      />
      <Route
        path="/tests/:testId/assessment/writing-email"
        element={<WritingEmailWritingScreen />}
      />
      <Route path="/tests/:testId/completed" element={<AssessmentCompletedScreen />} />
      <Route path="/tests/:testId/results" element={<ResultsScreen />} />
      <Route path="/tests/:testId/detailed-report" element={<DetailedReportScreen />} />
      <Route path="/tests/:testId/improvement-plan" element={<ImprovementPlanScreen />} />
      <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/bulk-upload" element={<BulkUpload />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="assessments/create" element={<AssessmentForm />} />
        <Route path="assessments/builder" element={<AssessmentForm />} />
        <Route path="assessments/assign" element={<Assign />} />
        <Route path="question-bank" element={<Activities />} />
        <Route path="question-bank/editor" element={<ActivityEditor />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="results" element={<Results />} />
        <Route path="results/report" element={<Report />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return true
    const params = new URLSearchParams(window.location.search)
    if (params.has('theme')) return false
    if (window.location.pathname.startsWith('/admin')) return false
    return true
  })

  useEffect(() => {
    if (isAdmin) setShowSplash(false)
  }, [isAdmin])

  useEffect(() => {
    if (!showSplash) return undefined
    const timer = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(timer)
  }, [showSplash])

  if (isAdmin) return <AdminRoutes />

  return (
    <MobileShell mode="app">
      <div className="h-full">
        <StudentRoutes showSplash={showSplash} />
      </div>
    </MobileShell>
  )
}
