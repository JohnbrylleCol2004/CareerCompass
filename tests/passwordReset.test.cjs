const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup(error = null) {
  const calls = [];
  const supabase = { auth: { resetPasswordForEmail: async (...args) => { calls.push(args); return { error }; } } };
  const source = fs.readFileSync('src/services/passwordResetService.js', 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace(/export (async function|const)/g, '$1');
  const context = vm.createContext({ supabase });
  vm.runInContext(`${source}\nthis.request = requestPasswordReset;`, context);
  return { request: context.request, calls };
}
test('reset request validates email before contacting Auth', async () => {
  const { request, calls } = setup();
  for (const email of ['', 'bad', 'x@', 'a b@example.com']) await assert.rejects(request(email), /valid email/i);
  assert.equal(calls.length, 0);
});
test('reset sends normalized email to Auth using the existing web recovery destination', async () => {
  const { request, calls } = setup();
  await request(' Student@Example.com ');
  assert.equal(calls[0][0], 'student@example.com');
  assert.equal(calls[0][1].redirectTo, 'https://career-compass-web-cb.vercel.app/?auth_flow=reset');
});
test('reset propagates delivery and rate-limit failures instead of claiming success', async () => {
  await assert.rejects(setup({ message: 'Email rate limit exceeded' }).request('student@example.com'), /rate limit/);
});
