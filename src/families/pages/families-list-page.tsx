import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Pagination,
  SegmentedControl,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { IconBan, IconCircleCheck, IconPencil, IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FamilyForm } from '../components/family-form'
import { useDeactivateFamily } from '../hooks/use-deactivate-family'
import { useFamilies } from '../hooks/use-families'
import { useReactivateFamily } from '../hooks/use-reactivate-family'
import type { FamilyStatus, FamilySummary } from '../families.types'
import { notifyError } from '../../lib/notifications'

const STATUS_LABELS: Record<FamilyStatus, string> = {
  activa: 'Activa',
  inactiva: 'Inactiva',
}

const STATUS_COLORS: Record<FamilyStatus, string> = {
  activa: 'green',
  inactiva: 'gray',
}

type FilterValue = FamilyStatus | 'todas'

export default function FamiliesListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<FilterValue>('activa')
  const [editFamily, setEditFamily] = useState<FamilySummary | null>(null)

  const status = filter === 'todas' ? undefined : filter
  const { data, isLoading } = useFamilies({ page, status })
  const deactivateMutation = useDeactivateFamily()
  const reactivateMutation = useReactivateFamily()

  const totalPages = data ? Math.ceil(data.total / 20) : 1

  const handleFilterChange = (value: string) => {
    setFilter(value as FilterValue)
    setPage(1)
  }

  const handleRowClick = (familyId: string) => {
    void navigate(`/familias/${familyId}`)
  }

  const rows =
    data?.items.length === 0 ? (
      <Table.Tr>
        <Table.Td colSpan={5} ta="center" py="xl">
          <Text c="dimmed">No se encontraron familias</Text>
        </Table.Td>
      </Table.Tr>
    ) : (
      data?.items.map((family) => (
        <Table.Tr
          key={family.id}
          style={{ cursor: 'pointer' }}
          onClick={() => handleRowClick(family.id)}
        >
          <Table.Td fw={500}>{family.familyName}</Table.Td>
          <Table.Td c={family.primaryEmail ? undefined : 'dimmed'}>
            {family.primaryEmail ?? '—'}
          </Table.Td>
          <Table.Td c={family.primaryPhone ? undefined : 'dimmed'}>
            {family.primaryPhone ?? '—'}
          </Table.Td>
          <Table.Td>
            <Badge color={STATUS_COLORS[family.status]} variant="light">
              {STATUS_LABELS[family.status]}
            </Badge>
          </Table.Td>
          <Table.Td onClick={(e) => e.stopPropagation()}>
            <Group gap={4}>
              <ActionIcon
                variant="subtle"
                aria-label="Editar"
                onClick={() => setEditFamily(family)}
              >
                <IconPencil size={16} />
              </ActionIcon>
              {family.status === 'activa' ? (
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label="Desactivar"
                  loading={deactivateMutation.isPending}
                  onClick={() =>
                    deactivateMutation.mutate(family.id, { onError: notifyError })
                  }
                >
                  <IconBan size={16} />
                </ActionIcon>
              ) : (
                <ActionIcon
                  variant="subtle"
                  color="green"
                  aria-label="Activar"
                  loading={reactivateMutation.isPending}
                  onClick={() =>
                    reactivateMutation.mutate(family.id, { onError: notifyError })
                  }
                >
                  <IconCircleCheck size={16} />
                </ActionIcon>
              )}
            </Group>
          </Table.Td>
        </Table.Tr>
      ))
    )

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={2}>Familias</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => void navigate('/familias/nueva')}
        >
          Nueva familia
        </Button>
      </Group>

      <SegmentedControl
        value={filter}
        onChange={handleFilterChange}
        data={[
          { value: 'activa', label: 'Activas' },
          { value: 'todas', label: 'Todas' },
          { value: 'inactiva', label: 'Inactivas' },
        ]}
        w="fit-content"
      />

      {isLoading ? (
        <Center h={300}>
          <Loader />
        </Center>
      ) : (
        <Table.ScrollContainer minWidth={600}>
          <Table highlightOnHover withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Familia</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Teléfono</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}

      <FamilyForm
        key={editFamily?.id ?? 'edit'}
        opened={!!editFamily}
        onClose={() => setEditFamily(null)}
        family={editFamily ?? undefined}
      />
    </Stack>
  )
}
