export const dynamic = 'force-dynamic'

import { getAnalyticsData } from '@/lib/admin-api'
import AnalyticsCharts from './AnalyticsCharts'

const STATUS_LABELS: Record<string, string> = {
  new:       'جديد',
  confirmed: 'مؤكد',
  shipped:   'شُحن',
  delivered: 'سُلّم',
  cancelled: 'ملغي',
}

const STATUS_COLORS: Record<string, string> = {
  new:       '#2563eb',
  confirmed: '#7c3aed',
  shipped:   '#d97706',
  delivered: '#16a34a',
  cancelled: '#dc2626',
}

export default async function AnalyticsPage() {
  const { orders, items, newsletterCount } = await getAnalyticsData()

  // ── إجمالي القطع المباعة ──────────────────────────────────────────────────
  const totalItemsSold = items.reduce((s, i) => s + (i.qty ?? 1), 0)

  // ── نسبة الإتمام ──────────────────────────────────────────────────────────
  const deliveredCount  = orders.filter(o => o.status === 'delivered').length
  const completionRate  = orders.length
    ? Math.round((deliveredCount / orders.length) * 100)
    : 0

  // ── أكثر زبون شراءً ──────────────────────────────────────────────────────
  const buyerMap: Record<string, number> = {}
  orders.forEach(o => {
    if (o.name?.trim()) buyerMap[o.name.trim()] = (buyerMap[o.name.trim()] ?? 0) + 1
  })
  const sortedBuyers = Object.entries(buyerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, count]) => ({ name, count }))
  const topBuyer = sortedBuyers[0] ?? null
  const topBuyers = sortedBuyers

  // ── Status breakdown (مع ألوان الحالة) ───────────────────────────────────
  const statusMap: Record<string, number> = {}
  orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] ?? 0) + 1 })
  const statusData = Object.entries(statusMap)
    .map(([k, v]) => ({
      name:  STATUS_LABELS[k] ?? k,
      value: v,
      color: STATUS_COLORS[k] ?? '#888',
    }))

  // ── Province breakdown ────────────────────────────────────────────────────
  const provinceMap: Record<string, number> = {}
  orders.forEach(o => {
    if (o.province) provinceMap[o.province] = (provinceMap[o.province] ?? 0) + 1
  })
  const provinceData = Object.entries(provinceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  // ── Items: products (by SKU) / brands / sizes / colors ───────────────────
  const productMap: Record<string, number> = {}  // key = SKU
  const brandMap:   Record<string, number> = {}
  const sizeMap:    Record<string, number> = {}
  const colorMap:   Record<string, number> = {}

  items.forEach(item => {
    const qty = item.qty ?? 1
    // للمنتجات: استخدم SKU كمعرّف — fallback للماركة إذا لم يوجد SKU
    const skuKey = item.sku?.trim() || [item.brand, item.sub].filter(Boolean).join(' — ')
    if (skuKey)      productMap[skuKey]     = (productMap[skuKey]     ?? 0) + qty
    if (item.brand)  brandMap[item.brand]   = (brandMap[item.brand]   ?? 0) + qty
    if (item.size)   sizeMap[item.size]     = (sizeMap[item.size]     ?? 0) + qty
    if (item.color)  colorMap[item.color]   = (colorMap[item.color]   ?? 0) + qty
  })

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }))

  const topBrands = Object.entries(brandMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }))

  const sizeData  = Object.entries(sizeMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  const colorData = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, value]) => ({ name, value }))

  // ── helpers لبناء trend ───────────────────────────────────────────────────
  function buildTrend(days: number) {
    const map: Record<string, number> = {}
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      map[d.toISOString().slice(0, 10)] = 0
    }
    orders.forEach(o => {
      if (!o.created_at) return
      const key = o.created_at.slice(0, 10)
      if (key in map) map[key]++
    })
    return Object.entries(map).map(([date, value]) => ({
      name: new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
      value,
    }))
  }

  const trendData7  = buildTrend(7)
  const trendData30 = buildTrend(30)

  return (
    <AnalyticsCharts
      kpis={{ newsletterCount, totalItemsSold, completionRate, topBuyer }}
      topBuyers={topBuyers}
      statusData={statusData}
      provinceData={provinceData}
      topProducts={topProducts}
      topBrands={topBrands}
      sizeData={sizeData}
      colorData={colorData}
      trendData7={trendData7}
      trendData30={trendData30}
    />
  )
}
