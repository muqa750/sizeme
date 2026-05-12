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
interface DataPoint { name: string; value: number }
interface Buyer     { name: string; count: number }

interface Props {
  kpis: {
    newsletterCount: number
    totalItemsSold:  number
    completionRate:  number
    topBuyer:        Buyer | null
  }
  topBuyers:    Buyer[]
  statusData:   DataPoint[]
  provinceData: DataPoint[]
  topProducts:  DataPoint[]
  sizeData:     DataPoint[]
  colorData:    DataPoint[]
  trendData:    DataPoint[]
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
  kpis, topBuyers, statusData, provinceData, topProducts, sizeData, colorData, trendData,
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
              width: '100%', maxWidth: 400, maxHeight: '80vh', overflow: 'auto',
              direction: 'rtl',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>أكثر الزبائن شراءً</h2>
              <button onClick={() => setShowBuyers(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 18, padding: 4,
              }}>✕</button>
            </div>
            {topBuyers.length === 0 ? (
              <p style={{ color: '#bbb', textAlign: 'center', padding: '2rem 0' }}>لا توجد بيانات بعد</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topBuyers.map((b, i) => (
                  <div key={b.name} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '10px 12px', background: i === 0 ? 'rgba(201,168,76,0.06)' : '#fafafa',
                    borderRadius: 10, border: `1px solid ${i === 0 ? '#c9a84c33' : '#f0f0f0'}`,
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: i === 0 ? ACCENT : '#e8e8e8',
                      color: i === 0 ? '#fff' : '#888',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ flex: 1, fontWeight: i === 0 ? 600 : 400, fontSize: 14 }}>{b.name}</span>
                    <span style={{
                      background: '#f0f0f0', borderRadius: 20, padding: '2px 10px',
                      fontSize: 12, color: '#555', fontWeight: 600,
                    }}>
                      {b.count} طلب
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{
        padding: '20px 16px', direction: 'rtl',
        fontFamily: 'IBM Plex Sans Arabic, sans-serif',
        background: '#f9f9f9', minHeight: '100vh',
      }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px' }}>
            الإحصائيات
          </h1>
          <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>نظرة شاملة على أداء Sizeme</p>
        </div>

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
            title="أكثر زبون شراءً"
            value={kpis.topBuyer ? kpis.topBuyer.name : '—'}
            sub={kpis.topBuyer ? `${kpis.topBuyer.count} طلب — اضغط لعرض الكل` : undefined}
            onClick={() => setShowBuyers(true)}
            linkLabel="عرض أكثر 15 زبون"
          />
        </div>

        {/* Row 1: Top Products + Status */}
        <div className="analytics-grid-3-2">
          <ChartCard title="أكثر المنتجات مبيعاً (قطع)">
            {topProducts.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topProducts} layout="vertical" margin={{ right: 16, left: 0 }}>
                  <XAxis type="number" tick={{ ...axisStyle, fill: '#aaa' }} axisLine={false} tickLine={false}
                    tickFormatter={v => Number(v ?? 0).toLocaleString('en-US')} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ ...axisStyle, fill: '#1a1a1a' }} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} formatter={(v) => [Number(v ?? 0).toLocaleString('en-US') + ' قطعة', 'المبيعات']} />
                  <Bar dataKey="value" fill={ACCENT} radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="الطلبات حسب الحالة">
            {statusData.length === 0 ? <Empty /> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={3} dataKey="value">
                      {statusData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip {...tip} formatter={(v, _, p) => [v, p.payload.name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                  {statusData.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                        {s.name}
                      </div>
                      <span style={{ color: '#aaa', direction: 'ltr' }}>{s.value.toLocaleString('en-US')}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ChartCard>
        </div>

        {/* Row 2: Sizes + Colors */}
        <div className="analytics-grid-2">
          <ChartCard title="أكثر القياسات طلباً">
            {sizeData.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={220}>
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
                <ResponsiveContainer width="100%" height={200}>
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

        {/* Row 3: Province + Trend */}
        <div className="analytics-grid-2">
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

          <ChartCard title="الطلبات — آخر 7 أيام">
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={trendData} margin={{ right: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ ...axisStyle, fill: '#1a1a1a' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ ...axisStyle, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => Number(v ?? 0).toLocaleString('en-US')} />
                <Tooltip {...tip} formatter={(v) => [Number(v ?? 0).toLocaleString('en-US') + ' طلب', 'اليوم']} />
                <Line type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2.5}
                  dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>
    </>
  )
}
