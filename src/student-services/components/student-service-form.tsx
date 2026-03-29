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
import type { ApiError } from '../../lib/api-error'
import { useCreateStudentService } from '../hooks/use-student-services'
import { useUpdateStudentService } from '../hooks/use-student-services'
import type { FeeConcept } from '../../fee-concepts/fee-concepts.types'
import type { StudentService } from '../student-services.types'

interface StudentServiceFormProps {
  opened: boolean
  onClose: () => void
  studentId: string
  services: FeeConcept[]
  service?: StudentService
}

export function StudentServiceForm({
  opened,
  onClose,
  studentId,
  services,
  service,
}: StudentServiceFormProps) {
  const isEdit = !!service
  const createMutation = useCreateStudentService(studentId)
  const updateMutation = useUpdateStudentService(studentId)

  const serviceOptions = services
    .filter((s) => s.isActive && s.type === 'servicio')
    .map((s) => ({ value: s.id, label: s.name }))

  const form = useForm({
    initialValues: {
      feeConceptId: service?.feeConcept.id ?? '',
      academicYear: service?.academicYear ?? new Date().getFullYear(),
      activeFrom: service?.activeFrom?.substring(0, 10) ?? '',
      activeTo: service?.activeTo?.substring(0, 10) ?? '',
      notes: service?.notes ?? '',
    },
  })

  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending
  const error = (isEdit ? updateMutation.error : createMutation.error) as ApiError | null

  const handleClose = () => {
    createMutation.reset()
    updateMutation.reset()
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    const data = {
      academicYear: values.academicYear,
      activeFrom: values.activeFrom,
      activeTo: values.activeTo || undefined,
      notes: values.notes.trim() || undefined,
    }

    const onSuccess = () => {
      form.reset()
      onClose()
    }

    if (isEdit && service) {
      updateMutation.mutate({ serviceId: service.id, data }, { onSuccess })
    } else {
      createMutation.mutate(
        { feeConceptId: values.feeConceptId, ...data },
        { onSuccess },
      )
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? 'Editar servicio' : 'Agregar servicio'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(error)}
            </Alert>
          )}
          {!isEdit && (
            <Select
              label="Servicio"
              required
              placeholder="Seleccionar servicio"
              data={serviceOptions}
              {...form.getInputProps('feeConceptId')}
            />
          )}
          <NumberInput
            label="Año lectivo"
            min={2020}
            max={2099}
            required
            {...form.getInputProps('academicYear')}
          />
          <Group grow>
            <TextInput
              label="Vigente desde"
              type="date"
              required
              {...form.getInputProps('activeFrom')}
            />
            <TextInput
              label="Vigente hasta"
              type="date"
              {...form.getInputProps('activeTo')}
            />
          </Group>
          <Textarea label="Notas" rows={2} {...form.getInputProps('notes')} />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? 'Guardar cambios' : 'Agregar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
