export const dynamic = 'force-dynamic'

import { getCoupons } from '@/lib/admin-api'
import CouponsClient from './CouponsClient'

export default async function CouponsPage() {
  const coupons = await getCoupons()
  return <CouponsClient coupons={coupons as any} />
}
