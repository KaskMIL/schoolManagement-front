import {
  Alert,
  Button,
  Divider,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { getErrorMessage } from '../../lib/api-error'
import { useCreateStudent } from '../hooks/use-create-student'
import { useUpdateStudent } from '../hooks/use-update-student'
import type { FamilySummary } from '../../families/families.types'
import type { Institution } from '../../institutions/institutions.types'
import type { StudentDetail, StudentSummary } from '../students.types'

interface StudentFormProps {
  opened: boolean
  onClose: () => void
  families: FamilySummary[]
  institutions: Institution[]
  student?: StudentSummary | StudentDetail
}

const STATUS_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'egresado', label: 'Egresado' },
  { value: 'baja', label: 'Baja' },
]

const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
]

function cleanOptional(value: string): string | undefined {
  return value.trim() || undefined
}

export function StudentForm({
  opened,
  onClose,
  families,
  institutions,
  student,
}: StudentFormProps) {
  const isEdit = !!student
  const createMutation = useCreateStudent()
  const updateMutation = useUpdateStudent()

  const familyOptions = families.map((f) => ({ value: f.id, label: f.familyName }))
  const institutionOptions = institutions.map((i) => ({ value: i.id, label: i.name }))

  const detail = student as StudentDetail | undefined

  const form = useForm({
    initialValues: {
      firstName: student?.firstName ?? '',
      lastName: student?.lastName ?? '',
      familyId: student?.family?.id ?? '',
      institutionId: student?.institution?.id ?? '',
      status: student?.status ?? 'activo',
      dni: student?.dni ?? '',
      birthDate: student?.birthDate?.substring(0, 10) ?? '',
      gender: student?.gender ?? '',
      bloodType: detail?.bloodType ?? '',
      medicalNotes: detail?.medicalNotes ?? '',
      allergies: detail?.allergies ?? '',
      healthInsurance: detail?.healthInsurance ?? '',
      healthInsuranceNumber: detail?.healthInsuranceNumber ?? '',
      enrollmentDate: detail?.enrollmentDate?.substring(0, 10) ?? '',
      notes: detail?.notes ?? '',
    },
    validate: {
      firstName: (v) => (v.trim().length === 0 ? 'Requerido' : null),
      lastName: (v) => (v.trim().length === 0 ? 'Requerido' : null),
      familyId: (v) => (v.length === 0 ? 'Seleccioná una familia' : null),
      institutionId: (v) => (v.length === 0 ? 'Seleccioná una institución' : null),
    },
  })

  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending
  const error = isEdit ? updateMutation.error : createMutation.error

  const handleClose = () => {
    createMutation.reset()
    updateMutation.reset()
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    const onSuccess = () => {
      form.reset()
      onClose()
    }

    if (isEdit && student) {
      updateMutation.mutate(
        {
          studentId: student.id,
          data: {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            status: values.status as 'activo' | 'inactivo' | 'egresado' | 'baja',
            dni: cleanOptional(values.dni),
            birthDate: cleanOptional(values.birthDate),
            gender: cleanOptional(values.gender) as
              | 'masculino'
              | 'femenino'
              | 'otro'
              | undefined,
            bloodType: cleanOptional(values.bloodType),
            medicalNotes: cleanOptional(values.medicalNotes),
            allergies: cleanOptional(values.allergies),
            healthInsurance: cleanOptional(values.healthInsurance),
            healthInsuranceNumber: cleanOptional(values.healthInsuranceNumber),
            enrollmentDate: cleanOptional(values.enrollmentDate),
            notes: cleanOptional(values.notes),
          },
        },
        { onSuccess },
      )
    } else {
      createMutation.mutate(
        {
          familyId: values.familyId,
          institutionId: values.institutionId,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          status: values.status as 'activo' | 'inactivo' | 'egresado' | 'baja',
          dni: cleanOptional(values.dni),
          birthDate: cleanOptional(values.birthDate),
          gender: cleanOptional(values.gender) as 'masculino' | 'femenino' | 'otro' | undefined,
          bloodType: cleanOptional(values.bloodType),
          medicalNotes: cleanOptional(values.medicalNotes),
          allergies: cleanOptional(values.allergies),
          healthInsurance: cleanOptional(values.healthInsurance),
          healthInsuranceNumber: cleanOptional(values.healthInsuranceNumber),
          enrollmentDate: cleanOptional(values.enrollmentDate),
          notes: cleanOptional(values.notes),
        },
        { onSuccess },
      )
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? 'Editar alumno' : 'Nuevo alumno'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(error)}
            </Alert>
          )}

          <Text fw={500} size="sm" c="dimmed">
            Datos básicos
          </Text>
          <Group grow>
            <TextInput label="Nombre" required {...form.getInputProps('firstName')} />
            <TextInput label="Apellido" required {...form.getInputProps('lastName')} />
          </Group>
          <Select
            label="Familia"
            placeholder="Buscá una familia..."
            required
            searchable
            data={familyOptions}
            disabled={isEdit}
            {...form.getInputProps('familyId')}
          />
          <Select
            label="Institución"
            required
            data={institutionOptions}
            disabled={isEdit}
            {...form.getInputProps('institutionId')}
          />
          <Select
            label="Estado"
            data={STATUS_OPTIONS}
            {...form.getInputProps('status')}
          />

          <Divider mt="xs" />
          <Text fw={500} size="sm" c="dimmed">
            Datos personales
          </Text>
          <Group grow>
            <TextInput label="DNI" placeholder="12345678" {...form.getInputProps('dni')} />
            <TextInput
              label="Fecha de nacimiento"
              type="date"
              {...form.getInputProps('birthDate')}
            />
          </Group>
          <Group grow>
            <Select
              label="Género"
              placeholder="Seleccionar"
              clearable
              data={GENDER_OPTIONS}
              {...form.getInputProps('gender')}
            />
            <TextInput
              label="Grupo sanguíneo"
              placeholder="A+"
              {...form.getInputProps('bloodType')}
            />
          </Group>

          <Divider mt="xs" />
          <Text fw={500} size="sm" c="dimmed">
            Datos médicos y adicionales
          </Text>
          <Textarea
            label="Observaciones médicas"
            rows={2}
            {...form.getInputProps('medicalNotes')}
          />
          <Textarea label="Alergias" rows={2} {...form.getInputProps('allergies')} />
          <Group grow>
            <TextInput label="Obra social" {...form.getInputProps('healthInsurance')} />
            <TextInput label="Nro. afiliado" {...form.getInputProps('healthInsuranceNumber')} />
          </Group>
          <TextInput
            label="Fecha de ingreso al colegio"
            type="date"
            {...form.getInputProps('enrollmentDate')}
          />
          <Textarea label="Notas" rows={2} {...form.getInputProps('notes')} />

          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? 'Guardar cambios' : 'Crear alumno'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
