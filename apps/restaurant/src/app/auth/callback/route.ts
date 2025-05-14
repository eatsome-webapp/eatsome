import { createRouteHandlerClient } from '@/utils/supabase/route';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabase = await createRouteHandlerClient(request);
    
    // Wissel de code in voor een sessie
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL om naar terug te keren na succesvolle aanmelding
  return NextResponse.redirect(new URL('/dashboard', request.url));
} 