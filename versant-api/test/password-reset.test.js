import assert from 'node:assert/strict'
import test from 'node:test'
import { codesMatch, hashResetCode, recentlySent, resetStillValid } from '../src/password-reset.js'

test('a reset code matches only its hash', () => {
  const hash = hashResetCode('123456')
  assert.equal(codesMatch('123456', hash), true)
  assert.equal(codesMatch('654321', hash), false)
  assert.equal(codesMatch('12345', hash), false)
})

test('a reset code expires after its time', () => {
  const future = new Date(Date.now() + 60_000).toISOString()
  const past = new Date(Date.now() - 60_000).toISOString()
  assert.equal(resetStillValid(future), true)
  assert.equal(resetStillValid(past), false)
  assert.equal(resetStillValid(''), false)
})

test('a reset email is not sent again within a minute', () => {
  assert.equal(recentlySent(new Date().toISOString()), true)
  assert.equal(recentlySent(new Date(Date.now() - 120_000).toISOString()), false)
})
