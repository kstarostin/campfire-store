import { Container } from '@/components/layout/Container'
import { MegaMenuLink } from '@/components/layout/MegaMenuLink'
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
      className={`absolute inset-x-0 top-full border-t border-header-border bg-header-bg shadow-md ${
        open ? 'block' : 'hidden'
      }`}
    >
      <Container wide className="py-5 pb-4">
        {categories.isLoading ? (
          <LoadingState label={t('home.categoriesLoading')} />
        ) : null}

        {categories.data ? (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3">
              {categories.data.map((category) => (
                <div key={category._id}>
                  <h3 className="m-0 mb-2.5 font-display text-base font-semibold tracking-tight">
                    <MegaMenuLink
                      to={categoryPath(category)}
                      className="mega-menu-link--title cursor-pointer text-base font-semibold"
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

            <div className="mt-4 border-t border-header-border pt-3.5">
              <MegaMenuLink
                to="/categories"
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
