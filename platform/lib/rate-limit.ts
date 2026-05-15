import 'server-only'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'

/**
 * Rate Limiter يعمل عبر جدول rate_limits في Supabase
 *
 * يستخدم service_role لأن جدول rate_limits محمي بـ RLS
 * ولا يسمح للـ anon بالقراءة/الكتابة
 */

interface RateLimitOptions {
  action:    string  // اسم العملية (newsletter | rating | suggestion | review)
  max:       number  // أقصى عدد طلبات مسموح في النافذة الزمنية
  windowSec: number  // النافذة الزمنية بالثواني
}

/**
 * يستخرج IP المستخدم من الـ headers
 */
function getClientIp(): string {
  const h = headers()
  // Vercel / Cloudflare / standard proxies
  const xff = h.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()

  const xri = h.get('x-real-ip')
  if (xri) return xri.trim()

  const cf = h.get('cf-connecting-ip')
  if (cf) return cf.trim()

  return 'unknown'
}

/**
 * فحص rate limit. إذا تجاوز الحد، يُرجع { allowed: false }.
 * إذا سمح، يُسجّل الطلب الجديد ويُرجع { allowed: true }.
 *
 * Fail-open: لو حصل خطأ في DB، نسمح بالطلب (لا نوقف الموقع)
 */
export async function checkRateLimit(opts: RateLimitOptions): Promise<{
  allowed: boolean
  remaining?: number
}> {
  const ip = getClientIp()
  if (ip === 'unknown') {
    // لو لم نستطع تحديد IP، نسمح لكن نسجّل تحذير
    console.warn('[rate-limit] could not determine client IP')
    return { allowed: true }
  }

  try {
    const admin = createAdminClient()
    const since = new Date(Date.now() - opts.windowSec * 1000).toISOString()

    // عدّ الطلبات السابقة في النافذة الزمنية
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count, error: countError } = await (admin as any)
      .from('rate_limits')
      .select('id', { count: 'exact', head: true })
      .eq('ip', ip)
      .eq('action', opts.action)
      .gte('created_at', since)

    if (countError) {
      console.error('[rate-limit] count error:', countError.message)
      return { allowed: true } // fail-open
    }

    if ((count ?? 0) >= opts.max) {
      return { allowed: false, remaining: 0 }
    }

    // تسجيل الطلب الحالي
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (admin as any)
      .from('rate_limits')
      .insert({ ip, action: opts.action })

    if (insertError) {
      console.error('[rate-limit] insert error:', insertError.message)
    }

    return { allowed: true, remaining: opts.max - (count ?? 0) - 1 }
  } catch (e) {
    console.error('[rate-limit] unexpected error:', e)
    return { allowed: true } // fail-open في حالة الخطأ
  }
}
