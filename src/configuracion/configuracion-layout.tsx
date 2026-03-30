import { Stack, Tabs } from '@mantine/core'
import { Outlet, useLocation, useNavigate } from 'react-router'

export default function ConfiguracionLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = location.pathname.startsWith('/configuracion/instituciones')
    ? 'instituciones'
    : location.pathname.startsWith('/configuracion/precios')
      ? 'precios'
      : location.pathname.startsWith('/configuracion/general')
        ? 'general'
        : location.pathname.startsWith('/configuracion/descuentos')
          ? 'descuentos'
          : 'usuarios'

  return (
    <Stack gap="md">
      <Tabs value={activeTab} onChange={(value) => navigate(`/configuracion/${value}`)}>
        <Tabs.List>
          <Tabs.Tab value="usuarios">Usuarios</Tabs.Tab>
          <Tabs.Tab value="instituciones">Instituciones</Tabs.Tab>
          <Tabs.Tab value="precios">Precios</Tabs.Tab>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="descuentos">Descuentos</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Outlet />
    </Stack>
  )
}
