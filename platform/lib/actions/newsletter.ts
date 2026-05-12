'use server'
import { supabase } from '@/lib/supabase'

export async function subscribeNewsletter(
  contact: string,
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = contact.trim()
  if (!trimmed) return { ok: false, error: 'يرجى إدخال بريدك أو رقم هاتفك.' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('newsletter_subscribers')
    .insert({ contact: trimmed })

  if (error) {
    console.error('[newsletter]', error.message)
    return { ok: false, error: 'حدث خطأ، حاول مجدداً.' }
  }
  return { ok: true }
}
