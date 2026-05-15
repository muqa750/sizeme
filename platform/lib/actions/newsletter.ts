'use server'
import { supabase } from '@/lib/supabase'
import { validateNewsletterContact } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rate-limit'

export async function subscribeNewsletter(
  contact: string,
): Promise<{ ok: boolean; error?: string }> {
  // 1) Rate limit: 3 محاولات / 5 دقائق لكل IP
  const rl = await checkRateLimit({
    action:    'newsletter',
    max:       3,
    windowSec: 300,
  })
  if (!rl.allowed) {
    return { ok: false, error: 'محاولات كثيرة. حاول بعد قليل.' }
  }

  // 2) Validation: إيميل أو هاتف عراقي صحيح
  const v = validateNewsletterContact(contact)
  if (!v.ok) return { ok: false, error: v.error }

  // 3) Insert (RLS سيتحقق مرة ثانية على مستوى DB)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('newsletter_subscribers')
    .insert({ contact: v.normalized })

  if (error) {
    // unique constraint violation = مشترك مسبقاً → نعتبرها نجاحاً
    if (error.code === '23505') return { ok: true }
    console.error('[newsletter]', error.message)
    return { ok: false, error: 'حدث خطأ، حاول مجدداً.' }
  }
  return { ok: true }
}
