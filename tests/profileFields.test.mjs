import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProgram, validateProfileFields, validateProfilePhoto, serializeProfile } from '../src/utils/profileFields.mjs';

test('profile fields normalize BSIT and retain unsupported values for correction', () => {
  assert.equal(normalizeProgram(' BSIT '), 'Bachelor of Science in Information Technology');
  assert.equal(normalizeProgram('Other'), 'Other');
  assert.equal(normalizeProgram(null), '');
  assert.match(validateProfileFields({ program: 'Other' }, null), /program/i);
  assert.match(validateProfileFields({ academic_year: '5th Year' }, null), /academic year/i);
  for (const academic_year of ['', '1st Year', '2nd Year', '3rd Year', '4th Year']) {
    assert.equal(validateProfileFields({ academic_year }, null), null);
  }
});
test('career load failure preserves goal; loaded catalog validates it', () => {
  assert.equal(validateProfileFields({ career_target: 'Old role' }, null), null);
  assert.match(validateProfileFields({ career_target: 'Old role' }, ['Web Developer']), /career/i);
  assert.equal(validateProfileFields({ career_target: 'Web Developer' }, ['Web Developer']), null);
});
test('serialization includes academic year and additional fields without arbitrary profile writes', () => {
  const result = serializeProfile({ first_name: ' Jane ', academic_year: '2nd Year', program: 'BSIT', username: 'jane', department: 'IT', position: 'Student', role: 'admin' }, { interests: ['Networking'], technologies: ['Git'] });
  assert.equal(result.first_name, 'Jane');
  assert.equal(result.academic_year, '2nd Year');
  assert.equal(result.department, 'IT');
  assert.equal(result.position, 'Student');
  assert.equal(result.role, undefined);
  assert.deepEqual(result.technologies, ['Git']);
});
test('photos accept only PNG/JPEG and readable sizes up to 2 MB', () => {
  assert.equal(validateProfilePhoto({ mimeType: 'image/png' }, 2097152), null);
  assert.equal(validateProfilePhoto({ uri: 'file:///photo.jpg' }, 10), null);
  assert.match(validateProfilePhoto({ mimeType: 'image/jpeg' }, 2097153), /2 MB/);
  assert.match(validateProfilePhoto({ mimeType: 'image/gif', uri: 'file:///fake.jpg' }, 100), /PNG/);
  assert.match(validateProfilePhoto({ mimeType: 'image/jpeg' }, 0), /read/i);
});
