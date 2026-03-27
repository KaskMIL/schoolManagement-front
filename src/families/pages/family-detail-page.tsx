import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconArrowLeft,
  IconBan,
  IconCircleCheck,
  IconPencil,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FamilyForm } from '../components/family-form'
import { GuardianForm } from '../components/guardian-form'
import { useDeactivateFamily } from '../hooks/use-deactivate-family'
import { useDeleteGuardian } from '../hooks/use-delete-guardian'
import { useFamily } from '../hooks/use-family'
import { useReactivateFamily } from '../hooks/use-reactivate-family'
import type { Guardian, Relationship } from '../families.types'

const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  padre: 'Padre',
  madre: 'Madre',
  tutor: 'Tutor/a',
  otro: 'Otro',
}

interface InfoFieldProps {
  label: string
  value: string | null
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <Text size="xs" c="dimmed" mb={2}>
        {label}
      </Text>
      <Text size="sm">{value ?? '—'}</Text>
    </div>
  )
}

export default function FamilyDetailPage() {
  const { familyId } = useParams<{ familyId: string }>()
  const navigate = useNavigate()
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [addGuardianOpened, { open: openAddGuardian, close: closeAddGuardian }] =
    useDisclosure(false)
  const [editGuardian, setEditGuardian] = useState<Guardian | null>(null)

  const { data: family, isLoading } = useFamily(familyId!)
  const deactivateMutation = useDeactivateFamily()
  const reactivateMutation = useReactivateFamily()
  const deleteGuardianMutation = useDeleteGuardian()

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    )
  }

  if (!family) return null

  const isActive = family.status === 'activa'

  return (
    <Stack gap="lg">
      {/* Encabezado */}
      <Group>
        <ActionIcon
          variant="subtle"
          size="lg"
          aria-label="Volver"
          onClick={() => void navigate('/familias')}
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>{family.familyName}</Title>
        <Badge color={isActive ? 'green' : 'gray'} variant="light" size="lg">
          {isActive ? 'Activa' : 'Inactiva'}
        </Badge>
      </Group>

      {/* Acciones */}
      <Group>
        <Button variant="default" leftSection={<IconPencil size={16} />} onClick={openEdit}>
          Editar
        </Button>
        {isActive ? (
          <Button
            variant="light"
            color="red"
            leftSection={<IconBan size={16} />}
            loading={deactivateMutation.isPending}
            onClick={() => deactivateMutation.mutate(family.id)}
          >
            Desactivar
          </Button>
        ) : (
          <Button
            variant="light"
            color="green"
            leftSection={<IconCircleCheck size={16} />}
            loading={reactivateMutation.isPending}
            onClick={() => reactivateMutation.mutate(family.id)}
          >
            Activar
          </Button>
        )}
      </Group>

      {/* Datos de la familia */}
      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="md">
          Información general
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <InfoField label="Email principal" value={family.primaryEmail} />
          <InfoField label="Teléfono principal" value={family.primaryPhone} />
          <InfoField label="Dirección" value={family.address} />
          <InfoField label="Localidad" value={family.locality} />
          {family.notes && (
            <div style={{ gridColumn: '1 / -1' }}>
              <InfoField label="Notas" value={family.notes} />
            </div>
          )}
        </SimpleGrid>
      </Paper>

      <Divider />

      {/* Responsables */}
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Responsables</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconPlus size={14} />}
            onClick={openAddGuardian}
          >
            Agregar responsable
          </Button>
        </Group>

        <Table.ScrollContainer minWidth={700}>
          <Table withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Vínculo</Table.Th>
                <Table.Th>DNI</Table.Th>
                <Table.Th>Teléfono</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {family.guardians.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text c="dimmed">Sin responsables registrados</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                family.guardians.map((guardian) => (
                  <Table.Tr key={guardian.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>
                          {guardian.firstName} {guardian.lastName}
                        </Text>
                        {guardian.isPrimaryContact && (
                          <Badge size="xs" color="blue" variant="light">
                            Principal
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>{RELATIONSHIP_LABELS[guardian.relationship]}</Table.Td>
                    <Table.Td c={guardian.dni ? undefined : 'dimmed'}>
                      {guardian.dni ?? '—'}
                    </Table.Td>
                    <Table.Td c={guardian.phone ? undefined : 'dimmed'}>
                      {guardian.phone ?? '—'}
                    </Table.Td>
                    <Table.Td c={guardian.email ? undefined : 'dimmed'}>
                      {guardian.email ?? '—'}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          variant="subtle"
                          aria-label="Editar responsable"
                          onClick={() => setEditGuardian(guardian)}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          aria-label="Eliminar responsable"
                          loading={deleteGuardianMutation.isPending}
                          onClick={() =>
                            deleteGuardianMutation.mutate({
                              familyId: family.id,
                              guardianId: guardian.id,
                            })
                          }
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>

      <FamilyForm key={family.id} opened={editOpened} onClose={closeEdit} family={family} />
      <GuardianForm
        key="add-guardian"
        opened={addGuardianOpened}
        onClose={closeAddGuardian}
        familyId={family.id}
      />
      <GuardianForm
        key={editGuardian?.id ?? 'edit-guardian'}
        opened={!!editGuardian}
        onClose={() => setEditGuardian(null)}
        familyId={family.id}
        guardian={editGuardian ?? undefined}
      />
    </Stack>
  )
}
