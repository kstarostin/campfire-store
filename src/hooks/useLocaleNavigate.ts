import { useCallback } from 'react'
import { useNavigate, type NavigateOptions } from 'react-router-dom'
import { useLocalePath } from '@/hooks/useLocalePath'

export function useLocaleNavigate() {
  const navigate = useNavigate()
  const localePath = useLocalePath()

  return useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        navigate(to)
        return
      }
      navigate(localePath(to), options)
    },
    [navigate, localePath],
  )
}
