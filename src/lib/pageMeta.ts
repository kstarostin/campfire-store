export interface PageMetaInput {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'product'
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function removeMeta(attribute: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove()
}

export function applyPageMeta(meta: PageMetaInput) {
  if (meta.title) {
    document.title = meta.title
  }

  if (meta.description) {
    upsertMeta('name', 'description', meta.description)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('name', 'twitter:description', meta.description)
  }

  if (meta.title) {
    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('name', 'twitter:title', meta.title)
  }

  const pageUrl = meta.url ?? (typeof window !== 'undefined' ? window.location.href : '')
  if (pageUrl) {
    upsertMeta('property', 'og:url', pageUrl)
  }

  upsertMeta('property', 'og:type', meta.type ?? 'website')
  upsertMeta('property', 'og:site_name', 'Campfire')
  upsertMeta('name', 'twitter:card', meta.image ? 'summary_large_image' : 'summary')

  if (meta.image) {
    upsertMeta('property', 'og:image', meta.image)
    upsertMeta('name', 'twitter:image', meta.image)
  } else {
    removeMeta('property', 'og:image')
    removeMeta('name', 'twitter:image')
  }
}

export function truncateMetaDescription(value: string, maxLength = 160): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}
