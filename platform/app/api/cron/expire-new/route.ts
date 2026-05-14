import { type NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

/*
  Vercel Cron يستدعي هذا الـ route يومياً
  يحوّل المنتجات التي مضى عليها أكثر من 7 أيام من 'new' → 'active'
*/
export async function GET(_req: NextRequest) {
  const supabase = createAdminClient()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('products')
    .update({ status: 'active' })
    .eq('status', 'new')
    .lt('created_at', sevenDaysAgo)
    .select('id, brand')

  if (error) {
    console.error('Cron expire-new error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(`expire-new: updated ${data?.length ?? 0} products`)
  return NextResponse.json({ updated: data?.length ?? 0, products: data })
}
