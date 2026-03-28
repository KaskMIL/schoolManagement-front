import {
  Alert,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { getErrorMessage } from '../../lib/api-error'
import { useCreateEnrollment } from '../hooks/use-create-enrollment'
import { useUpdateEnrollment } from '../hooks/use-update-enrollment'
import type { Enrollment } from '../students.types'

interface EnrollmentFormProps {
  opened: boolean
  onClose: () => void
  studentId: string
  enrollment?: Enrollment
}

const LEVEL_OPTIONS = [
  { value: 'jardin', label: 'Jardín' },
  { value: 'primaria', label: 'Primaria' },
  { value: 'secundaria', label: 'Secundaria' },
]

const SECTION_OPTIONS = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'unico', label: 'Único' },
]

const SHIFT_OPTIONS = [
  { value: 'manana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'completo', label: 'Completo' },
]

const STATUS_OPTIONS = [
  { value: 'inscripto', label: 'Inscripto' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'baja', label: 'Baja' },
]

export function EnrollmentForm({
  opened,
  onClose,
  studentId,
  enrollment,
}: EnrollmentFormProps) {
  const isEdit = !!enrollment
  const createMutation = useCreateEnrollment()
  const updateMutation = useUpdateEnrollment()

  const form = useForm({
    initialValues: {
      academicYear: enrollment?.academicYear ?? new Date().getFullYear(),
      level: enrollment?.level ?? 'primaria',
      gradeOrRoom: enrollment?.gradeOrRoom ?? '',
      section: enrollment?.section ?? 'A',
      shift: enrollment?.shift ?? 'manana',
      status: enrollment?.status ?? 'inscripto',
      enrollmentDate: enrollment?.enrollmentDate?.substring(0, 10) ?? '',
      notes: enrollment?.notes ?? '',
    },
    validate: {
      gradeOrRoom: (v) => (v.trim().length === 0 ? 'Requerido' : null),
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
    const data = {
      academicYear: values.academicYear,
      level: values.level as 'jardin' | 'primaria' | 'secundaria',
      gradeOrRoom: values.gradeOrRoom.trim(),
      section: values.section as 'A' | 'B' | 'unico',
      shift: values.shift as 'manana' | 'tarde' | 'completo',
      status: values.status as 'inscripto' | 'confirmado' | 'baja',
      enrollmentDate: values.enrollmentDate.trim() || undefined,
      notes: values.notes.trim() || undefined,
    }

    const onSuccess = () => {
      form.reset()
      onClose()
    }

    if (isEdit && enrollment) {
      updateMutation.mutate({ studentId, enrollmentId: enrollment.id, data }, { onSuccess })
    } else {
      createMutation.mutate({ studentId, data }, { onSuccess })
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? 'Editar inscripción' : 'Nueva inscripción'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(error)}
            </Alert>
          )}
          <NumberInput
            label="Año lectivo"
            min={2020}
            max={2099}
            required
            {...form.getInputProps('academicYear')}
          />
          <Group grow>
            <Select
              label="Nivel"
              required
              data={LEVEL_OPTIONS}
              {...form.getInputProps('level')}
            />
            <TextInput
              label="Grado / Sala"
              placeholder="3° grado, Sala de 4..."
              required
              {...form.getInputProps('gradeOrRoom')}
            />
          </Group>
          <Group grow>
            <Select
              label="Sección"
              required
              data={SECTION_OPTIONS}
              {...form.getInputProps('section')}
            />
            <Select
              label="Turno"
              required
              data={SHIFT_OPTIONS}
              {...form.getInputProps('shift')}
            />
          </Group>
          <Select
            label="Estado"
            required
            data={STATUS_OPTIONS}
            {...form.getInputProps('status')}
          />
          <TextInput
            label="Fecha de inscripción"
            type="date"
            {...form.getInputProps('enrollmentDate')}
          />
          <Textarea label="Notas" rows={2} {...form.getInputProps('notes')} />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? 'Guardar cambios' : 'Inscribir'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
