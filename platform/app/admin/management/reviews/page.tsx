export const dynamic = 'force-dynamic'

import { getAdminReviews } from '@/lib/admin-api'
import ReviewsManager from './ReviewsManager'

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews()
  return <ReviewsManager reviews={reviews} />
}
