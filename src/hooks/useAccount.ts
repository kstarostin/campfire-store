import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { endpoints } from '@/api/endpoints'
import { parseUserResponse } from '@/api/normalizers'
import type { Address } from '@/api/types'
import { useLocale } from '@/hooks/useLocale'
import { useAuthStore } from '@/store/authStore'

export function useAccountUser() {
  const token = useAuthStore((state) => state.token)
  const storedUser = useAuthStore((state) => state.user)
  const setSession = useAuthStore((state) => state.setSession)
  const { language, currency } = useLocale()

  return useQuery({
    queryKey: ['account-user', storedUser?._id, language, currency],
    queryFn: async () => {
      const response = await endpoints.user(storedUser!._id, token!, language, currency)
      const user = parseUserResponse(response)
      setSession(token!, user)
      return user
    },
    enabled: Boolean(token && storedUser?._id),
    placeholderData: storedUser ?? undefined,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

function useAccountMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<ReturnType<typeof parseUserResponse>>,
) {
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.token)
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn,
    onSuccess: (user) => {
      if (token) {
        setSession(token, user)
      }
      queryClient.setQueryData(['account-user', user._id], user)
    },
  })
}

export function useUpdateProfile() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const { language, currency } = useLocale()

  return useAccountMutation(async (name: string) => {
    const response = await endpoints.updateUser(user!._id, token!, language, currency, { name })
    return parseUserResponse(response)
  })
}

export function useUpdateAddresses() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const { language, currency } = useLocale()

  return useAccountMutation(
    async (body: {
      deliveryAddresses?: Address[]
      billingAddresses?: Address[]
    }) => {
      const response = await endpoints.updateUser(user!._id, token!, language, currency, body)
      return parseUserResponse(response)
    },
  )
}

export function useUploadUserPhoto() {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const { language, currency } = useLocale()

  return useAccountMutation(async (file: File) => {
    const response = await endpoints.uploadUserPhoto(
      user!._id,
      token!,
      language,
      currency,
      file,
    )
    return parseUserResponse(response)
  })
}
