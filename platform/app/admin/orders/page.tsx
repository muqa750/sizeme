import { getAdminOrders } from '@/lib/admin-api'
import OrderRow from './OrderRow'
import SearchInput from './SearchInput'
import SmartRefresh from './SmartRefresh'
import { Suspense } from 'react'

interface Props {
  searchParams: { status?: string; search?: string }
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
  const search       = searchParams.search ?? ''

  const { orders, count } = await getAdminOrders({ status: statusFilter, search })

  // بناء href للفلاتر (نحافظ على البحث)
  function filterHref(value: string) {
    const p = new URLSearchParams()
    if (value !== 'all') p.set('status', value)
    if (search) p.set('search', search)
    const qs = p.toString()
    return qs ? `/admin/orders?${qs}` : '/admin/orders'
  }

  return (
    <div style={{ padding: '1.25rem 1rem', direction: 'rtl', maxWidth: 860, margin: '0 auto' }}>

      {/* Smart Refresh — لا polling، يعمل عند العودة للتبويب */}
      <Suspense fallback={null}>
        <SmartRefresh />
      </Suspense>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a' }}>
          الطلبات
          <span style={{ fontSize: '0.78rem', color: '#aaa', marginRight: 6, fontWeight: 400 }}>({count})</span>
        </h1>
      </div>

      {/* شريط البحث */}
      <div style={{ marginBottom: '0.85rem' }}>
        <Suspense fallback={null}>
          <SearchInput defaultValue={search} />
        </Suspense>
        {search && (
          <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 6 }}>
            نتائج البحث عن: <strong style={{ color: '#555' }}>{search}</strong>
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <a
            key={f.value}
            href={filterHref(f.value)}
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
            {search ? `لا توجد نتائج لـ "${search}"` : 'لا توجد طلبات'}
          </div>
        )}
      </div>
    </div>
  )
}
