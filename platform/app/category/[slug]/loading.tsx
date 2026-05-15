import { PageHeadingSkeleton, ProductGridSkeleton } from '@/components/Skeletons'

export default function CategoryLoading() {
  return (
    <main style={{ direction: 'rtl' }}>
      <PageHeadingSkeleton />
      <ProductGridSkeleton count={8} />
    </main>
  )
}
