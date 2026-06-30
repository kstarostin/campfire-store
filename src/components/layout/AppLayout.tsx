import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ToastStack } from '@/components/ui/ToastStack'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastStack />
    </div>
  )
}
