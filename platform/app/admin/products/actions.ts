'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

const IMG_FOLDERS: Record<string, string> = {
  tshirt:    'imagestshirts',
  polo:      'imagespolo',
  shirt:     'imagesshirts',
  jeans:     'imagesjeans',
  tracksuit: 'imagestracksuit',
}

// ── رفع صورة إلى Supabase Storage ─────────────────────────────────────────
export async function uploadProductImage(formData: FormData): Promise<{
  ok: boolean
  imgKey?: string
  error?: string
}> {
  const file       = formData.get('file') as File | null
  const categoryId = (formData.get('categoryId') as string) ?? 'tshirt'
  const catSeq     = (formData.get('catSeq')     as string) ?? '00'
  const seq        = Number(formData.get('seq') ?? 1)

  if (!file || file.size === 0) return { ok: false, error: 'لم يُرفع ملف' }

  const folder = IMG_FOLDERS[categoryId] ?? 'imagestshirts'
  const imgKey = Math.random().toString(36).slice(2, 10)
  const path   = `${folder}/${catSeq}-${seq}-${imgKey}.jpg`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const buf   = Buffer.from(await file.arrayBuffer())

  const { error } = await admin.storage
    .from('products')
    .upload(path, buf, { contentType: 'image/jpeg', upsert: true })

  if (error) return { ok: false, error: error.message }
  return { ok: true, imgKey }
}

// ── إنشاء منتج جديد ────────────────────────────────────────────────────────
export async function createProduct(formData: FormData): Promise<{
  ok: boolean
  error?: string
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any

  const brand       = (formData.get('brand')       as string).trim()
  const sub         = (formData.get('sub')         as string).trim() || null
  const description = (formData.get('description') as string).trim() || null
  const category_id = (formData.get('category_id') as string).trim()
  const sku         = (formData.get('sku')         as string).trim()
  const img_key     = (formData.get('img_key')     as string).trim()
  const cat_seq     = (formData.get('cat_seq')     as string).trim() || null
  const status      = (formData.get('status')      as string) || 'active'
  const sort_order  = Number(formData.get('sort_order') ?? 0)
  const colorsRaw   = formData.get('colors') as string
  const colors      = colorsRaw ? JSON.parse(colorsRaw) : []

  if (!brand || !category_id || !sku) {
    return { ok: false, error: 'الماركة، القسم، والكود مطلوبة' }
  }

  const { error } = await admin.from('products').insert({
    brand,
    sub,
    description,
    category_id,
    sku,
    img_key: img_key || 'default',
    cat_seq,
    colors,
    status,
    sort_order,
    added_at: new Date().toISOString(),
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { ok: true }
}

// ── تعديل منتج موجود ────────────────────────────────────────────────────────
export async function updateProduct(id: number, formData: FormData): Promise<{
  ok: boolean
  error?: string
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any

  const brand       = (formData.get('brand')       as string).trim()
  const sub         = (formData.get('sub')         as string).trim() || null
  const description = (formData.get('description') as string).trim() || null
  const category_id = (formData.get('category_id') as string).trim()
  const sku         = (formData.get('sku')         as string).trim()
  const img_key     = (formData.get('img_key')     as string).trim()
  const cat_seq     = (formData.get('cat_seq')     as string).trim() || null
  const status      = (formData.get('status')      as string) || 'active'
  const sort_order  = Number(formData.get('sort_order') ?? 0)
  const colorsRaw   = formData.get('colors') as string
  const colors      = colorsRaw ? JSON.parse(colorsRaw) : []

  if (!brand || !category_id || !sku) {
    return { ok: false, error: 'الماركة، القسم، والكود مطلوبة' }
  }

  const updateData: Record<string, unknown> = {
    brand, sub, description, category_id, sku, cat_seq,
    colors, status, sort_order, updated_at: new Date().toISOString(),
  }
  if (img_key) updateData.img_key = img_key

  const { error } = await admin.from('products').update(updateData).eq('id', id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { ok: true }
}

// ── حذف منتج نهائياً ────────────────────────────────────────────────────────
export async function deleteProduct(id: number): Promise<{
  ok: boolean
  error?: string
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any

  const { error } = await admin.from('products').delete().eq('id', id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { ok: true }
}

// ── تغيير حالة المنتج فقط ──────────────────────────────────────────────────
export async function setProductStatus(
  id: number,
  status: 'active' | 'best-seller' | 'new' | 'hidden',
): Promise<{ ok: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { error } = await admin.from('products').update({ status }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/')
  return { ok: true }
}
