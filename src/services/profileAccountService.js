import { supabase } from '../lib/supabase';

export async function getAccountEmail() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  if (!data?.user?.email) throw new Error('Please sign in again to manage your account email.');
  return data.user.email;
}

export async function requestEmailChange(nextEmail) {
  const email = String(nextEmail || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  const currentEmail = await getAccountEmail();
  if (email.toLowerCase() === currentEmail.toLowerCase()) throw new Error('Enter a different email address.');
  // Use the project's configured confirmation destination, shared with the web app.
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw new Error(error.message);
}

export async function getCareerOptions() {
  const { data, error } = await supabase.from('careers').select('id, name').order('name');
  if (error) throw new Error(error.message);
  return (data || []).filter(item => typeof item.name === 'string' && item.name.trim());
}
