import { getAdminProducts } from '@/lib/admin-api'
import { fmt, imgPath } from '@/lib/utils'
import ProductStatusSelect from './ProductStatusSelect'

const STATUS_AR: Record<string, string> = {
  active:       'نشط',
  'best-seller': 'الأكثر مبيعاً',
  new:           'وصل حديثاً',
  hidden:        'مخفي',
}

const STATUS_COLOR: Record<string, string> = {
  active:       '#16a34a',
  'best-seller': '#7c3aed',
  new:           '#2563eb',
  hidden:        '#9ca3af',
}

export default async function ProductsPage() {
  const products = await getAdminProducts()

  const byStat = {
    active:       products.filter(p => p.status === 'active').length,
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

      {/* Status summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.entries(byStat).map(([status, count]) => (
          <div key={status} style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: STATUS_COLOR[status],
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '0.75rem', color: '#888' }}>{STATUS_AR[status]}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a' }}>{count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              {['', 'SKU', 'البراند', 'الفئة', 'الألوان', 'السعر', 'الحالة'].map(h => (
                <th key={h} style={{
                  textAlign: 'right',
                  padding: '0.75rem 1rem',
                  fontWeight: 500,
                  color: '#888',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f5f5f5' }}>

                {/* Thumbnail */}
                <td style={{ padding: '0.625rem 1rem', width: 48 }}>
                  <div style={{
                    width: 40,
                    height: 52,
                    background: '#f7f7f7',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    <img
                      src={imgPath(product.category_id, product.cat_seq, product.img_key, 1)}
                      alt={product.brand}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </td>

                <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontSize: '0.72rem', color: '#aaa' }}>
                  {product.sku}
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>
                  {product.brand}
                  {product.sub && (
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#aaa', fontWeight: 400 }}>
                      {product.sub}
                    </span>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1rem', color: '#888' }}>
                  {product.category?.name_ar ?? product.category_id}
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#888' }}>
                    {product.colors?.length ?? 0} لون
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {fmt(product.category?.price ?? 35000)}
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <ProductStatusSelect productId={product.id} current={product.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
