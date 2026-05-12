import { getReviewStats } from '@/lib/api'
import RatingsSectionClient from './RatingsSectionClient'

export default async function RatingsSection() {
  const stats = await getReviewStats()
  return <RatingsSectionClient stats={stats} />
}
