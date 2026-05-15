'use server'
import { createAdminClient } from '@/lib/supabase'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

// المسارات الافتراضية للصور القديمة
const DEFAULT_IMG_PATHS: Record<number, string> = {
  1: 'brands/louis-vuitton.jpg',
  2: 'brands/hermes.jpg',
  3: 'brands/us-polo.jpg',
}

export interface BrandSpot {
  slot:    number
  brands:  string[]   // قائمة ماركات (1-3)
  imgPath: string
  imgVer:  number
}

// ── جلب إعدادات الـ 3 خانات ────────────────────────────────────────────────
export async function getBrandSpotlights(): Promise<BrandSpot[]> {
  noStore()
  const admin = createAdminClient()
  const { data } = await admin
    .from('settings')
    .select('key, value')
    .in('key', ['brand_spotlight_1', 'brand_spotlight_2', 'brand_spotlight_3'])

  const defaults: BrandSpot[] = [
    { slot: 1, brands: [], imgPath: DEFAULT_IMG_PATHS[1], imgVer: 0 },
    { slot: 2, brands: [], imgPath: DEFAULT_IMG_PATHS[2], imgVer: 0 },
    { slot: 3, brands: [], imgPath: DEFAULT_IMG_PATHS[3], imgVer: 0 },
  ]

  return defaults.map(d => {
    const row = (data ?? []).find(r => r.key === `brand_spotlight_${d.slot}`)
    if (!row) return d
    const v = row.value as {
      brand?:    string    // قديم — للتوافق
      brands?:   string[]
      img_path?: string
      img_ver?:  number
    }
    // دعم كلا الصيغتين: القديمة (brand) والجديدة (brands)
    const brands = v.brands?.length
      ? v.brands
      : v.brand ? [v.brand] : []

    return {
      slot:    d.slot,
      brands,
      imgPath: v.img_path ?? d.imgPath,
      imgVer:  v.img_ver  ?? d.imgVer,
    }
  })
}

// ── حفظ الخانة ──────────────────────────────────────────────────────────────
export async function saveBrandSpotlight(
  slot:    number,
  brands:  string[],
  imgFd:   FormData | null
): Promise<{ ok: boolean; error?: string; imgPath?: string; imgVer?: number }> {
  try {
    const admin = createAdminClient() as any
    const key   = `brand_spotlight_${slot}`

    const { data: existing } = await admin
      .from('settings').select('value').eq('key', key).single()
    const cur = (existing?.value ?? {}) as { img_path?: string; img_ver?: number }

    let imgPath = cur.img_path ?? DEFAULT_IMG_PATHS[slot]
    let imgVer  = cur.img_ver  ?? 0

    if (imgFd) {
      const file = imgFd.get('file') as File | null
      if (file) {
        const buf  = Buffer.from(await file.arrayBuffer())
        const path = `brands/${slot}.jpg`
        const { error: upErr } = await admin.storage
          .from('brands')
          .upload(path, buf, { contentType: 'image/jpeg', upsert: true })
        if (upErr) return { ok: false, error: upErr.message }
        imgPath = path
        imgVer  = Date.now()
      }
    }

    await admin.from('settings').upsert(
      { key, value: { brands, img_path: imgPath, img_ver: imgVer } },
      { onConflict: 'key' }
    )

    revalidatePath('/')
    revalidatePath(`/brand/${slot}`)
    return { ok: true, imgPath, imgVer }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}
