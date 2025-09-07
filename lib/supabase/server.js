import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// READ-ONLY client for Page components
export function createServer() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
      },
    }
  )
}