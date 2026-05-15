'use server'
import { supabase } from '@/lib/supabase'
import { isValidRatingLabel, clampRatingScore } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rate-limit'

export async function submitRating(
  label: string,
  score: number,
): Promise<{ ok: boolean; error?: string }> {
  // 1) Rate limit: تقييم واحد فقط / ساعة لكل IP
  const rl = await checkRateLimit({
    action:    'rating',
    max:       1,
    windowSec: 3600,
  })
  if (!rl.allowed) {
    return { ok: false, error: 'تم تسجيل تقييمك مسبقاً. شكراً!' }
  }

  // 2) Validation: label من القائمة المعتمدة + score بين 1-5
  if (!isValidRatingLabel(label)) {
    return { ok: false, error: 'قيمة غير صحيحة' }
  }
  const validScore = clampRatingScore(score)

  // 3) Insert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('ratings')
    .insert({ label, score: validScore })

  if (error) {
    console.error('[ratings]', error.message)
    return { ok: false, error: 'حدث خطأ' }
  }
  return { ok: true }
}
