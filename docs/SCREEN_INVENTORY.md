# Screen inventory — Web admin vs mobile student

Source of truth for **implemented React routes**: `versant-web-app/src/App.jsx`.  
Static HTML prototypes (design reference): `versant-web-app/html-files/`.

---

## Admin portal (web)

**Shell:** `AdminLayout` — sidebar navigation, desktop layout.  
**Base path:** `/admin/*`

| Route | React screen | HTML prototype | Purpose |
|-------|--------------|----------------|---------|
| `/admin/dashboard` | `AdminDashboardScreen` | `adminDashboard.html` | KPIs, recent activity, shortcuts |
| `/admin/students` | `AdminStudentsScreen` | `adminStudents.html` | Student roster, search, filters |
| `/admin/students/bulk-upload` | `AdminBulkUploadScreen` | `adminBulkUpload.html` | CSV / bulk import |
| `/admin/faculty` | `AdminFacultyScreen` | `adminFaculty.html` | Faculty accounts |
| `/admin/assessments` | `AdminAssessmentsScreen` | `adminAssessments.html` | Assessment catalog |
| `/admin/assessments/create` | `AdminCreateAssessmentScreen` | `adminCreateAssessment.html` | New assessment wizard |
| `/admin/assessments/builder` | `AdminAssessmentBuilderScreen` | `adminAssessmentBuilder.html` | Section / question assembly |
| `/admin/assessments/assign` | `AdminAssignAssessmentScreen` | `adminAssignAssessment.html` | Assign to cohorts / students |
| `/admin/question-bank` | `AdminQuestionBankScreen` | `adminQuestionBank.html` | Question library |
| `/admin/question-bank/editor` | `AdminQuestionEditorScreen` | `adminQuestionEditor.html` | Create / edit items |
| `/admin/monitoring` | `AdminLiveMonitoringScreen` | `adminLiveMonitoring.html` | Live test sessions |
| `/admin/results` | `AdminResultsScreen` | `adminResults.html` | Scores and outcomes |
| `/admin/results/report` | `AdminStudentDetailedReportScreen` | `adminStudentDetailedReport.html` | Per-student drill-down |
| `/admin/analytics` | `AdminAnalyticsScreen` | `adminAnalytics.html` | Trends, skill breakdown |
| `/admin/reports` | `AdminReportsScreen` | `adminReports.html` | Export / reporting |
| `/admin/settings` | `AdminSettingsScreen` | `adminSettings.html` | Org and system settings |

**Sidebar highlights** (`AdminLayout` NAV): Dashboard → People (Students, Faculty) → Assessments (list, assign, question bank, editor, live monitoring, results) → Insights (analytics, reports) → Settings.

**Not in admin app today:** `landingPage.html`, `jobPoster.html` — marketing / collateral only.

**Shared login prototype:** `login.html` (student app uses `LoginScreen`; admin may share auth later).

---

## Student mobile app

**Shell:** `MobileShell` + `MainLayout` (bottom tabs on main sections).  
**Base paths:** `/login`, `/home`, `/practice`, `/tests`, `/progress`, `/profile`, plus assessment flow under `/tests/:testId/*`.

### Onboarding & main tabs

| Route | React screen | HTML prototype | Notes |
|-------|--------------|----------------|-------|
| (splash) | `SplashScreen` | `splashScreen.html` | 2s splash unless `?theme=` or `/admin` |
| `/login` | `LoginScreen` | `login.html` | Entry after `/` redirect |
| `/home` | `HomeScreen` | — | Tab: Home |
| `/practice` | `PracticeScreen` | `practice.html` | Tab: Practice hub |
| `/tests` | `TestsScreen` | `testsAndAssignments.html` | Tab: Tests & assignments |
| `/progress` | `ProgressScreen` | `progressScoreHistory.html` | Tab: Progress / history |
| `/profile` | `ProfileScreen` | `profileSettings.html` | Tab: Profile & settings |
| `/notifications` | `NotificationsScreen` | `notifications.html` | Outside tab bar |

### Practice (by skill)

| Route | React screen | HTML prototype |
|-------|--------------|----------------|
| `/practice/speaking` | `SpeakingPracticeScreen` | `speakingPractice.html` |
| `/practice/listening` | `ListeningPracticeScreen` | `listeningPractice.html` |
| `/practice/reading` | `ReadingPracticeScreen` | `readingPractice.html` |
| `/practice/writing` | `WritingPracticeScreen` | `writingPractice.html` |

### Assessment flow (`:testId` e.g. `english-communication`)

| Route | React screen | HTML prototype |
|-------|--------------|----------------|
| `/tests/:testId` | `AssessmentDetailsScreen` | `assessmentDetails.html` |
| `.../device-check` | `DeviceCheckScreen` | `deviceCheck.html` |
| `.../instructions` | `TestInstructionsScreen` | `testInstructions.html` |
| `.../overview` | `TestOverviewScreen` | `testOverview.html` |
| `.../sample` | `SampleQuestionScreen` | `sampleQuestion.html` |
| `.../begin` | `BeginAssessmentScreen` | `beginAssessment.html` |

### Live tasks (during assessment)

| Route | React screen | HTML prototype | Skill |
|-------|--------------|----------------|-------|
| `.../assessment` | `AssessmentScreen` | `assessment.html`, `speakingReadAloud.html` | Speaking — read aloud |
| `.../assessment/repeat` | `SpeakingRepeatScreen` | `speakingRepeat.html` | Speaking |
| `.../assessment/story-retelling` | `SpeakingStoryRetellingScreen` | `speakingStoryRetelling.html` | Speaking |
| `.../assessment/open-question` | `SpeakingOpenQuestionScreen` | `speakingOpenQuestion.html` | Speaking |
| `.../assessment/listening-conversation` | `ListeningConversationScreen` | `listeningConversation.html` | Listening |
| `.../assessment/listening-passage` | `ListeningPassageScreen` | `listeningPassage.html` | Listening |
| `.../assessment/reading-sentence-completion` | `ReadingSentenceCompletionScreen` | `readingSentenceCompletion.html` | Reading |
| `.../assessment/writing-typing` | `WritingTypingScreen` | `writingTyping.html` | Writing |
| `.../assessment/writing-dictation` | `WritingDictationScreen` | `writingDictation.html` | Writing |
| `.../assessment/writing-passage-reconstruction` | `WritingPassageReconstructionScreen` | `writingPassageReconstruction.html` | Writing |
| `.../assessment/writing-email` | `WritingEmailWritingScreen` | `writingEmailWriting.html` | Writing |

### Post-assessment

| Route | React screen | HTML prototype |
|-------|--------------|----------------|
| `.../completed` | `AssessmentCompletedScreen` | `assessmentCompleted.html` |
| `.../results` | `ResultsScreen` | `results.html` |
| `.../detailed-report` | `DetailedReportScreen` | `detailedSkillReport.html` |
| `.../improvement-plan` | `ImprovementPlanScreen` | `improvementPlan.html` |

**Workflow map:** `versant-web-app/src/components/WorkflowMap.jsx` renders the full student journey for demos and PNG/PDF export.

---

## Planned split (frontend + backend)

| Product | Target frontend | Likely backend concerns |
|---------|-----------------|-------------------------|
| **versant-web-app** | Admin-only Vite/React (or separate package) | Users/RBAC, org settings, assessment CRUD, assignments, reporting, exports |
| **versant-mobile-app** | React Native or dedicated mobile web | Auth, assignments, attempt/session state, media upload (speaking), scoring results, notifications |

Until split, all React code lives under `versant-web-app/src/` (`screens/` = mobile, `admin/` = web admin).
