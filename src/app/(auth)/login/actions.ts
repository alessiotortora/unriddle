'use server';

import { createClient } from '@/utils/supabase/server';

export async function SignInWithMagicLink(email: string) {
  const supabase = createClient();

  try {
    const { data, error } = await (await supabase).auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      },
    });

    if (error) {
      console.error('Error sending magic link:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error during sign-in:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
