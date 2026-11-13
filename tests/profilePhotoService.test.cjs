const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
async function setup({ size = 100, encodedSize = 100, uploadError = null, user = { id: 'user1' }, avatarMissing = false, profileError = null } = {}) {
  const policy = await import('../src/utils/profileFields.mjs');
  const calls = [];
  const buckets = [];
  const supabase = { auth: { getUser: async () => ({ data: { user } }) },
    from: table => { assert.equal(table, 'profiles'); return { select: column => { assert.equal(column, 'profile_image_path'); return { eq: (key, id) => { assert.equal(key, 'id'); assert.equal(id, 'user1'); return { single: async () => ({ data: { profile_image_path: 'user1/from-web.png' }, error: profileError }) }; } }; } }; },
    storage: { from: bucket => { buckets.push(bucket); return {
      upload: async (...args) => { calls.push(args); return { error: uploadError }; },
      createSignedUrl: async (path, expiry) => { assert.equal(expiry, 3600); return avatarMissing && bucket === 'avatars' ? { error: { message: 'Object not found' } } : { data: { signedUrl: `https://storage/${bucket}/${path}` } }; },
    }; } },
  };
  const source = fs.readFileSync('src/services/profilePhotoService.js', 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export async function/g, 'async function');
  const context = vm.createContext({ ...policy, supabase, File: class { size = size; }, Platform: { OS: 'android' },
    decode: () => new ArrayBuffer(encodedSize), SaveFormat: { JPEG: 'jpeg' },
    ImageManipulator: { manipulate: () => ({ resize: () => {}, renderAsync: async () => ({ saveAsync: async () => ({ base64: 'encoded' }) }) }) },
  });
  vm.runInContext(`${source}\nthis.api = { uploadProfilePhoto, getProfilePhotoUrl, getProfilePhotoPath };`, context);
  return { api: context.api, calls, buckets };
}
const asset = { uri: 'file:///photo.jpg', mimeType: 'image/jpeg', width: 500, height: 500 };
test('photo service rejects oversized source and unsupported format before storage', async () => {
  const big = await setup({ size: 2097153 });
  await assert.rejects(big.api.uploadProfilePhoto(asset), /2 MB/);
  assert.equal(big.calls.length, 0);
  const gif = await setup();
  await assert.rejects(gif.api.uploadProfilePhoto({ ...asset, mimeType: 'image/gif' }), /PNG/);
  assert.equal(gif.calls.length, 0);
});
test('photo service checks processed bytes and authentication', async () => {
  await assert.rejects((await setup({ encodedSize: 2097153 })).api.uploadProfilePhoto(asset), /2 MB/);
  await assert.rejects((await setup({ user: null })).api.uploadProfilePhoto(asset), /sign in/i);
});
test('photo service uploads JPEG in authenticated folder and propagates failure', async () => {
  const { api, calls, buckets } = await setup();
  assert.match(await api.uploadProfilePhoto(asset), /^user1\/.+\.jpg$/);
  assert.equal(calls[0][2].contentType, 'image/jpeg');
  assert.deepEqual(buckets, ['avatars']);
  await assert.rejects((await setup({ uploadError: { message: 'Storage unavailable' } })).api.uploadProfilePhoto(asset), /Storage unavailable/);
});
test('web photos resolve from the shared avatars bucket; old mobile photos retain fallback', async () => {
  const shared = await setup();
  assert.equal(await shared.api.getProfilePhotoUrl('user1/from-web.png'), 'https://storage/avatars/user1/from-web.png');
  const old = await setup({ avatarMissing: true });
  assert.equal(await old.api.getProfilePhotoUrl('user1/old.jpg'), 'https://storage/profile-photos/user1/old.jpg');
  assert.deepEqual(old.buckets, ['avatars', 'profile-photos']);
  assert.equal(await old.api.getProfilePhotoUrl(null), null);
});
test('photo refresh reads the latest shared profile path and surfaces errors', async () => {
  assert.equal(await (await setup()).api.getProfilePhotoPath('user1'), 'user1/from-web.png');
  await assert.rejects((await setup({ profileError: { message: 'Offline' } })).api.getProfilePhotoPath('user1'), /Offline/);
});
