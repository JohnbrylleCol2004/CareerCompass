import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const SESSION_KEY = 'career_compass_session';

// REGISTER
export async function register(userData) {
  const {
    name,
    firstName,
    middleName,
    lastName,
    suffix = '',
    username,
    email,
    password,
    role = 'student',
    academicYear = '1st Year',
    experienceLevel = 'Entry Level',
  } = userData;

  const fullName =
    name ||
    [firstName, middleName, lastName, suffix]
      .filter(Boolean)
      .join(' ');

  const { data, error: authError } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!data.user) {
    throw new Error('Registration failed.');
  }

  const profile = {
    id: data.user.id,
    name: fullName,
    first_name: firstName || '',
    middle_name: middleName || '',
    last_name: lastName || '',
    suffix,
    username,
    email,
    role,
    academic_year: academicYear,
    experience_level: experienceLevel,
    current_career: 'Web Developer',
    interests: [],
    technologies: [],
  };

  const {
    data: savedProfile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (profileError) {
    throw new Error(profileError.message);
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

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(profile)
  );

  return profile;
}

// GET CURRENT USER
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }

  const userId = data.session.user.id;

  const {
    data: profile,
    error,
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
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