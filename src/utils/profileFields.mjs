export const PROGRAM = 'Bachelor of Science in Information Technology';
export const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const PROFILE_FIELDS = ['username', 'first_name', 'middle_name', 'last_name', 'student_id', 'academic_year', 'program', 'department', 'position', 'career_target'];

export function normalizeProgram(value = '') {
  const text = String(value ?? '').trim();
  return text.toUpperCase() === 'BSIT' ? PROGRAM : text;
}

export function validateProfileFields(values, careerNames) {
  if (values.program && normalizeProgram(values.program) !== PROGRAM) return 'Choose a program from the dropdown.';
  if (values.academic_year && !ACADEMIC_YEARS.includes(values.academic_year)) return 'Choose an academic year from the dropdown.';
  if (values.career_target && careerNames !== null && !careerNames.includes(values.career_target)) return 'Choose a career goal from the dropdown.';
  return null;
}

export function serializeProfile(values, selections) {
  return {
    ...Object.fromEntries(PROFILE_FIELDS.map(key => [key, String(values[key] || '').trim()])),
    program: normalizeProgram(values.program),
    interests: [...selections.interests], technologies: [...selections.technologies],
  };
}

export function validateProfilePhoto(asset, byteSize) {
  const type = asset?.mimeType?.toLowerCase();
  const name = asset?.fileName || asset?.uri || '';
  if (type ? !['image/png', 'image/jpeg'].includes(type) : !/\.(png|jpe?g)(?:[?#].*)?$/i.test(name)) {
    return 'Choose a PNG or JPG/JPEG image.';
  }
  if (!Number.isFinite(byteSize) || byteSize <= 0) return 'Unable to read this photo. Please choose another image.';
  if (byteSize > MAX_PHOTO_BYTES) return 'Choose a photo no larger than 2 MB.';
  return null;
}
