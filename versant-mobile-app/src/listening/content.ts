export type ListeningActivityId =
  | 'listen-respond'
  | 'conversations'
  | 'passage'
  | 'audio-comprehension'

export type OptionId = 'A' | 'B' | 'C' | 'D'

export type ListeningOption = {
  id: OptionId
  text: string
}

export type ListeningQuestion = {
  id: number
  prompt: string
  options: ListeningOption[]
  answer: OptionId
}

export type ListeningActivity = {
  id: ListeningActivityId
  title: string
  description: string
  duration: string
  level?: string
  iconBg: string
  iconColor: string
  audioLabel: string
  headline: string
  subtitle: string
  audioSeconds: number
  maxListens: number
  questionSeconds: number
  tip: string
  questions: ListeningQuestion[]
}

export const LISTENING_ACTIVITIES: ListeningActivity[] = [
  {
    id: 'listen-respond',
    title: 'Listen & Respond',
    description: 'Listen and choose the best response',
    duration: '3 min',
    level: 'Beginner',
    iconBg: '#FFF0E2',
    iconColor: '#E58A45',
    audioLabel: 'Short clip',
    headline: 'Listen and choose the best response',
    subtitle: 'Listen to the short clip, then select the reply that sounds most natural.',
    audioSeconds: 8,
    maxListens: 2,
    questionSeconds: 30,
    tip: 'Listen for the speaker’s intent, then pick the reply you would actually say.',
    questions: [
      {
        id: 1,
        prompt: 'Someone asks, “Could you tell me where the library is?” What is the best response?',
        answer: 'B',
        options: [
          { id: 'A', text: 'The library is closed on books.' },
          { id: 'B', text: 'It’s across the courtyard, next to the science block.' },
          { id: 'C', text: 'Yes, I have already eaten lunch.' },
          { id: 'D', text: 'Libraries are usually made of paper.' },
        ],
      },
      {
        id: 2,
        prompt: 'A classmate says, “I missed the bus and arrived late.” What is the best response?',
        answer: 'A',
        options: [
          { id: 'A', text: 'That sounds stressful. I hope the class went all right.' },
          { id: 'B', text: 'Yes, the bus is usually blue.' },
          { id: 'C', text: 'You should buy a new classroom.' },
          { id: 'D', text: 'I don’t think classes have buses.' },
        ],
      },
      {
        id: 3,
        prompt: 'A friend says, “I have an interview tomorrow and I’m a little nervous.” What is the best response?',
        answer: 'C',
        options: [
          { id: 'A', text: 'Interviews are usually made of glass.' },
          { id: 'B', text: 'You should buy a larger calendar.' },
          { id: 'C', text: 'That’s understandable. You’ve prepared well.' },
          { id: 'D', text: 'Tomorrow is only after breakfast.' },
        ],
      },
    ],
  },
  {
    id: 'conversations',
    title: 'Conversations',
    description: 'Understand everyday conversations',
    duration: '7 min',
    iconBg: '#DCEBDD',
    iconColor: '#1F6B4F',
    audioLabel: 'Conversation',
    headline: 'Listen and choose the best response',
    subtitle: 'Listen to the short conversation, then select the response that best completes it.',
    audioSeconds: 15,
    maxListens: 2,
    questionSeconds: 45,
    tip: 'Focus on the meaning and context. Choose the response that would sound natural.',
    questions: [
      {
        id: 1,
        prompt:
          'Your classmate says, “I missed the bus this morning and arrived late for class.” What is the most natural response?',
        answer: 'A',
        options: [
          { id: 'A', text: 'That sounds difficult. I hope you are okay.' },
          { id: 'B', text: 'Yes, the bus is usually blue.' },
          { id: 'C', text: 'You should buy a new classroom.' },
          { id: 'D', text: 'I don’t think classes have buses.' },
        ],
      },
      {
        id: 2,
        prompt:
          'A coworker says, “I’m not sure I understand this part of the report.” What is the most natural response?',
        answer: 'A',
        options: [
          { id: 'A', text: 'Let me explain it in a simpler way.' },
          { id: 'B', text: 'Reports are always made of paper.' },
          { id: 'C', text: 'You should close the window now.' },
          { id: 'D', text: 'I think the lunch menu changed.' },
        ],
      },
      {
        id: 3,
        prompt:
          'A friend says, “I have an interview tomorrow and I’m a little nervous.” What is the most natural response?',
        answer: 'A',
        options: [
          { id: 'A', text: 'That’s understandable. You’ve prepared well.' },
          { id: 'B', text: 'Interviews are usually made of glass.' },
          { id: 'C', text: 'You should buy a larger calendar.' },
          { id: 'D', text: 'Tomorrow is after breakfast only.' },
        ],
      },
    ],
  },
  {
    id: 'passage',
    title: 'Passage Comprehension',
    description: 'Listen to a passage and answer questions',
    duration: '8 min',
    iconBg: '#F2F5E8',
    iconColor: '#1F6B4F',
    audioLabel: 'Passage',
    headline: 'Listen and understand',
    subtitle: 'Listen to the passage carefully, then answer the question based on what you heard.',
    audioSeconds: 30,
    maxListens: 2,
    questionSeconds: 60,
    tip: 'Focus on the main idea and the important details. You can replay the passage once.',
    questions: [
      {
        id: 1,
        prompt: 'Why did the community decide to create the new public garden?',
        answer: 'A',
        options: [
          { id: 'A', text: 'To provide a shared outdoor space for residents.' },
          { id: 'B', text: 'To build a new parking area for visitors.' },
          { id: 'C', text: 'To make room for a larger shopping centre.' },
          { id: 'D', text: 'To replace an old sports stadium.' },
        ],
      },
      {
        id: 2,
        prompt: 'According to the passage, what was one benefit of the project?',
        answer: 'A',
        options: [
          { id: 'A', text: 'It helped neighbors spend more time outdoors together.' },
          { id: 'B', text: 'It removed all traffic from the city centre.' },
          { id: 'C', text: 'It replaced the local school with a museum.' },
          { id: 'D', text: 'It stopped people from using public transport.' },
        ],
      },
      {
        id: 3,
        prompt: 'What does the speaker suggest people should do next?',
        answer: 'A',
        options: [
          { id: 'A', text: 'Join a local event and help maintain the garden.' },
          { id: 'B', text: 'Sell the land to a private company.' },
          { id: 'C', text: 'Close the garden during weekends.' },
          { id: 'D', text: 'Build offices around the garden immediately.' },
        ],
      },
    ],
  },
  {
    id: 'audio-comprehension',
    title: 'Audio Comprehension',
    description: 'Listen carefully and identify key information',
    duration: '6 min',
    iconBg: '#FFF0E2',
    iconColor: '#E58A45',
    audioLabel: 'Audio',
    headline: 'Listen for the key details',
    subtitle: 'Play the audio, then choose the option that matches what you heard.',
    audioSeconds: 20,
    maxListens: 2,
    questionSeconds: 40,
    tip: 'Note the time, place, and the one detail the speaker repeats.',
    questions: [
      {
        id: 1,
        prompt: 'When is the campus workshop scheduled?',
        answer: 'C',
        options: [
          { id: 'A', text: 'Monday morning at 8.' },
          { id: 'B', text: 'Tuesday evening at 9.' },
          { id: 'C', text: 'Thursday afternoon at 3.' },
          { id: 'D', text: 'Friday night at 7.' },
        ],
      },
      {
        id: 2,
        prompt: 'Where should students meet before the workshop?',
        answer: 'B',
        options: [
          { id: 'A', text: 'At the main gate.' },
          { id: 'B', text: 'In the seminar room on the second floor.' },
          { id: 'C', text: 'Outside the sports field.' },
          { id: 'D', text: 'In the college canteen.' },
        ],
      },
      {
        id: 3,
        prompt: 'What should students bring with them?',
        answer: 'D',
        options: [
          { id: 'A', text: 'A printed textbook and a camera.' },
          { id: 'B', text: 'Sports shoes and a water bottle.' },
          { id: 'C', text: 'A laptop charger only.' },
          { id: 'D', text: 'A notebook and their student ID.' },
        ],
      },
    ],
  },
]

export function getListeningActivity(id: ListeningActivityId) {
  const activity = LISTENING_ACTIVITIES.find(item => item.id === id)
  if (!activity) {
    throw new Error(`Unknown listening activity: ${id}`)
  }
  return activity
}

export function formatSeconds(total: number) {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
