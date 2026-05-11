import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/api'

export const revalidate = 300 // إعادة جلب كل 5 دقائق

export async function GET() {
  const products = await getProducts()

  // نرجع فقط الحقول اللازمة للبحث والعرض
  const slim = products.map(p => ({
    id:          p.id,
    brand:       p.brand,
    sub:         p.sub ?? '',
    colors:      p.colors ?? [],
    category_id: p.category_id,
    img_key:     p.img_key,
    cat_seq:     p.cat_seq ?? '',
    cat_name:    p.category?.name_ar ?? '',
  }))

  return NextResponse.json(slim, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
  })
}
