import { hashPassword } from './auth.js'
import { now } from './domain.js'
import { replace } from './store.js'

function question(activityId, order, prompt, answer, options) {
  return {
    id: `${activityId}-q${order}`,
    activityId,
    order,
    prompt,
    answer,
    options,
  }
}

function options(a, b, c, d) {
  return [
    { id: 'A', text: a },
    { id: 'B', text: b },
    { id: 'C', text: c },
    { id: 'D', text: d },
  ]
}

export function buildSeed() {
  const createdAt = now()
  const password = hashPassword('Student@123')
  const adminPassword = hashPassword('Admin@123')

  const users = [
    {
      id: 'user_admin',
      role: 'admin',
      name: 'Avery Cole',
      email: 'admin@elytedu.com',
      passwordHash: adminPassword,
      settings: {},
      createdAt,
    },
    {
      id: 'user_emma',
      role: 'student',
      name: 'Emma Wilson',
      email: 'emma.wilson@college.edu',
      studentId: 'EW20260421',
      college: 'ElytEdu College',
      program: 'English Communication',
      passwordHash: password,
      settings: { rememberDevice: true, autoPlayAudio: false, language: 'English' },
      createdAt,
    },
    {
      id: 'user_alex',
      role: 'student',
      name: 'Alex Rivera',
      email: 'alex.rivera@college.edu',
      studentId: 'AR20260488',
      college: 'ElytEdu College',
      program: 'English Communication',
      passwordHash: password,
      settings: { rememberDevice: true, autoPlayAudio: false, language: 'English' },
      createdAt,
    },
  ]

  const activities = [
    {
      id: 'listen-respond',
      title: 'Listen & Respond',
      description: 'Listen and choose the best response',
      duration: '3 min',
      level: 'Beginner',
      iconBg: '#FFF0E2',
      iconColor: '#E58A45',
      audioLabel: 'Short clip',
      script:
        'Could you tell me where the library is? I missed the bus and arrived late. I have an interview tomorrow and I’m a little nervous.',
      headline: 'Listen and choose the best response',
      subtitle: 'Listen to the short clip, then select the reply that sounds most natural.',
      audioSeconds: 8,
      maxListens: 2,
      questionSeconds: 30,
      tip: 'Listen for the speaker’s intent, then pick the reply you would actually say.',
      published: true,
      createdAt,
    },
    {
      id: 'conversations',
      title: 'Conversations',
      description: 'Understand everyday conversations',
      duration: '7 min',
      level: 'Intermediate',
      iconBg: '#DCEBDD',
      iconColor: '#1F6B4F',
      audioLabel: 'Conversation',
      script:
        'A classmate says: I missed the bus this morning and arrived late for class. A coworker says: I’m not sure I understand this part of the report. A friend says: I have an interview tomorrow and I’m a little nervous.',
      headline: 'Listen and choose the best response',
      subtitle: 'Listen to the short conversation, then select the response that best completes it.',
      audioSeconds: 15,
      maxListens: 2,
      questionSeconds: 45,
      tip: 'Focus on the meaning and context. Choose the response that would sound natural.',
      published: true,
      createdAt,
    },
    {
      id: 'passage',
      title: 'Passage Comprehension',
      description: 'Listen to a passage and answer questions',
      duration: '8 min',
      level: 'Intermediate',
      iconBg: '#F2F5E8',
      iconColor: '#1F6B4F',
      audioLabel: 'Passage',
      script:
        'The community decided to create a new public garden so residents would have a shared outdoor space. One benefit was that neighbors spent more time outdoors together. People should join a local event and help maintain the garden.',
      headline: 'Listen and understand',
      subtitle: 'Listen to the passage carefully, then answer the question based on what you heard.',
      audioSeconds: 30,
      maxListens: 2,
      questionSeconds: 60,
      tip: 'Focus on the main idea and the important details. You can replay the passage once.',
      published: true,
      createdAt,
    },
    {
      id: 'audio-comprehension',
      title: 'Audio Comprehension',
      description: 'Listen carefully and identify key information',
      duration: '6 min',
      level: 'Beginner',
      iconBg: '#FFF0E2',
      iconColor: '#E58A45',
      audioLabel: 'Audio',
      script:
        'The campus workshop is scheduled for Thursday afternoon at 3. Students should meet in the seminar room on the second floor. Please bring a notebook and your student ID.',
      headline: 'Listen for the key details',
      subtitle: 'Play the audio, then choose the option that matches what you heard.',
      audioSeconds: 20,
      maxListens: 2,
      questionSeconds: 40,
      tip: 'Note the time, place, and the one detail the speaker repeats.',
      published: true,
      createdAt,
    },
  ]

  const questions = [
    question(
      'listen-respond',
      1,
      'Someone asks, “Could you tell me where the library is?” What is the best response?',
      'B',
      options(
        'The library is closed on books.',
        'It’s across the courtyard, next to the science block.',
        'Yes, I have already eaten lunch.',
        'Libraries are usually made of paper.',
      ),
    ),
    question(
      'listen-respond',
      2,
      'A classmate says, “I missed the bus and arrived late.” What is the best response?',
      'A',
      options(
        'That sounds stressful. I hope the class went all right.',
        'Yes, the bus is usually blue.',
        'You should buy a new classroom.',
        'I don’t think classes have buses.',
      ),
    ),
    question(
      'listen-respond',
      3,
      'A friend says, “I have an interview tomorrow and I’m a little nervous.” What is the best response?',
      'C',
      options(
        'Interviews are usually made of glass.',
        'You should buy a larger calendar.',
        'That’s understandable. You’ve prepared well.',
        'Tomorrow is only after breakfast.',
      ),
    ),
    question(
      'conversations',
      1,
      'Your classmate says, “I missed the bus this morning and arrived late for class.” What is the most natural response?',
      'A',
      options(
        'That sounds difficult. I hope you are okay.',
        'Yes, the bus is usually blue.',
        'You should buy a new classroom.',
        'I don’t think classes have buses.',
      ),
    ),
    question(
      'conversations',
      2,
      'A coworker says, “I’m not sure I understand this part of the report.” What is the most natural response?',
      'A',
      options(
        'Let me explain it in a simpler way.',
        'Reports are always made of paper.',
        'You should close the window now.',
        'I think the lunch menu changed.',
      ),
    ),
    question(
      'conversations',
      3,
      'A friend says, “I have an interview tomorrow and I’m a little nervous.” What is the most natural response?',
      'A',
      options(
        'That’s understandable. You’ve prepared well.',
        'Interviews are usually made of glass.',
        'You should buy a larger calendar.',
        'Tomorrow is after breakfast only.',
      ),
    ),
    question(
      'passage',
      1,
      'Why did the community decide to create the new public garden?',
      'A',
      options(
        'To provide a shared outdoor space for residents.',
        'To build a new parking area for visitors.',
        'To make room for a larger shopping centre.',
        'To replace an old sports stadium.',
      ),
    ),
    question(
      'passage',
      2,
      'According to the passage, what was one benefit of the project?',
      'A',
      options(
        'It helped neighbors spend more time outdoors together.',
        'It removed all traffic from the city centre.',
        'It replaced the local school with a museum.',
        'It stopped people from using public transport.',
      ),
    ),
    question(
      'passage',
      3,
      'What does the speaker suggest people should do next?',
      'A',
      options(
        'Join a local event and help maintain the garden.',
        'Sell the land to a private company.',
        'Close the garden during weekends.',
        'Build offices around the garden immediately.',
      ),
    ),
    question(
      'audio-comprehension',
      1,
      'When is the campus workshop scheduled?',
      'C',
      options('Monday morning at 8.', 'Tuesday evening at 9.', 'Thursday afternoon at 3.', 'Friday night at 7.'),
    ),
    question(
      'audio-comprehension',
      2,
      'Where should students meet before the workshop?',
      'B',
      options(
        'At the main gate.',
        'In the seminar room on the second floor.',
        'Outside the sports field.',
        'In the college canteen.',
      ),
    ),
    question(
      'audio-comprehension',
      3,
      'What should students bring with them?',
      'D',
      options(
        'A printed textbook and a camera.',
        'Sports shoes and a water bottle.',
        'A laptop charger only.',
        'A notebook and their student ID.',
      ),
    ),
  ]

  const tests = [
    {
      id: 'english-communication',
      title: 'English Communication Test',
      description: 'A listening assessment of conversations and a short passage.',
      badge: 'College assessment',
      durationMinutes: 30,
      dueDate: '2026-09-14',
      status: 'published',
      activityIds: ['conversations', 'passage'],
      createdAt,
    },
    {
      id: 'level-assessment',
      title: 'English Level Assessment',
      description: 'Find your current listening level from a short audio.',
      badge: 'Placement test',
      durationMinutes: 20,
      dueDate: '2026-09-20',
      status: 'published',
      activityIds: ['audio-comprehension'],
      createdAt,
    },
  ]

  const assignments = [
    {
      id: 'asg_emma_comm',
      testId: 'english-communication',
      studentId: 'user_emma',
      status: 'assigned',
      assignedAt: createdAt,
    },
    {
      id: 'asg_emma_level',
      testId: 'level-assessment',
      studentId: 'user_emma',
      status: 'assigned',
      assignedAt: createdAt,
    },
    {
      id: 'asg_alex_level',
      testId: 'level-assessment',
      studentId: 'user_alex',
      status: 'assigned',
      assignedAt: createdAt,
    },
  ]

  const attempts = [
    {
      id: 'att_emma_practice',
      studentId: 'user_emma',
      kind: 'practice',
      activityId: 'listen-respond',
      testId: null,
      assignmentId: null,
      answers: [
        { questionId: 'listen-respond-q1', optionId: 'B', correct: true },
        { questionId: 'listen-respond-q2', optionId: 'A', correct: true },
        { questionId: 'listen-respond-q3', optionId: 'A', correct: false },
      ],
      correct: 2,
      total: 3,
      score: 67,
      createdAt: '2026-09-28T09:30:00.000Z',
    },
  ]

  const notifications = [
    {
      id: 'note_1',
      studentId: 'user_emma',
      title: 'Assessment due soon',
      body: 'English Communication Test is due Sep 14.',
      read: false,
      createdAt: '2026-09-29T08:00:00.000Z',
    },
    {
      id: 'note_2',
      studentId: 'user_emma',
      title: 'Practice recommendation',
      body: 'A short Listen & Respond set is ready in practice.',
      read: false,
      createdAt: '2026-09-28T12:00:00.000Z',
    },
    {
      id: 'note_3',
      studentId: 'user_alex',
      title: 'Placement test assigned',
      body: 'English Level Assessment is due Sep 20.',
      read: false,
      createdAt: '2026-09-29T08:00:00.000Z',
    },
  ]

  return {
    users,
    activities,
    questions,
    tests,
    assignments,
    attempts,
    notifications,
    settings: {
      collegeName: 'ElytEdu College',
      supportEmail: 'admin@elytedu.com',
      passMark: 60,
    },
  }
}

export async function seedDatabase() {
  return replace(buildSeed())
}
