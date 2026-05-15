export const dynamic = 'force-dynamic'

import { getAnalyticsData } from '@/lib/admin-api'
import AnalyticsCharts from './AnalyticsCharts'
import DateFilter, { type DateRange } from './DateFilter'
import { Suspense } from 'react'

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

// ── حساب تاريخ البداية بحسب النطاق ─────────────────────────────────────────
function rangeStart(range: DateRange): string | null {
  const now = new Date()
  if (range === 'week') {
    const d = new Date(now); d.setDate(d.getDate() - 7)
    return d.toISOString().slice(0, 10)
  }
  if (range === 'month') {
    const d = new Date(now); d.setDate(1)
    return d.toISOString().slice(0, 10)
  }
  if (range === 'quarter') {
    const d = new Date(now); d.setDate(d.getDate() - 90)
    return d.toISOString().slice(0, 10)
  }
  return null // 'all'
}

interface Props {
  searchParams: { range?: string }
}

export default async function AnalyticsPage({ searchParams }: Props) {
  const range = (['week', 'month', 'quarter', 'all'].includes(searchParams.range ?? '')
    ? searchParams.range
    : 'all') as DateRange

  const { orders: allOrders, items: allItems, newsletterCount } = await getAnalyticsData()

  // ── فلتر التاريخ ──────────────────────────────────────────────────────────
  const start  = rangeStart(range)
  const orders = start
    ? allOrders.filter(o => o.created_at && o.created_at.slice(0, 10) >= start)
    : allOrders
  const items  = allItems // الأصناف لا تحمل تاريخاً — نُبقيها كاملة

  // ── إجمالي القطع المباعة — فقط من الطلبات المُسلّمة ─────────────────────
  const deliveredOrderIds = new Set(
    orders.filter(o => o.status === 'delivered').map(o => o.order_id)
  )
  const totalItemsSold = items.reduce(
    (s, i) => s + (deliveredOrderIds.has(i.order_id) ? (i.qty ?? 1) : 0),
    0
  )

  // ── نسبة الإتمام ──────────────────────────────────────────────────────────
  const deliveredCount  = orders.filter(o => o.status === 'delivered').length
  const completionRate  = orders.length
    ? Math.round((deliveredCount / orders.length) * 100)
    : 0

  // ── أكثر زبون شراءً — مؤكد وسُلّم فقط ─────────────────────────────────
  const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered')

  const buyerMap: Record<string, number> = {}
  confirmedOrders.forEach(o => {
    if (o.name?.trim()) buyerMap[o.name.trim()] = (buyerMap[o.name.trim()] ?? 0) + 1
  })
  const topBuyers = Object.entries(buyerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, count]) => ({ name, count }))

  const buyerAmountMap: Record<string, number> = {}
  confirmedOrders.forEach(o => {
    if (o.name?.trim()) {
      const net = (o.total ?? 0) - (o.shipping ?? 0)
      buyerAmountMap[o.name.trim()] = (buyerAmountMap[o.name.trim()] ?? 0) + net
    }
  })
  const topBuyersByAmount = Object.entries(buyerAmountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, total]) => ({ name, total }))

  const uniqueBuyersCount = Object.keys(buyerMap).length

  // ── Status breakdown ─────────────────────────────────────────────────────
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

  // ── Items: products / brands / sizes / colors ─────────────────────────────
  const productMap: Record<string, number> = {}
  const brandMap:   Record<string, number> = {}
  const sizeMap:    Record<string, number> = {}
  const colorMap:   Record<string, number> = {}

  items.forEach(item => {
    const qty    = item.qty ?? 1
    const skuKey = item.sku?.trim() || [item.brand, item.sub].filter(Boolean).join(' — ')
    if (skuKey)      productMap[skuKey]   = (productMap[skuKey]   ?? 0) + qty
    if (item.brand)  brandMap[item.brand] = (brandMap[item.brand] ?? 0) + qty
    if (item.size)   sizeMap[item.size]   = (sizeMap[item.size]   ?? 0) + qty
    if (item.color)  colorMap[item.color] = (colorMap[item.color] ?? 0) + qty
  })

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([name, value]) => ({ name, value }))

  const topBrands = Object.entries(brandMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([name, value]) => ({ name, value }))

  const sizeData  = Object.entries(sizeMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  const colorData = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 7)
    .map(([name, value]) => ({ name, value }))

  // ── Trend helpers ─────────────────────────────────────────────────────────
  function buildTrend(days: number) {
    const map: Record<string, number> = {}
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
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

  // ── عدد الطلبات في النطاق الحالي ─────────────────────────────────────────
  const rangeLabel: Record<DateRange, string> = {
    week: 'هذا الأسبوع', month: 'هذا الشهر', quarter: 'آخر 3 أشهر', all: 'الكل',
  }

  return (
    <div style={{ direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* Header + فلتر التاريخ */}
      <div style={{
        padding: '16px 16px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: 12,
        maxWidth: 900, margin: '0 auto',
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 2px' }}>
            الإحصائيات
          </h1>
          <p style={{ color: '#aaa', fontSize: 12, margin: 0 }}>
            {rangeLabel[range]}
            {range !== 'all' && (
              <span style={{ marginRight: 6, color: '#c9a84c', fontWeight: 600 }}>
                · {orders.length} طلب
              </span>
            )}
          </p>
        </div>

        <Suspense fallback={null}>
          <DateFilter current={range} />
        </Suspense>
      </div>

      <AnalyticsCharts
        kpis={{ newsletterCount, totalItemsSold, completionRate, uniqueBuyersCount }}
        topBuyers={topBuyers}
        topBuyersByAmount={topBuyersByAmount}
        statusData={statusData}
        provinceData={provinceData}
        topProducts={topProducts}
        topBrands={topBrands}
        sizeData={sizeData}
        colorData={colorData}
        trendData7={trendData7}
        trendData30={trendData30}
      />
    </div>
  )
}
