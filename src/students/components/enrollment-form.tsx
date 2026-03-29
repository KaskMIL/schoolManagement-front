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
import type { Enrollment, Level } from '../students.types'

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

function getGradeOptions(level: Level) {
  if (level === 'jardin') {
    return [3, 4, 5].map((n) => ({ value: String(n), label: `Sala de ${n}` }))
  }
  if (level === 'primaria') {
    return [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n}° grado` }))
  }
  return [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n}° año` }))
}

function defaultGrade(level: Level): number {
  return level === 'jardin' ? 3 : 1
}

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
      level: (enrollment?.level ?? 'primaria') as Level,
      grade: enrollment?.grade ?? 1,
      section: enrollment?.section ?? 'A',
      shift: enrollment?.shift ?? 'manana',
      status: enrollment?.status ?? 'inscripto',
      enrollmentDate: enrollment?.enrollmentDate?.substring(0, 10) ?? '',
      notes: enrollment?.notes ?? '',
    },
  })

  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending
  const error = isEdit ? updateMutation.error : createMutation.error
  const gradeOptions = getGradeOptions(form.values.level)

  function handleLevelChange(value: string | null) {
    if (!value) return
    const level = value as Level
    form.setValues({ level, grade: defaultGrade(level) })
  }

  const handleClose = () => {
    createMutation.reset()
    updateMutation.reset()
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    const data = {
      academicYear: values.academicYear,
      level: values.level,
      grade: values.grade,
      section: values.section,
      shift: values.shift,
      status: values.status,
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
              allowDeselect={false}
              value={form.values.level}
              onChange={handleLevelChange}
              error={form.errors.level}
            />
            <Select
              label="Grado / Sala"
              required
              data={gradeOptions}
              allowDeselect={false}
              value={String(form.values.grade)}
              onChange={(v) => form.setFieldValue('grade', Number(v))}
              error={form.errors.grade}
            />
          </Group>
          <Group grow>
            <Select
              label="Sección"
              required
              data={SECTION_OPTIONS}
              allowDeselect={false}
              {...form.getInputProps('section')}
            />
            <Select
              label="Turno"
              required
              data={SHIFT_OPTIONS}
              allowDeselect={false}
              {...form.getInputProps('shift')}
            />
          </Group>
          <Select
            label="Estado"
            required
            data={STATUS_OPTIONS}
            allowDeselect={false}
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
