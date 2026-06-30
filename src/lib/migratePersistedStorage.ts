const PERSISTED_KEYS = ['campfire-auth', 'campfire-cart', 'campfire-wishlist'] as const

export function migratePersistedStorageFromSession() {
  if (typeof window === 'undefined') return

  for (const key of PERSISTED_KEYS) {
    const legacy = sessionStorage.getItem(key)
    if (!legacy) continue

    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, legacy)
    }

    sessionStorage.removeItem(key)
  }
}
