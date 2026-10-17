const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { decode } = require('base64-arraybuffer');

function setup({ file = '%PDF-1.7\nsample resume', invokeError = null, exists = true } = {}) {
  const calls = [];
  const base64 = Buffer.from(file).toString('base64');
  const context = vm.createContext({
    Uint8Array, decode,
    FileSystem: {
      EncodingType: { Base64: 'base64' },
      getInfoAsync: async () => ({ exists, size: Buffer.byteLength(file) }),
      readAsStringAsync: async uri => { calls.push(['read', uri]); return base64; },
    },
    supabase: { functions: { invoke: async (name, options) => {
      calls.push(['invoke', name, options]);
      return { data: invokeError ? null : { isResume: true, score: 60 }, error: invokeError };
    } } },
  });
  const strip = source => source.replace(/^import .*;\r?\n/gm, '')
    .replace(/export (async function|function|const)/g, '$1');
  vm.runInContext(`${strip(fs.readFileSync('src/utils/resumePdf.js', 'utf8'))}\n${strip(fs.readFileSync('src/services/careerAiService.js', 'utf8'))}\nthis.api = { analyzeResumePdf, requestCareerAi };`, context);
  return { api: context.api, calls, base64 };
}

test('mobile resume service reads the chosen URI and sends its bytes to the protected function', async () => {
  const { api, calls, base64 } = setup();
  assert.equal((await api.analyzeResumePdf({ name: 'my-resume.pdf', size: 100, uri: 'file:///app-cache/resume.pdf' })).score, 60);
  assert.equal(calls[0][1], 'file:///app-cache/resume.pdf');
  const [, name, options] = calls[1];
  assert.equal(name, 'career-ai');
  assert.equal(options.body.pdfBase64, base64);
  assert.equal(options.timeout, 90000);
});
test('invalid or missing local files never make an AI request', async () => {
  for (const overrides of [{ exists: false }, { file: 'not a PDF' }]) {
    const { api, calls } = setup(overrides);
    await assert.rejects(api.analyzeResumePdf({ name: 'resume.pdf', size: 100, uri: 'file:///resume.pdf' }));
    assert.ok(!calls.some(item => item[0] === 'invoke'));
  }
});
test('server configuration errors are shown instead of returning demo feedback', async () => {
  const { api } = setup({ invokeError: { context: { json: async () => ({ error: 'AI setup is not complete.' }) } } });
  await assert.rejects(api.requestCareerAi({ action: 'interview_questions' }), /AI setup is not complete/);
});
