/**
 * SizeMe Admin API — server-side only (service role)
 */
import { createAdminClient } from './supabase'
import type { Order, Product, Category } from './types'

/* ══ إحصائيات اللوحة ══ */
export async function getDashboardStats() {
  const admin = createAdminClient()

  const [ordersRes, productsRes, revenueRes, todayRes] = await Promise.all([
    admin.from('orders').select('id, status', { count: 'exact' }),
    admin.from('products').select('id', { count: 'exact' }),
    admin.from('orders').select('total').neq('status', 'cancelled'),
    admin.from('orders').select('total, created_at')
      .gte('created_at', new Date().toISOString().slice(0, 10))
      .neq('status', 'cancelled'),
  ])

  const totalOrders   = ordersRes.count ?? 0
  const totalProducts = productsRes.count ?? 0
  const totalRevenue  = (revenueRes.data ?? []).reduce((s, o) => s + (o.total ?? 0), 0)
  const todayRevenue  = (todayRes.data ?? []).reduce((s, o) => s + (o.total ?? 0), 0)
  const pendingOrders = (ordersRes.data ?? []).filter(o => o.status === 'new').length

  return { totalOrders, totalProducts, totalRevenue, todayRevenue, pendingOrders }
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
    .select('*, order_items(*)', { count: 'exact' })
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
  const admin = createAdminClient()
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
  const admin = createAdminClient()
  const { error } = await admin
    .from('products')
    .update({ status })
    .eq('id', productId)
  if (error) throw error
}
