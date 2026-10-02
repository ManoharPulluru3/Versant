import assert from 'node:assert/strict'
import test from 'node:test'
import { limitScript, resolveVoice, scriptFromTranscript } from '../src/speech.js'

test('a single speaker stays one paragraph', () => {
  const script = scriptFromTranscript({
    text: 'The library closes at six.',
    words: [
      { text: 'The', speaker: 0 },
      { text: 'library', speaker: 0 },
      { text: 'closes', speaker: 0 },
      { text: 'at', speaker: 0 },
      { text: 'six.', speaker: 0 },
    ],
  })
  assert.equal(script, 'The library closes at six.')
})

test('two speakers become a labeled dialogue', () => {
  const script = scriptFromTranscript({
    text: 'Hello Where is the station It is beside the park',
    words: [
      { text: 'Hello.', speaker: 0 },
      { text: 'Where', speaker: 0 },
      { text: 'is', speaker: 0 },
      { text: 'the', speaker: 0 },
      { text: 'station?', speaker: 0 },
      { text: 'It', speaker: 1 },
      { text: 'is', speaker: 1 },
      { text: 'beside', speaker: 1 },
      { text: 'the', speaker: 1 },
      { text: 'park.', speaker: 1 },
    ],
  })
  assert.equal(script, 'Speaker 1: Hello. Where is the station?\n\nSpeaker 2: It is beside the park.')
})

test('a pause splits the transcript into paragraphs', () => {
  const script = scriptFromTranscript({
    text: 'Hello. It is beside the park.',
    segments: [
      { text: ' Hello.', start: 0, end: 0.6 },
      { text: ' It is beside the park.', start: 2.4, end: 4 },
    ],
  })
  assert.equal(script, 'Hello.\n\nIt is beside the park.')
})

test('unknown voices fall back to Female', () => {
  assert.equal(resolveVoice('hi-IN-SwaraNeural').name, 'Female')
  assert.equal(resolveVoice('en-IN-PrabhatNeural').name, 'Male')
})

test('long transcripts are shortened', () => {
  const limited = limitScript('a'.repeat(12010))
  assert.equal(limited.trimmed, true)
  assert.equal(limited.script.length, 12000)
})
