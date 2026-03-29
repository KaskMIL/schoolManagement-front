import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../users.api'
import type { UpdateUserProfileData } from '../users.types'

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserProfileData }) =>
      usersApi.updateProfile(userId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
    },
  })
}
