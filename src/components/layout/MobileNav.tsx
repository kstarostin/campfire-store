import { ChevronDown, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { MegaMenuLink } from '@/components/layout/MegaMenuLink'
import { LocaleLink } from '@/components/ui/LocaleLink'
import { LoadingState } from '@/components/ui/LoadingState'
import { useTranslation } from '@/i18n'
import { useCategories } from '@/hooks/useCategories'
import { categoryPath } from '@/lib/categoryPath'
import { useIsAuthenticated } from '@/store/authStore'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { t } = useTranslation()
  const baseId = useId()
  const isAuthenticated = useIsAuthenticated()
  const categories = useCategories()
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
        aria-label={t('nav.closeMenu')}
        onClick={onClose}
      />

      <nav
        aria-label={t('nav.menu')}
        className="fixed inset-y-0 right-0 z-50 flex h-dvh max-h-dvh w-[min(100%,20rem)] flex-col overflow-hidden border-l border-header-border bg-header-bg text-header-text md:hidden"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-header-border px-4 py-4">
          <span className="font-display text-lg font-semibold">{t('nav.menu')}</span>
          <button
            type="button"
            className="header-icon-btn inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
            aria-label={t('nav.closeMenu')}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mobile-nav-body min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#a8a29e]">
            {t('nav.categories')}
          </p>

          {categories.isLoading ? (
            <LoadingState label={t('home.categoriesLoading')} />
          ) : null}

          {categories.data ? (
            <ul className="m-0 list-none space-y-1 p-0">
              {categories.data.map((category) => {
                const panelId = `${baseId}-panel-${category._id}`
                const isExpanded = expandedCategoryId === category._id
                const subcategories = category.subCategories ?? []
                const hasSubcategories = subcategories.length > 0

                return (
                  <li key={category._id}>
                    <div className="flex items-stretch gap-0.5">
                      <MegaMenuLink
                        to={categoryPath(category)}
                        className="mega-menu-link--title min-w-0 flex-1 rounded-md py-2 font-medium"
                        onClick={onClose}
                      >
                        {category.name}
                      </MegaMenuLink>

                      {hasSubcategories ? (
                        <button
                          type="button"
                          className={`header-icon-btn inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md ${
                            isExpanded ? 'text-[#fdba74]' : ''
                          }`}
                          aria-expanded={isExpanded}
                          aria-controls={panelId}
                          aria-label={
                            isExpanded
                              ? t('nav.collapseCategory', { category: category.name })
                              : t('nav.expandCategory', { category: category.name })
                          }
                          onClick={() => toggleCategory(category._id)}
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
                        {subcategories.map((sub) => (
                          <li key={sub._id}>
                            <MegaMenuLink
                              to={categoryPath(sub)}
                              className="w-full rounded-md py-1.5 text-sm"
                              onClick={onClose}
                            >
                              {sub.name}
                            </MegaMenuLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              })}

              <li className="pt-1">
                <MegaMenuLink
                  to="/categories"
                  showFire={false}
                  className="mega-menu-link--view-all w-full rounded-md py-2 text-sm font-semibold"
                  onClick={onClose}
                >
                  {t('nav.viewAllCategories')}
                </MegaMenuLink>
              </li>
            </ul>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-header-border bg-header-bg px-4 py-4">
          <ul className="m-0 list-none space-y-1 p-0">
            <li>
              <LocaleLink
                to={isAuthenticated ? '/account' : '/login'}
                className="block rounded-md px-2 py-2 hover:bg-white/10 hover:text-[#fdba74]"
                onClick={onClose}
              >
                {isAuthenticated ? t('nav.account') : t('nav.signIn')}
              </LocaleLink>
            </li>
            {isAuthenticated ? (
              <li>
                <LocaleLink
                  to="/account?panel=wishlist"
                  className="block rounded-md px-2 py-2 hover:bg-white/10 hover:text-[#fdba74]"
                  onClick={onClose}
                >
                  {t('nav.wishlist')}
                </LocaleLink>
              </li>
            ) : null}
          </ul>
        </div>
      </nav>
    </>
  )
}
