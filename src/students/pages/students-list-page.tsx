import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil, IconPlus, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useFamilies } from '../../families/hooks/use-families'
import { useInstitutions } from '../../institutions/hooks/use-institutions'
import { StudentForm } from '../components/student-form'
import { useStudents } from '../hooks/use-students'
import type { StudentStatus, StudentSummary } from '../students.types'

const STATUS_LABELS: Record<StudentStatus, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  egresado: 'Egresado',
  baja: 'Baja',
}

const STATUS_COLORS: Record<StudentStatus, string> = {
  activo: 'green',
  inactivo: 'gray',
  egresado: 'blue',
  baja: 'red',
}

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
  { value: 'egresado', label: 'Egresados' },
  { value: 'baja', label: 'Baja' },
]

export default function StudentsListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [institutionId, setInstitutionId] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [search, setSearch] = useState('')
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false)
  const [editStudent, setEditStudent] = useState<StudentSummary | null>(null)

  const { data, isLoading } = useStudents({
    page,
    institutionId: institutionId || undefined,
    status: (status as StudentStatus) || undefined,
    search: search || undefined,
  })

  const { data: families } = useFamilies({ limit: 500, status: 'activa' })
  const { data: institutions } = useInstitutions()

  const institutionOptions = [
    { value: '', label: 'Todas las instituciones' },
    ...(institutions ?? []).map((i) => ({ value: i.id, label: i.name })),
  ]

  const totalPages = data ? Math.ceil(data.total / 20) : 1

  const handleFilterChange = () => setPage(1)

  const rows =
    data?.items.length === 0 ? (
      <Table.Tr>
        <Table.Td colSpan={6} ta="center" py="xl">
          <Text c="dimmed">No se encontraron alumnos</Text>
        </Table.Td>
      </Table.Tr>
    ) : (
      data?.items.map((student) => (
        <Table.Tr
          key={student.id}
          style={{ cursor: 'pointer' }}
          onClick={() => void navigate(`/alumnos/${student.id}`)}
        >
          <Table.Td fw={500}>
            {student.lastName}, {student.firstName}
          </Table.Td>
          <Table.Td c={student.dni ? undefined : 'dimmed'}>{student.dni ?? '—'}</Table.Td>
          <Table.Td>{student.family.familyName}</Table.Td>
          <Table.Td>{student.institution.name}</Table.Td>
          <Table.Td>
            <Badge color={STATUS_COLORS[student.status]} variant="light">
              {STATUS_LABELS[student.status]}
            </Badge>
          </Table.Td>
          <Table.Td onClick={(e) => e.stopPropagation()}>
            <ActionIcon
              variant="subtle"
              aria-label="Editar"
              onClick={() => setEditStudent(student)}
            >
              <IconPencil size={16} />
            </ActionIcon>
          </Table.Td>
        </Table.Tr>
      ))
    )

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={2}>Alumnos</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Nuevo alumno
        </Button>
      </Group>

      <Group>
        <TextInput
          placeholder="Buscar por nombre..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
            handleFilterChange()
          }}
          w={220}
        />
        <Select
          data={institutionOptions}
          value={institutionId}
          onChange={(v) => {
            setInstitutionId(v ?? '')
            handleFilterChange()
          }}
          w={220}
        />
        <Select
          data={STATUS_FILTER_OPTIONS}
          value={status}
          onChange={(v) => {
            setStatus(v ?? '')
            handleFilterChange()
          }}
          w={180}
        />
      </Group>

      {isLoading ? (
        <Center h={300}>
          <Loader />
        </Center>
      ) : (
        <Table.ScrollContainer minWidth={700}>
          <Table highlightOnHover withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Apellido y nombre</Table.Th>
                <Table.Th>DNI</Table.Th>
                <Table.Th>Familia</Table.Th>
                <Table.Th>Institución</Table.Th>
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

      <StudentForm
        key="create-student"
        opened={createOpened}
        onClose={closeCreate}
        families={families?.items ?? []}
        institutions={institutions ?? []}
      />
      <StudentForm
        key={editStudent?.id ?? 'edit-student'}
        opened={!!editStudent}
        onClose={() => setEditStudent(null)}
        families={families?.items ?? []}
        institutions={institutions ?? []}
        student={editStudent ?? undefined}
      />
    </Stack>
  )
}
