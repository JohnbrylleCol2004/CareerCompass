import { supabase } from '../lib/supabase';

// Match the shared web app's recovery flow. Its callback establishes the recovery
// session and routes to /update-password; a hash route alone loses this context.
export const PASSWORD_RESET_REDIRECT = 'https://career-compass-web-cb.vercel.app/?auth_flow=reset';

export async function requestPasswordReset(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: PASSWORD_RESET_REDIRECT,
  });
  if (error) throw new Error(error.message);
}
