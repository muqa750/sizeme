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
  const topBuyerEntry = Object.entries(buyerMap).sort((a, b) => b[1] - a[1])[0]
  const topBuyer = topBuyerEntry
    ? { name: topBuyerEntry[0], count: topBuyerEntry[1] }
    : null

  // ── Status breakdown ──────────────────────────────────────────────────────
  const statusMap: Record<string, number> = {}
  orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] ?? 0) + 1 })
  const statusData = Object.entries(statusMap)
    .map(([k, v]) => ({ name: STATUS_LABELS[k] ?? k, value: v }))

  // ── Province breakdown ────────────────────────────────────────────────────
  const provinceMap: Record<string, number> = {}
  orders.forEach(o => {
    if (o.province) provinceMap[o.province] = (provinceMap[o.province] ?? 0) + 1
  })
  const provinceData = Object.entries(provinceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

  // ── Items: products / sizes / colors ─────────────────────────────────────
  const productMap: Record<string, number> = {}
  const sizeMap:    Record<string, number> = {}
  const colorMap:   Record<string, number> = {}

  items.forEach(item => {
    const qty   = item.qty ?? 1
    const label = [item.brand, item.sub].filter(Boolean).join(' — ')
    if (label)      productMap[label]    = (productMap[label]    ?? 0) + qty
    if (item.size)  sizeMap[item.size]   = (sizeMap[item.size]   ?? 0) + qty
    if (item.color) colorMap[item.color] = (colorMap[item.color] ?? 0) + qty
  })

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({
      name: name.length > 24 ? name.slice(0, 24) + '…' : name,
      value,
    }))

  const sizeData  = Object.entries(sizeMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  const colorData = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, value]) => ({ name, value }))

  // ── 7-day trend ───────────────────────────────────────────────────────────
  const trendMap: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    trendMap[d.toISOString().slice(0, 10)] = 0
  }
  orders.forEach(o => {
    if (!o.created_at) return
    const key = o.created_at.slice(0, 10)
    if (key in trendMap) trendMap[key]++
  })
  const trendData = Object.entries(trendMap).map(([date, value]) => ({
    name: new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    value,
  }))

  return (
    <AnalyticsCharts
      kpis={{
        newsletterCount,
        totalItemsSold,
        completionRate,
        topBuyer,
      }}
      statusData={statusData}
      provinceData={provinceData}
      topProducts={topProducts}
      sizeData={sizeData}
      colorData={colorData}
      trendData={trendData}
    />
  )
}
