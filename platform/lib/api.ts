/**
 * SizeMe API — دوال جلب البيانات من Supabase
 * كل الدوال server-side (تُستدعى من Server Components)
 */
import { supabase } from './supabase'
import type { Product, Category, Coupon, Review } from './types'

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
  category?: string
  status?: string
  brands?: string[]
  colors?: string[]
  page: number
  perPage: number
}): Promise<{ products: Product[]; total: number }> {
  const { page, perPage, category, status, brands = [], colors = [] } = opts
  const from = (page - 1) * perPage
  const to   = from + perPage - 1

  let q = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .neq('status', 'hidden')
    .order('sort_order', { ascending: false })
    .range(from, to)

  if (category)         q = q.eq('category_id', category)
  if (status)           q = q.eq('status', status)
  if (brands.length)    q = q.in('brand', brands)
  if (colors.length)    q = q.overlaps('colors', colors)

  const { data, error, count } = await q
  if (error) throw error
  return { products: (data ?? []) as Product[], total: count ?? 0 }
}

export async function getCategoryFilters(category: string): Promise<{ brands: string[]; colors: string[] }> {
  const { data } = await supabase
    .from('products')
    .select('brand, colors')
    .eq('category_id', category)
    .neq('status', 'hidden')

  const rows = data ?? []

  // ترتيب الماركات حسب عدد المنتجات (الأكثر أولاً)
  const brandCount: Record<string, number> = {}
  rows.forEach((p: any) => { if (p.brand) brandCount[p.brand] = (brandCount[p.brand] ?? 0) + 1 })
  const brands = Object.entries(brandCount).sort((a, b) => b[1] - a[1]).map(([b]) => b)

  // ترتيب الألوان حسب عدد المنتجات (الأكثر أولاً)
  const colorCount: Record<string, number> = {}
  rows.forEach((p: any) => (p.colors ?? []).forEach((c: string) => { colorCount[c] = (colorCount[c] ?? 0) + 1 }))
  const colors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]).map(([c]) => c)

  return { brands, colors }
}

/* ══ جلب اسم الماركة الحقيقي من قاعدة البيانات عبر slug ══ */
export async function getActualBrandName(slug: string): Promise<string | null> {
  const { data } = await supabase
    .from('products')
    .select('brand')
    .neq('status', 'hidden')
    .not('brand', 'is', null)

  const brands = Array.from(
    new Set((data ?? []).map((p: any) => p.brand as string).filter(Boolean))
  )

  // تطبيع قوي: أحرف صغيرة + إزالة التشكيل (Hermès→hermes) + حذف كل غير الحروف والأرقام
  const normalize = (s: string) =>
    s.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')  // يزيل الـ accents
      .replace(/[^a-z0-9]/g, '')                          // يبقي الحروف والأرقام فقط

  const slugNorm = normalize(slug)

  return (
    // 1. مطابقة تامة
    brands.find(b => normalize(b) === slugNorm) ??
    // 2. الـ slug يبدأ بـ اسم الماركة في DB (us-polo ← uspolo inside uspoloassn)
    brands.find(b => normalize(b).startsWith(slugNorm)) ??
    // 3. اسم الماركة في DB يبدأ بـ الـ slug
    brands.find(b => slugNorm.startsWith(normalize(b))) ??
    null
  )
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

  const coupon = data as any

  // تحقق من تاريخ الانتهاء
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return null

  // تحقق من الحد الأقصى للاستخدام
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) return null

  return coupon
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

/* ══ الآراء ══ */
/* ══ وصل حديثاً ══ */
export async function getNewArrivals(limit = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data ?? []) as Product[]
}

/* ══ الأكثر طلباً ══ */
export async function getBestSellers(limit = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', 'best-seller')
    .order('sort_order', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data ?? []) as Product[]
}

/* ══ المراجعات ══ */
export async function getReviews(): Promise<Review[]> {
  const { data, error } = await (supabase as any)
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []) as Review[]
}

export async function getReviewStats(): Promise<{
  avg: number; fabric: number; size: number; delivery: number; service: number; count: number
}> {
  const reviews = await getReviews()
  if (reviews.length === 0) return { avg: 0, fabric: 0, size: 0, delivery: 0, service: 0, count: 0 }
  const n = reviews.length
  const fabric   = reviews.reduce((s, r) => s + r.fabric_rating,   0) / n
  const size     = reviews.reduce((s, r) => s + r.size_rating,     0) / n
  const delivery = reviews.reduce((s, r) => s + r.delivery_rating, 0) / n
  const service  = reviews.reduce((s, r) => s + r.service_rating,  0) / n
  const avg = (fabric + size + delivery + service) / 4
  return {
    avg:      Math.round(avg  * 10) / 10,
    fabric:   Math.round(fabric   * 10) / 10,
    size:     Math.round(size     * 10) / 10,
    delivery: Math.round(delivery * 10) / 10,
    service:  Math.round(service  * 10) / 10,
    count: n,
  }
}
