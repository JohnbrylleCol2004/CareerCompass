const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const babel = require('@babel/core');
function render(disabled, onValueChange) {
  const source = fs.readFileSync('src/components/ProfileSelect.js', 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace('export default function', 'function');
  const { code } = babel.transformSync(source, { configFile: false, babelrc: false, plugins: ['@babel/plugin-transform-react-jsx'] });
  const context = vm.createContext({ React: { createElement: (type, props, ...children) => ({ type, props, children }) },
    View: 'View', Text: 'Text', Picker: Object.assign(function Picker() {}, { Item: 'Item' }), StyleSheet: { create: x => x }, colors: {},
  });
  vm.runInContext(`${code}\nthis.render = ProfileSelect;`, context);
  return context.render({ label: 'Goal', value: 'Old goal', options: ['Web Developer'], placeholder: 'Select', disabled, onValueChange });
}
function picker(tree) {
  if (typeof tree.type === 'function') return tree;
  return tree.children.flat().filter(Boolean).map(child => typeof child === 'object' ? picker(child) : null).find(Boolean);
}
test('disabled selection never changes value even when native picker sends an event', () => {
  const calls = [];
  picker(render(true, value => calls.push(value))).props.onValueChange('Web Developer');
  assert.deepEqual(calls, []);
});
test('enabled selection delivers the chosen value and preserves a legacy choice visibly', () => {
  const calls = [];
  const element = picker(render(false, value => calls.push(value)));
  element.props.onValueChange('Web Developer');
  assert.deepEqual(calls, ['Web Developer']);
  assert.equal(element.props.selectedValue, 'Old goal');
  assert.ok(element.children.flat().some(child => child?.props?.value === 'Old goal'));
});
