import { CatalogBreadcrumb } from '@/components/catalog/CatalogPageHeader'
import { ProductCatalogView } from '@/components/catalog/ProductCatalogView'
import { useTranslation } from '@/i18n'

export function ProductsPage() {
  const { t } = useTranslation()

  return (
    <ProductCatalogView
      variant="all"
      title={t('pages.allProducts')}
      breadcrumb={<CatalogBreadcrumb items={[{ label: t('pages.allProducts') }]} />}
    />
  )
}
