import { ActionIcon, AppShell, Group, NavLink, Stack, Text, Title, Tooltip } from '@mantine/core'
import { IconLogout, IconSchool, IconSettings, IconUsers } from '@tabler/icons-react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useCurrentUser } from '../auth/hooks/use-current-user'
import { useLogout } from '../auth/hooks/use-logout'

export default function AppShellLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: currentUser } = useCurrentUser()
  const logout = useLogout()

  function handleLogout() {
    logout.mutate()
  }

  return (
    <AppShell navbar={{ width: 220, breakpoint: 'sm' }} padding="md">
      <AppShell.Navbar p="md">
        <Stack h="100%" justify="space-between">
          <Stack gap="xs">
            <Title order={5} px="xs" mb="xs" c="dimmed">
              EscuelaGest
            </Title>
            <NavLink
              label="Familias"
              leftSection={<IconUsers size={16} />}
              active={location.pathname.startsWith('/familias')}
              onClick={() => navigate('/familias')}
            />
            <NavLink
              label="Alumnos"
              leftSection={<IconSchool size={16} />}
              active={location.pathname.startsWith('/alumnos')}
              onClick={() => navigate('/alumnos')}
            />
            <NavLink
              label="Configuración"
              leftSection={<IconSettings size={16} />}
              active={location.pathname.startsWith('/configuracion')}
              onClick={() => navigate('/configuracion/usuarios')}
            />
          </Stack>
          <Group justify="space-between" px="xs">
            <Text size="sm" c="dimmed" truncate>
              {currentUser?.username}
            </Text>
            <Tooltip label="Cerrar sesión">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={handleLogout}
                loading={logout.isPending}
              >
                <IconLogout size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
