import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { staticCategories } from '@/data/staticCategories'
import { useIsAuthenticated } from '@/store/authStore'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const isAuthenticated = useIsAuthenticated()

  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        aria-label="Close menu"
        onClick={onClose}
      />

      <nav
        aria-label="Mobile"
        className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,20rem)] flex-col overflow-y-auto border-l border-header-border bg-header-bg text-header-text md:hidden"
      >
        <div className="flex items-center justify-between border-b border-header-border px-4 py-4">
          <span className="font-display text-lg font-semibold">Menu</span>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#a8a29e]">
            Categories
          </p>
          <ul className="m-0 list-none space-y-1 p-0">
            {staticCategories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/categories/${category.id}`}
                  className="block rounded-md px-2 py-2 font-medium hover:bg-white/10 hover:text-[#fdba74]"
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/categories"
                className="mega-menu-link mega-menu-link--view-all block rounded-md px-2 py-2 text-sm font-semibold"
                onClick={onClose}
              >
                View all categories
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-auto border-t border-header-border px-4 py-4">
          <ul className="m-0 list-none space-y-1 p-0">
            <li>
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="block rounded-md px-2 py-2 hover:bg-white/10"
                onClick={onClose}
              >
                {isAuthenticated ? 'Account' : 'Sign in'}
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                className="block rounded-md px-2 py-2 hover:bg-white/10"
                onClick={onClose}
              >
                Wishlist
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
