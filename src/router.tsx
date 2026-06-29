import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LocaleRoute } from '@/components/routing/LocaleRoute'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute'
import { RootRedirect } from '@/components/routing/RootRedirect'
import { isLanguage } from '@/lib/localePath'
import { useLocaleStore } from '@/store/localeStore'
import { AccountPage } from '@/pages/AccountPage'
import { CartPage } from '@/pages/CartPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { CategoryDetailPage } from '@/pages/CategoryDetailPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { SearchPage } from '@/pages/SearchPage'
import { SignupPage } from '@/pages/SignupPage'

function LocalizedNotFound() {
  const { lang } = useParams<{ lang: string }>()
  const storedLanguage = useLocaleStore((state) => state.language)
  const language = isLanguage(lang ?? '') ? lang : storedLanguage
  return <Navigate to={`/${language}`} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route path="/:lang" element={<LocaleRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:categoryCode" element={<CategoryDetailPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="search" element={<SearchPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="account" element={<AccountPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<Navigate to="../account?panel=orders" replace />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="wishlist" element={<Navigate to="../account?panel=wishlist" replace />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        <Route path="*" element={<LocalizedNotFound />} />
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}
