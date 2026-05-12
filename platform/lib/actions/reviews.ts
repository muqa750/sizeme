'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

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
  const { name, body, fabric_rating, size_rating, delivery_rating, service_rating } = data

  if (!name.trim() || !body.trim()) return { ok: false, error: 'الاسم والرأي مطلوبان' }
  if (name.trim().length > 60)      return { ok: false, error: 'الاسم طويل جداً' }
  if (body.trim().length > 600)     return { ok: false, error: 'الرأي طويل جداً' }

  const ratings = [fabric_rating, size_rating, delivery_rating, service_rating]
  if (ratings.some(r => r < 1 || r > 5)) return { ok: false, error: 'التقييم يجب أن يكون بين 1 و 5' }

  const supabase = createPublicClient()
  const { error } = await (supabase as any).from('reviews').insert([{
    name: name.trim(),
    body: body.trim(),
    fabric_rating, size_rating, delivery_rating, service_rating,
  }])

  if (error) return { ok: false, error: 'حدث خطأ، حاول مجدداً' }

  revalidatePath('/reviews')
  revalidatePath('/')
  return { ok: true }
}
