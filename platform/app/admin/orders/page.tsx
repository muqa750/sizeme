import { getAdminOrders } from '@/lib/admin-api'
import { fmt } from '@/lib/utils'
import StatusSelect from './StatusSelect'

interface Props {
  searchParams: { status?: string }
}

const FILTERS = [
  { value: 'all',       label: 'الكل'      },
  { value: 'new',       label: 'جديد'      },
  { value: 'confirmed', label: 'مؤكد'      },
  { value: 'shipped',   label: 'في الطريق' },
  { value: 'delivered', label: 'مُسلّم'    },
  { value: 'cancelled', label: 'ملغي'      },
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
              color:  statusFilter === f.value ? '#fff' : '#888',
              border: '1px solid',
              borderColor: statusFilter === f.value ? '#1a1a1a' : '#e5e5e5',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              {['رقم الطلب', 'الزبون', 'الهاتف', 'المحافظة', 'المنتجات', 'المبلغ', 'الحالة', 'التاريخ'].map(h => (
                <th key={h} style={{
                  textAlign: 'right',
                  padding: '0.75rem 1rem',
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
            {orders.map(order => (
              <tr
                key={order.id}
                style={{ borderBottom: '1px solid #f5f5f5' }}
              >
                <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', color: '#555', whiteSpace: 'nowrap' }}>
                  {order.order_id}
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{order.name}</td>
                <td style={{ padding: '0.875rem 1rem', color: '#888', direction: 'ltr', textAlign: 'right' }}>
                  {order.phone}
                </td>
                <td style={{ padding: '0.875rem 1rem', color: '#888' }}>{order.province ?? '—'}</td>
                <td style={{ padding: '0.875rem 1rem', color: '#888' }}>
                  {order.order_items?.length ?? 0} قطعة
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {fmt(order.total)}
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <StatusSelect orderId={order.order_id} current={order.status} />
                </td>
                <td style={{ padding: '0.875rem 1rem', color: '#aaa', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                  {new Date(order.created_at).toLocaleDateString('ar-IQ')}
                  <br />
                  <span style={{ fontSize: '0.68rem' }}>
                    {new Date(order.created_at).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '4rem', textAlign: 'center', color: '#aaa' }}>
                  لا توجد طلبات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order items detail (expandable) - coming soon */}
    </div>
  )
}
