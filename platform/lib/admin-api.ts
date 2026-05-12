/**
 * SizeMe Admin API — server-side only (service role)
 */
import { createAdminClient } from './supabase'
import type { Order, Product, Category } from './types'

/* ══ إحصائيات اللوحة ══ */
export async function getDashboardStats() {
  const admin = createAdminClient()
  const todayStr = new Date().toISOString().slice(0, 10)

  const [allOrdersRes, productsRes, revenueRes, todayOrdersRes] = await Promise.all([
    // كل الطلبات لحساب الإجمالي والمعلقة
    admin.from('orders').select('id, status', { count: 'exact' }),
    // عدد المنتجات
    admin.from('products').select('id', { count: 'exact' }),
    // الإيرادات — مُسلّم فقط، بدون التوصيل
    admin.from('orders')
      .select('total, shipping')
      .eq('status', 'delivered'),
    // طلبات اليوم مع إيراداتها — مُسلّم فقط
    admin.from('orders')
      .select('id, status, total, shipping, created_at')
      .gte('created_at', todayStr),
  ])

  const allOrders    = allOrdersRes.data ?? []
  const totalOrders  = allOrdersRes.count ?? 0
  const totalProducts = productsRes.count ?? 0
  const pendingOrders = allOrders.filter(o => o.status === 'new').length

  // الإيرادات = المبيعات فقط (بدون التوصيل) للطلبات المُسلَّمة
  const totalRevenue = (revenueRes.data ?? [])
    .reduce((s, o) => s + ((o.total ?? 0) - (o.shipping ?? 0)), 0)

  const todayOrders = todayOrdersRes.data ?? []
  const todayCount  = todayOrders.length
  const todayRevenue = todayOrders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + ((o.total ?? 0) - (o.shipping ?? 0)), 0)

  return { totalOrders, todayCount, totalProducts, totalRevenue, todayRevenue, pendingOrders }
}

/* ══ الطلبات ══ */
export async function getAdminOrders(opts?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<{ orders: Order[]; count: number }> {
  const admin = createAdminClient()

  let q = admin
    .from('orders')
    .select('*, order_items(*, product:products(img_key, category_id, cat_seq))', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (opts?.status && opts.status !== 'all') q = q.eq('status', opts.status)
  if (opts?.limit)  q = q.limit(opts.limit)
  if (opts?.offset) q = q.range(opts.offset, (opts.offset + (opts.limit ?? 50)) - 1)

  const { data, error, count } = await q
  if (error) throw error
  return { orders: (data ?? []) as Order[], count: count ?? 0 }
}

export async function getAdminOrderById(orderId: string): Promise<Order | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_id', orderId)
    .single()
  if (error) return null
  return data as Order
}

/* ══ المنتجات ══ */
export async function getAdminProducts(): Promise<Product[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('products')
    .select('*, category:categories(*)')
    .order('sort_order', { ascending: false })
  if (error) throw error
  return (data ?? []) as Product[]
}

/* ══ تحديث حالة الطلب ══ */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { error } = await admin
    .from('orders')
    .update({ status })
    .eq('order_id', orderId)
  if (error) throw error
}

/* ══ تحديث حالة المنتج ══ */
export async function updateProductStatus(
  productId: number,
  status: Product['status']
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { error } = await admin
    .from('products')
    .update({ status })
    .eq('id', productId)
  if (error) throw error
}

/* ══ الإدارة — جلب البيانات ══ */

export async function getCoupons() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export interface CouponOrder {
  order_id: string
  name: string
  created_at: string
  coupon_discount: number
  total: number
}

export type CouponUsageMap = Record<string, CouponOrder[]>

export async function getCouponUsage(): Promise<CouponUsageMap> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('orders')
    .select('order_id, name, created_at, coupon_code, coupon_discount, total')
    .not('coupon_code', 'is', null)
    .gt('coupon_discount', 0)
    .order('created_at', { ascending: false })
  if (error) throw error

  const map: CouponUsageMap = {}
  for (const o of (data ?? [])) {
    const code = o.coupon_code as string
    if (!map[code]) map[code] = []
    map[code].push({
      order_id:        o.order_id,
      name:            o.name,
      created_at:      o.created_at,
      coupon_discount: o.coupon_discount,
      total:           o.total,
    })
  }
  return map
}

export async function getNewsletterSubscribers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data, error, count } = await admin
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
  if (error) throw error
  return { subscribers: data ?? [], count: count ?? 0 }
}

export async function getRatings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data, error } = await admin
    .from('ratings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getSuggestions() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data, error } = await admin
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getSettings() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('settings')
    .select('*')
    .order('key')
  if (error) throw error
  return data ?? []
}

/* ══ الإحصائيات ══ */
export async function getAnalyticsData() {
  const admin = createAdminClient()

  const [ordersRes, itemsRes, newsletterRes] = await Promise.all([
    admin
      .from('orders')
      .select('status, province, total, shipping, created_at, name'),
    admin
      .from('order_items')
      .select('brand, sub, color, size, qty'),
    admin
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true }),
  ])

  return {
    orders: (ordersRes.data ?? []) as Array<{
      status: string
      province: string
      total: number
      shipping: number
      created_at: string
      name: string
    }>,
    items: (itemsRes.data ?? []) as Array<{
      brand: string
      sub: string
      color: string
      size: string
      qty: number
    }>,
    newsletterCount: newsletterRes.count ?? 0,
  }
}
