import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/router'
import { translate } from '@/i18n'
import { useLocaleStore } from '@/store/localeStore'

function LocaleDocumentSync() {
  const language = useLocaleStore((state) => state.language)

  useEffect(() => {
    document.documentElement.lang = language
    document.title = translate(language, 'common.storeName')
  }, [language])

  return null
}

export function App() {
  return (
    <BrowserRouter>
      <LocaleDocumentSync />
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
