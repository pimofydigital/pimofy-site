const test = require('node:test');
const assert = require('node:assert/strict');

const {
  generateArithmeticChallenge,
  validateArithmeticAnswer,
  evaluateArithmeticQuestion,
} = require('../utils/humanVerification');

test('generateArithmeticChallenge creates a valid arithmetic question and answer', () => {
  const challenge = generateArithmeticChallenge();

  assert.ok(challenge);
  assert.ok(challenge.question);
  assert.ok(challenge.answer !== undefined && challenge.answer !== null && challenge.answer !== '');
  assert.equal(validateArithmeticAnswer(String(challenge.answer), challenge.question), true);
});

test('evaluateArithmeticQuestion handles addition and subtraction correctly', () => {
  assert.equal(evaluateArithmeticQuestion('7 + 3'), 10);
  assert.equal(evaluateArithmeticQuestion('12 - 4'), 8);
  assert.equal(evaluateArithmeticQuestion('2 + 2'), 4);
});

test('validateArithmeticAnswer rejects incorrect answers and invalid questions', () => {
  assert.equal(validateArithmeticAnswer('9', '7 + 3'), false);
  assert.equal(validateArithmeticAnswer('10', '7 + 3'), true);
  assert.equal(validateArithmeticAnswer('10', 'invalid question'), false);
  assert.equal(validateArithmeticAnswer('', '7 + 3'), false);
});
