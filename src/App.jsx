import { useEffect, useState } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import MobileShell from './components/MobileShell'
import { MainLayout } from './components/BottomNav'
import WorkflowMap from './components/WorkflowMap'
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

const VIEW_KEY = 'elytedu-view-mode'

function ModeToggle({ mode, onToggle }) {
  const isWorkflow = mode === 'workflow'

  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed right-4 top-4 z-[100] flex items-center gap-2 rounded-full border border-[#D7DED5] bg-white/95 px-3.5 py-2.5 shadow-[0_10px_30px_rgba(23,34,29,0.14)] backdrop-blur-md transition hover:bg-white md:right-6 md:top-6"
      aria-label={isWorkflow ? 'Switch to app view' : 'Switch to workflow view'}
    >
      <span
        className={`flex h-7 items-center rounded-full px-2.5 type-caption font-extrabold transition ${
          !isWorkflow ? 'bg-brand text-white' : 'text-[#667068]'
        }`}
      >
        App
      </span>
      <span
        className={`flex h-7 items-center rounded-full px-2.5 type-caption font-extrabold transition ${
          isWorkflow ? 'bg-brand text-white' : 'text-[#667068]'
        }`}
      >
        Workflow
      </span>
    </button>
  )
}

export default function App() {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(VIEW_KEY) === 'workflow' ? 'workflow' : 'app'
    } catch {
      return 'app'
    }
  })

  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return true
    const params = new URLSearchParams(window.location.search)
    if (params.has('theme')) return false
    if (localStorage.getItem(VIEW_KEY) === 'workflow') return false
    return true
  })

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, mode)
  }, [mode])

  useEffect(() => {
    if (!showSplash) return undefined
    const timer = setTimeout(() => setShowSplash(false), 2000)
    return () => clearTimeout(timer)
  }, [showSplash])

  function toggleMode() {
    setMode((current) => {
      const next = current === 'app' ? 'workflow' : 'app'
      if (next === 'workflow') setShowSplash(false)
      return next
    })
  }

  return (
    <>
      <ModeToggle mode={mode} onToggle={toggleMode} />

      <MobileShell mode={mode}>
        {mode === 'workflow' ? (
          <WorkflowMap onOpenScreen={() => setMode('app')} />
        ) : (
          <div className="h-full">
            {showSplash ? (
              <SplashScreen />
            ) : (
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
                <Route
                  path="/tests/:testId/assessment/writing-typing"
                  element={<WritingTypingScreen />}
                />
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
                <Route
                  path="/tests/:testId/completed"
                  element={<AssessmentCompletedScreen />}
                />
                <Route path="/tests/:testId/results" element={<ResultsScreen />} />
                <Route
                  path="/tests/:testId/detailed-report"
                  element={<DetailedReportScreen />}
                />
                <Route
                  path="/tests/:testId/improvement-plan"
                  element={<ImprovementPlanScreen />}
                />
              </Routes>
            )}
          </div>
        )}
      </MobileShell>
    </>
  )
}
