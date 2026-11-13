import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from './handler.mjs';

const questions = { questions: Array.from({ length: 20 }, (_, i) => ({ question: `Describe project ${i}.`, category: 'Behavioral' })) };
const feedback = { score: 7, summary: 'Clear answer.', strengths: ['Relevant'], improvements: ['Add evidence'], sampleAnswer: 'In [your project], I used...' };
const analysis = { isResume: true, score: 75, summary: 'Strong project experience.', strengths: ['Clear projects'], improvements: ['Quantify outcomes'], missingSections: [], skills: ['JavaScript'], suggestedRoles: ['Junior web developer'], exampleBullet: 'Built a website using JavaScript for [number] users.' };
const pdfBase64 = btoa('%PDF-1.7\nminimal test fixture');

function setup(overrides = {}) {
  const calls = [];
  let aiAttempt = 0;
  const env = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_ANON_KEY: 'public-key', SUPABASE_SERVICE_ROLE_KEY: 'service-secret', GEMINI_API_KEY: 'gemini-secret', ...overrides.env };
  const handler = createHandler({ env: name => env[name], now: overrides.now, fetch: async (url, options) => {
    calls.push({ url, options });
    if (overrides.networkFailure) throw new Error('private upstream details');
    let data;
    let status = 200;
    if (url.includes('/auth/')) { data = { id: 'verified-user' }; status = overrides.authStatus || 200; }
    else if (url.includes('/profiles?')) { data = overrides.noProfile ? [] : [{ program: 'BSIT', career_target: 'Web developer', interests: ['Coding'], technologies: ['JavaScript'], first_name: 'PRIVATE NAME', student_id: 'PRIVATE ID', ...overrides.profile }]; status = overrides.profileStatus || 200; }
    else if (url.includes('/rpc/')) { data = overrides.quota ?? true; status = overrides.quotaStatus || 200; }
    else {
      data = overrides.response || { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(overrides.value || questions) }] } }] };
      status = overrides.aiStatuses?.[aiAttempt++] ?? overrides.aiStatus ?? 200;
    }
    return new Response(JSON.stringify(data), { status });
  } });
  const send = (body = { action: 'interview_questions' }, authorization = 'Bearer user-token', extraHeaders = {}) => handler(new Request('https://local/career-ai-mobile', {
    method: 'POST', headers: { ...(authorization ? { Authorization: authorization } : {}), ...extraHeaders }, body: JSON.stringify(body),
  }));
  return { calls, send, handler };
}

test('missing or invalid bearer token never reaches a paid endpoint', async () => {
  for (const token of ['', 'Basic token', 'Bearer']) {
    const s = setup();
    assert.equal((await s.send({}, token)).status, 401);
    assert.equal(s.calls.length, 0);
  }
  const s = setup({ authStatus: 401 });
  assert.equal((await s.send()).status, 401);
  assert.equal(s.calls.length, 1);
});
test('methods and missing server configuration fail closed', async () => {
  const s = setup();
  assert.equal((await s.handler(new Request('https://local', { method: 'GET' }))).status, 405);
  assert.equal((await s.handler(new Request('https://local', { method: 'OPTIONS' }))).status, 204);
  const missing = setup({ env: { GEMINI_API_KEY: '' } });
  assert.equal((await missing.send()).status, 503);
  assert.equal(missing.calls.length, 0);
});
test('question generation scopes profile and quota to the verified user and excludes identifiers', async () => {
  const s = setup();
  assert.deepEqual(await (await s.send({ action: 'interview_questions', userId: 'attacker' })).json(), questions);
  assert.match(s.calls[1].url, /id=eq.verified-user$/);
  assert.equal(s.calls[1].options.headers.Authorization, 'Bearer user-token');
  assert.equal(s.calls[2].options.headers.Authorization, 'Bearer service-secret');
  assert.deepEqual(JSON.parse(s.calls[2].options.body), { p_user_id: 'verified-user', p_kind: 'interview' });
  const ai = s.calls[3];
  const body = JSON.parse(ai.options.body);
  assert.equal(ai.options.headers['x-goog-api-key'], 'gemini-secret');
  assert.equal(ai.options.headers.Authorization, undefined);
  assert.doesNotMatch(ai.url, /gemini-secret/);
  assert.match(ai.url, /models\/gemini-3.5-flash-lite:generateContent$/);
  assert.equal(body.generationConfig.responseMimeType, 'application/json');
  assert.equal(body.generationConfig.responseJsonSchema.properties.questions.minItems, 20);
  assert.equal(JSON.parse(body.contents[0].parts[0].text).profile.program, 'BSIT');
  assert.doesNotMatch(ai.options.body, /PRIVATE NAME|PRIVATE ID|service-secret|user-token/);
});
test('feedback sends the actual answer and returns validated coaching', async () => {
  const s = setup({ value: feedback });
  assert.deepEqual(await (await s.send({ action: 'interview_feedback', question: 'Tell me about a project', answer: 'I built a website.' })).json(), feedback);
  assert.equal(JSON.parse(JSON.parse(s.calls[3].options.body).contents[0].parts[0].text).answer, 'I built a website.');
});

test('career assessment sends one complete set and rejects incomplete or duplicated area results', async () => {
  const answers = Array.from({ length: 20 }, (_, i) => ({ question: `Question ${i + 1}?`, answer: `Answer ${i + 1}` }));
  const ids = ['programming', 'web', 'database', 'networking', 'security', 'systems', 'integration', 'quality', 'analysis', 'support'];
  const value = { areas: ids.map((area, i) => ({ area, level: 'demonstrated', evidence: [i + 1], note: 'Relevant explanation.' })) };
  const s = setup({ value });
  assert.deepEqual(await (await s.send({ action: 'career_assessment', answers })).json(), value);
  const sent = JSON.parse(JSON.parse(s.calls[3].options.body).contents[0].parts[0].text);
  assert.equal(sent.answers.length, 20);
  assert.equal(sent.answers[19].number, 20);
  const invalid = setup();
  assert.equal((await invalid.send({ action: 'career_assessment', answers: answers.slice(1) })).status, 400);
  assert.ok(invalid.calls.every(call => !call.url.includes('generativelanguage.googleapis.com')));
  const duplicate = setup({ value: { areas: [...value.areas.slice(0, 9), value.areas[0]] } });
  assert.equal((await duplicate.send({ action: 'career_assessment', answers })).status, 502);
});
test('resume sends the actual PDF inline without creating persistent file storage', async () => {
  const s = setup({ value: analysis });
  assert.deepEqual(await (await s.send({ action: 'resume_analysis', filename: 'sample.pdf', pdfBase64 })).json(), analysis);
  const body = JSON.parse(s.calls[3].options.body);
  assert.deepEqual(body.contents[0].parts[1], { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } });
  assert.equal(JSON.parse(s.calls[2].options.body).p_kind, 'resume');
  assert.equal(s.calls.length, 4);
});
test('unrelated document gets an honest document warning response', async () => {
  const value = { ...analysis, isResume: false, score: 0, summary: 'This is an invoice, not a resume.', strengths: [], improvements: [], missingSections: [], skills: [], suggestedRoles: [], exampleBullet: 'Not available for this document.' };
  const s = setup({ value });
  assert.deepEqual(await (await s.send({ action: 'resume_analysis', filename: 'invoice.pdf', pdfBase64 })).json(), value);
});
test('invalid actions, inputs, profile, and quota never call Gemini', async () => {
  for (const [overrides, body, status] of [
    [{}, { action: 'constructor' }, 400],
    [{}, { action: 'interview_feedback', question: 'Q', answer: '' }, 400],
    [{}, { action: 'interview_feedback', question: 'Q', answer: 'a'.repeat(6001) }, 400],
    [{}, { action: 'resume_analysis', filename: 'file.txt', pdfBase64 }, 400],
    [{}, { action: 'resume_analysis', filename: 'file.pdf', pdfBase64: btoa('not a PDF') }, 400],
    [{}, { action: 'resume_analysis', filename: 'file.pdf', pdfBase64: '%%%broken%%%' }, 400],
    [{ profile: { program: '' } }, { action: 'interview_questions' }, 400],
    [{ noProfile: true }, { action: 'interview_questions' }, 400],
    [{ quota: false }, { action: 'interview_questions' }, 429],
    [{ quotaStatus: 404 }, { action: 'interview_questions' }, 503],
    [{ profileStatus: 403 }, { action: 'interview_questions' }, 503],
  ]) {
    const s = setup(overrides);
    assert.equal((await s.send(body)).status, status);
    assert.ok(s.calls.every(call => !call.url.includes('generativelanguage.googleapis.com')));
  }
});

test('daily app limit reports the next UTC reset as a Philippine date and time', async () => {
  const before = setup({ quota: false, now: () => new Date('2026-11-13T23:59:00Z') });
  const first = await before.send({ action: 'interview_feedback', question: 'Q', answer: 'A' });
  assert.equal(first.status, 429);
  assert.match((await first.json()).error, /Nov 14, 2026.*8:00 AM.*Philippine time/i);

  const after = setup({ quota: false, now: () => new Date('2026-11-14T00:00:00Z') });
  const second = await after.send({ action: 'interview_feedback', question: 'Q', answer: 'A' });
  assert.equal(second.status, 429);
  assert.match((await second.json()).error, /Nov 15, 2026.*8:00 AM.*Philippine time/i);
  assert.ok(before.calls.every(call => !call.url.includes('generativelanguage.googleapis.com')));
  assert.ok(after.calls.every(call => !call.url.includes('generativelanguage.googleapis.com')));
});
test('oversized and malformed payloads are rejected before quota or Gemini', async () => {
  const s = setup();
  assert.equal((await s.send({ action: 'interview_questions' }, 'Bearer user-token', { 'content-length': '20000000' })).status, 413);
  const malformed = await s.handler(new Request('https://local', { method: 'POST', headers: { Authorization: 'Bearer token' }, body: 'not JSON' }));
  assert.equal(malformed.status, 400);
  assert.ok(s.calls.every(call => call.url.includes('/auth/')));
});
test('upstream errors and invalid model outputs never become demo results or leak secrets', async () => {
  for (const [overrides, status] of [
    [{ aiStatus: 429 }, 429], [{ aiStatus: 401 }, 503], [{ aiStatus: 403 }, 503], [{ aiStatus: 404 }, 503], [{ aiStatus: 500 }, 503],
    [{ response: { promptFeedback: { blockReason: 'SAFETY' } } }, 422],
    [{ response: { candidates: [] } }, 502],
    [{ response: { candidates: [{ finishReason: 'MAX_TOKENS' }] } }, 502],
    [{ response: { candidates: [{ finishReason: 'SAFETY' }] } }, 422],
    [{ response: { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'not JSON' }] } }] } }, 502],
    [{ value: { questions: [] } }, 502], [{ value: { ...questions, extra: true } }, 502],
    [{ networkFailure: true }, 503],
  ]) {
    const response = await setup(overrides).send();
    assert.equal(response.status, status);
    assert.doesNotMatch(JSON.stringify(await response.json()), /gemini-secret|service-secret|private upstream/);
  }
});

test('Gemini failure messages distinguish billing, unsupported requests, and server errors without leaking upstream details', async () => {
  for (const [status, expected] of [
    [402, /billing.*HTTP 402/i],
    [501, /does not support.*HTTP 501/i],
    [500, /temporarily unavailable.*HTTP 500/i],
    [503, /temporarily unavailable.*HTTP 503/i],
  ]) {
    const response = await setup({ aiStatus: status, response: { error: { message: 'PRIVATE UPSTREAM DETAILS' } } }).send();
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.match(body.error, expected);
    assert.doesNotMatch(JSON.stringify(body), /PRIVATE UPSTREAM DETAILS/);
  }
});

test('question generation falls back to another model after HTTP 503 without consuming the app quota twice', async () => {
  const s = setup({ aiStatuses: [503, 200] });
  const response = await s.send();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), questions);
  assert.equal(s.calls.filter(call => call.url.includes('/rpc/')).length, 1);
  const aiCalls = s.calls.filter(call => call.url.includes('generativelanguage.googleapis.com'));
  assert.equal(aiCalls.length, 2);
  assert.match(aiCalls[0].url, /models\/gemini-3\.5-flash-lite:generateContent$/);
  assert.match(aiCalls[1].url, /models\/gemini-3\.8-flash:generateContent$/);
});

test('feedback falls back to another model after HTTP 503', async () => {
  const s = setup({ aiStatuses: [503, 200], value: feedback });
  const response = await s.send({ action: 'interview_feedback', question: 'Tell me about a project', answer: 'I built a website.' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), feedback);
  const aiCalls = s.calls.filter(call => call.url.includes('generativelanguage.googleapis.com'));
  assert.equal(aiCalls.length, 2);
  assert.match(aiCalls[1].url, /models\/gemini-3\.8-flash:generateContent$/);
});

test('question generation stops after one fallback when both models return HTTP 503', async () => {
  const s = setup({ aiStatuses: [503, 503, 200] });
  const response = await s.send();
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /HTTP 503/);
  const aiCalls = s.calls.filter(call => call.url.includes('generativelanguage.googleapis.com'));
  assert.equal(aiCalls.length, 2);
  assert.match(aiCalls[1].url, /models\/gemini-3\.8-flash:generateContent$/);
});

test('quota errors do not trigger a second model request', async () => {
  const s = setup({ aiStatuses: [429, 200] });
  const response = await s.send({ action: 'interview_feedback', question: 'Q', answer: 'A' });
  assert.equal(response.status, 429);
  assert.equal(s.calls.filter(call => call.url.includes('generativelanguage.googleapis.com')).length, 1);
});

test('the full 10 MB PDF limit works and an extra byte is rejected', async () => {
  const bytes = new Uint8Array(10 * 1024 * 1024 + 1).fill(32);
  bytes.set(new TextEncoder().encode('%PDF-1.7'));
  const s = setup({ value: analysis });
  const exact = Buffer.from(bytes.subarray(0, bytes.length - 1)).toString('base64');
  assert.equal((await s.send({ action: 'resume_analysis', filename: 'resume.pdf', pdfBase64: exact })).status, 200);
  const oversized = setup();
  assert.equal((await oversized.send({ action: 'resume_analysis', filename: 'resume.pdf', pdfBase64: Buffer.from(bytes).toString('base64') })).status, 400);
  assert.ok(oversized.calls.every(call => !call.url.includes('generativelanguage.googleapis.com')));
});

test('thought parts are excluded and supported schema constraints are sent to Gemini', async () => {
  const s = setup({ response: { candidates: [{ finishReason: 'STOP', content: { parts: [
    { thought: true, text: 'private reasoning summary' }, { text: JSON.stringify(questions) },
  ] } }] } });
  assert.deepEqual(await (await s.send()).json(), questions);
  const schema = JSON.parse(s.calls[3].options.body).generationConfig.responseJsonSchema;
  assert.equal(schema.properties.questions.items.properties.question.maxLength, undefined);
  assert.equal(schema.properties.questions.maxItems, 20);
});

test('invalid API keys are reported as setup errors, not blamed on a resume PDF', async () => {
  const s = setup({ aiStatus: 400, response: { error: { message: 'API key not valid. gemini-secret' } } });
  const response = await s.send({ action: 'resume_analysis', filename: 'resume.pdf', pdfBase64 });
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /setup needs attention/);
});
