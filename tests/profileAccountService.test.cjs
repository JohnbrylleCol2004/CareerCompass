const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup({ user = { email: 'old@example.com' }, error = null, updateError = null, careerError = null } = {}) {
  const calls = [];
  const supabase = {
    auth: {
      getUser: async () => ({ data: { user }, error }),
      updateUser: async payload => { calls.push(payload); return { error: updateError }; },
    },
    from: table => { assert.equal(table, 'careers'); return { select: fields => { assert.equal(fields, 'id, name'); return { order: async field => { assert.equal(field, 'name'); return { data: [{ id: 1, name: 'Web Developer' }], error: careerError }; } }; } }; },
  };
  const source = fs.readFileSync('src/services/profileAccountService.js', 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export async function/g, 'async function');
  const context = vm.createContext({ supabase });
  vm.runInContext(`${source}\nthis.api = { getAccountEmail, requestEmailChange, getCareerOptions };`, context);
  return { api: context.api, calls };
}
test('email request rejects blank, invalid, unchanged addresses before update', async () => {
  const { api, calls } = setup();
  for (const value of ['', 'bad', 'OLD@example.com']) await assert.rejects(api.requestEmailChange(value));
  assert.equal(calls.length, 0);
});
test('email request only sends Auth update and retains current confirmed email', async () => {
  const { api, calls } = setup();
  await api.requestEmailChange(' new@example.com ');
  assert.equal(calls[0].email, 'new@example.com');
  assert.equal(await api.getAccountEmail(), 'old@example.com');
});
test('account service surfaces authentication and email update errors', async () => {
  await assert.rejects(setup({ user: null }).api.getAccountEmail(), /sign in/i);
  await assert.rejects(setup({ error: { message: 'Offline' } }).api.getAccountEmail(), /Offline/);
  await assert.rejects(setup({ updateError: { message: 'Rate limited' } }).api.requestEmailChange('new@example.com'), /Rate limited/);
});
test('career lookup returns shared catalog and propagates failures', async () => {
  assert.equal((await setup().api.getCareerOptions())[0].name, 'Web Developer');
  await assert.rejects(setup({ careerError: { message: 'Unavailable' } }).api.getCareerOptions(), /Unavailable/);
});
