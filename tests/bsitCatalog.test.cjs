const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const source = readFileSync(require.resolve('../src/data/mockData.js'), 'utf8');
const catalog = import(`data:text/javascript,${encodeURIComponent(source)}`);

test('BSIT career paths match the supplied primary and secondary role lists', async () => {
  const { careers } = await catalog;
  assert.deepEqual(careers.filter(role => role.tier === 'primary').map(role => role.name), [
    'Web and Applications Developer',
    'Junior Database Administrator',
    'Systems Administrator',
    'Network Engineer',
    'Junior Information Security Administrator',
    'Systems Integration Personnel',
    'IT Audit Assistant',
    'Technical Support Specialist',
  ]);
  assert.deepEqual(careers.filter(role => role.tier === 'secondary').map(role => role.name), [
    'QA Specialist', 'Systems Analyst', 'Computer Programmer',
  ]);
  assert.ok(careers.every(role => !('matchScore' in role)));
});

test('BSIT elective catalog shows the six recommended courses in the supplied curriculum', async () => {
  const { electives } = await catalog;
  assert.deepEqual(electives.map(({ code, name }) => [code, name]), [
    ['IPT102', 'Integrative Programming Technologies 2'],
    ['PT101', 'Platform Technologies'],
    ['WS101', 'Web Systems and Technologies'],
    ['PF101', 'Object-Oriented Programming'],
    ['SIA102', 'Systems Integration and Architecture 2'],
    ['HCI102', 'Human Computer Interaction 2'],
  ]);
  assert.ok(electives.every(course => !('skillBoost' in course)));
});

test('specialization elective links point to courses in the BSIT catalog', async () => {
  const { electives, specializations } = await catalog;
  const names = new Set(electives.map(course => course.name));
  for (const specialization of specializations) {
    assert.ok(specialization.recommendedElectives.every(name => names.has(name)), specialization.name);
  }
});

test('built-in interview questions point to a listed BSIT career path', async () => {
  const { careers, interviewQuestions } = await catalog;
  const names = new Set(careers.map(role => role.name));
  for (const question of interviewQuestions) assert.ok(names.has(question.career), question.career);
});

