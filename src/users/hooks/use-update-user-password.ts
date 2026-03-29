import { useMutation } from '@tanstack/react-query'
import { usersApi } from '../users.api'
import type { UpdateUserPasswordData } from '../users.types'

export function useUpdateUserPassword() {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserPasswordData }) =>
      usersApi.updatePassword(userId, data),
  })
}
