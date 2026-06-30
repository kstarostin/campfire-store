import { Camera } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  useAccountUser,
  useUpdateProfile,
  useUploadUserPhoto,
} from '@/hooks/useAccount'
import { useTranslation } from '@/i18n'
import { showToast } from '@/lib/toast'
import { userPhotoUrl } from '@/lib/imageUrl'

export function AccountProfilePanel() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: user } = useAccountUser()
  const updateProfile = useUpdateProfile()
  const uploadPhoto = useUploadUserPhoto()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name)
    }
  }, [user])

  if (!user) {
    return <p className="account-panel-loading">{t('common.loading')}</p>
  }

  const photoSrc = userPhotoUrl(user.photo, 'small')
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleSave = async () => {
    setError(null)

    try {
      await updateProfile.mutateAsync(name.trim())
      showToast(t('toast.profileSaved'))
    } catch {
      setError(t('account.profileSaveError'))
    }
  }

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file) return

    setError(null)

    try {
      await uploadPhoto.mutateAsync(file)
      showToast(t('toast.photoSaved'))
    } catch {
      setError(t('account.photoSaveError'))
    }
  }

  return (
    <section
      className="account-panel is-active"
      id="panel-profile"
      aria-labelledby="account-profile-heading"
    >
      <header className="account-panel__head">
        <div>
          <h2 id="account-profile-heading">{t('account.profileTitle')}</h2>
          <p>{t('account.profileDescription')}</p>
        </div>
      </header>

      <div className="profile-layout">
        <div className="profile-photo">
          <div className="profile-photo__frame">
            {photoSrc ? (
              <img src={photoSrc} alt={user.name} width={104} height={104} />
            ) : (
              <span className="profile-photo__initials" aria-hidden>
                {initials}
              </span>
            )}
            <button
              type="button"
              className="profile-photo__upload"
              aria-label={t('account.uploadPhoto')}
              disabled={uploadPhoto.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={16} aria-hidden />
            </button>
          </div>
          <p className="profile-photo__hint">{t('account.photoHint')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              void handlePhotoChange(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </div>

        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault()
            void handleSave()
          }}
        >
          <div className="field">
            <label htmlFor="profile-name">{t('account.fullName')}</label>
            <input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label htmlFor="profile-email">{t('account.email')}</label>
            <input
              id="profile-email"
              type="email"
              value={user.email}
              disabled
              aria-describedby="profile-email-hint"
            />
            <p className="field-hint" id="profile-email-hint">
              {t('account.emailHint')}
            </p>
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={updateProfile.isPending || name.trim() === user.name}>
              {t('account.saveProfile')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={name.trim() === user.name}
              onClick={() => setName(user.name)}
            >
              {t('account.resetProfile')}
            </Button>
          </div>
        </form>
      </div>

      {error ? (
        <p className="account-form-message account-form-message--error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
