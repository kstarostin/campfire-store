import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

export function ProductDetailPage() {
  const { id } = useParams()

  return (
    <PagePlaceholder
      title="Product detail"
      description={`Product “${id ?? 'unknown'}” — coming in Phase 4.`}
    />
  )
}
