import type { ListeningTaskId } from '../navigation/types'

export const LISTENING_TASKS: { id: ListeningTaskId; title: string; blurb: string }[] = [
  { id: 'mcq', title: 'Listening & Answering', blurb: 'Hear a clip, then choose the right answer' },
  { id: 'blank', title: 'Fill in the Blanks', blurb: 'Listen, then type the missing words' },
  { id: 'match', title: 'Match the Following', blurb: 'Connect what you heard with the right pair' },
  { id: 'truefalse', title: 'True / False', blurb: 'Decide whether the statement matches the clip' },
  { id: 'repeat', title: 'Listening & Repeat', blurb: 'Listen to a sentence and say it back' },
  { id: 'type', title: 'Listen & Type', blurb: 'Type exactly what you hear' },
  { id: 'respond', title: 'Listen & Respond', blurb: 'Hear a situation and answer in your own words' },
  { id: 'recall', title: 'Listen & Recall', blurb: 'Remember the details after the clip ends' },
  { id: 'identify', title: 'Listen & Identify', blurb: 'Pick the word or phrase you heard' },
]

export function listeningTaskOf(item: { kind?: string | null; questions?: { type?: string }[] | null }): ListeningTaskId {
  const kind = item.kind || 'answering'
  if (kind === 'repeat' || kind === 'type' || kind === 'respond' || kind === 'recall' || kind === 'identify') return kind
  const type = item.questions?.[0]?.type
  if (type === 'blank' || type === 'match' || type === 'truefalse') return type
  return 'mcq'
}
