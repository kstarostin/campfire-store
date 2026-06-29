import { ArrowLeft } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/client'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'
import { loginWithCredentials, signupWithCredentials } from '@/lib/authSession'

interface AuthFormProps {
  initialRegisterMode?: boolean
  returnUrl?: string | null
}

export function AuthForm({ initialRegisterMode = false, returnUrl }: AuthFormProps) {
  const { t, language } = useTranslation()
  const navigate = useNavigate()
  const [registerMode, setRegisterMode] = useState(initialRegisterMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectAfterAuth = () => {
    if (returnUrl) {
      navigate(decodeURIComponent(returnUrl), { replace: true })
      return
    }
    navigate(`/${language}/account`, { replace: true })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (registerMode) {
        if (password !== passwordConfirm) {
          setError(t('auth.passwordMismatch'))
          return
        }
        await signupWithCredentials(name.trim(), email.trim(), password, passwordConfirm)
      } else {
        await loginWithCredentials(email.trim(), password)
      }
      redirectAfterAuth()
    } catch (caught) {
      const message =
        caught instanceof ApiError ? caught.message : t('auth.genericError')
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const exitRegisterMode = () => {
    setError(null)
    setRegisterMode(false)
    setName('')
    setPasswordConfirm('')
  }

  return (
    <div className="auth-card">
      <div className="auth-card__head">
        <h1>{t('auth.welcomeTitle')}</h1>
        <p>{t('auth.welcomeSubtitle')}</p>
        {returnUrl ? (
          <div className="auth-return-note" role="status">
            <ArrowLeft size={16} aria-hidden />
            <span>
              {t('auth.returnAfterSignIn', {
                url: decodeURIComponent(returnUrl),
              })}
            </span>
          </div>
        ) : null}
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {registerMode ? (
          <div className="field">
            <label htmlFor="auth-name">{t('auth.fullName')}</label>
            <input
              id="auth-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={t('auth.fullNamePlaceholder')}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
        ) : null}

        <div className="field">
          <label htmlFor="auth-email">{t('auth.email')}</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="auth-password">{t('auth.password')}</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={registerMode ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {registerMode ? (
          <div className="field">
            <label htmlFor="auth-password-confirm">{t('auth.passwordConfirm')}</label>
            <input
              id="auth-password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
            />
          </div>
        ) : null}

        {!registerMode ? (
          <div className="auth-actions auth-actions--default">
            <Button type="submit" disabled={isSubmitting}>
              {t('nav.signIn')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => {
                setError(null)
                setRegisterMode(true)
              }}
            >
              {t('auth.register')}
            </Button>
          </div>
        ) : (
          <div className="auth-register-extra__btn-row">
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={exitRegisterMode}>
              {t('auth.backToSignIn')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {t('auth.createAccount')}
            </Button>
          </div>
        )}

        {error ? (
          <p className="auth-form-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      <p className="demo-hint">
        <strong>{t('auth.demoHintTitle')}</strong> {t('auth.demoHintBody')}
      </p>
    </div>
  )
}
