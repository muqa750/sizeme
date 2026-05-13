import { NextRequest, NextResponse } from 'next/server'
import { getProductsPaged } from '@/lib/api'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category') ?? undefined
  const status   = searchParams.get('status')   ?? undefined
  const brandsRaw = searchParams.get('brands')
  const colorsRaw = searchParams.get('colors')
  const brands   = brandsRaw ? brandsRaw.split(',').filter(Boolean) : []
  const colors   = colorsRaw ? colorsRaw.split(',').filter(Boolean) : []
  const page     = parseInt(searchParams.get('page')    ?? '1', 10)
  const perPage  = parseInt(searchParams.get('perPage') ?? '18', 10)

  try {
    const result = await getProductsPaged({ category, status, brands, colors, page, perPage })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ products: [], total: 0 }, { status: 500 })
  }
}
