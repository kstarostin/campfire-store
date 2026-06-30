import { Navigate, useParams } from 'react-router-dom'
import { useLocalePath } from '@/hooks/useLocalePath'

export function OrderDetailPage() {
  const { id } = useParams()
  const localePath = useLocalePath()

  if (!id) {
    return <Navigate to={localePath('/account?panel=orders')} replace />
  }

  return <Navigate to={localePath(`/account?panel=orders&order=${id}`)} replace />
}
