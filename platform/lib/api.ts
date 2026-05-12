/**
 * SizeMe API — دوال جلب البيانات من Supabase
 * كل الدوال server-side (تُستدعى من Server Components)
 */
import { supabase } from './supabase'
import type { Product, Category, Coupon } from './types'

/* ══ الفئات ══ */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

/* ══ المنتجات ══ */
export async function getProducts(opts?: {
  category?: string
  status?: string
  limit?: number
}): Promise<Product[]> {
  let q = supabase
    .from('products')
    .select('*, category:categories(*)')
    .neq('status', 'hidden')
    .order('sort_order', { ascending: false })

  if (opts?.category) q = q.eq('category_id', opts.category)
  if (opts?.status)   q = q.eq('status', opts.status)
  if (opts?.limit)    q = q.limit(opts.limit)

  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Product[]
}

/* ══ المنتجات مع pagination ══ */
export async function getProductsPaged(opts: {
  category: string
  page: number
  perPage: number
}): Promise<{ products: Product[]; total: number }> {
  const { page, perPage, category } = opts
  const from = (page - 1) * perPage
  const to   = from + perPage - 1

  const { data, error, count } = await supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .neq('status', 'hidden')
    .eq('category_id', category)
    .order('sort_order', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { products: (data ?? []) as Product[], total: count ?? 0 }
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Product
}

/* ══ الكوبونات ══ */
export async function validateCoupon(code: string): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toLowerCase())
    .eq('is_active', true)
    .single()

  if (error || !data) return null

  // تحقق من تاريخ الانتهاء
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null

  // تحقق من الحد الأقصى للاستخدام
  if (data.max_uses !== null && data.used_count >= data.max_uses) return null

  return data
}

/* ══ الطلبات ══ */
export async function createOrder(payload: {
  order_id: string
  name: string
  phone: string
  province: string
  area: string
  address: string
  notes: string
  subtotal: number
  bulk_discount: number
  coupon_code: string
  coupon_discount: number
  shipping: number
  total: number
  payment_method: string
  lang: string
  items: Array<{
    product_id: number | null
    sku: string
    brand: string
    sub: string
    color: string
    size: string
    qty: number
    unit_price: number
    line_total: number
  }>
}) {
  const { items, ...orderData } = payload

  // إدخال الطلب
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order, error: orderErr } = await (supabase as any)
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (orderErr) throw orderErr

  // إدخال المنتجات
  const itemsToInsert = items.map(item => ({
    ...item,
    order_id: payload.order_id,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: itemsErr } = await (supabase as any)
    .from('order_items')
    .insert(itemsToInsert)

  if (itemsErr) throw itemsErr

  return order
}
