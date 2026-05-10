'use client'

import { useState, useTransition } from 'react'
import { updateSetting } from '@/lib/actions/admin-management'

interface Setting { key: string; value: unknown }
interface Props { settings: Setting[] }

export default function SettingsClient({ settings: initial }: Props) {
  const [settings, setSettings] = useState(initial)
  const [editKey, setEditKey]   = useState<string | null>(null)
  const [editVal, setEditVal]   = useState('')
  const [saved, setSaved]       = useState<string | null>(null)
  const [err, setErr]           = useState('')
  const [pending, startTransition] = useTransition()

  function startEdit(s: Setting) {
    setEditKey(s.key)
    setEditVal(typeof s.value === 'string' ? s.value : JSON.stringify(s.value, null, 2))
    setErr(''); setSaved(null)
  }

  function handleSave() {
    if (!editKey) return
    startTransition(async () => {
      const res = await updateSetting(editKey, editVal)
      if (!res.ok) { setErr(res.error ?? 'حدث خطأ'); return }
      setSettings(p => p.map(s => s.key === editKey ? { ...s, value: editVal } : s))
      setSaved(editKey); setEditKey(null); setErr('')
      setTimeout(() => setSaved(null), 2500)
    })
  }

  return (
    <div style={{ padding: '32px 28px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px' }}>
        الإعدادات
      </h1>
      <p style={{ color: '#aaa', fontSize: 13, margin: '0 0 28px' }}>تعديل إعدادات المتجر</p>

      {settings.length === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 40, textAlign: 'center', color: '#bbb' }}>
          لا توجد إعدادات بعد في جدول settings
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {settings.map(s => (
          <div key={s.key} style={{
            background: '#fff', border: `1px solid ${saved === s.key ? '#c9a84c' : '#e8e8e8'}`,
            borderRadius: 12, padding: '18px 20px',
            transition: 'border-color .3s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editKey === s.key ? 12 : 0 }}>
              <div>
                <span style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 3 }}>المفتاح</span>
                <code style={{ fontSize: 13, color: '#1a1a1a', fontFamily: 'monospace', background: '#f5f5f5', padding: '2px 8px', borderRadius: 4 }}>
                  {s.key}
                </code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {editKey !== s.key && (
                  <span style={{ fontSize: 13, color: '#555', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {typeof s.value === 'string' ? s.value : JSON.stringify(s.value)}
                  </span>
                )}
                {saved === s.key && <span style={{ color: '#c9a84c', fontSize: 12 }}>✓ تم الحفظ</span>}
                {editKey === s.key ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} disabled={pending} style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                      {pending ? '...' : 'حفظ'}
                    </button>
                    <button onClick={() => setEditKey(null)} style={{ background: 'none', color: '#888', border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(s)} style={{ background: 'none', color: '#888', border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                    تعديل
                  </button>
                )}
              </div>
            </div>
            {editKey === s.key && (
              <>
                <textarea
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  rows={3}
                  style={{ width: '100%', border: '1px solid #e8e8e8', borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'monospace', color: '#1a1a1a', outline: 'none', resize: 'vertical', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left' }}
                />
                {err && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 6 }}>{err}</p>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
