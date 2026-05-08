import { getAdminOrders } from '@/lib/admin-api'
import OrderRow from './OrderRow'

interface Props {
  searchParams: { status?: string }
}

const FILTERS = [
  { value: 'all', label: 'الكل' },
  { value: 'new', label: 'جديد' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'shipped', label: 'شُحن' },
  { value: 'delivered', label: 'سُلّم' },
  { value: 'cancelled', label: 'ملغي' },
]

export default async function OrdersPage({ searchParams }: Props) {
  const statusFilter = searchParams.status ?? 'all'
  const { orders, count } = await getAdminOrders({ status: statusFilter })

  return (
    <div style={{ padding: '2rem 2.5rem', direction: 'rtl' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a1a' }}>
          الطلبات
          <span style={{ fontSize: '0.8rem', color: '#aaa', marginRight: 8, fontWeight: 400 }}>
            ({count})
          </span>
        </h1>
        <p style={{ fontSize: '0.72rem', color: '#bbb' }}>اضغط على الطلب لعرض التفاصيل</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <a
            key={f.value}
            href={f.value === 'all' ? '/admin/orders' : `/admin/orders?status=${f.value}`}
            style={{
              padding: '5px 14px',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              background: statusFilter === f.value ? '#1a1a1a' : '#fff',
              color: statusFilter === f.value ? '#fff' : '#888',
              border: '1px solid',
              borderColor: statusFilter === f.value ? '#1a1a1a' : '#e5e5e5',
            }}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 750 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              <th style={{ width: 24 }} />
              {['رقم الطلب', 'الزبون', 'الهاتف', 'المحافظة', 'الكمية', 'المبلغ', 'الحالة', 'التاريخ'].map(h => (
                <th key={h} style={{
                  textAlign: 'right',
                  padding: '0.75rem 0.5rem',
                  fontWeight: 500,
                  color: '#888',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <OrderRow key={order.id} order={order as any} index={i} />
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '4rem', textAlign: 'center', color: '#aaa' }}>
                  لا توجد طلبات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
