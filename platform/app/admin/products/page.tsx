import { getAdminProducts } from '@/lib/admin-api'
import { getCategories } from '@/lib/api'
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

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getCategories(),
  ])

  const byStat = {
    active:        products.filter(p => p.status === 'active').length,
    'best-seller': products.filter(p => p.status === 'best-seller').length,
    new:           products.filter(p => p.status === 'new').length,
    hidden:        products.filter(p => p.status === 'hidden').length,
  }

  return (
    <div style={{ padding: '1.25rem 1rem', direction: 'rtl', maxWidth: 900, margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a' }}>
          المنتجات
          <span style={{ fontSize: '0.78rem', color: '#aaa', marginRight: 6, fontWeight: 400 }}>
            ({products.length})
          </span>
        </h1>
      </div>

      {/* ملخص الحالات */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(byStat).map(([status, count]) => (
          <div key={status} style={{
            background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8,
            padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[status], flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: '#888' }}>{STATUS_AR[status]}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }}>{count}</span>
          </div>
        ))}
      </div>

      {/* الجدول مع البحث + الإدارة */}
      <ProductsTable products={products} categories={categories} />
    </div>
  )
}
