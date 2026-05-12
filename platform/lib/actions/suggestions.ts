'use server'
import { supabase } from '@/lib/supabase'

export async function submitSuggestion(
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = text.trim()
  if (!trimmed || trimmed.length < 5) {
    return { ok: false, error: 'يرجى كتابة اقتراح واضح (5 أحرف على الأقل).' }
  }
  if (trimmed.length > 1000) {
    return { ok: false, error: 'الاقتراح طويل جداً (الحد 1000 حرف).' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('suggestions')
    .insert({ text: trimmed })

  if (error) {
    console.error('[suggestions]', error.message)
    return { ok: false, error: 'حدث خطأ أثناء الإرسال، حاول مجدداً.' }
  }

  return { ok: true }
}
