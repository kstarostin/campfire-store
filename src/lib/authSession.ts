import { endpoints } from '@/api/endpoints'
import { parseAuthResponse } from '@/api/normalizers'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

function clearCartSession() {
  useCartStore.getState().clearCartId()
}

export async function loginWithCredentials(email: string, password: string) {
  const response = await endpoints.login({ email, password })
  const { token, user } = parseAuthResponse(response)
  clearCartSession()
  useAuthStore.getState().setSession(token, user)
  await queryClient.invalidateQueries({ queryKey: ['account-user'] })
  return user
}

export async function signupWithCredentials(
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
) {
  const response = await endpoints.signup({ name, email, password, passwordConfirm })
  const { token, user } = parseAuthResponse(response)
  clearCartSession()
  useAuthStore.getState().setSession(token, user)
  await queryClient.invalidateQueries({ queryKey: ['account-user'] })
  return user
}

export async function logoutSession() {
  const token = useAuthStore.getState().token

  if (token) {
    try {
      await endpoints.logout(token)
    } catch {
      // Clear local session even if the API logout fails.
    }
  }

  clearCartSession()
  useAuthStore.getState().clearSession()
  await queryClient.removeQueries({ queryKey: ['account-user'] })
}
