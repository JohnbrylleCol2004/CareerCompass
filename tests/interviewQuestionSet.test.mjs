import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { requireTwentyQuestions } from '../src/data/interviewQuestionSet.mjs';

const source = readFileSync(new URL('../src/data/bsitInterviewQuestions.js', import.meta.url), 'utf8');
const { bsitInterviewQuestions } = await import(`data:text/javascript,${encodeURIComponent(source)}`);

test('the actual built-in Interview Coach set has 20 distinct questions', () => {
  assert.equal(requireTwentyQuestions(bsitInterviewQuestions).length, 20);
});

test('a short or repeated AI set cannot replace the 20 built-in questions', () => {
  assert.throws(() => requireTwentyQuestions(bsitInterviewQuestions.slice(0, 5)), /20 questions/);
  assert.throws(() => requireTwentyQuestions([...bsitInterviewQuestions.slice(0, 19), bsitInterviewQuestions[0]]), /20 questions/);
});
