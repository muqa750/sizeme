'use server'
import { supabase } from '@/lib/supabase'

export async function submitRating(
  label: string,
  score: number,
): Promise<{ ok: boolean }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('ratings')
    .insert({ label, score })

  if (error) console.error('[ratings]', error.message)
  return { ok: !error }
}
