const PROD_API_BASE_URL = 'https://campfire-store-api.onrender.com/api/v1'
const PROD_API_ORIGIN = 'https://campfire-store-api.onrender.com'
const DEV_API_BASE_URL = 'http://localhost:3000/api/v1'
const DEV_API_ORIGIN = 'http://localhost:3000'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD ? PROD_API_BASE_URL : DEV_API_BASE_URL)

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ??
  (import.meta.env.PROD ? PROD_API_ORIGIN : DEV_API_ORIGIN)
