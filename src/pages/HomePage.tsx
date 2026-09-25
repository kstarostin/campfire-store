import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Hero } from '@/components/home/Hero'
import { usePageTitle } from '@/hooks/usePageTitle'

export function HomePage() {
  usePageTitle('documentTitle.home')
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
    </>
  )
}
