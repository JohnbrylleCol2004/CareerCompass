import { supabase } from '../lib/supabase';

export async function register(userData) {
  const {
    name,
    username,
    email,
    password,
    role,
  } = userData;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Registration failed.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      name,
      username,
      email,
      role: role || 'student',
      academic_year: '1st Year',
      experience_level: 'Entry Level',
      current_career: 'Web Developer',
      interests: [],
      technologies: [],
    })
    .select()
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return profile;
}

export async function login(identifier, password) {
  let email = identifier;

  if (!identifier.includes('@')) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', identifier)
      .single();

    if (profileError) {
      throw new Error('Username not found.');
    }

    email = profile.email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return profile;
}

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return profile;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}