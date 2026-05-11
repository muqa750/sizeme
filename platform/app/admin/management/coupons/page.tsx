export const dynamic = 'force-dynamic'

import { getCoupons, getCouponUsage } from '@/lib/admin-api'
import CouponsClient from './CouponsClient'

export default async function CouponsPage() {
  const [coupons, usageMap] = await Promise.all([getCoupons(), getCouponUsage()])
  return <CouponsClient coupons={coupons as any} usageMap={usageMap} />
}
