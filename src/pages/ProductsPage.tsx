import { CatalogBreadcrumb } from '@/components/catalog/CatalogPageHeader'
import { ProductCatalogView } from '@/components/catalog/ProductCatalogView'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from '@/i18n'

export function ProductsPage() {
  const { t } = useTranslation()
  usePageTitle('documentTitle.products')

  return (
    <ProductCatalogView
      variant="all"
      title={t('pages.allProducts')}
      breadcrumb={<CatalogBreadcrumb items={[{ label: t('pages.allProducts') }]} />}
    />
  )
}
