import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseBadgeList } from '@/api/normalizers'
import { useLocale } from '@/hooks/useLocale'

export function useBadges() {
  const { language } = useLocale()

  return useQuery({
    queryKey: ['badges', language],
    queryFn: () => endpoints.badges(language),
    select: (response) => parseBadgeList(response, language),
  })
}

/**
 * The id of a badge, looked up by its stable code. Products store a badge
 * reference, so filtering by "the new badge" means filtering on that id — and
 * the id is per-environment, which is why it is resolved rather than written
 * down here.
 */
export function useBadgeId(code: string): string | undefined {
  const { data } = useBadges()
  return data?.find((badge) => badge.code === code)?._id
}
