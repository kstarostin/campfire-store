import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/router'
import { useLocaleStore } from '@/store/localeStore'

function LocaleDocumentSync() {
  const language = useLocaleStore((state) => state.language)

  useEffect(() => {
    document.documentElement.lang = language
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
