import {
  ActionIcon,
  Button,
  Group,
  Kbd,
  Text,
  Tooltip,
} from '@mantine/core'
import { spotlight } from '@mantine/spotlight'
import { IconLogout, IconSearch, IconSettings } from '@tabler/icons-react'
import { useNavigate } from 'react-router'
import { useCurrentUser } from '../auth/hooks/use-current-user'
import { useLogout } from '../auth/hooks/use-logout'

export function Header() {
  const navigate = useNavigate()
  const { data: currentUser } = useCurrentUser()
  const logout = useLogout()

  return (
    <Group h="100%" px="md" justify="space-between">
      <Text fw={700} size="md">
        EscuelaGest
      </Text>

      <Button
        variant="default"
        onClick={() => spotlight.open()}
        leftSection={<IconSearch size={14} />}
        rightSection={
          <Group gap={4}>
            <Kbd size="xs">⌘</Kbd>
            <Kbd size="xs">K</Kbd>
          </Group>
        }
        style={{ minWidth: 260, justifyContent: 'space-between' }}
      >
        <Text size="sm" c="dimmed">
          Buscar familias y alumnos...
        </Text>
      </Button>

      <Group gap="xs">
        <Tooltip label="Configuración">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => void navigate('/configuracion/usuarios')}
          >
            <IconSettings size={18} />
          </ActionIcon>
        </Tooltip>
        <Text size="sm" c="dimmed">
          {currentUser?.username}
        </Text>
        <Tooltip label="Cerrar sesión">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => logout.mutate()}
            loading={logout.isPending}
          >
            <IconLogout size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  )
}
