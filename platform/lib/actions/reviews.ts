'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { sanitizeText, clampRatingScore } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rate-limit'

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function submitReview(data: {
  name: string
  body: string
  fabric_rating: number
  size_rating: number
  delivery_rating: number
  service_rating: number
}): Promise<{ ok: boolean; error?: string }> {
  // 1) Rate limit: تقييم واحد / 30 دقيقة لكل IP
  const rl = await checkRateLimit({
    action:    'review',
    max:       1,
    windowSec: 1800,
  })
  if (!rl.allowed) {
    return { ok: false, error: 'لقد أرسلت تقييماً مؤخراً. شكراً!' }
  }

  // 2) تنقية النصوص
  const name = sanitizeText(data.name)
  const body = sanitizeText(data.body)

  if (name.length < 2)  return { ok: false, error: 'الاسم قصير جداً' }
  if (name.length > 60) return { ok: false, error: 'الاسم طويل جداً' }
  if (body.length < 1)  return { ok: false, error: 'الرأي مطلوب' }
  if (body.length > 600) return { ok: false, error: 'الرأي طويل جداً' }

  // 3) Clamp التقييمات بين 1-5
  const fabric_rating   = clampRatingScore(data.fabric_rating)
  const size_rating     = clampRatingScore(data.size_rating)
  const delivery_rating = clampRatingScore(data.delivery_rating)
  const service_rating  = clampRatingScore(data.service_rating)

  // 4) Insert
  const supabase = createPublicClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('reviews').insert([{
    name, body,
    fabric_rating, size_rating, delivery_rating, service_rating,
  }])

  if (error) {
    console.error('[reviews]', error.message)
    return { ok: false, error: 'حدث خطأ، حاول مجدداً' }
  }

  revalidatePath('/reviews')
  revalidatePath('/')
  return { ok: true }
}
