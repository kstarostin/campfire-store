import { ChevronDown, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { staticCategories } from '@/data/staticCategories'
import { useIsAuthenticated } from '@/store/authStore'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const baseId = useId()
  const isAuthenticated = useIsAuthenticated()
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setExpandedCategoryId(null)
    }
  }, [open])

  if (!open) return null

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryId((current) => (current === categoryId ? null : categoryId))
  }

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
        className="fixed inset-y-0 right-0 z-50 flex h-dvh max-h-dvh w-[min(100%,20rem)] flex-col overflow-hidden border-l border-header-border bg-header-bg text-header-text md:hidden"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-header-border px-4 py-4">
          <span className="font-display text-lg font-semibold">Menu</span>
          <button
            type="button"
            className="header-icon-btn inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#a8a29e]">
            Categories
          </p>
          <ul className="m-0 list-none space-y-1 p-0">
            {staticCategories.map((category) => {
              const panelId = `${baseId}-panel-${category.id}`
              const isExpanded = expandedCategoryId === category.id
              const hasSubcategories = category.subcategories.length > 0

              return (
                <li key={category.id}>
                  <div className="flex items-stretch gap-0.5">
                    <Link
                      to={`/categories/${category.id}`}
                      className="mega-menu-link mega-menu-link--title min-w-0 flex-1 rounded-md px-2 py-2 font-medium"
                      onClick={onClose}
                    >
                      {category.name}
                    </Link>

                    {hasSubcategories ? (
                      <button
                        type="button"
                        className={`header-icon-btn inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md ${
                          isExpanded ? 'text-[#fdba74]' : ''
                        }`}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name} subcategories`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-150 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          aria-hidden
                        />
                      </button>
                    ) : null}
                  </div>

                  {hasSubcategories && isExpanded ? (
                    <ul
                      id={panelId}
                      className="m-0 mb-1 list-none space-y-0.5 border-l border-header-border p-0 pl-3 ml-2"
                    >
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/categories/${sub.id}`}
                            className="mega-menu-link block rounded-md px-2 py-1.5 text-sm"
                            onClick={onClose}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}

            <li className="pt-1">
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

        <div className="shrink-0 border-t border-header-border bg-header-bg px-4 py-4">
          <ul className="m-0 list-none space-y-1 p-0">
            <li>
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="block rounded-md px-2 py-2 hover:bg-white/10 hover:text-[#fdba74]"
                onClick={onClose}
              >
                {isAuthenticated ? 'Account' : 'Sign in'}
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                className="block rounded-md px-2 py-2 hover:bg-white/10 hover:text-[#fdba74]"
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
