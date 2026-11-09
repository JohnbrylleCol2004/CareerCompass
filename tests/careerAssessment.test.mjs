import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAssessment, rankCareers, isCompleteSet } from '../src/data/careerAssessment.mjs';

const answers = Array.from({ length: 20 }, (_, index) => ({ question: `Question ${index + 1}?`, answer: `Answer ${index + 1}` }));

test('a set requires all 20 nonblank answers', () => {
  assert.equal(isCompleteSet(answers), true);
  assert.equal(isCompleteSet(answers.slice(1)), false);
  assert.equal(isCompleteSet(answers.map((item, i) => i === 5 ? { ...item, answer: ' ' } : item)), false);
});

test('assessment rejects duplicate or missing areas and sanitizes saved evidence', () => {
  const areas = ['programming', 'web', 'database', 'networking', 'security', 'systems', 'integration', 'quality', 'analysis', 'support'];
  const result = { areas: areas.map((area, index) => ({ area, level: index < 2 ? 'strong' : 'unassessed', evidence: index < 2 ? [index + 1] : [], note: 'Short reason.' })) };
  const normalized = normalizeAssessment({ ...result, answers });
  assert.equal(normalized.areas.length, 10);
  assert.equal(JSON.stringify(normalized).includes('Answer 1'), false);
  assert.deepEqual(rankCareers(normalized)[0].name, 'Web and Applications Developer');
  assert.throws(() => normalizeAssessment({ areas: [...result.areas.slice(0, 9), result.areas[0]] }));
  assert.throws(() => normalizeAssessment({ areas: result.areas.map(item => ({ ...item, evidence: [21] })) }));
});

test('career suggestions change with the demonstrated answer areas', () => {
  const areas = ['programming', 'web', 'database', 'networking', 'security', 'systems', 'integration', 'quality', 'analysis', 'support'];
  const result = normalizeAssessment({ areas: areas.map((area, index) => ({
    area,
    level: ['networking', 'systems'].includes(area) ? 'strong' : 'unassessed',
    evidence: ['networking', 'systems'].includes(area) ? [index + 1] : [],
    note: 'Practice evidence.',
  })) });
  assert.equal(rankCareers(result)[0].name, 'Systems Administrator');
  assert.ok(!rankCareers(result).some(role => role.name === 'Web and Applications Developer'));
});
