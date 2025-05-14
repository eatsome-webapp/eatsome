import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@repo/auth';
import { redirect } from 'next/navigation';

/**
 * Route handler for email confirmation and token exchange
 * Handles redirects from email confirmation links
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/(staff)/orders';

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirect user to specified page or default staff page
      redirect(next);
    }
  }

  // If there's an error or missing params, redirect to login
  redirect('/staff-login');
} 