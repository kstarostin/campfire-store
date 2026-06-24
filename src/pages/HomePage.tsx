import { CategoryRow } from '@/components/home/CategoryRow'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Hero } from '@/components/home/Hero'
import { PromoStrip } from '@/components/home/PromoStrip'

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryRow />
      <FeaturedProducts />
      <PromoStrip />
    </>
  )
}
