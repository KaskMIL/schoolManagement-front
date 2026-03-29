import { Alert, Button, Group, Modal, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { getErrorMessage } from '../../lib/api-error'
import { useUpdateUserPassword } from '../hooks/use-update-user-password'
import type { User } from '../users.types'

interface PasswordFormProps {
  opened: boolean
  onClose: () => void
  user: User
}

export function PasswordForm({ opened, onClose, user }: PasswordFormProps) {
  const mutation = useUpdateUserPassword()

  const form = useForm({
    initialValues: { password: '' },
    validate: {
      password: (v) => (v.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : null),
    },
  })

  const handleClose = () => {
    mutation.reset()
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    mutation.mutate(
      { userId: user.id, data: { password: values.password } },
      {
        onSuccess: () => {
          form.reset()
          onClose()
        },
      },
    )
  })

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={`Cambiar contraseña — ${user.username}`}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {mutation.isError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(mutation.error)}
            </Alert>
          )}
          <PasswordInput
            label="Nueva contraseña"
            placeholder="••••••••"
            required
            {...form.getInputProps('password')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Cambiar contraseña
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
