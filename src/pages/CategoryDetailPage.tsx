import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

export function CategoryDetailPage() {
  const { id } = useParams()

  return (
    <PagePlaceholder
      title="Category"
      description={`Product listing for category “${id ?? 'unknown'}” — coming in Phase 3.`}
    />
  )
}
