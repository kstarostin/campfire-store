import { Container } from '@/components/layout/Container'
import { MegaMenuLink } from '@/components/layout/MegaMenuLink'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useTranslation } from '@/i18n'
import { categoryPath } from '@/lib/categoryPath'
import { useCategories } from '@/hooks/useCategories'

interface MegaMenuProps {
  open: boolean
  id: string
}

export function MegaMenu({ open, id }: MegaMenuProps) {
  const { t } = useTranslation()
  const categories = useCategories()

  return (
    <div
      id={id}
      aria-label={t('nav.exploreMenu')}
      aria-hidden={!open}
      className={`mega-menu absolute inset-x-0 top-full border-t shadow-md ${
        open ? 'block' : 'hidden'
      }`}
    >
      {/* px-4 overrides .site-container--header's 12px gutter for this panel
          only — the header bar itself keeps the tighter inline padding. */}
      <Container wide className="px-4 py-5 pb-4">
        {categories.isLoading ? (
          <LoadingState label={t('home.categoriesLoading')} />
        ) : null}

        {categories.isError ? (
          <ErrorState
            message={t('home.categoriesError')}
            onRetry={() => categories.refetch()}
          />
        ) : null}

        {categories.data ? (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3">
              {categories.data.map((category) => (
                <div key={category._id}>
                  <h3 className="m-0 mb-3 font-display font-semibold tracking-tight">
                    <MegaMenuLink
                      to={categoryPath(category)}
                      className="mega-menu-link--title cursor-pointer font-semibold"
                    >
                      {category.name}
                    </MegaMenuLink>
                  </h3>
                  <ul className="m-0 list-none p-0">
                    {category.subCategories?.map((sub) => (
                      <li key={sub._id} className="mt-1.5 first:mt-0">
                        <MegaMenuLink
                          to={categoryPath(sub)}
                          className="cursor-pointer text-sm"
                        >
                          {sub.name}
                        </MegaMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <MegaMenuLink
                to="/#categories"
                showFire={false}
                className="mega-menu-link--view-all cursor-pointer text-sm font-semibold"
              >
                {t('nav.viewAllCategories')}
              </MegaMenuLink>
            </div>
          </>
        ) : null}
      </Container>
    </div>
  )
}
