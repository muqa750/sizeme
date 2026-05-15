'use client'
import { useState, useRef, useEffect } from 'react'

interface Props {
  file: File
  onConfirm: (croppedFile: File) => void
  onCancel: () => void
}

const OUT_W = 800
const OUT_H = 1000

export default function ImageCropModal({ file, onConfirm, onCancel }: Props) {
  const [imgSrc, setImgSrc]       = useState('')
  const [ready, setReady]         = useState(false)
  const [processing, setProcessing] = useState(false)
  const [scale, setScale]         = useState(1)
  const [imgX, setImgX]           = useState(0)
  const [imgY, setImgY]           = useState(0)
  const [baseW, setBaseW]         = useState(0)
  const [baseH, setBaseH]         = useState(0)
  const [natW, setNatW]           = useState(0)
  const [natH, setNatH]           = useState(0)
  const [cfX, setCfX]             = useState(0)  // crop frame X
  const [cfY, setCfY]             = useState(0)  // crop frame Y
  const [cfW, setCfW]             = useState(0)  // crop frame W
  const [cfH, setCfH]             = useState(0)  // crop frame H
  const [cW, setCW]               = useState(0)  // container W
  const [cH, setCH]               = useState(0)  // container H

  const imgRef       = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Refs للقيم الحالية داخل handlers (تتحديث بعد كل render)
  const S = useRef({ scale, imgX, imgY, baseW, baseH, cfX, cfY, cfW, cfH, cW, cH })
  useEffect(() => { S.current = { scale, imgX, imgY, baseW, baseH, cfX, cfY, cfW, cfH, cW, cH } })

  // Pointer tracking للـ multi-touch
  const ptrs      = useRef<Map<number, { x: number; y: number }>>(new Map())
  const lastDist  = useRef(0)
  const dragStart = useRef({ x: 0, y: 0, ix: 0, iy: 0 })

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setImgSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // يضمن أن الصورة دائماً تغطي إطار القص
  function clamp(nx: number, ny: number, ns: number, bw: number, bh: number, fx: number, fy: number, fw: number, fh: number) {
    const iw = bw * ns
    const ih = bh * ns
    return {
      x: Math.max(fx + fw - iw, Math.min(fx, nx)),
      y: Math.max(fy + fh - ih, Math.min(fy, ny)),
    }
  }

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const cont = containerRef.current
    if (!cont) return
    const contW = cont.offsetWidth
    const contH = cont.offsetHeight || window.innerHeight - 140
    const nw    = e.currentTarget.naturalWidth
    const nh    = e.currentTarget.naturalHeight

    setNatW(nw); setNatH(nh)
    setCW(contW); setCH(contH)

    // إطار القص — 82% من عرض الحاوية، نسبة 4:5
    const fw = Math.floor(contW * 0.82)
    const fh = Math.floor(fw * 1.25)
    const fx = (contW - fw) / 2
    const fy = (contH - fh) / 2
    setCfW(fw); setCfH(fh); setCfX(fx); setCfY(fy)

    // الحجم الأساسي للصورة عند scale=1 يكفي لتغطية الإطار
    const minS  = Math.max(fw / nw, fh / nh)
    const bw    = Math.round(nw * minS)
    const bh    = Math.round(nh * minS)
    setBaseW(bw); setBaseH(bh)

    // مركز الصورة في الحاوية
    const ix = (contW - bw) / 2
    const iy = (contH - bh) / 2
    setScale(1); setImgX(ix); setImgY(iy)
    setReady(true)
  }

  // ── Pointer handlers ────────────────────────────────────────────────────────
  function onPtrDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault()
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    if (ptrs.current.size === 1) {
      dragStart.current = { x: e.clientX, y: e.clientY, ix: S.current.imgX, iy: S.current.imgY }
    }
  }

  function onPtrMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!ptrs.current.has(e.pointerId)) return
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const { scale: s, baseW: bw, baseH: bh, cfX: fx, cfY: fy, cfW: fw, cfH: fh } = S.current

    if (ptrs.current.size === 1) {
      // تحريك
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      const p  = clamp(dragStart.current.ix + dx, dragStart.current.iy + dy, s, bw, bh, fx, fy, fw, fh)
      setImgX(p.x); setImgY(p.y)
      S.current = { ...S.current, imgX: p.x, imgY: p.y }
    } else if (ptrs.current.size === 2) {
      // تكبير بأصبعين
      const pts     = Array.from(ptrs.current.values())
      const newDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      if (lastDist.current > 0) {
        const ratio    = newDist / lastDist.current
        const ns       = Math.min(4, Math.max(1, s * ratio))
        const midX     = (pts[0].x + pts[1].x) / 2
        const midY     = (pts[0].y + pts[1].y) / 2
        const cont     = containerRef.current!.getBoundingClientRect()
        const mcx      = midX - cont.left
        const mcy      = midY - cont.top
        const { imgX: ix, imgY: iy } = S.current
        const pxRatio  = (mcx - ix) / (bw * s)
        const pyRatio  = (mcy - iy) / (bh * s)
        const nx       = mcx - pxRatio * bw * ns
        const ny       = mcy - pyRatio * bh * ns
        const p        = clamp(nx, ny, ns, bw, bh, fx, fy, fw, fh)
        setScale(ns); setImgX(p.x); setImgY(p.y)
        // تحديث فوري — يمنع تشويه الصورة عند التقريب بأصبعين متسارع
        S.current = { ...S.current, scale: ns, imgX: p.x, imgY: p.y }
      }
      lastDist.current = newDist
    }
  }

  function onPtrUp(e: React.PointerEvent<HTMLDivElement>) {
    ptrs.current.delete(e.pointerId)
    if (ptrs.current.size < 2) lastDist.current = 0
  }

  // تكبير بعجلة الفأرة (ديسكتوب)
  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    const { scale: s, baseW: bw, baseH: bh, imgX: ix, imgY: iy, cfX: fx, cfY: fy, cfW: fw, cfH: fh } = S.current
    const ns   = Math.min(4, Math.max(1, s * (e.deltaY > 0 ? 0.92 : 1.08)))
    const cont = containerRef.current!.getBoundingClientRect()
    const mx   = e.clientX - cont.left
    const my   = e.clientY - cont.top
    const px   = (mx - ix) / (bw * s)
    const py   = (my - iy) / (bh * s)
    const p    = clamp(mx - px * bw * ns, my - py * bh * ns, ns, bw, bh, fx, fy, fw, fh)
    setScale(ns); setImgX(p.x); setImgY(p.y)
  }

  // شريط التكبير
  function onSlider(val: number) {
    const { scale: s, baseW: bw, baseH: bh, imgX: ix, imgY: iy, cfX: fx, cfY: fy, cfW: fw, cfH: fh, cW: contW, cH: contH } = S.current
    const ns  = val / 100
    const mcx = contW / 2
    const mcy = contH / 2
    const px  = (mcx - ix) / (bw * s)
    const py  = (mcy - iy) / (bh * s)
    const p   = clamp(mcx - px * bw * ns, mcy - py * bh * ns, ns, bw, bh, fx, fy, fw, fh)
    setScale(ns); setImgX(p.x); setImgY(p.y)
  }

  // ── تأكيد القص ─────────────────────────────────────────────────────────────
  async function handleConfirm() {
    if (!imgRef.current || !ready) return
    setProcessing(true)

    const iw  = baseW * scale
    const ih  = baseH * scale
    const sx  = (cfX - imgX) * (natW / iw)
    const sy  = (cfY - imgY) * (natH / ih)
    const sw  = cfW * (natW / iw)
    const sh  = cfH * (natH / ih)

    const canvas = document.createElement('canvas')
    canvas.width = OUT_W; canvas.height = OUT_H
    canvas.getContext('2d')!.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, OUT_W, OUT_H)

    canvas.toBlob(blob => {
      if (!blob) { setProcessing(false); return }
      onConfirm(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.92)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ position:'fixed', inset:0, background:'#080808', zIndex:10001, display:'flex', flexDirection:'column', fontFamily:'IBM Plex Sans Arabic, sans-serif' }}>

      {/* شريط الأعلى */}
      <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
        <button onClick={onCancel} style={{ background:'none', border:'none', color:'#777', fontSize:14, cursor:'pointer', minWidth:56, minHeight:40 }}>إلغاء</button>
        <div style={{ textAlign:'center' }}>
          <p style={{ color:'#c9a84c', fontSize:11, letterSpacing:'0.1em', margin:0 }}>4:5 — 800×1000</p>
          <p style={{ color:'#444', fontSize:10, margin:'2px 0 0' }}>حرّك وكبّر الصورة</p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!ready || processing}
          style={{ background: ready ? '#c9a84c' : '#222', border:'none', borderRadius:8, padding:'8px 18px', color:'#fff', fontSize:14, fontWeight:600, cursor: ready ? 'pointer' : 'default', minHeight:40 }}
        >
          {processing ? '...' : 'قص ✓'}
        </button>
      </div>

      {/* منطقة الصورة */}
      <div
        ref={containerRef}
        style={{ flex:1, position:'relative', overflow:'hidden', touchAction:'none', cursor:'grab' }}
        onPointerDown={onPtrDown}
        onPointerMove={onPtrMove}
        onPointerUp={onPtrUp}
        onPointerCancel={onPtrUp}
        onWheel={onWheel}
      >
        {imgSrc && (
          <img
            ref={imgRef}
            src={imgSrc}
            alt=""
            onLoad={onImgLoad}
            style={{
              position:'absolute',
              left: imgX, top: imgY,
              width:  ready ? baseW * scale : 'auto',
              height: ready ? baseH * scale : 'auto',
              userSelect:'none', pointerEvents:'none', display:'block',
            }}
            draggable={false}
          />
        )}

        {/* طبقات الظل + الإطار */}
        {ready && (
          <>
            <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
              {/* ظل الأعلى */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height: cfY, background:'rgba(0,0,0,0.72)' }} />
              {/* ظل الأسفل */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, top: cfY + cfH, background:'rgba(0,0,0,0.72)' }} />
              {/* ظل اليسار */}
              <div style={{ position:'absolute', top: cfY, left:0, width: cfX, height: cfH, background:'rgba(0,0,0,0.72)' }} />
              {/* ظل اليمين */}
              <div style={{ position:'absolute', top: cfY, left: cfX + cfW, right:0, height: cfH, background:'rgba(0,0,0,0.72)' }} />
              {/* الإطار */}
              <div style={{ position:'absolute', top: cfY, left: cfX, width: cfW, height: cfH, border:'2px solid rgba(201,168,76,0.85)', boxSizing:'border-box' }}>
                {/* زوايا ذهبية */}
                {([{top:-2,left:-2},{top:-2,right:-2},{bottom:-2,left:-2},{bottom:-2,right:-2}] as React.CSSProperties[]).map((s, i) => (
                  <div key={i} style={{ position:'absolute', width:18, height:18, ...s,
                    borderTop:    s.top    !== undefined ? '3px solid #c9a84c' : undefined,
                    borderBottom: s.bottom !== undefined ? '3px solid #c9a84c' : undefined,
                    borderLeft:   s.left   !== undefined ? '3px solid #c9a84c' : undefined,
                    borderRight:  s.right  !== undefined ? '3px solid #c9a84c' : undefined,
                  }} />
                ))}
                {/* خطوط الثلاثيات */}
                {[33.3, 66.6].map(p => (
                  <div key={`v${p}`} style={{ position:'absolute', top:0, bottom:0, left:`${p}%`, width:1, background:'rgba(255,255,255,0.15)' }} />
                ))}
                {[33.3, 66.6].map(p => (
                  <div key={`h${p}`} style={{ position:'absolute', left:0, right:0, top:`${p}%`, height:1, background:'rgba(255,255,255,0.15)' }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* شريط التكبير */}
      {ready && (
        <div style={{ padding:'10px 20px 14px', display:'flex', alignItems:'center', gap:12, flexShrink:0, background:'rgba(0,0,0,0.6)' }}>
          <button
            onClick={() => onSlider(Math.max(100, Math.round(scale * 100) - 10))}
            style={{ background:'none', border:'none', color:'#666', fontSize:20, cursor:'pointer', minWidth:32, minHeight:40, display:'flex', alignItems:'center', justifyContent:'center' }}
          >−</button>
          <input
            type="range" min={100} max={400} step={1}
            value={Math.round(scale * 100)}
            onChange={e => onSlider(Number(e.target.value))}
            style={{ flex:1, accentColor:'#c9a84c', height:4, cursor:'pointer' }}
          />
          <button
            onClick={() => onSlider(Math.min(400, Math.round(scale * 100) + 10))}
            style={{ background:'none', border:'none', color:'#666', fontSize:20, cursor:'pointer', minWidth:32, minHeight:40, display:'flex', alignItems:'center', justifyContent:'center' }}
          >+</button>
          <span style={{ color:'#c9a84c', fontSize:12, minWidth:36, textAlign:'center' }}>{Math.round(scale * 100)}%</span>
        </div>
      )}
    </div>
  )
}
