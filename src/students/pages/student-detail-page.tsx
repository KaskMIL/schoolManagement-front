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
import { IconArrowLeft, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useFeeConcepts } from '../../fee-concepts/hooks/use-fee-concepts'
import { useFamilies } from '../../families/hooks/use-families'
import { useInstitutions } from '../../institutions/hooks/use-institutions'
import { notifyError } from '../../lib/notifications'
import { StudentServiceForm } from '../../student-services/components/student-service-form'
import { useDeleteStudentService } from '../../student-services/hooks/use-student-services'
import { useStudentServices } from '../../student-services/hooks/use-student-services'
import { EmergencyContactForm } from '../components/emergency-contact-form'
import { EnrollmentForm } from '../components/enrollment-form'
import { StudentForm } from '../components/student-form'
import { useDeleteEmergencyContact } from '../hooks/use-delete-emergency-contact'
import { useStudent } from '../hooks/use-student'
import type {
  EmergencyContact,
  Enrollment,
  EnrollmentStatus,
  Level,
  Section,
  Shift,
  StudentStatus,
} from '../students.types'
import type { StudentService } from '../../student-services/student-services.types'

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

const LEVEL_LABELS: Record<Level, string> = {
  jardin: 'Jardín',
  primaria: 'Primaria',
  secundaria: 'Secundaria',
}

const SECTION_LABELS: Record<Section, string> = {
  A: 'A',
  B: 'B',
  unico: 'Único',
}

const SHIFT_LABELS: Record<Shift, string> = {
  manana: 'Mañana',
  tarde: 'Tarde',
  completo: 'Completo',
}

const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  inscripto: 'Inscripto',
  confirmado: 'Confirmado',
  baja: 'Baja',
}

const ENROLLMENT_STATUS_COLORS: Record<EnrollmentStatus, string> = {
  inscripto: 'yellow',
  confirmado: 'green',
  baja: 'gray',
}

interface InfoFieldProps {
  label: string
  value: string | null | undefined
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

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR')
}

function gradeLabel(level: Level, grade: number): string {
  if (level === 'jardin') return `Sala de ${grade}`
  if (level === 'primaria') return `${grade}° grado`
  return `${grade}° año`
}

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [addEnrollmentOpened, { open: openAddEnrollment, close: closeAddEnrollment }] =
    useDisclosure(false)
  const [editEnrollment, setEditEnrollment] = useState<Enrollment | null>(null)
  const [addContactOpened, { open: openAddContact, close: closeAddContact }] = useDisclosure(false)
  const [editContact, setEditContact] = useState<EmergencyContact | null>(null)
  const [addServiceOpened, { open: openAddService, close: closeAddService }] = useDisclosure(false)
  const [editService, setEditService] = useState<StudentService | null>(null)

  const { data: student, isLoading } = useStudent(studentId!)
  const deleteContactMutation = useDeleteEmergencyContact()
  const deleteServiceMutation = useDeleteStudentService(studentId!)
  const { data: families } = useFamilies({ limit: 500, status: 'activa' })
  const { data: institutions } = useInstitutions()
  const { data: studentServices } = useStudentServices(studentId!)
  const { data: feeConcepts } = useFeeConcepts(student?.institution.id ?? null)

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    )
  }

  if (!student) return null

  return (
    <Stack gap="lg">
      <Group>
        <ActionIcon
          variant="subtle"
          size="lg"
          aria-label="Volver"
          onClick={() => void navigate('/alumnos')}
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>
          {student.lastName}, {student.firstName}
        </Title>
        <Badge color={STATUS_COLORS[student.status]} variant="light" size="lg">
          {STATUS_LABELS[student.status]}
        </Badge>
      </Group>

      <Group>
        <Button variant="default" leftSection={<IconPencil size={16} />} onClick={openEdit}>
          Editar
        </Button>
      </Group>

      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="md">
          Información del alumno
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <InfoField label="Familia" value={student.family.familyName} />
          <InfoField label="Institución" value={student.institution.name} />
          <InfoField label="DNI" value={student.dni} />
          <InfoField label="Fecha de nacimiento" value={formatDate(student.birthDate)} />
          <InfoField
            label="Género"
            value={
              student.gender === 'masculino'
                ? 'Masculino'
                : student.gender === 'femenino'
                  ? 'Femenino'
                  : student.gender === 'otro'
                    ? 'Otro'
                    : null
            }
          />
          <InfoField label="Grupo sanguíneo" value={student.bloodType} />
          <InfoField label="Obra social" value={student.healthInsurance} />
          <InfoField label="Nro. afiliado" value={student.healthInsuranceNumber} />
          <InfoField label="Fecha de ingreso" value={formatDate(student.enrollmentDate)} />
          {student.medicalNotes && (
            <div style={{ gridColumn: '1 / -1' }}>
              <InfoField label="Observaciones médicas" value={student.medicalNotes} />
            </div>
          )}
          {student.allergies && (
            <div style={{ gridColumn: '1 / -1' }}>
              <InfoField label="Alergias" value={student.allergies} />
            </div>
          )}
          {student.notes && (
            <div style={{ gridColumn: '1 / -1' }}>
              <InfoField label="Notas" value={student.notes} />
            </div>
          )}
        </SimpleGrid>
      </Paper>

      <Divider />

      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Inscripciones</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconPlus size={14} />}
            onClick={openAddEnrollment}
          >
            Nueva inscripción
          </Button>
        </Group>
        <Table.ScrollContainer minWidth={700}>
          <Table withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Año</Table.Th>
                <Table.Th>Nivel</Table.Th>
                <Table.Th>Grado / Sala</Table.Th>
                <Table.Th>Sección</Table.Th>
                <Table.Th>Turno</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {student.enrollments.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7} ta="center" py="xl">
                    <Text c="dimmed">Sin inscripciones registradas</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                [...student.enrollments]
                  .sort((a, b) => b.academicYear - a.academicYear)
                  .map((enrollment) => (
                    <Table.Tr key={enrollment.id}>
                      <Table.Td fw={500}>{enrollment.academicYear}</Table.Td>
                      <Table.Td>{LEVEL_LABELS[enrollment.level]}</Table.Td>
                      <Table.Td>{gradeLabel(enrollment.level, enrollment.grade)}</Table.Td>
                      <Table.Td>{SECTION_LABELS[enrollment.section]}</Table.Td>
                      <Table.Td>{SHIFT_LABELS[enrollment.shift]}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={ENROLLMENT_STATUS_COLORS[enrollment.status]}
                          variant="light"
                          size="sm"
                        >
                          {ENROLLMENT_STATUS_LABELS[enrollment.status]}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="subtle"
                          aria-label="Editar inscripción"
                          onClick={() => setEditEnrollment(enrollment)}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>

      <Divider />

      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Servicios adicionales</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconPlus size={14} />}
            onClick={openAddService}
          >
            Agregar servicio
          </Button>
        </Group>
        <Table.ScrollContainer minWidth={600}>
          <Table withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Servicio</Table.Th>
                <Table.Th>Año</Table.Th>
                <Table.Th>Vigente desde</Table.Th>
                <Table.Th>Vigente hasta</Table.Th>
                <Table.Th>Notas</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {!studentServices || studentServices.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text c="dimmed">Sin servicios contratados</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                [...studentServices]
                  .sort((a, b) => b.academicYear - a.academicYear)
                  .map((svc) => (
                    <Table.Tr key={svc.id}>
                      <Table.Td fw={500}>{svc.feeConcept.name}</Table.Td>
                      <Table.Td>{svc.academicYear}</Table.Td>
                      <Table.Td>{formatDate(svc.activeFrom)}</Table.Td>
                      <Table.Td>{formatDate(svc.activeTo)}</Table.Td>
                      <Table.Td>{svc.notes ?? '—'}</Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon
                            variant="subtle"
                            aria-label="Editar servicio"
                            onClick={() => setEditService(svc)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Eliminar servicio"
                            loading={deleteServiceMutation.isPending}
                            onClick={() =>
                              deleteServiceMutation.mutate(svc.id, { onError: notifyError })
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

      <Divider />

      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Contactos de emergencia</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconPlus size={14} />}
            onClick={openAddContact}
          >
            Agregar contacto
          </Button>
        </Group>
        <Table.ScrollContainer minWidth={500}>
          <Table withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Teléfono</Table.Th>
                <Table.Th>Vínculo</Table.Th>
                <Table.Th>Prioridad</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {student.emergencyContacts.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" py="xl">
                    <Text c="dimmed">Sin contactos de emergencia</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                [...student.emergencyContacts]
                  .sort((a, b) => a.priorityOrder - b.priorityOrder)
                  .map((contact) => (
                    <Table.Tr key={contact.id}>
                      <Table.Td fw={500}>{contact.name}</Table.Td>
                      <Table.Td>{contact.phone}</Table.Td>
                      <Table.Td>{contact.relationship}</Table.Td>
                      <Table.Td>{contact.priorityOrder}</Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <ActionIcon
                            variant="subtle"
                            aria-label="Editar contacto"
                            onClick={() => setEditContact(contact)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Eliminar contacto"
                            loading={deleteContactMutation.isPending}
                            onClick={() =>
                              deleteContactMutation.mutate(
                                { studentId: student.id, contactId: contact.id },
                                { onError: notifyError },
                              )
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

      <StudentServiceForm
        key="add-service"
        opened={addServiceOpened}
        onClose={closeAddService}
        studentId={student.id}
        services={feeConcepts ?? []}
      />
      <StudentServiceForm
        key={editService?.id ?? 'edit-service'}
        opened={!!editService}
        onClose={() => setEditService(null)}
        studentId={student.id}
        services={feeConcepts ?? []}
        service={editService ?? undefined}
      />
      <StudentForm
        key={student.id}
        opened={editOpened}
        onClose={closeEdit}
        families={families?.items ?? []}
        institutions={institutions ?? []}
        student={student}
      />
      <EnrollmentForm
        key="add-enrollment"
        opened={addEnrollmentOpened}
        onClose={closeAddEnrollment}
        studentId={student.id}
      />
      <EnrollmentForm
        key={editEnrollment?.id ?? 'edit-enrollment'}
        opened={!!editEnrollment}
        onClose={() => setEditEnrollment(null)}
        studentId={student.id}
        enrollment={editEnrollment ?? undefined}
      />
      <EmergencyContactForm
        key="add-contact"
        opened={addContactOpened}
        onClose={closeAddContact}
        studentId={student.id}
      />
      <EmergencyContactForm
        key={editContact?.id ?? 'edit-contact'}
        opened={!!editContact}
        onClose={() => setEditContact(null)}
        studentId={student.id}
        contact={editContact ?? undefined}
      />
    </Stack>
  )
}
