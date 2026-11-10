import test from 'node:test';
import assert from 'node:assert/strict';
import { passwordRequirementError } from '../src/utils/passwordPolicy.mjs';

test('registration passwords require length, lowercase, uppercase, number, and special character', () => {
  assert.equal(passwordRequirementError('ValidPass1!'), null);
  assert.match(passwordRequirementError('Ab1!'), /8 characters/);
  assert.match(passwordRequirementError('UPPERCASE1!'), /lowercase/);
  assert.match(passwordRequirementError('lowercase1!'), /uppercase/);
  assert.match(passwordRequirementError('NoNumber!'), /number/);
  assert.match(passwordRequirementError('NoSpecial1'), /special character/);
});
