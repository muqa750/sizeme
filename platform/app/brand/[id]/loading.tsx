import { HeroSkeleton, ProductGridSkeleton } from '@/components/Skeletons'

export default function BrandLoading() {
  return (
    <main style={{ direction: 'rtl' }}>
      <HeroSkeleton />
      <ProductGridSkeleton count={8} />
    </main>
  )
}
