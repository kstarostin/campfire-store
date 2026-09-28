import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Hero } from '@/components/home/Hero'
import { NewArrivals } from '@/components/home/NewArrivals'
import { RecentlyViewed } from '@/components/home/RecentlyViewed'
import { usePageTitle } from '@/hooks/usePageTitle'

export function HomePage() {
  usePageTitle('documentTitle.home')
  return (
    <>
      <Hero />
      <CategoryShowcase />
      {/* Rails between the two grids, so the page alternates rather than
          stacking three card grids in a row. */}
      <NewArrivals />
      <FeaturedProducts />
      <RecentlyViewed />
    </>
  )
}
