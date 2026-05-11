import { getDashboardStats, getAdminOrders } from '@/lib/admin-api'
import { fmtEn, dateEn } from '@/lib/utils'
import Link from 'next/link'

const STATUS_AR: Record<string, string> = {
  new: 'جديد', confirmed: 'مؤكد', shipped: 'شُحن', delivered: 'سُلّم', cancelled: 'ملغي',
}
const STATUS_COLOR: Record<string, string> = {
  new: '#2563eb', confirmed: '#7c3aed', shipped: '#d97706', delivered: '#16a34a', cancelled: '#dc2626',
}

export default async function AdminDashboard() {
  const [stats, { orders }] = await Promise.all([
    getDashboardStats(),
    getAdminOrders({ limit: 8 }),
  ])

  const STATS = [
    { label: 'طلبات اليوم',      value: stats.todayCount.toString(),     icon: '📦' },
    { label: 'جديدة',            value: stats.pendingOrders.toString(),   icon: '🔔' },
    { label: 'إجمالي الطلبات',   value: stats.totalOrders.toString(),     icon: '📊' },
    { label: 'إيرادات اليوم',    value: fmtEn(stats.todayRevenue),        icon: '💰' },
    { label: 'إجمالي الإيرادات', value: fmtEn(stats.totalRevenue),        icon: '📈' },
  ]

  return (
    <div style={{ padding: '1.25rem 1rem', direction: 'rtl', maxWidth: 860, margin: '0 auto' }}>

      <h1 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: '#1a1a1a' }}>
        لوحة التحكم
      </h1>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.75rem',
      }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: 10,
            padding: '1rem',
          }}>
            <p style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1, direction: 'ltr', textAlign: 'right' }}>
              {s.value}
            </p>
            <p style={{ fontSize: '0.7rem', color: '#aaa', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>آخر الطلبات</h2>
          <Link href="/admin/orders" style={{ fontSize: '0.75rem', color: '#888', textDecoration: 'none' }}>
            عرض الكل ←
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {orders.map(order => {
            const sc = STATUS_COLOR[order.status] ?? '#888'
            return (
              <Link
                key={order.id}
                href="/admin/orders"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '12px 14px' }}>
                  {/* الصف الأول */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#666' }}>
                      {order.order_id}
                    </span>
                    <span style={{
                      padding: '2px 10px', borderRadius: 4, fontSize: '0.7rem',
                      color: sc, background: sc + '18',
                    }}>
                      {STATUS_AR[order.status] ?? order.status}
                    </span>
                  </div>
                  {/* الصف الثاني */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{order.name}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', direction: 'ltr' }}>{fmtEn(order.total)}</span>
                  </div>
                  {/* الصف الثالث */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{order.province ?? '—'}</span>
                    <span style={{ fontSize: '0.72rem', color: '#ccc', direction: 'ltr' }}>{dateEn(order.created_at)}</span>
                  </div>
                </div>
              </Link>
            )
          })}

          {orders.length === 0 && (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#aaa', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10 }}>
              لا توجد طلبات بعد
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
