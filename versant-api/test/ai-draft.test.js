import assert from 'node:assert/strict'
import test from 'node:test'
import { distributeAnswers, normalizeAiQuestions, normalizeScript, questionCountFromInstruction } from '../src/ai.js'

test('a script is trimmed and kept under the speech limit', () => {
  const script = normalizeScript(`  ${'The library closes at six. '.repeat(20)}  `)
  assert.equal(script.startsWith('The library'), true)
  assert.ok(script.length <= 4000)
})

test('question letters are kept and short option lists are filled out', () => {
  const questions = normalizeAiQuestions({
    questions: [
      {
        prompt: 'What time does the library close?',
        answer: 'B',
        options: ['Five', 'Six', 'Seven'],
      },
    ],
  })
  assert.equal(questions[0].answer, 'B')
  assert.equal(questions[0].options[1].text, 'Six')
  assert.equal(questions[0].options.length, 4)
  assert.equal(questions[0].options[3].text, '')
})

test('a question request keeps the number the user asked for', () => {
  assert.equal(questionCountFromInstruction('Generate 4 questions about the library'), 4)
  assert.equal(questionCountFromInstruction('just the main idea'), null)
})

test('a choice marked correct is kept when no letter is given', () => {
  const questions = normalizeAiQuestions([
    {
      prompt: 'When does the library close?',
      options: [
        { text: 'At five' },
        { text: 'At six', correct: true },
        { text: 'At seven' },
        { text: 'At eight' },
      ],
    },
  ])
  assert.equal(questions[0].answer, 'B')
  assert.equal(questions[0].options[1].text, 'At six')
})

test('correct answers are spread across letters', () => {
  const questions = distributeAnswers(
    [
      { prompt: 'When does the library close?', answer: 'A', options: [{ text: 'At six' }, { text: 'At five' }, { text: 'At seven' }, { text: 'At eight' }] },
      { prompt: 'Where are books returned?', answer: 'A', options: [{ text: 'The desk' }, { text: 'The cafe' }, { text: 'The lab' }, { text: 'The gate' }] },
      { prompt: 'Who can stay late?', answer: 'A', options: [{ text: 'Staff' }, { text: 'Guests' }, { text: 'Students' }, { text: 'Visitors' }] },
    ],
    () => 0,
  )
  assert.deepEqual(questions.map((question) => question.answer), ['A', 'B', 'C'])
  assert.equal(questions[0].options[0].text, 'At six')
  assert.equal(questions[1].options[1].text, 'The desk')
  assert.equal(questions[2].options[2].text, 'Staff')
})

test('an answer written as text is mapped to its letter', () => {
  const questions = normalizeAiQuestions([
    {
      prompt: 'Where should the books be returned?',
      answer: 'The front desk',
      options: ['The cafe', 'The front desk', 'The lab', 'The gate'],
    },
  ])
  assert.equal(questions[0].answer, 'B')
})
