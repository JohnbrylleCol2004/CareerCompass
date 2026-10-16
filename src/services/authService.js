import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const SESSION_KEY = 'career_compass_session';

// REGISTER
export async function register(userData) {
  const { email, password } = userData;
  const profile = {
    username: userData.username.trim(),
    first_name: userData.firstName.trim(),
    middle_name: userData.middleName?.trim() || '',
    last_name: userData.lastName.trim(),
    student_id: userData.studentId.trim(),
    program: userData.program.trim(),
    department: userData.department?.trim() || '',
    position: userData.position?.trim() || '',
    career_target: userData.careerTarget?.trim() || '',
    interests: userData.interests || [],
    technologies: userData.technologies || [],
  };

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    // Preserve form data until email confirmation allows an authenticated insert.
    options: { data: { career_compass_profile: profile } },
  });
  if (authError) throw new Error(authError.message);
  if (!data.user) throw new Error('Registration failed.');
  if (!data.session) return { requiresEmailConfirmation: true };

  profile.id = data.user.id;

  const {
    data: savedProfile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();

  if (profileError) {
    throw profileSaveError(profileError);
  }

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(savedProfile)
  );

  return savedProfile;
}

// LOGIN
export async function login(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Login failed.');
  }

  const profile = await loadOrCreateProfile(data.user);

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(profile)
  );

  return profile;
}

function profileSaveError(error) {
  return new Error(error.code === '42501'
    ? 'Your account exists, but profile access is blocked. Ask the administrator to apply the profiles registration policies, then log in again.'
    : error.message);
}

async function loadOrCreateProfile(authUser) {
  const { data: existing, error } = await supabase.from('profiles')
    .select('*').eq('id', authUser.id).maybeSingle();
  if (error) throw profileSaveError(error);
  const pending = authUser.user_metadata?.career_compass_profile;
  const requiredFields = ['username', 'first_name', 'last_name', 'student_id', 'program'];
  const hasText = value => typeof value === 'string' && value.trim().length > 0;
  // An Auth trigger can create a placeholder row before the email is confirmed.
  // Repair it from registration metadata instead of treating its existence as completion.
  // Once required fields are complete, later edits (including cleared optional fields) win.
  if (existing && requiredFields.every(key => hasText(existing[key]))) return existing;
  if (!pending || typeof pending !== 'object') {
    if (existing) return existing;
    throw new Error('Your account exists but has no profile details. Ask the administrator to restore your profile. Do not register the same email again.');
  }
  // Metadata is user-editable: allow only profile fields, and take ID from Auth.
  const fields = ['username', 'first_name', 'middle_name', 'last_name', 'student_id',
    'program', 'department', 'position', 'career_target', 'interests', 'technologies'];
  const profile = Object.fromEntries(fields.filter(key => {
    const current = existing?.[key];
    const candidate = pending[key];
    return ['interests', 'technologies'].includes(key)
      ? (!current || (Array.isArray(current) && current.length === 0))
        && Array.isArray(candidate) && candidate.length > 0 && candidate.every(item => typeof item === 'string')
      : !hasText(current) && hasText(candidate);
  }).map(key => [key, pending[key]]));
  if (!existing && !requiredFields.every(key => hasText(profile[key]))) {
    throw new Error('Your account exists but has no profile details. Ask the administrator to restore your profile. Do not register the same email again.');
  }
  if (existing && Object.keys(profile).length === 0) return existing;
  const { data: saved, error: saveError } = await supabase.from('profiles')
    .upsert({ ...profile, id: authUser.id }, { onConflict: 'id' }).select().single();
  if (saveError) throw profileSaveError(saveError);
  return saved;
}

// GET CURRENT USER
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }

  let profile;
  try {
    profile = await loadOrCreateProfile(data.session.user);
  } catch {
    return null;
  }

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(profile)
  );

  return profile;
}

// UPDATE PROFILE
export async function updateProfile(profileData) {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    throw new Error('No logged-in user found.');
  }

  const userId = data.session.user.id;

  const {
    data: updatedProfile,
    error,
  } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(updatedProfile)
  );

  return updatedProfile;
}

// LOGOUT
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  await AsyncStorage.removeItem(SESSION_KEY);
}

// CLEAR LOCAL SESSION
export async function clearAllUsers() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
