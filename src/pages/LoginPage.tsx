import { Link, useSearchParams } from 'react-router-dom'

export function LoginPage() {
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm">
      <h1 className="font-display text-2xl tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-text-muted">
        Authentication will be implemented in Phase 5.
      </p>
      {returnUrl ? (
        <p className="mt-3 text-sm text-text-muted">
          You will return to{' '}
          <span className="font-medium text-text">
            {decodeURIComponent(returnUrl)}
          </span>{' '}
          after signing in.
        </p>
      ) : null}
      <p className="mt-6 text-sm">
        <Link to="/signup" className="font-medium text-secondary hover:text-secondary-hover">
          Create an account
        </Link>
      </p>
    </div>
  )
}
