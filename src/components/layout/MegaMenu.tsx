import { Link } from 'react-router-dom'
import { staticCategories } from '@/data/staticCategories'
import { Container } from '@/components/layout/Container'

interface MegaMenuProps {
  open: boolean
  id: string
}

export function MegaMenu({ open, id }: MegaMenuProps) {
  return (
    <div
      id={id}
      aria-label="Explore menu"
      aria-hidden={!open}
      className={`absolute inset-x-0 top-full border-t border-header-border bg-header-bg shadow-md ${
        open ? 'block' : 'hidden'
      }`}
    >
      <Container wide className="py-5 pb-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-3">
          {staticCategories.map((category) => (
            <div key={category.id}>
              <h3 className="m-0 mb-2.5 font-display text-base font-semibold tracking-tight">
                <Link
                  to={`/categories/${category.id}`}
                  className="mega-menu-link mega-menu-link--title cursor-pointer text-base font-semibold"
                >
                  {category.name}
                </Link>
              </h3>
              <ul className="m-0 list-none p-0">
                {category.subcategories.map((sub) => (
                  <li key={sub.id} className="mt-1.5 first:mt-0">
                    <Link
                      to={`/categories/${sub.id}`}
                      className="mega-menu-link cursor-pointer text-sm"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-header-border pt-3.5">
          <Link
            to="/categories"
            className="mega-menu-link mega-menu-link--view-all cursor-pointer text-sm font-semibold"
          >
            View all categories
          </Link>
        </div>
      </Container>
    </div>
  )
}
