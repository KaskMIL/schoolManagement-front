import { AppShell, NavLink, Stack, Title } from '@mantine/core'
import { IconUsers } from '@tabler/icons-react'
import { Outlet, useLocation, useNavigate } from 'react-router'

export default function AppShellLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AppShell navbar={{ width: 220, breakpoint: 'sm' }} padding="md">
      <AppShell.Navbar p="md">
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
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
