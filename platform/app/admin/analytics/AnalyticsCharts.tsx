'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'

// ─── Color map (English names → hex) ─────────────────────────────────────────
const COLOR_HEX: Record<string, string> = {
  'Black':      '#1a1a1a',
  'White':      '#d0d0d0',   // أبيض → رمادي فاتح للظهور على البيضاء
  'Dark Navy':  '#1B2A4A',
  'Royal Blue': '#1C4EBF',
  'Brown':      '#6B3F2A',
  'Burgundy':   '#6D1A36',
  'Charcoal':   '#3D3D3D',
  'Taupe':      '#B5A69A',
  'Olive':      '#5A5E3A',
}

function colorForBar(name: string): string {
  return COLOR_HEX[name] ?? '#c9a84c'
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface DataPoint { name: string; value: number }

interface Props {
  kpis: {
    newsletterCount: number
    totalItemsSold:  number
    completionRate:  number
    topBuyer:        { name: string; count: number } | null
  }
  statusData:   DataPoint[]
  provinceData: DataPoint[]
  topProducts:  DataPoint[]
  sizeData:     DataPoint[]
  colorData:    DataPoint[]
  trendData:    DataPoint[]
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT  = '#c9a84c'
const DARK    = '#1a1a1a'
const PALETTE = [ACCENT, DARK, '#8B7355', '#999', '#D4AF37', '#555', '#B8960C', '#777']

const tip = {
  contentStyle: {
    background: '#fff',
    border: '1px solid #e8e8e8',
    borderRadius: 8,
    fontSize: 12,
    fontFamily: 'IBM Plex Sans Arabic, sans-serif',
    color: '#1a1a1a',
    direction: 'rtl' as const,
  },
  cursor: { fill: 'rgba(201,168,76,0.06)' },
}

const axisStyle = { fontSize: 11, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }

// ─── Reusable components ──────────────────────────────────────────────────────
function KpiCard({
  title, value, sub, accent,
}: {
  title: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${accent ? '#c9a84c44' : '#e8e8e8'}`,
      borderRadius: 12,
      padding: '22px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <span style={{ color: '#999', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
        {title}
      </span>
      <span style={{
        color: accent ? ACCENT : '#1a1a1a',
        fontSize: 26,
        fontWeight: 600,
        fontFamily: 'Cormorant Garamond, serif',
        lineHeight: 1.1,
        direction: 'ltr',
        textAlign: 'right',
      }}>
        {value}
      </span>
      {sub && (
        <span style={{ color: '#bbb', fontSize: 11, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
          {sub}
        </span>
      )}
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8e8e8',
      borderRadius: 12,
      padding: 24,
    }}>
      <h3 style={{
        margin: '0 0 18px',
        paddingBottom: 12,
        borderBottom: '1px solid #f0f0f0',
        fontSize: 13,
        fontWeight: 500,
        color: '#1a1a1a',
        fontFamily: 'IBM Plex Sans Arabic, sans-serif',
        letterSpacing: '0.03em',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Empty() {
  return (
    <p style={{ color: '#bbb', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic, sans-serif', margin: 0 }}>
      لا توجد بيانات بعد
    </p>
  )
}

// ─── Custom color bar (each bar gets its own color) ───────────────────────────
function ColorBarShape(props: any) {
  const { x, y, width, height, name } = props
  return <rect x={x} y={y} width={width} height={height} fill={colorForBar(name)} rx={6} />
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AnalyticsCharts({
  kpis, statusData, provinceData, topProducts, sizeData, colorData, trendData,
}: Props) {
  return (
    <div style={{
      padding: '32px 28px',
      direction: 'rtl',
      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
      background: '#f9f9f9',
      minHeight: '100vh',
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 28, fontWeight: 600, color: '#1a1a1a',
          fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px',
        }}>
          الإحصائيات
        </h1>
        <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>
          نظرة شاملة على أداء Sizeme
        </p>
      </div>

      {/* ── KPI Row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
        gap: 12,
        marginBottom: 20,
      }}>
        <KpiCard
          title="مشتركو النشرة البريدية"
          value={kpis.newsletterCount.toLocaleString('en-US')}
          sub="إجمالي المشتركين"
          accent
        />
        <KpiCard
          title="القطع المباعة"
          value={kpis.totalItemsSold.toLocaleString('en-US')}
          sub="من جميع الطلبات"
        />
        <KpiCard
          title="نسبة إتمام الطلبات"
          value={`${kpis.completionRate}%`}
          sub="من الطلبات وصلت للزبون"
        />
        <KpiCard
          title="أكثر زبون شراءً"
          value={kpis.topBuyer ? kpis.topBuyer.name : '—'}
          sub={kpis.topBuyer ? `${kpis.topBuyer.count} طلب` : undefined}
        />
      </div>

      {/* ── Row 1: Top Products + Status ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12, marginBottom: 12 }}>

        <ChartCard title="أكثر المنتجات مبيعاً (قطع)">
          {topProducts.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProducts} layout="vertical" margin={{ right: 20, left: 0 }}>
                <XAxis
                  type="number"
                  tick={{ ...axisStyle, fill: '#aaa' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => v.toLocaleString('en-US')}
                />
                <YAxis
                  type="category" dataKey="name" width={135}
                  tick={{ ...axisStyle, fill: '#1a1a1a' }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip {...tip} formatter={(v: number) => [v.toLocaleString('en-US') + ' قطعة', 'المبيعات']} />
                <Bar dataKey="value" fill={ACCENT} radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="الطلبات حسب الحالة">
          {statusData.length === 0 ? <Empty /> : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={3} dataKey="value"
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tip} formatter={(v, _, p) => [v, p.payload.name]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 12 }}>
                {statusData.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, color: '#1a1a1a',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{
                        width: 9, height: 9, borderRadius: '50%',
                        background: PALETTE[i % PALETTE.length], flexShrink: 0,
                      }} />
                      {s.name}
                    </div>
                    <span style={{ color: '#aaa', fontVariantNumeric: 'tabular-nums', direction: 'ltr' }}>
                      {s.value.toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>
      </div>

      {/* ── Row 2: Sizes + Colors ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

        <ChartCard title="أكثر القياسات طلباً">
          {sizeData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sizeData} margin={{ right: 8, left: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ ...axisStyle, fill: '#1a1a1a', fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ ...axisStyle, fill: '#aaa' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => v.toLocaleString('en-US')}
                />
                <Tooltip {...tip} formatter={(v: number) => [v.toLocaleString('en-US') + ' طلب', 'القياس']} />
                <Bar dataKey="value" fill={ACCENT} radius={[6, 6, 0, 0]} barSize={38} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="أكثر الألوان طلباً">
          {colorData.length === 0 ? <Empty /> : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={colorData} margin={{ right: 8, left: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ ...axisStyle, fill: '#1a1a1a' }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ ...axisStyle, fill: '#aaa' }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => v.toLocaleString('en-US')}
                  />
                  <Tooltip {...tip} formatter={(v: number) => [v.toLocaleString('en-US') + ' طلب', 'اللون']} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32} shape={<ColorBarShape />} />
                </BarChart>
              </ResponsiveContainer>

              {/* Color swatches legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
                {colorData.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}>
                    <span style={{
                      width: 12, height: 12, borderRadius: 3,
                      background: colorForBar(c.name),
                      border: c.name === 'White' ? '1px solid #ccc' : 'none',
                      flexShrink: 0,
                    }} />
                    {c.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>
      </div>

      {/* ── Row 3: Province + Trend ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        <ChartCard title="الطلبات حسب المحافظة">
          {provinceData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={provinceData} margin={{ right: 8, left: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ ...axisStyle, fill: '#1a1a1a' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ ...axisStyle, fill: '#aaa' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => v.toLocaleString('en-US')}
                />
                <Tooltip {...tip} formatter={(v: number) => [v.toLocaleString('en-US') + ' طلب', 'المحافظة']} />
                <Bar dataKey="value" fill={DARK} radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="الطلبات — آخر 7 أيام">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ right: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ ...axisStyle, fill: '#1a1a1a' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ ...axisStyle, fill: '#aaa' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => v.toLocaleString('en-US')}
              />
              <Tooltip {...tip} formatter={(v: number) => [v.toLocaleString('en-US') + ' طلب', 'اليوم']} />
              <Line
                type="monotone" dataKey="value"
                stroke={ACCENT} strokeWidth={2.5}
                dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

    </div>
  )
}
