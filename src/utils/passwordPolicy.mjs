export function passwordRequirementError(password) {
  if (typeof password !== 'string' || password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[a-z]/.test(password)) return 'Password needs at least one lowercase letter.';
  if (!/[A-Z]/.test(password)) return 'Password needs at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Password needs at least one number.';
  if (!/[^A-Za-z0-9\s]/.test(password)) return 'Password needs at least one special character.';
  return null;
}
