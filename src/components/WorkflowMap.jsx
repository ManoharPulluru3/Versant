import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import SplashScreen from '../screens/SplashScreen'
import LoginScreen from '../screens/LoginScreen'
import HomeScreen from '../screens/HomeScreen'
import PracticeScreen from '../screens/PracticeScreen'
import SpeakingPracticeScreen from '../screens/SpeakingPracticeScreen'
import ListeningPracticeScreen from '../screens/ListeningPracticeScreen'
import ReadingPracticeScreen from '../screens/ReadingPracticeScreen'
import WritingPracticeScreen from '../screens/WritingPracticeScreen'
import TestsScreen from '../screens/TestsScreen'
import AssessmentDetailsScreen from '../screens/AssessmentDetailsScreen'
import DeviceCheckScreen from '../screens/DeviceCheckScreen'
import TestInstructionsScreen from '../screens/TestInstructionsScreen'
import TestOverviewScreen from '../screens/TestOverviewScreen'
import SampleQuestionScreen from '../screens/SampleQuestionScreen'
import BeginAssessmentScreen from '../screens/BeginAssessmentScreen'
import AssessmentScreen from '../screens/AssessmentScreen'
import SpeakingRepeatScreen from '../screens/SpeakingRepeatScreen'
import SpeakingStoryRetellingScreen from '../screens/SpeakingStoryRetellingScreen'
import SpeakingOpenQuestionScreen from '../screens/SpeakingOpenQuestionScreen'
import ListeningConversationScreen from '../screens/ListeningConversationScreen'
import ListeningPassageScreen from '../screens/ListeningPassageScreen'
import ReadingSentenceCompletionScreen from '../screens/ReadingSentenceCompletionScreen'
import WritingTypingScreen from '../screens/WritingTypingScreen'
import WritingDictationScreen from '../screens/WritingDictationScreen'
import WritingPassageReconstructionScreen from '../screens/WritingPassageReconstructionScreen'
import WritingEmailWritingScreen from '../screens/WritingEmailWritingScreen'
import AssessmentCompletedScreen from '../screens/AssessmentCompletedScreen'
import ResultsScreen from '../screens/ResultsScreen'
import DetailedReportScreen from '../screens/DetailedReportScreen'
import ImprovementPlanScreen from '../screens/ImprovementPlanScreen'
import ProgressScreen from '../screens/ProgressScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import ProfileScreen from '../screens/ProfileScreen'

const TEST = 'english-communication'

const PHONE_W = 390
const PHONE_H = 844
/** Preview size — keep high so zoom stays sharp */
const PREVIEW_SCALE = 0.48
const FRAME_W = Math.round(PHONE_W * PREVIEW_SCALE)
const FRAME_H = Math.round(PHONE_H * PREVIEW_SCALE)
const LABEL_H = 34
const GAP_X = 160
const GAP_Y = 180
const PAD_X = 80
const PAD_Y = 100

function col(i) {
  return PAD_X + i * (FRAME_W + GAP_X)
}

function row(i) {
  return PAD_Y + i * (FRAME_H + LABEL_H + GAP_Y)
}

const NODES = [
  // Row 0 — onboarding + main tabs (Profile included)
  { id: 'splash', label: '1. Splash', path: '/splash', x: col(0), y: row(0), tab: false, Screen: SplashScreen },
  { id: 'login', label: '2. Login', path: '/login', x: col(1), y: row(0), tab: false, Screen: LoginScreen },
  { id: 'home', label: '3. Home', path: '/home', x: col(2), y: row(0), tab: true, Screen: HomeScreen },
  { id: 'practice', label: '4. Practice', path: '/practice', x: col(3), y: row(0), tab: true, Screen: PracticeScreen },
  { id: 'tests', label: '5. Tests', path: '/tests', x: col(4), y: row(0), tab: true, Screen: TestsScreen },
  { id: 'progress', label: '6. Progress', path: '/progress', x: col(5), y: row(0), tab: true, Screen: ProgressScreen },
  { id: 'profile', label: '7. Profile', path: '/profile', x: col(6), y: row(0), tab: true, Screen: ProfileScreen },

  // Row 1 — notifications + assessment setup
  { id: 'notifications', label: 'Notifications', path: '/notifications', x: col(2), y: row(1), tab: false, Screen: NotificationsScreen },
  { id: 'details', label: 'Assessment Details', path: `/tests/${TEST}`, x: col(4), y: row(1), tab: false, Screen: AssessmentDetailsScreen },
  { id: 'device', label: 'Device Check', path: `/tests/${TEST}/device-check`, x: col(5), y: row(1), tab: false, Screen: DeviceCheckScreen },
  { id: 'instructions', label: 'Instructions', path: `/tests/${TEST}/instructions`, x: col(6), y: row(1), tab: false, Screen: TestInstructionsScreen },
  { id: 'overview', label: 'Test Overview', path: `/tests/${TEST}/overview`, x: col(7), y: row(1), tab: false, Screen: TestOverviewScreen },
  { id: 'sample', label: 'Sample Question', path: `/tests/${TEST}/sample`, x: col(8), y: row(1), tab: false, Screen: SampleQuestionScreen },
  { id: 'begin', label: 'Begin Assessment', path: `/tests/${TEST}/begin`, x: col(9), y: row(1), tab: false, Screen: BeginAssessmentScreen },

  // Row 2 — practice skills
  { id: 'p-speaking', label: 'Speaking Practice', path: '/practice/speaking', x: col(0), y: row(2), tab: true, Screen: SpeakingPracticeScreen },
  { id: 'p-listening', label: 'Listening Practice', path: '/practice/listening', x: col(1), y: row(2), tab: true, Screen: ListeningPracticeScreen },
  { id: 'p-reading', label: 'Reading Practice', path: '/practice/reading', x: col(2), y: row(2), tab: true, Screen: ReadingPracticeScreen },
  { id: 'p-writing', label: 'Writing Practice', path: '/practice/writing', x: col(3), y: row(2), tab: true, Screen: WritingPracticeScreen },

  // Row 3 — live assessment tasks
  { id: 'read-aloud', label: 'Read Aloud', path: `/tests/${TEST}/assessment`, x: col(0), y: row(3), tab: false, Screen: AssessmentScreen },
  { id: 'repeat', label: 'Repeat Sentence', path: `/tests/${TEST}/assessment/repeat`, x: col(1), y: row(3), tab: false, Screen: SpeakingRepeatScreen },
  { id: 'story', label: 'Story Retelling', path: `/tests/${TEST}/assessment/story-retelling`, x: col(2), y: row(3), tab: false, Screen: SpeakingStoryRetellingScreen },
  { id: 'open-q', label: 'Open Question', path: `/tests/${TEST}/assessment/open-question`, x: col(3), y: row(3), tab: false, Screen: SpeakingOpenQuestionScreen },
  { id: 'listen-convo', label: 'Listening Conversation', path: `/tests/${TEST}/assessment/listening-conversation`, x: col(4), y: row(3), tab: false, Screen: ListeningConversationScreen },
  { id: 'listen-pass', label: 'Listening Passage', path: `/tests/${TEST}/assessment/listening-passage`, x: col(5), y: row(3), tab: false, Screen: ListeningPassageScreen },
  { id: 'read-sent', label: 'Sentence Completion', path: `/tests/${TEST}/assessment/reading-sentence-completion`, x: col(6), y: row(3), tab: false, Screen: ReadingSentenceCompletionScreen },

  // Row 4 — writing + results
  { id: 'w-typing', label: 'Typing', path: `/tests/${TEST}/assessment/writing-typing`, x: col(0), y: row(4), tab: false, Screen: WritingTypingScreen },
  { id: 'w-dictation', label: 'Dictation', path: `/tests/${TEST}/assessment/writing-dictation`, x: col(1), y: row(4), tab: false, Screen: WritingDictationScreen },
  { id: 'w-passage', label: 'Passage Reconstruction', path: `/tests/${TEST}/assessment/writing-passage-reconstruction`, x: col(2), y: row(4), tab: false, Screen: WritingPassageReconstructionScreen },
  { id: 'w-email', label: 'Email Writing', path: `/tests/${TEST}/assessment/writing-email`, x: col(3), y: row(4), tab: false, Screen: WritingEmailWritingScreen },
  { id: 'completed', label: 'Completed', path: `/tests/${TEST}/completed`, x: col(4), y: row(4), tab: false, Screen: AssessmentCompletedScreen },
  { id: 'results', label: 'Results', path: `/tests/${TEST}/results`, x: col(5), y: row(4), tab: false, Screen: ResultsScreen },
  { id: 'report', label: 'Detailed Report', path: `/tests/${TEST}/detailed-report`, x: col(6), y: row(4), tab: false, Screen: DetailedReportScreen },
  { id: 'plan', label: 'Improvement Plan', path: `/tests/${TEST}/improvement-plan`, x: col(7), y: row(4), tab: false, Screen: ImprovementPlanScreen },
]

const SECTIONS = [
  { label: 'A · Onboarding & main tabs', x: col(0), y: row(0) - 52 },
  { label: 'B · Notifications & assessment setup', x: col(2), y: row(1) - 52 },
  { label: 'C · Practice skill hubs', x: col(0), y: row(2) - 52 },
  { label: 'D · Live assessment (Speaking → Listening → Reading)', x: col(0), y: row(3) - 52 },
  { label: 'E · Writing tasks & results journey', x: col(0), y: row(4) - 52 },
]

/** Clean sequential edges — avoids crossing spaghetti */
const EDGES = [
  { from: 'splash', to: 'login', label: 'Auto · 2s' },
  { from: 'login', to: 'home', label: 'Sign In' },
  { from: 'home', to: 'practice', label: 'Bottom nav' },
  { from: 'practice', to: 'tests', label: 'Bottom nav' },
  { from: 'tests', to: 'progress', label: 'Bottom nav' },
  { from: 'progress', to: 'profile', label: 'Bottom nav' },
  { from: 'home', to: 'notifications', label: 'Tap bell' },
  { from: 'home', to: 'details', label: 'Start Assessment', kind: 'cta' },
  { from: 'tests', to: 'details', label: 'View Test', kind: 'cta' },
  { from: 'details', to: 'device', label: 'Continue' },
  { from: 'device', to: 'instructions', label: 'Checks OK' },
  { from: 'instructions', to: 'overview', label: 'Next' },
  { from: 'overview', to: 'sample', label: 'Next' },
  { from: 'sample', to: 'begin', label: 'Ready' },
  { from: 'begin', to: 'read-aloud', label: 'Start test' },
  { from: 'practice', to: 'p-speaking', label: 'Open skill' },
  { from: 'practice', to: 'p-listening', label: 'Open skill' },
  { from: 'practice', to: 'p-reading', label: 'Open skill' },
  { from: 'practice', to: 'p-writing', label: 'Open skill' },
  { from: 'read-aloud', to: 'repeat', label: 'Next' },
  { from: 'repeat', to: 'story', label: 'Next' },
  { from: 'story', to: 'open-q', label: 'Next' },
  { from: 'open-q', to: 'listen-convo', label: '→ Listening' },
  { from: 'listen-convo', to: 'listen-pass', label: 'Next' },
  { from: 'listen-pass', to: 'read-sent', label: '→ Reading' },
  { from: 'read-sent', to: 'w-typing', label: '→ Writing' },
  { from: 'w-typing', to: 'w-dictation', label: 'Next' },
  { from: 'w-dictation', to: 'w-passage', label: 'Next' },
  { from: 'w-passage', to: 'w-email', label: 'Next' },
  { from: 'w-email', to: 'completed', label: 'Submit' },
  { from: 'completed', to: 'results', label: 'View results' },
  { from: 'results', to: 'report', label: 'Details' },
  { from: 'report', to: 'plan', label: 'Plan' },
  { from: 'plan', to: 'practice', label: 'Keep practicing', kind: 'loop', route: 'around' },
  { from: 'plan', to: 'home', label: 'Back to Home', kind: 'loop', route: 'around' },
]

function edgeColor(kind) {
  if (kind === 'cta') return '#1F6B4F'
  if (kind === 'loop') return '#5C63A8'
  return '#3E4A43'
}

function ports(node) {
  const x = node.x
  const y = node.y + LABEL_H
  return {
    top: { x: x + FRAME_W / 2, y },
    bottom: { x: x + FRAME_W / 2, y: y + FRAME_H },
    left: { x, y: y + FRAME_H / 2 },
    right: { x: x + FRAME_W, y: y + FRAME_H / 2 },
  }
}

function orthoEdge(from, to, kind, route) {
  const a = ports(from)
  const b = ports(to)
  const dx = b.top.x - a.top.x
  const dy = b.top.y - a.top.y

  let start
  let end
  let midX
  let midY
  let d

  if (route === 'around') {
    // Loop outside to the right / bottom
    start = a.bottom
    end = b.bottom
    const swingY = Math.max(a.bottom.y, b.bottom.y) + 70
    const swingX = Math.max(a.right.x, b.right.x) + 90
    d = `M ${start.x} ${start.y} L ${start.x} ${swingY} L ${swingX} ${swingY} L ${end.x} ${swingY} L ${end.x} ${end.y}`
    midX = (start.x + swingX) / 2
    midY = swingY - 14
    return { d, labelX: midX, labelY: midY }
  }

  if (Math.abs(dx) >= Math.abs(dy)) {
    start = dx >= 0 ? a.right : a.left
    end = dx >= 0 ? b.left : b.right
    midX = (start.x + end.x) / 2
    d = `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`
    midY = (start.y + end.y) / 2
    return { d, labelX: midX, labelY: midY - (Math.abs(start.y - end.y) < 8 ? 16 : 0) }
  }

  start = dy >= 0 ? a.bottom : a.top
  end = dy >= 0 ? b.top : b.bottom
  midY = (start.y + end.y) / 2
  d = `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`
  midX = (start.x + end.x) / 2
  return { d, labelX: midX + (Math.abs(start.x - end.x) < 8 ? 0 : 0), labelY: midY - 14 }
}

function TabShell({ children }) {
  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      <div className="shrink-0 border-t border-[#E4E8DF] bg-[#FCFBF8] px-2 py-2">
        <div className="grid grid-cols-5 text-center type-nav text-[#8A918B]">
          {['Home', 'Practice', 'Tests', 'Progress', 'Profile'].map((label) => (
            <div key={label} className="py-1">
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PreviewRoutes({ node }) {
  const Screen = node.Screen
  if (node.tab) {
    return (
      <TabShell>
        <Screen />
      </TabShell>
    )
  }

  return (
    <Routes>
      <Route path="/splash" element={<SplashScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/notifications" element={<NotificationsScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/practice" element={<PracticeScreen />} />
      <Route path="/practice/speaking" element={<SpeakingPracticeScreen />} />
      <Route path="/practice/listening" element={<ListeningPracticeScreen />} />
      <Route path="/practice/reading" element={<ReadingPracticeScreen />} />
      <Route path="/practice/writing" element={<WritingPracticeScreen />} />
      <Route path="/tests" element={<TestsScreen />} />
      <Route path="/progress" element={<ProgressScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/tests/:testId" element={<AssessmentDetailsScreen />} />
      <Route path="/tests/:testId/device-check" element={<DeviceCheckScreen />} />
      <Route path="/tests/:testId/instructions" element={<TestInstructionsScreen />} />
      <Route path="/tests/:testId/overview" element={<TestOverviewScreen />} />
      <Route path="/tests/:testId/sample" element={<SampleQuestionScreen />} />
      <Route path="/tests/:testId/begin" element={<BeginAssessmentScreen />} />
      <Route path="/tests/:testId/assessment" element={<AssessmentScreen />} />
      <Route path="/tests/:testId/assessment/repeat" element={<SpeakingRepeatScreen />} />
      <Route path="/tests/:testId/assessment/story-retelling" element={<SpeakingStoryRetellingScreen />} />
      <Route path="/tests/:testId/assessment/open-question" element={<SpeakingOpenQuestionScreen />} />
      <Route path="/tests/:testId/assessment/listening-conversation" element={<ListeningConversationScreen />} />
      <Route path="/tests/:testId/assessment/listening-passage" element={<ListeningPassageScreen />} />
      <Route path="/tests/:testId/assessment/reading-sentence-completion" element={<ReadingSentenceCompletionScreen />} />
      <Route path="/tests/:testId/assessment/writing-typing" element={<WritingTypingScreen />} />
      <Route path="/tests/:testId/assessment/writing-dictation" element={<WritingDictationScreen />} />
      <Route path="/tests/:testId/assessment/writing-passage-reconstruction" element={<WritingPassageReconstructionScreen />} />
      <Route path="/tests/:testId/assessment/writing-email" element={<WritingEmailWritingScreen />} />
      <Route path="/tests/:testId/completed" element={<AssessmentCompletedScreen />} />
      <Route path="/tests/:testId/results" element={<ResultsScreen />} />
      <Route path="/tests/:testId/detailed-report" element={<DetailedReportScreen />} />
      <Route path="/tests/:testId/improvement-plan" element={<ImprovementPlanScreen />} />
    </Routes>
  )
}

function ScreenPreview({ node, onOpen, suppressClickRef }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return undefined
    const routePath = node.path === '/splash' ? '/splash' : node.path
    const root = createRoot(el)
    root.render(
      <MemoryRouter initialEntries={[routePath]} initialIndex={0}>
        <div className="h-full overflow-hidden bg-surface">
          <PreviewRoutes node={node} />
        </div>
      </MemoryRouter>,
    )
    return () => {
      setTimeout(() => {
        try {
          root.unmount()
        } catch {
          // ignore
        }
      }, 0)
    }
  }, [node])

  return (
    <div
      className="absolute"
      style={{ left: node.x, top: node.y, width: FRAME_W, height: FRAME_H + LABEL_H }}
    >
      <div className="mb-2 flex h-7 items-center justify-between gap-2">
        <div className="truncate text-[12px] font-extrabold tracking-[-0.01em] text-[#17221D]">
          {node.label}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpen(node)
          }}
          className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-[10px] font-extrabold text-white"
        >
          Open
        </button>
      </div>

      <button
        type="button"
        data-phone-frame
        onClick={() => {
          if (suppressClickRef?.current) return
          onOpen(node)
        }}
        className="workflow-phone block overflow-hidden rounded-[24px] border-[3px] border-[#17221D] bg-white text-left shadow-[0_16px_36px_rgba(23,34,29,0.14)] transition hover:border-brand"
        style={{ width: FRAME_W, height: FRAME_H }}
        aria-label={`Open ${node.label}`}
      >
        {/* CSS zoom keeps text crisp vs transform:scale */}
        <div
          className="pointer-events-none origin-top-left"
          style={{
            width: PHONE_W,
            height: PHONE_H,
            zoom: PREVIEW_SCALE,
          }}
        >
          <div ref={mountRef} className="h-full w-full" />
        </div>
      </button>
    </div>
  )
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export default function WorkflowMap({ onOpenScreen }) {
  const navigate = useNavigate()
  const viewportRef = useRef(null)
  const boardRef = useRef(null)
  const suppressClickRef = useRef(false)
  const [transform, setTransform] = useState({ x: 32, y: 110, scale: 0.62 })
  const [exporting, setExporting] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const dragRef = useRef(null)

  const byId = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), [])

  const bounds = useMemo(() => {
    const maxX = Math.max(...NODES.map((n) => n.x)) + FRAME_W + 200
    const maxY = Math.max(...NODES.map((n) => n.y)) + FRAME_H + LABEL_H + 160
    return { width: maxX, height: maxY }
  }, [])

  const openNode = useCallback(
    (node) => {
      onOpenScreen?.()
      navigate(node.path === '/splash' ? '/login' : node.path)
    },
    [navigate, onOpenScreen],
  )

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return undefined

    function onWheel(e) {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      setTransform((prev) => {
        const delta = e.deltaY > 0 ? 0.92 : 1.08
        const nextScale = Math.min(1.6, Math.max(0.35, +(prev.scale * delta).toFixed(3)))
        const worldX = (mx - prev.x) / prev.scale
        const worldY = (my - prev.y) / prev.scale
        return {
          scale: nextScale,
          x: Math.round(mx - worldX * nextScale),
          y: Math.round(my - worldY * nextScale),
        }
      })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  function onPointerDown(e) {
    if (e.button !== 0) return
    if (e.target.closest('button') && !e.target.closest('[data-phone-frame]')) return
    suppressClickRef.current = false
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: transform.x,
      origY: transform.y,
      moved: false,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      drag.moved = true
      suppressClickRef.current = true
    }
    setTransform((prev) => ({
      ...prev,
      x: Math.round(drag.origX + dx),
      y: Math.round(drag.origY + dy),
    }))
  }

  function onPointerUp(e) {
    if (dragRef.current?.pointerId === e.pointerId) {
      const moved = dragRef.current.moved
      dragRef.current = null
      if (moved) {
        requestAnimationFrame(() => {
          suppressClickRef.current = false
        })
      }
    }
  }

  function zoomBy(factor) {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(1.6, Math.max(0.35, +(prev.scale * factor).toFixed(3))),
    }))
  }

  function resetView() {
    setTransform({ x: 32, y: 110, scale: 0.62 })
  }

  async function exportCurrentView() {
    if (!viewportRef.current || !boardRef.current) return
    setExporting('view')
    setExportOpen(false)
    try {
      // Capture the board as drawn in the viewport by cloning visual transform
      const dataUrl = await toPng(boardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#DDE3D8',
        width: bounds.width,
        height: bounds.height,
        style: {
          transform: 'none',
          zoom: '1',
        },
      })

      // Crop to current viewport in board space
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = dataUrl
      })

      const view = viewportRef.current.getBoundingClientRect()
      const sx = Math.max(0, -transform.x / transform.scale)
      const sy = Math.max(0, -transform.y / transform.scale)
      const sw = Math.min(bounds.width - sx, view.width / transform.scale)
      const sh = Math.min(bounds.height - sy, view.height / transform.scale)

      const canvas = document.createElement('canvas')
      const ratio = 2
      canvas.width = Math.round(sw * ratio)
      canvas.height = Math.round(sh * ratio)
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#DDE3D8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        img,
        sx * (img.width / bounds.width),
        sy * (img.height / bounds.height),
        sw * (img.width / bounds.width),
        sh * (img.height / bounds.height),
        0,
        0,
        canvas.width,
        canvas.height,
      )
      downloadDataUrl(canvas.toDataURL('image/png'), 'elytedu-workflow-view.png')
    } catch (err) {
      console.error(err)
      window.alert('Could not export current view. Try again in a moment.')
    } finally {
      setExporting(null)
    }
  }

  async function exportFullPdf() {
    if (!boardRef.current) return
    setExporting('pdf')
    setExportOpen(false)
    try {
      const dataUrl = await toPng(boardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#DDE3D8',
        width: bounds.width,
        height: bounds.height,
        style: {
          transform: 'none',
          zoom: '1',
        },
      })

      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = dataUrl
      })

      // Landscape A3-ish pages tiled across the journey
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1600, 1000],
        compress: true,
      })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      // Use source tiles sized for HD landscape pages
      const tileW = Math.ceil(img.width / Math.max(1, Math.ceil(bounds.width / 1400)))
      const tileH = Math.ceil(tileW * (pageH / pageW))

      let first = true
      for (let y = 0; y < img.height; y += tileH) {
        for (let x = 0; x < img.width; x += tileW) {
          const tw = Math.min(tileW, img.width - x)
          const th = Math.min(tileH, img.height - y)
          const tileCanvas = document.createElement('canvas')
          tileCanvas.width = tw
          tileCanvas.height = th
          const tctx = tileCanvas.getContext('2d')
          tctx.fillStyle = '#DDE3D8'
          tctx.fillRect(0, 0, tw, th)
          tctx.drawImage(img, x, y, tw, th, 0, 0, tw, th)
          const tileUrl = tileCanvas.toDataURL('image/png')
          if (!first) pdf.addPage([1600, 1000], 'landscape')
          first = false
          // Fit tile into page preserving aspect
          const scale = Math.min(pageW / tw, pageH / th)
          const dw = tw * scale
          const dh = th * scale
          const ox = (pageW - dw) / 2
          const oy = (pageH - dh) / 2
          pdf.addImage(tileUrl, 'PNG', ox, oy, dw, dh)
        }
      }

      // Cover page
      pdf.setPage(1)
      pdf.setFontSize(22)
      pdf.text('ElytEdu — User Journey (Design Review)', 48, 42)

      pdf.save('elytedu-user-journey.pdf')
    } catch (err) {
      console.error(err)
      window.alert('Could not export PDF. Try Export view (PNG) instead.')
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#DDE3D8] font-nunito text-dark">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-30 bg-gradient-to-b from-[#E8ECE2] via-[#E8ECE2]/95 to-transparent px-5 pb-12 pt-4">
        <div className="pointer-events-auto flex flex-wrap items-end justify-between gap-3 pr-40">
          <div>
            <p className="type-label text-[#7A837D]">Customer design review</p>
            <h1 className="type-title mt-1">ElytEdu user journey</h1>
            <p className="type-caption mt-1 max-w-xl text-[#5C6660]">
              Scroll zoom · drag pan · click Open for live app · export HD for approval
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => zoomBy(0.9)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D0D7CB] bg-white text-lg font-bold"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => zoomBy(1.1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D0D7CB] bg-white text-lg font-bold"
            >
              +
            </button>
            <button
              type="button"
              onClick={resetView}
              className="h-9 rounded-full border border-[#D0D7CB] bg-white px-3 type-caption font-extrabold"
            >
              Reset
            </button>
            <span className="rounded-full bg-white/90 px-3 py-2 type-caption font-bold text-[#667068]">
              {Math.round(transform.scale * 100)}%
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={() => setExportOpen((v) => !v)}
                disabled={!!exporting}
                className="flex h-9 items-center gap-2 rounded-full bg-brand px-4 type-caption font-extrabold text-white disabled:opacity-60"
              >
                {exporting ? 'Exporting…' : 'Export'}
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-11 z-40 w-64 overflow-hidden rounded-2xl border border-[#D0D7CB] bg-white shadow-xl">
                  <button
                    type="button"
                    onClick={exportCurrentView}
                    className="flex w-full flex-col items-start gap-0.5 border-b border-[#ECEEE9] px-4 py-3 text-left hover:bg-[#F5F7F1]"
                  >
                    <span className="type-meta font-extrabold">Export current view</span>
                    <span className="type-caption text-[#7A837D]">PNG of what you see now</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportFullPdf}
                    className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left hover:bg-[#F5F7F1]"
                  >
                    <span className="type-meta font-extrabold">Export full PDF (HD)</span>
                    <span className="type-caption text-[#7A837D]">
                      Entire journey for customer review
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="workflow-board origin-top-left"
          style={{
            width: bounds.width,
            height: bounds.height,
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
            transformOrigin: '0 0',
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            ref={boardRef}
            className="relative"
            style={{ width: bounds.width, height: bounds.height }}
            data-workflow-board
          >
            {SECTIONS.map((section) => (
              <div
                key={section.label}
                className="absolute type-label font-extrabold tracking-[0.12em] text-[#6F7A73]"
                style={{ left: section.x, top: section.y }}
              >
                {section.label}
              </div>
            ))}

            <svg
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={bounds.width}
              height={bounds.height}
            >
              <defs>
                {['default', 'cta', 'loop'].map((kind) => (
                  <marker
                    key={kind}
                    id={`wf-arrow-${kind}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0,0 L8,4 L0,8 Z" fill={edgeColor(kind === 'default' ? undefined : kind)} />
                  </marker>
                ))}
              </defs>

              {EDGES.map((edge) => {
                const from = byId[edge.from]
                const to = byId[edge.to]
                if (!from || !to) return null
                const { d, labelX, labelY } = orthoEdge(from, to, edge.kind, edge.route)
                const color = edgeColor(edge.kind)
                const markerId = `wf-arrow-${edge.kind || 'default'}`
                const labelW = Math.min(Math.max(edge.label.length * 7.4 + 28, 88), 200)
                return (
                  <g key={`${edge.from}-${edge.to}-${edge.label}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeWidth={2.4}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeDasharray={edge.kind === 'loop' ? '8 6' : undefined}
                      markerEnd={`url(#${markerId})`}
                    />
                    <rect
                      x={labelX - labelW / 2}
                      y={labelY - 12}
                      rx={9}
                      width={labelW}
                      height={24}
                      fill="#F7F8F2"
                      stroke="#C5CFC0"
                    />
                    <text
                      x={labelX}
                      y={labelY + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#3E4A43"
                      fontSize="11"
                      fontWeight="800"
                      fontFamily="Nunito Sans, sans-serif"
                    >
                      {edge.label}
                    </text>
                  </g>
                )
              })}
            </svg>

            {NODES.map((node) => (
              <ScreenPreview
                key={node.id}
                node={node}
                onOpen={openNode}
                suppressClickRef={suppressClickRef}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
