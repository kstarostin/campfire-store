import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  return (
    <PagePlaceholder
      title={query ? `Search: “${query}”` : 'Search'}
      description={
        query
          ? 'The dedicated search API is not available yet. Results will appear here once GET /search ships.'
          : 'Enter a search term in the header to look up gear, brands, and categories.'
      }
    >
      <div className="flex max-w-lg items-start gap-3 rounded-lg border border-border bg-surface-muted p-4 text-sm text-text-muted">
        <Search size={18} className="mt-0.5 shrink-0 text-secondary" aria-hidden />
        <p className="m-0">
          Search UI is ready and routes to this page, but product results are
          deferred until the backend <code className="text-text">GET /search</code>{' '}
          endpoint is live.
        </p>
      </div>
    </PagePlaceholder>
  )
}
