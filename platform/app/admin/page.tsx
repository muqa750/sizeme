import { getDashboardStats, getAdminOrders } from '@/lib/admin-api'
import { fmt } from '@/lib/utils'

const STATUS_AR: Record<string, string> = {
  new:       'جديد',
  confirmed: 'مؤكد',
  shipped:   'في الطريق',
  delivered: 'مُسلّم',
  cancelled: 'ملغي',
}

const STATUS_COLOR: Record<string, string> = {
  new:       '#2563eb',
  confirmed: '#7c3aed',
  shipped:   '#d97706',
  delivered: '#16a34a',
  cancelled: '#dc2626',
}

export default async function AdminDashboard() {
  const [stats, { orders }] = await Promise.all([
    getDashboardStats(),
    getAdminOrders({ limit: 10 }),
  ])

  const STATS = [
    { label: 'إجمالي الطلبات',  value: stats.totalOrders.toString() },
    { label: 'طلبات جديدة',     value: stats.pendingOrders.toString() },
    { label: 'إيرادات اليوم',   value: fmt(stats.todayRevenue) },
    { label: 'إجمالي الإيرادات', value: fmt(stats.totalRevenue) },
    { label: 'عدد المنتجات',    value: stats.totalProducts.toString() },
  ]

  return (
    <div style={{ padding: '2rem 2.5rem', direction: 'rtl' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', color: '#1a1a1a' }}>
        لوحة التحكم
      </h1>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            padding: '1.25rem',
          }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: '#888', marginBottom: 8 }}>
              {s.label.toUpperCase()}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5' }}>
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600 }}>آخر الطلبات</h2>
          <a href="/admin/orders" style={{ fontSize: '0.75rem', color: '#888', textDecoration: 'none' }}>
            عرض الكل ←
          </a>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['رقم الطلب', 'الزبون', 'المحافظة', 'المبلغ', 'الحالة', 'التاريخ'].map(h => (
                <th key={h} style={{
                  textAlign: 'right',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 500,
                  color: '#888',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '0.875rem 1.5rem', fontFamily: 'monospace', color: '#555' }}>
                  {order.order_id}
                </td>
                <td style={{ padding: '0.875rem 1.5rem', fontWeight: 500 }}>{order.name}</td>
                <td style={{ padding: '0.875rem 1.5rem', color: '#888' }}>{order.province ?? '—'}</td>
                <td style={{ padding: '0.875rem 1.5rem', fontWeight: 500 }}>{fmt(order.total)}</td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    color: STATUS_COLOR[order.status] ?? '#888',
                    background: (STATUS_COLOR[order.status] ?? '#888') + '15',
                    borderRadius: 2,
                  }}>
                    {STATUS_AR[order.status] ?? order.status}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1.5rem', color: '#aaa', fontSize: '0.75rem' }}>
                  {new Date(order.created_at).toLocaleDateString('ar-IQ')}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>
                  لا توجد طلبات بعد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
