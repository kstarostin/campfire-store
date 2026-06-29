import { API_BASE_URL } from './config'
import type { ApiErrorBody, Currency, Language } from './types'

export class ApiError extends Error {
  readonly status: number
  readonly body?: ApiErrorBody

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export interface LocaleParams {
  language?: Language
  currency?: Currency
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
}

export interface ListQueryParams extends LocaleParams, PaginationParams {
  filter?: Record<string, unknown> | string
  fields?: string
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string | null
  params?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
  formData?: FormData
}

function buildQueryString(
  params?: Record<string, string | number | boolean | undefined>,
): string {
  if (!params) return ''

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    if (key === 'filter' && typeof value === 'object') {
      search.set(key, JSON.stringify(value))
    } else {
      search.set(key, String(value))
    }
  }

  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function localeQueryParams(locale: LocaleParams): Record<string, string> {
  const params: Record<string, string> = {}
  if (locale.language) params.language = locale.language
  if (locale.currency) params.currency = locale.currency
  return params
}

export function listQueryParams(
  locale: LocaleParams,
  pagination?: PaginationParams & { filter?: Record<string, unknown> | string; fields?: string },
): Record<string, string | number | undefined> {
  return {
    ...localeQueryParams(locale),
    page: pagination?.page,
    limit: pagination?.limit,
    sort: pagination?.sort,
    fields: pagination?.fields,
    filter:
      pagination?.filter === undefined
        ? undefined
        : typeof pagination.filter === 'string'
          ? pagination.filter
          : JSON.stringify(pagination.filter),
  }
}

async function parseJson<T>(response: Response): Promise<T | undefined> {
  const text = await response.text()
  if (!text) return undefined
  return JSON.parse(text) as T
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, token, params, signal, formData } = options
  const url = `${API_BASE_URL}${path}${buildQueryString(params)}`

  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (formData) {
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  } else {
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    signal,
  })

  if (!response.ok) {
    const errorBody = await parseJson<ApiErrorBody>(response.clone())
    const message =
      errorBody?.message ?? `Request failed with status ${response.status}`
    throw new ApiError(response.status, message, errorBody)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const data = await parseJson<T>(response)
  return data as T
}

export const api = {
  get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return apiRequest<T>(path, { ...options, method: 'GET' })
  },

  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return apiRequest<T>(path, { ...options, method: 'POST', body })
  },

  patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return apiRequest<T>(path, { ...options, method: 'PATCH', body })
  },

  delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body' | 'formData'>) {
    return apiRequest<T>(path, { ...options, method: 'DELETE' })
  },

  upload<T>(
    path: string,
    file: File,
    options?: Omit<RequestOptions, 'method' | 'body' | 'formData'>,
  ) {
    const formData = new FormData()
    formData.append('photo', file)
    return apiRequest<T>(path, { ...options, method: 'PATCH', formData })
  },
}
