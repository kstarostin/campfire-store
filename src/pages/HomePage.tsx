import { CategoryRow } from '@/components/home/CategoryRow'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Hero } from '@/components/home/Hero'
import { PromoStrip } from '@/components/home/PromoStrip'
import { usePageTitle } from '@/hooks/usePageTitle'

export function HomePage() {
  usePageTitle('documentTitle.home')
  return (
    <>
      <Hero />
      <CategoryRow />
      <FeaturedProducts />
      <PromoStrip />
    </>
  )
}
