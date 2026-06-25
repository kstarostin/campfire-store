import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { normalizeCategory } from '@/api/normalizers'
import type { Category } from '@/api/types'
import { useCategories } from '@/hooks/useCategories'
import { useLocale } from '@/hooks/useLocale'

function flattenCategories(roots: Category[]): Category[] {
  const flat: Category[] = []

  for (const root of roots) {
    flat.push(root)
    for (const sub of root.subCategories ?? []) {
      flat.push(sub)
    }
  }

  return flat
}

export function useCategory(categoryCode: string | undefined) {
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: ['category', categoryCode, language, currency],
    queryFn: () => endpoints.category(categoryCode!, language, currency),
    enabled: Boolean(categoryCode),
    select: (response) => normalizeCategory(response.data.document, language),
  })
}

export function useCategoryAncestors(categoryCode: string | undefined) {
  const categories = useCategories()

  return useMemo(() => {
    if (!categoryCode || !categories.data) return []

    const flat = flattenCategories(categories.data)
    const ancestors: Category[] = []
    let current = flat.find(
      (category) => category.code === categoryCode || category._id === categoryCode,
    )

    while (current?.parentCategory) {
      const parentId = current.parentCategory
      const parent = flat.find((category) => category._id === parentId)
      if (!parent) break

      ancestors.unshift(parent)
      current = parent
    }

    return ancestors
  }, [categoryCode, categories.data])
}
