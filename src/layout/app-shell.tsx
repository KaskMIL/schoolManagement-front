import { AppShell, NavLink, Stack } from '@mantine/core'
import { IconSchool, IconSettings, IconUsers } from '@tabler/icons-react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Header } from './header'
import { SpotlightSearch } from './spotlight-search'

export default function AppShellLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 220, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
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
      </AppShell.Navbar>

      <SpotlightSearch />

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
