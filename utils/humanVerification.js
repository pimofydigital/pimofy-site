function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function evaluateArithmeticQuestion(question) {
  if (typeof question !== 'string') {
    return null;
  }

  const normalized = question.trim();
  const match = normalized.match(/^(-?\d+)\s*([+-])\s*(-?\d+)$/);

  if (!match) {
    return null;
  }

  const left = Number(match[1]);
  const operator = match[2];
  const right = Number(match[3]);

  if (operator === '+') {
    return left + right;
  }

  return left - right;
}

function generateArithmeticChallenge() {
  const left = randomInt(2, 12);
  const right = randomInt(1, 9);
  const useAddition = Math.random() >= 0.5;

  if (useAddition) {
    return {
      question: `${left} + ${right}`,
      answer: left + right,
    };
  }

  const largerLeft = Math.max(left, right + 1);
  return {
    question: `${largerLeft} - ${right}`,
    answer: largerLeft - right,
  };
}

function validateArithmeticAnswer(answer, question) {
  const expected = evaluateArithmeticQuestion(question);
  if (expected === null || !Number.isFinite(expected)) {
    return false;
  }

  const numericAnswer = Number(String(answer || '').trim());
  if (!Number.isFinite(numericAnswer)) {
    return false;
  }

  return numericAnswer === expected;
}

module.exports = {
  evaluateArithmeticQuestion,
  generateArithmeticChallenge,
  validateArithmeticAnswer,
};
