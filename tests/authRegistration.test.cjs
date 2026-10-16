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
    single: async () => ({ data: { ...existing, ...calls.find(item => item[0] === 'save')?.[1] }, error: saveError }),
  };
  const supabase = {
    auth: {
      signUp: async input => { calls.push(['signup', input]); return { data: { user, session }, error: null }; },
      signInWithPassword: async () => ({ data: { user, session: {} }, error: null }),
      getSession: async () => ({ data: { session: { user } } }),
    },
    from: () => { calls.push(['database']); return query; },
  };
  const source = fs.readFileSync('src/services/authService.js', 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace(/export async function/g, 'async function');
  const context = vm.createContext({ supabase, AsyncStorage: { setItem: async () => {} } });
  vm.runInContext(`${source}\nthis.api = { register, login, getCurrentUser };`, context);
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
  const { api, calls } = setup({ existing: { ...metadata, id: 'auth-user', program: 'Updated course' } });
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

test('login fills an empty trigger-created profile from registration details', async () => {
  const { api } = setup({ existing: { id: 'auth-user', first_name: null, last_name: '', student_id: null, program: null },
    pending: { ...metadata, interests: ['Web Development'], technologies: ['JavaScript'] } });
  const profile = await api.login(form.email, form.password);
  assert.equal(profile.first_name, 'Test');
  assert.equal(profile.student_id, '123');
  assert.equal(profile.program, 'BSIT');
  assert.equal(profile.technologies[0], 'JavaScript');
});

test('session restore repairs a placeholder while preserving existing edits and photo', async () => {
  const { api, calls } = setup({ existing: { id: 'auth-user', first_name: 'Updated name', program: '', profile_image_path: 'auth-user/photo.jpg' } });
  const profile = await api.getCurrentUser();
  assert.equal(profile.program, 'BSIT');
  assert.equal(profile.first_name, 'Updated name');
  assert.equal(profile.profile_image_path, 'auth-user/photo.jpg');
  assert.equal(calls.find(item => item[0] === 'save')[1].first_name, undefined);
});

test('completed profiles keep optional fields intentionally cleared after signup', async () => {
  const { api, calls } = setup({ existing: { ...metadata, career_target: '', interests: [] },
    pending: { ...metadata, career_target: 'Developer', interests: ['Coding'] } });
  const profile = await api.login(form.email, form.password);
  assert.equal(profile.career_target, '');
  assert.equal(profile.interests.length, 0);
  assert.ok(!calls.some(item => item[0] === 'save'));
});
