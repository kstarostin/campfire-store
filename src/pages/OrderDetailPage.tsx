import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

export function OrderDetailPage() {
  const { id } = useParams()

  return (
    <PagePlaceholder
      title="Order detail"
      description={`Order “${id ?? 'unknown'}” — coming in Phase 7.`}
    />
  )
}
