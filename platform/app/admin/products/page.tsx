import { getAdminProducts } from '@/lib/admin-api'
import ProductsTable from './ProductsTable'

const STATUS_AR: Record<string, string> = {
  active:        'نشط',
  'best-seller': 'الأكثر مبيعاً',
  new:           'وصل حديثاً',
  hidden:        'مخفي',
}

const STATUS_COLOR: Record<string, string> = {
  active:        '#16a34a',
  'best-seller': '#7c3aed',
  new:           '#2563eb',
  hidden:        '#9ca3af',
}

export default async function ProductsPage() {
  const products = await getAdminProducts()

  const byStat = {
    active:        products.filter(p => p.status === 'active').length,
    'best-seller': products.filter(p => p.status === 'best-seller').length,
    new:           products.filter(p => p.status === 'new').length,
    hidden:        products.filter(p => p.status === 'hidden').length,
  }

  return (
    <div style={{ padding: '2rem 2.5rem', direction: 'rtl' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a1a' }}>
          المنتجات
          <span style={{ fontSize: '0.8rem', color: '#aaa', marginRight: 8, fontWeight: 400 }}>
            ({products.length})
          </span>
        </h1>
      </div>

      {/* ملخص الحالات */}
      <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.entries(byStat).map(([status, count]) => (
          <div key={status} style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            padding: '0.625rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[status], flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: '#888' }}>{STATUS_AR[status]}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a1a1a' }}>{count}</span>
          </div>
        ))}
      </div>

      {/* الجدول مع البحث */}
      <ProductsTable products={products} />
    </div>
  )
}
