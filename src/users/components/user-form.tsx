import { Alert, Button, Group, Modal, PasswordInput, Select, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { getErrorMessage } from '../../lib/api-error'
import { USER_ROLE_LABELS, USER_ROLES } from '../constants'
import { useCreateUser } from '../hooks/use-create-user'
import { useUpdateUserProfile } from '../hooks/use-update-user-profile'
import type { User, UserRole } from '../users.types'

interface UserFormProps {
  opened: boolean
  onClose: () => void
  user?: User
}

export function UserForm({ opened, onClose, user }: UserFormProps) {
  const isEdit = !!user
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUserProfile()

  const form = useForm({
    initialValues: {
      username: user?.username ?? '',
      password: '',
      role: user?.role ?? USER_ROLES[0],
    },
    validate: {
      username: (v) => (v.trim().length < 2 ? 'El usuario debe tener al menos 2 caracteres' : null),
      password: (v) => {
        if (isEdit) return null
        return v.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : null
      },
    },
  })

  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending
  const error = isEdit ? updateMutation.error : createMutation.error

  const handleClose = () => {
    createMutation.reset()
    updateMutation.reset()
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    const onSuccess = () => {
      form.reset()
      onClose()
    }

    if (isEdit && user) {
      updateMutation.mutate(
        { userId: user.id, data: { username: values.username.trim(), role: values.role as UserRole } },
        { onSuccess },
      )
    } else {
      createMutation.mutate(
        { username: values.username.trim(), password: values.password, role: values.role as UserRole },
        { onSuccess },
      )
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? 'Editar usuario' : 'Nuevo usuario'}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(error)}
            </Alert>
          )}
          <TextInput
            label="Usuario"
            placeholder="nombre.usuario"
            required
            {...form.getInputProps('username')}
          />
          {!isEdit && (
            <PasswordInput
              label="Contraseña"
              placeholder="••••••••"
              required
              {...form.getInputProps('password')}
            />
          )}
          <Select
            label="Rol"
            data={USER_ROLES.map((r) => ({ value: r, label: USER_ROLE_LABELS[r] }))}
            required
            allowDeselect={false}
            {...form.getInputProps('role')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
