'use server'
import { supabase } from '@/lib/supabase'

export async function submitRating(
  label: string,
  score: number,
): Promise<{ ok: boolean }> {
  const { error } = await supabase
    .from('ratings')
    .insert({ label, score })

  if (error) console.error('[ratings]', error.message)
  return { ok: !error }
}
