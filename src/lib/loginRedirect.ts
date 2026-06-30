import type { Language } from '@/api/types'

export function buildLoginPath(language: Language, returnPath: string): string {
  return `/${language}/login?returnUrl=${encodeURIComponent(returnPath)}`
}
