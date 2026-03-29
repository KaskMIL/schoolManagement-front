import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconKey, IconPencil, IconTrash, IconUserCheck, IconUserOff } from '@tabler/icons-react'
import { useState } from 'react'
import { USER_ROLE_LABELS } from '../constants'
import { notifyError } from '../../lib/notifications'
import { PasswordForm } from '../components/password-form'
import { UserForm } from '../components/user-form'
import { useDeleteUser } from '../hooks/use-delete-user'
import { useDisableUser } from '../hooks/use-disable-user'
import { useRestoreUser } from '../hooks/use-restore-user'
import { useUsers } from '../hooks/use-users'
import type { User } from '../users.types'

export default function UsersConfigPage() {
  const { data, isLoading, isSuccess } = useUsers({ limit: 100 })
  const disableMutation = useDisableUser()
  const restoreMutation = useRestoreUser()
  const deleteMutation = useDeleteUser()

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [passwordUser, setPasswordUser] = useState<User | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)


  function handleDisable(userId: string) {
    disableMutation.mutate(userId, { onError: notifyError })
  }

  function handleRestore(userId: string) {
    restoreMutation.mutate(userId, { onError: notifyError })
  }

  function handleDelete(userId: string) {
    deleteMutation.mutate(userId, {
      onSuccess: () => setConfirmDeleteId(null),
      onError: (error) => {
        setConfirmDeleteId(null)
        notifyError(error)
      },
    })
  }

  return (
    <>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Usuarios</Title>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            Nuevo usuario
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Usuario</Table.Th>
              <Table.Th>Rol</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" size="sm" ta="center">
                    Cargando...
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
            {isSuccess && data.items.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {user.username}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {USER_ROLE_LABELS[user.role] ?? user.role}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {user.disabledAt ? (
                    <Badge color="red" variant="light" size="sm">
                      Deshabilitado
                    </Badge>
                  ) : (
                    <Badge color="green" variant="light" size="sm">
                      Activo
                    </Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <Tooltip label="Editar perfil">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => setEditUser(user)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Cambiar contraseña">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => setPasswordUser(user)}
                      >
                        <IconKey size={16} />
                      </ActionIcon>
                    </Tooltip>
                    {user.disabledAt ? (
                      <Tooltip label="Restaurar usuario">
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          onClick={() => handleRestore(user.id)}
                          loading={
                            restoreMutation.isPending &&
                            restoreMutation.variables === user.id
                          }
                        >
                          <IconUserCheck size={16} />
                        </ActionIcon>
                      </Tooltip>
                    ) : (
                      <Tooltip label="Deshabilitar usuario">
                        <ActionIcon
                          variant="subtle"
                          color="orange"
                          onClick={() => handleDisable(user.id)}
                          loading={
                            disableMutation.isPending &&
                            disableMutation.variables === user.id
                          }
                        >
                          <IconUserOff size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {confirmDeleteId === user.id ? (
                      <Group gap="xs">
                        <Button
                          size="xs"
                          color="red"
                          loading={deleteMutation.isPending}
                          onClick={() => handleDelete(user.id)}
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="xs"
                          variant="default"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancelar
                        </Button>
                      </Group>
                    ) : (
                      <Tooltip label="Eliminar usuario">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => setConfirmDeleteId(user.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      <UserForm opened={createOpen} onClose={() => setCreateOpen(false)} />
      {editUser && (
        <UserForm opened onClose={() => setEditUser(null)} user={editUser} />
      )}
      {passwordUser && (
        <PasswordForm opened onClose={() => setPasswordUser(null)} user={passwordUser} />
      )}
    </>
  )
}
