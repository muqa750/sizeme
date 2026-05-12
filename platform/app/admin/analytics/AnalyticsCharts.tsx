'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'

// ─── Color map ─────────────────────────────────────────────────────────────────
const COLOR_HEX: Record<string, string> = {
  'Black': '#1a1a1a', 'White': '#d0d0d0', 'Dark Navy': '#1B2A4A',
  'Royal Blue': '#1C4EBF', 'Brown': '#6B3F2A', 'Burgundy': '#6D1A36',
  'Charcoal': '#3D3D3D', 'Taupe': '#B5A69A', 'Olive': '#5A5E3A',
}
function colorForBar(name: string) { return COLOR_HEX[name] ?? '#c9a84c' }

// ─── Types ─────────────────────────────────────────────────────────────────────
interface DataPoint      { name: string; value: number }
interface StatusPoint   { name: string; value: number; color: string }
interface Buyer         { name: string; count: number }

interface BuyerAmount { name: string; total: number }

interface Props {
  kpis: {
    newsletterCount:   number
    totalItemsSold:    number
    completionRate:    number
    uniqueBuyersCount: number
  }
  topBuyers:         Buyer[]
  topBuyersByAmount: BuyerAmount[]
  statusData:        StatusPoint[]
  provinceData:      DataPoint[]
  topProducts:       DataPoint[]
  topBrands:         DataPoint[]
  sizeData:          DataPoint[]
  colorData:         DataPoint[]
  trendData7:        DataPoint[]
  trendData30:       DataPoint[]
}

// ─── Design ────────────────────────────────────────────────────────────────────
const ACCENT  = '#c9a84c'
const DARK    = '#1a1a1a'
const PALETTE = [ACCENT, DARK, '#8B7355', '#999', '#D4AF37', '#555', '#B8960C', '#777']

const tip = {
  contentStyle: {
    background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8,
    fontSize: 12, fontFamily: 'IBM Plex Sans Arabic, sans-serif',
    color: '#1a1a1a', direction: 'rtl' as const,
  },
  cursor: { fill: 'rgba(201,168,76,0.06)' },
}
const axisStyle = { fontSize: 11, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }

// ─── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  title, value, sub, accent, onClick, linkLabel,
}: {
  title: string; value: string; sub?: string; accent?: boolean
  onClick?: () => void; linkLabel?: string
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: `1px solid ${accent ? '#c9a84c44' : '#e8e8e8'}`,
        borderRadius: 12, padding: '20px 18px',
        display: 'flex', flexDirection: 'column', gap: 6,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { if (onClick) (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      <span style={{ color: '#999', fontSize: 12 }}>{title}</span>
      <span style={{
        color: accent ? ACCENT : '#1a1a1a', fontSize: 24, fontWeight: 600,
        fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.1,
        direction: 'ltr', textAlign: 'right',
      }}>
        {value}
      </span>
      {sub && <span style={{ color: '#bbb', fontSize: 11 }}>{sub}</span>}
      {linkLabel && (
        <span style={{
          marginTop: 4, fontSize: 11, color: ACCENT,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {linkLabel} ←
        </span>
      )}
    </div>
  )
}

// ─── Chart Card ────────────────────────────────────────────────────────────────
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20 }}>
      <h3 style={{
        margin: '0 0 16px', paddingBottom: 10, borderBottom: '1px solid #f0f0f0',
        fontSize: 13, fontWeight: 500, color: '#1a1a1a',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Empty() {
  return <p style={{ color: '#bbb', fontSize: 13, margin: 0 }}>لا توجد بيانات بعد</p>
}

function ColorBarShape(props: any) {
  const { x, y, width, height, name } = props
  return <rect x={x} y={y} width={width} height={height} fill={colorForBar(name)} rx={6} />
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function AnalyticsCharts({
  kpis, topBuyers, topBuyersByAmount, statusData, provinceData, topProducts, topBrands, sizeData, colorData, trendData7, trendData30,
}: Props) {
  const router = useRouter()
  const [showBuyers, setShowBuyers] = useState(false)

  return (
    <>
      <style>{`
        .analytics-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .analytics-grid-3-2 {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .analytics-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        @media (max-width: 640px) {
          .analytics-grid-2,
          .analytics-grid-3-2 {
            grid-template-columns: 1fr !important;
          }
          .analytics-kpis {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {/* Modal — أكثر الزبائن شراءً */}
      {showBuyers && (
        <div
          onClick={() => setShowBuyers(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, padding: 24,
              width: '100%', maxWidth: 680, maxHeight: '85vh', overflow: 'auto',
              direction: 'rtl',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>أكثر الزبائن شراءً</h2>
              <button onClick={() => setShowBuyers(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 18, padding: 4,
              }}>✕</button>
            </div>

            {/* القائمتان جنباً لجنب */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* عدد الطلبات */}
              <div>
                <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, marginBottom: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                  بعدد الطلبات
                </p>
                {topBuyers.length === 0
                  ? <p style={{ color: '#bbb', fontSize: 13 }}>لا توجد بيانات</p>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {topBuyers.map((b, i) => (
                        <div key={b.name} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 10px',
                          background: i === 0 ? 'rgba(201,168,76,0.06)' : '#fafafa',
                          borderRadius: 8, border: `1px solid ${i === 0 ? '#c9a84c33' : '#f0f0f0'}`,
                        }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                            background: i === 0 ? ACCENT : '#e8e8e8',
                            color: i === 0 ? '#fff' : '#888',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700,
                          }}>{i + 1}</span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: i === 0 ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
                          <span style={{ fontSize: 12, color: '#888', fontWeight: 600, flexShrink: 0 }}>{b.count}</span>
                        </div>
                      ))}
                    </div>
                }
              </div>

              {/* مجموع المبالغ */}
              <div>
                <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, marginBottom: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                  بمجموع المبالغ
                </p>
                {topBuyersByAmount.length === 0
                  ? <p style={{ color: '#bbb', fontSize: 13 }}>لا توجد بيانات</p>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {topBuyersByAmount.map((b, i) => (
                        <div key={b.name} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 10px',
                          background: i === 0 ? 'rgba(201,168,76,0.06)' : '#fafafa',
                          borderRadius: 8, border: `1px solid ${i === 0 ? '#c9a84c33' : '#f0f0f0'}`,
                        }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                            background: i === 0 ? ACCENT : '#e8e8e8',
                            color: i === 0 ? '#fff' : '#888',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700,
                          }}>{i + 1}</span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: i === 0 ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
                          <span style={{ fontSize: 11, color: '#888', fontWeight: 600, flexShrink: 0, direction: 'ltr' }}>
                            {b.total.toLocaleString('en-US')}
                          </span>
                        </div>
                      ))}
                    </div>
                }
              </div>

            </div>
          </div>
        </div>
      )}

      <div style={{
        padding: '14px 16px', direction: 'rtl',
        fontFamily: 'IBM Plex Sans Arabic, sans-serif',
        background: '#f9f9f9', minHeight: '100vh',
      }}>

        {/* KPIs */}
        <div className="analytics-kpis">
          <KpiCard
            title="مشتركو النشرة"
            value={kpis.newsletterCount.toLocaleString('en-US')}
            sub="اضغط لعرض القائمة"
            accent
            onClick={() => router.push('/admin/management/newsletter')}
            linkLabel="عرض القائمة"
          />
          <KpiCard
            title="القطع المباعة"
            value={kpis.totalItemsSold.toLocaleString('en-US')}
            sub="من جميع الطلبات"
          />
          <KpiCard
            title="نسبة الإتمام"
            value={`${kpis.completionRate}%`}
            sub="طلبات وصلت للزبون"
          />
          <KpiCard
            title="الزبائن المتكررون"
            value={kpis.uniqueBuyersCount.toLocaleString('en-US')}
            sub="اضغط لعرض الأكثر شراءً"
            onClick={() => setShowBuyers(true)}
            linkLabel="عرض التفاصيل"
          />
        </div>

        {/* Row 1: Top Products (SKU) | Top Brands */}
        <div className="analytics-grid-2">
          <ChartCard title="أكثر المنتجات مبيعاً — بالكود (SKU)">
            {topProducts.length === 0 ? <Empty /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {topProducts.map((item, i) => {
                  const max = topProducts[0]?.value ?? 1
                  const pct = Math.round((item.value / max) * 100)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: i < 3 ? ACCENT : '#ccc', minWidth: 16, textAlign: 'center', fontWeight: 700 }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <code style={{ fontSize: 11, color: '#1a1a1a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: 'ltr', background: '#f5f5f5', padding: '1px 6px', borderRadius: 4 }}>
                            {item.name}
                          </code>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#555', flexShrink: 0, marginRight: 6, direction: 'ltr' }}>
                            {item.value.toLocaleString('en-US')}
                          </span>
                        </div>
                        <div style={{ height: 3, background: '#f0f0f0', borderRadius: 99 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: ACCENT, borderRadius: 99 }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ChartCard>

          <ChartCard title="أكثر 10 ماركات مبيعاً (قطع)">
            {topBrands.length === 0 ? <Empty /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {topBrands.map((brand, i) => {
                  const max = topBrands[0]?.value ?? 1
                  const pct = Math.round((brand.value / max) * 100)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: i < 3 ? ACCENT : '#ccc', minWidth: 16, textAlign: 'center', fontWeight: 700 }}>{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {brand.name}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#555', flexShrink: 0, marginRight: 6, direction: 'ltr' }}>
                            {brand.value.toLocaleString('en-US')}
                          </span>
                        </div>
                        <div style={{ height: 3, background: '#f0f0f0', borderRadius: 99 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: i < 3 ? ACCENT : '#c9a84c66', borderRadius: 99 }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ChartCard>
        </div>

        {/* Row 2: Status (بألوان الحالة) | Province */}
        <div className="analytics-grid-2">
          <ChartCard title="الطلبات حسب الحالة">
            {statusData.length === 0 ? <Empty /> : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} dataKey="value">
                      {statusData.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                    <Tooltip {...tip} formatter={(v, _, p) => [v, p.payload.name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
                  {statusData.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 500, color: '#333' }}>{s.name}</span>
                      </div>
                      <span style={{ color: s.color, fontWeight: 700, direction: 'ltr' }}>{s.value.toLocaleString('en-US')}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ChartCard>

          <ChartCard title="الطلبات حسب المحافظة">
            {provinceData.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={provinceData} margin={{ right: 8, left: 0 }}>
                  <XAxis dataKey="name" tick={{ ...axisStyle, fill: '#1a1a1a' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ ...axisStyle, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => Number(v ?? 0).toLocaleString('en-US')} />
                  <Tooltip {...tip} formatter={(v) => [Number(v ?? 0).toLocaleString('en-US') + ' طلب', 'المحافظة']} />
                  <Bar dataKey="value" fill={DARK} radius={[6, 6, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Row 3: Sizes | Colors */}
        <div className="analytics-grid-2">
          <ChartCard title="أكثر القياسات طلباً">
            {sizeData.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={sizeData} margin={{ right: 8, left: 0 }}>
                  <XAxis dataKey="name" tick={{ ...axisStyle, fill: '#1a1a1a', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ ...axisStyle, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => Number(v ?? 0).toLocaleString('en-US')} />
                  <Tooltip {...tip} formatter={(v) => [Number(v ?? 0).toLocaleString('en-US') + ' طلب', 'القياس']} />
                  <Bar dataKey="value" fill={ACCENT} radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="أكثر الألوان طلباً">
            {colorData.length === 0 ? <Empty /> : (
              <>
                <ResponsiveContainer width="100%" height={185}>
                  <BarChart data={colorData} margin={{ right: 8, left: 0 }}>
                    <XAxis dataKey="name" tick={{ ...axisStyle, fill: '#1a1a1a' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ ...axisStyle, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => Number(v ?? 0).toLocaleString('en-US')} />
                    <Tooltip {...tip} formatter={(v) => [Number(v ?? 0).toLocaleString('en-US') + ' طلب', 'اللون']} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={30} shape={<ColorBarShape />} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10 }}>
                  {colorData.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#555' }}>
                      <span style={{ width: 11, height: 11, borderRadius: 3, background: colorForBar(c.name), border: c.name === 'White' ? '1px solid #ccc' : 'none', flexShrink: 0 }} />
                      {c.name}
                    </div>
                  ))}
                </div>
              </>
            )}
          </ChartCard>
        </div>

        {/* Row 4: 7 أيام | 30 يوم */}
        <div className="analytics-grid-2">
          <ChartCard title="الطلبات — آخر 7 أيام">
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={trendData7} margin={{ right: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ ...axisStyle, fill: '#1a1a1a' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ ...axisStyle, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => Number(v ?? 0).toLocaleString('en-US')} />
                <Tooltip {...tip} formatter={(v) => [Number(v ?? 0).toLocaleString('en-US') + ' طلب', 'اليوم']} />
                <Line type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2.5}
                  dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="الطلبات — آخر 30 يوم">
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={trendData30} margin={{ right: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ ...axisStyle, fill: '#1a1a1a' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis allowDecimals={false} tick={{ ...axisStyle, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => Number(v ?? 0).toLocaleString('en-US')} />
                <Tooltip {...tip} formatter={(v) => [Number(v ?? 0).toLocaleString('en-US') + ' طلب', 'اليوم']} />
                <Line type="monotone" dataKey="value" stroke={DARK} strokeWidth={2}
                  dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>
    </>
  )
}
