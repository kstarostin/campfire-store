import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseCategoryList } from '@/api/normalizers'
import type { Category } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'

function enrichCategories(categories: Category[]): Category[] {
  const roots = categories.filter((category) => !category.parentCategory)

  return roots.map((root) => ({
    ...root,
    subCategories:
      root.subCategories ??
      categories.filter((category) => category.parentCategory === root._id),
  }))
}

export function useCategories() {
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: ['categories', language, currency],
    queryFn: () => endpoints.categories(language, currency),
    select: (response) => enrichCategories(parseCategoryList(response, language)),
  })
}
