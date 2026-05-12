import { getAdminOrders } from '@/lib/admin-api'
import OrderRow from './OrderRow'

interface Props {
  searchParams: { status?: string }
}

const FILTERS = [
  { value: 'all',       label: 'الكل'  },
  { value: 'new',       label: 'جديد'  },
  { value: 'confirmed', label: 'مؤكد'  },
  { value: 'delivered', label: 'سُلّم' },
  { value: 'cancelled', label: 'ملغي'  },
]

export default async function OrdersPage({ searchParams }: Props) {
  const statusFilter = searchParams.status ?? 'all'
  const { orders, count } = await getAdminOrders({ status: statusFilter })

  return (
    <div style={{ padding: '1.25rem 1rem', direction: 'rtl', maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a' }}>
          الطلبات
          <span style={{ fontSize: '0.78rem', color: '#aaa', marginRight: 6, fontWeight: 400 }}>({count})</span>
        </h1>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <a
            key={f.value}
            href={f.value === 'all' ? '/admin/orders' : `/admin/orders?status=${f.value}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              textDecoration: 'none',
              borderRadius: 6,
              background: statusFilter === f.value ? '#1a1a1a' : '#fff',
              color:      statusFilter === f.value ? '#fff'    : '#888',
              border: '1px solid',
              borderColor: statusFilter === f.value ? '#1a1a1a' : '#e5e5e5',
              whiteSpace: 'nowrap',
            }}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Orders Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {orders.map((order, i) => (
          <OrderRow key={order.id} order={order as any} index={i} />
        ))}
        {orders.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#aaa', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8 }}>
            لا توجد طلبات
          </div>
        )}
      </div>
    </div>
  )
}
