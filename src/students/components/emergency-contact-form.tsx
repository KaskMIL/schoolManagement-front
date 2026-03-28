import { Alert, Button, Group, Modal, NumberInput, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { getErrorMessage } from '../../lib/api-error'
import { useCreateEmergencyContact } from '../hooks/use-create-emergency-contact'
import { useUpdateEmergencyContact } from '../hooks/use-update-emergency-contact'
import type { EmergencyContact } from '../students.types'

interface EmergencyContactFormProps {
  opened: boolean
  onClose: () => void
  studentId: string
  contact?: EmergencyContact
}

export function EmergencyContactForm({
  opened,
  onClose,
  studentId,
  contact,
}: EmergencyContactFormProps) {
  const isEdit = !!contact
  const createMutation = useCreateEmergencyContact()
  const updateMutation = useUpdateEmergencyContact()

  const form = useForm({
    initialValues: {
      name: contact?.name ?? '',
      phone: contact?.phone ?? '',
      relationship: contact?.relationship ?? '',
      priorityOrder: contact?.priorityOrder ?? 1,
    },
    validate: {
      name: (v) => (v.trim().length === 0 ? 'Requerido' : null),
      phone: (v) => (v.trim().length === 0 ? 'Requerido' : null),
      relationship: (v) => (v.trim().length === 0 ? 'Requerido' : null),
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
      name: values.name.trim(),
      phone: values.phone.trim(),
      relationship: values.relationship.trim(),
      priorityOrder: values.priorityOrder,
    }

    const onSuccess = () => {
      form.reset()
      onClose()
    }

    if (isEdit && contact) {
      updateMutation.mutate({ studentId, contactId: contact.id, data }, { onSuccess })
    } else {
      createMutation.mutate({ studentId, data }, { onSuccess })
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? 'Editar contacto de emergencia' : 'Agregar contacto de emergencia'}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(error)}
            </Alert>
          )}
          <TextInput
            label="Nombre completo"
            placeholder="María García"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Teléfono"
            placeholder="11 1234-5678"
            required
            {...form.getInputProps('phone')}
          />
          <TextInput
            label="Vínculo"
            placeholder="Abuela, Tío..."
            required
            {...form.getInputProps('relationship')}
          />
          <NumberInput
            label="Prioridad"
            description="1 = más urgente"
            min={1}
            {...form.getInputProps('priorityOrder')}
          />
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
