import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n'
import { buildLoginPath } from '@/lib/loginRedirect'

export function useLoginRedirect() {
  const { language } = useTranslation()
  const navigate = useNavigate()

  return useCallback(
    (returnPath: string) => {
      navigate(buildLoginPath(language, returnPath))
    },
    [language, navigate],
  )
}
