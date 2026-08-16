import { NextResponse } from 'next/server';
import * as authHelpers from '@supabase/auth-helpers-nextjs';

export async function middleware(req: any) {
  const res = NextResponse.next();
  const supabase = (authHelpers as any).createMiddlewareSupabaseClient({ req, res });

  const {
    data: { session },
  } = await (supabase as any).auth.getSession();

  // Attach the session to the request for further use
  req.session = session;

  return res;
}

// Apply middleware only to specific routes
export const config = {
  matcher: ['/admin/:path*', '/login'],
};