'use client'
import { useState, useRef } from 'react'
import { saveBrandSpotlight } from './actions'
import { brandImgUrl } from '@/lib/brand-utils'

interface Spotlight { slot: number; brands: string[]; imgPath: string; imgVer: number }
interface Props { spotlights: Spotlight[]; brands: string[] }

const slotLabel = ['الخانة الأولى', 'الخانة الثانية', 'الخانة الثالثة']

const inp: React.CSSProperties = {
  flex: 1, border: '1px solid #e0e0e0', borderRadius: 8,
  padding: '9px 12px', fontSize: 13, fontFamily: 'inherit',
  color: '#1a1a1a', background: '#fff', minHeight: 44,
}

export default function BrandSpotlightEditor({ spotlights, brands }: Props) {
  const [slots, setSlots] = useState(() =>
    spotlights.map(s => ({
      ...s,
      // حافظ على الماركات الموجودة في القائمة فقط
      brands:       s.brands.filter(b => brands.includes(b)),
      stagedFile:   null as File | null,
      localPreview: null as string | null,
    }))
  )
  const [loading, setLoading] = useState<Record<number, boolean>>({})
  const [msg,     setMsg]     = useState<Record<number, { text: string; ok: boolean }>>({})
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  function updateSlot(slot: number, patch: Partial<typeof slots[0]>) {
    setSlots(prev => prev.map(s => s.slot === slot ? { ...s, ...patch } : s))
  }

  // تحديث ماركة في موضع معين
  function setBrandAt(slot: number, idx: number, val: string) {
    const cur = slots.find(s => s.slot === slot)!
    const next = [...cur.brands]
    next[idx] = val
    updateSlot(slot, { brands: next })
  }

  // إضافة ماركة جديدة
  function addBrand(slot: number) {
    const cur = slots.find(s => s.slot === slot)!
    if (cur.brands.length >= 3) return
    // اختر أول ماركة غير محددة
    const available = brands.find(b => !cur.brands.includes(b)) ?? brands[0]
    updateSlot(slot, { brands: [...cur.brands, available] })
  }

  // حذف ماركة
  function removeBrand(slot: number, idx: number) {
    const cur = slots.find(s => s.slot === slot)!
    const next = cur.brands.filter((_, i) => i !== idx)
    updateSlot(slot, { brands: next })
  }

  async function handleSave(slot: number) {
    const s = slots.find(x => x.slot === slot)!
    if (!s.brands.length) return

    setLoading(l => ({ ...l, [slot]: true }))
    setMsg(m => ({ ...m, [slot]: { text: '', ok: true } }))

    let imgFd: FormData | null = null
    if (s.stagedFile) {
      imgFd = new FormData()
      imgFd.append('file', s.stagedFile)
    }

    const res = await saveBrandSpotlight(slot, s.brands, imgFd)
    setLoading(l => ({ ...l, [slot]: false }))

    if (!res.ok) {
      setMsg(m => ({ ...m, [slot]: { text: `خطأ: ${res.error}`, ok: false } }))
      return
    }
    if (res.imgPath !== undefined) {
      updateSlot(slot, { imgPath: res.imgPath, imgVer: res.imgVer!, stagedFile: null, localPreview: null })
    } else {
      updateSlot(slot, { stagedFile: null, localPreview: null })
    }
    setMsg(m => ({ ...m, [slot]: { text: 'تم الحفظ ✓', ok: true } }))
    setTimeout(() => setMsg(m => ({ ...m, [slot]: { text: '', ok: true } })), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {slots.map((spot, idx) => {
        const isLoading = loading[spot.slot] ?? false
        const feedback  = msg[spot.slot]
        const savedBrands = spotlights[idx]?.brands ?? []
        const isDirty = Boolean(
          spot.stagedFile ||
          JSON.stringify(spot.brands) !== JSON.stringify(savedBrands)
        )
        const imgSrc = spot.localPreview ?? brandImgUrl(spot.imgPath, spot.imgVer)

        return (
          <div key={spot.slot} style={{
            background: '#fff', borderRadius: 14,
            border: `1px solid ${isDirty ? '#c9a84c' : '#ebebeb'}`,
            padding: 20,
            boxShadow: isDirty ? '0 0 0 2px rgba(201,168,76,0.15)' : '0 1px 4px rgba(0,0,0,0.05)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>

            {/* ── العنوان ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#1a1a1a', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>{spot.slot}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{slotLabel[idx]}</span>
              {isDirty && (
                <span style={{ marginRight: 'auto', fontSize: 11, color: '#c9a84c', fontWeight: 600 }}>
                  • لم يُحفظ بعد
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>

              {/* ── معاينة الصورة ── */}
              <div
                onClick={() => fileRefs.current[spot.slot]?.click()}
                title="انقر لاختيار صورة — 1875×1188 px"
                style={{
                  width: 120, height: 80, borderRadius: 8, overflow: 'hidden',
                  flexShrink: 0, background: '#111',
                  border: '1.5px dashed #ccc', position: 'relative', cursor: 'pointer',
                }}
              >
                <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.08' }} />
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: '0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0' }}
                >
                  <span style={{ color: '#fff', fontSize: 11, textAlign: 'center' }}>تغيير<br/>الصورة</span>
                </div>
                {isLoading && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#888',
                  }}>جارٍ...</div>
                )}
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }}
                ref={el => { fileRefs.current[spot.slot] = el }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) updateSlot(spot.slot, { stagedFile: file, localPreview: URL.createObjectURL(file) })
                  e.target.value = ''
                }}
              />

              {/* ── الماركات ── */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{
                  display: 'block', fontSize: 11, color: '#888',
                  fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em',
                }}>
                  الماركات المعروضة
                  <span style={{ color: '#bbb', fontWeight: 400, marginRight: 4 }}>(حتى 3)</span>
                </label>

                {/* قائمة الماركات المختارة */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(spot.brands.length === 0 ? [''] : spot.brands).map((b, bi) => (
                    <div key={bi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select
                        disabled={isLoading}
                        value={b}
                        onChange={e => setBrandAt(spot.slot, bi, e.target.value)}
                        style={{
                          ...inp,
                          border: `1px solid ${!b ? '#e8a020' : '#e0e0e0'}`,
                          color:  b ? '#1a1a1a' : '#aaa',
                          cursor: 'pointer',
                        }}
                      >
                        {!b && <option value="" disabled>— اختر ماركة —</option>}
                        {brands.map(br => (
                          <option key={br} value={br}>{br}</option>
                        ))}
                      </select>

                      {/* زر حذف ماركة (إذا أكثر من واحدة) */}
                      {spot.brands.length > 1 && b && (
                        <button
                          onClick={() => removeBrand(spot.slot, bi)}
                          style={{
                            width: 32, height: 32, borderRadius: '50%',
                            border: '1px solid #f0d0d0', background: '#fff',
                            color: '#e74c3c', cursor: 'pointer', fontSize: 16,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >×</button>
                      )}
                    </div>
                  ))}

                  {/* زر إضافة ماركة */}
                  {spot.brands.length > 0 && spot.brands.length < 3 && spot.brands.every(b => b) && (
                    <button
                      onClick={() => addBrand(spot.slot)}
                      style={{
                        width: '100%', padding: '7px', borderRadius: 8,
                        border: '1.5px dashed #c9a84c',
                        background: 'rgba(201,168,76,0.04)',
                        color: '#c9a84c', cursor: 'pointer',
                        fontSize: 12, fontFamily: 'inherit',
                      }}
                    >
                      + إضافة ماركة أخرى
                    </button>
                  )}
                </div>

                {/* صورة */}
                <div style={{ marginTop: 10 }}>
                  <label style={{
                    display: 'block', fontSize: 11, color: '#888',
                    fontWeight: 600, marginBottom: 5, letterSpacing: '0.05em',
                  }}>
                    صورة الغلاف
                    <span style={{ color: '#c9a84c', fontWeight: 400, marginRight: 4 }}>— 1875 × 1188 px</span>
                  </label>
                  <button
                    disabled={isLoading}
                    onClick={() => fileRefs.current[spot.slot]?.click()}
                    style={{
                      width: '100%', padding: '8px 14px', borderRadius: 8,
                      border: `1.5px dashed ${spot.stagedFile ? '#c9a84c' : '#d0d0d0'}`,
                      background: spot.stagedFile ? 'rgba(201,168,76,0.05)' : '#fafafa',
                      cursor: 'pointer', fontSize: 12,
                      color: spot.stagedFile ? '#c9a84c' : '#888',
                      fontFamily: 'inherit', minHeight: 38,
                    }}
                  >
                    {spot.stagedFile ? `✓ ${spot.stagedFile.name}` : 'اختيار صورة جديدة'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── زر الحفظ ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <button
                onClick={() => handleSave(spot.slot)}
                disabled={isLoading || spot.brands.length === 0 || spot.brands.some(b => !b)}
                style={{
                  padding: '10px 28px', borderRadius: 8, border: 'none',
                  background: isLoading
                    ? '#ccc'
                    : isDirty ? '#1a1a1a' : '#e8e8e8',
                  color: isDirty ? '#fff' : '#aaa',
                  cursor: (isLoading || !spot.brands.length) ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontFamily: 'inherit', fontWeight: 600,
                  minHeight: 40, transition: 'all 0.2s',
                }}
              >
                {isLoading ? 'جارٍ الحفظ...' : 'حفظ'}
              </button>
              {feedback?.text && (
                <span style={{ fontSize: 12, color: feedback.ok ? '#16a34a' : '#c0392b' }}>
                  {feedback.text}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
