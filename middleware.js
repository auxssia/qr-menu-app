import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs';

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // If the user is not logged in, redirect them to the login page
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

// This config ensures the middleware runs ONLY on the specified paths
export const config = {
  matcher: [
    '/dashboard', // Protect the new unified dashboard
    '/admin',     // Keep the old admin page protected for now
    '/kitchen',   // Keep the old kitchen page protected for now
  ],
}