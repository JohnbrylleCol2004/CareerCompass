const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const form = { email: 'student@example.com', password: 'example-password', username: 'student',
  firstName: 'Test', lastName: 'Student', studentId: '123', program: 'BSIT' };
const metadata = { username: 'student', first_name: 'Test', last_name: 'Student', student_id: '123', program: 'BSIT' };
function setup({ session = null, existing = null, pending = metadata, saveError = null } = {}) {
  const calls = [];
  const user = { id: 'auth-user', user_metadata: { career_compass_profile: pending } };
  const query = {
    select() { return this; }, eq() { return this; },
    maybeSingle: async () => ({ data: existing, error: null }),
    upsert(profile) { calls.push(['save', profile]); return this; },
    single: async () => ({ data: calls.find(item => item[0] === 'save')?.[1], error: saveError }),
  };
  const supabase = {
    auth: {
      signUp: async input => { calls.push(['signup', input]); return { data: { user, session }, error: null }; },
      signInWithPassword: async () => ({ data: { user, session: {} }, error: null }),
    },
    from: () => { calls.push(['database']); return query; },
  };
  const source = fs.readFileSync('src/services/authService.js', 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace(/export async function/g, 'async function');
  const context = vm.createContext({ supabase, AsyncStorage: { setItem: async () => {} } });
  vm.runInContext(`${source}\nthis.api = { register, login };`, context);
  return { api: context.api, calls };
}

test('email confirmation saves form metadata without an unauthenticated profile write', async () => {
  const { api, calls } = setup();
  assert.equal((await api.register(form)).requiresEmailConfirmation, true);
  assert.ok(!calls.some(item => item[0] === 'database'));
  const signup = calls[0][1];
  assert.equal(signup.options.data.career_compass_profile.program, 'BSIT');
  assert.equal(signup.options.data.career_compass_profile.password, undefined);
});
test('registration with a session writes the authenticated profile ID', async () => {
  const { api } = setup({ session: {} });
  assert.equal((await api.register(form)).id, 'auth-user');
});
test('first login creates pending profile and ignores a metadata ID or role', async () => {
  const { api, calls } = setup({ pending: { ...metadata, id: 'another-user', role: 'admin' } });
  const profile = await api.login(form.email, form.password);
  assert.equal(profile.id, 'auth-user');
  assert.equal(profile.role, undefined);
  assert.equal(calls.filter(item => item[0] === 'save').length, 1);
});
test('existing profile is preserved on later logins', async () => {
  const { api, calls } = setup({ existing: { id: 'auth-user', program: 'Updated course' } });
  assert.equal((await api.login(form.email, form.password)).program, 'Updated course');
  assert.ok(!calls.some(item => item[0] === 'save'));
});
test('RLS failures explain that the account already exists', async () => {
  const { api } = setup({ session: {}, saveError: { code: '42501', message: 'RLS' } });
  await assert.rejects(api.register(form), /account exists.*profile access is blocked/);
});
test('older accounts without profile metadata get a recovery message', async () => {
  const { api } = setup({ pending: null });
  await assert.rejects(api.login(form.email, form.password), /restore your profile/);
});
