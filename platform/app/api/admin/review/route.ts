import { NextRequest, NextResponse } from 'next/server'
import { updateReview, deleteReview } from '@/lib/admin-api'

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, body } = await req.json()
    if (!id || !name?.trim() || !body?.trim()) {
      return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 })
    }
    await updateReview(id, name, body)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 })
    await deleteReview(id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
