import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client للاستخدام في المتجر (browser)
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Client للاستخدام في لوحة التحكم (server-side فقط)
// cache: 'no-store' يمنع Next.js من تخزين استجابات Supabase في الكاش
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (url: RequestInfo | URL, options: RequestInit = {}) =>
        fetch(url, { ...options, cache: 'no-store' }),
    },
  })
}
