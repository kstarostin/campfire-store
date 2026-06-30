import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LocaleRoute } from '@/components/routing/LocaleRoute'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute'
import { RootRedirect } from '@/components/routing/RootRedirect'
import { UnlocalizedPathRedirect } from '@/components/routing/UnlocalizedPathRedirect'
import { AccountPage } from '@/pages/AccountPage'
import { CartPage } from '@/pages/CartPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { CategoryDetailPage } from '@/pages/CategoryDetailPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { SearchPage } from '@/pages/SearchPage'
import { SignupPage } from '@/pages/SignupPage'

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

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Route>

      <Route path="*" element={<UnlocalizedPathRedirect />} />
    </Routes>
  )
}
