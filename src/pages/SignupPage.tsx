import { Link } from 'react-router-dom'

export function SignupPage() {
  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm">
      <h1 className="font-display text-2xl tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-text-muted">
        Sign-up will be implemented in Phase 5.
      </p>
      <p className="mt-6 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-secondary hover:text-secondary-hover">
          Sign in
        </Link>
      </p>
    </div>
  )
}
