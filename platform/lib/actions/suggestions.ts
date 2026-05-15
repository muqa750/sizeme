'use server'
import { supabase } from '@/lib/supabase'
import { sanitizeText } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rate-limit'

export async function submitSuggestion(
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  // 1) Rate limit: 3 اقتراحات / 10 دقائق لكل IP
  const rl = await checkRateLimit({
    action:    'suggestion',
    max:       3,
    windowSec: 600,
  })
  if (!rl.allowed) {
    return { ok: false, error: 'محاولات كثيرة. حاول بعد قليل.' }
  }

  // 2) تنقية HTML + التحقق من الطول
  const clean = sanitizeText(text)
  if (clean.length < 5) {
    return { ok: false, error: 'يرجى كتابة اقتراح واضح (5 أحرف على الأقل).' }
  }
  if (clean.length > 1000) {
    return { ok: false, error: 'الاقتراح طويل جداً (الحد 1000 حرف).' }
  }

  // 3) Insert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('suggestions')
    .insert({ text: clean })

  if (error) {
    console.error('[suggestions]', error.message)
    return { ok: false, error: 'حدث خطأ أثناء الإرسال، حاول مجدداً.' }
  }
  return { ok: true }
}
