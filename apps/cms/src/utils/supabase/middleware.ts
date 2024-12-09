import { type NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Allow the request to continue without authentication
  if (pathname === '/api/mux/upload') {
    return NextResponse.next();
  }

  // Allow both authenticated and unauthenticated users to access the root
  if (pathname === '/') {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users from `/login` to `/dashboard`
  if (user && pathname === '/login') {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect unauthenticated users from protected routes to `/login`
  const isProtectedRoute = pathname.startsWith('/dashboard');

  if (!user && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Return the response for authenticated requests
  return supabaseResponse;
}
