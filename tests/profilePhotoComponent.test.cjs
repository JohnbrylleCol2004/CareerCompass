const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const babel = require('@babel/core');

function setup({ failedPreview = false } = {}) {
  const asset = { uri: 'file:///chosen.jpg', mimeType: 'image/jpeg' };
  const states = ['https://saved-photo.example/image.jpg', false, failedPreview, null, failedPreview ? asset : null];
  let index = 0;
  let actions;
  const writes = [];
  const focusEffects = [];
  let foreground;
  let remotePath = 'user1/from-web.png';
  let remoteError = null;
  const source = fs.readFileSync('src/components/ProfilePhoto.js', 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace('export default function', 'function');
  const { code } = babel.transformSync(source, { configFile: false, babelrc: false, plugins: ['@babel/plugin-transform-react-jsx'] });
  const context = vm.createContext({
    React: { createElement: (type, props, ...children) => ({ type, props, children }) },
    useState: initial => { const slot = index++; if (states[slot] === undefined) states[slot] = initial; return [states[slot], value => { states[slot] = value; }]; },
    useRef: value => ({ current: value }), useCallback: fn => fn, useEffect: () => {}, useFocusEffect: fn => focusEffects.push(fn),
    useAuth: () => ({ user: { id: 'user1', profile_image_path: 'saved.jpg' }, updateProfile: async value => writes.push(value) }),
    useNetwork: () => ({ requireConnection: () => true }), useFonts: () => [true], useCameraPermissions: () => [null, async () => ({ granted: true })], useIsFocused: () => true,
    ImagePicker: { launchImageLibraryAsync: async () => ({ assets: [asset] }) },
    checkProfilePhoto: async () => {}, uploadProfilePhoto: async () => { writes.push('upload'); return 'uploaded.jpg'; },
    getProfilePhotoPath: async id => { assert.equal(id, 'user1'); if (remoteError) throw remoteError; return remotePath; },
    getProfilePhotoUrl: async path => path ? `https://saved-photo.example/${path}` : null,
    AppState: { addEventListener: (_event, callback) => { foreground = callback; return { remove: () => {} }; } },
    setInterval: () => 1, clearInterval: () => {},
    Alert: { alert: (_title, _message, buttons) => { actions = buttons; } },
    View: 'View', Text: 'Text', Image: 'Image', TouchableOpacity: 'TouchableOpacity', Modal: 'Modal', ActivityIndicator: 'ActivityIndicator',
    PrimaryButton: 'PrimaryButton', ProfileCamera: 'ProfileCamera', Ionicons: 'Ionicons', Linking: {},
    StyleSheet: { create: value => value }, colors: {},
  });
  vm.runInContext(`${code}\nthis.render = ProfilePhoto;`, context);
  return { render: () => { index = 0; return context.render({ explicitUpload: true }); }, states, writes,
    gallery: () => actions.find(item => item.text === 'Choose from Gallery').onPress(),
    focus: () => focusEffects.map(effect => effect()),
    resume: () => foreground('active'), changeRemotePath: path => { remotePath = path; },
    failRefresh: () => { remoteError = new Error('Offline'); },
  };
}
function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return null;
  if (predicate(tree)) return tree;
  return (tree.children || []).flat(Infinity).map(child => find(child, predicate)).find(Boolean);
}
const button = (tree, title) => find(tree, node => node.props?.title === title);

test('canceling a failed preview restores the saved image', () => {
  const app = setup({ failedPreview: true });
  button(app.render(), 'Cancel Selection').props.onPress();
  const image = find(app.render(), node => node.type === 'Image');
  assert.equal(image?.props.source.uri, 'https://saved-photo.example/image.jpg');
  assert.deepEqual(app.writes, []);
});
test('choosing a picture only previews it until explicit upload', async () => {
  const app = setup();
  button(app.render(), 'Choose Profile Picture').props.onPress();
  await app.gallery();
  assert.equal(app.states[4].uri, 'file:///chosen.jpg');
  assert.deepEqual(app.writes, []);
  await button(app.render(), 'Upload Picture').props.onPress();
  assert.equal(app.writes[0], 'upload');
  assert.equal(app.writes[1].profile_image_path, 'uploaded.jpg');
  assert.equal(app.states[4], null);
});
test('profile focus and app resume load the latest photo saved by the web app', async () => {
  const app = setup();
  app.render();
  app.focus();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(app.states[0], 'https://saved-photo.example/user1/from-web.png');
  app.changeRemotePath('user1/newer-web.png');
  app.resume();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(app.states[0], 'https://saved-photo.example/user1/newer-web.png');
  app.changeRemotePath(null);
  app.resume();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(app.states[0], null);
});
test('a failed remote refresh does not hide a valid pending local preview', async () => {
  const app = setup();
  button(app.render(), 'Choose Profile Picture').props.onPress();
  await app.gallery();
  app.failRefresh();
  app.focus();
  await new Promise(resolve => setImmediate(resolve));
  const image = find(app.render(), node => node.type === 'Image');
  assert.equal(image?.props.source.uri, 'file:///chosen.jpg');
  assert.deepEqual(app.writes, []);
});
