import { Alert, Button, Checkbox, Group, Modal, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { getErrorMessage } from '../../lib/api-error'
import { useCreateFeeConcept } from '../hooks/use-create-fee-concept'
import { useUpdateFeeConcept } from '../hooks/use-update-fee-concept'
import {
  FEE_CONCEPT_TYPE_LABELS,
  FEE_CONCEPT_TYPES,
  type FeeConcept,
  type FeeConceptType,
} from '../fee-concepts.types'

interface FeeConceptFormProps {
  opened: boolean
  onClose: () => void
  institutionId: string
  concept?: FeeConcept
}

export function FeeConceptForm({ opened, onClose, institutionId, concept }: FeeConceptFormProps) {
  const isEdit = !!concept
  const createMutation = useCreateFeeConcept()
  const updateMutation = useUpdateFeeConcept(institutionId)

  const form = useForm({
    initialValues: {
      name: concept?.name ?? '',
      type: (concept?.type ?? 'arancel') as FeeConceptType,
      isRecurring: concept?.isRecurring ?? true,
      description: concept?.description ?? '',
    },
    validate: {
      name: (v) => (v.trim().length === 0 ? 'El nombre es requerido' : null),
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
    const base = {
      name: values.name.trim(),
      type: values.type,
      isRecurring: values.isRecurring,
      description: values.description.trim() || undefined,
    }
    const onSuccess = () => { form.reset(); onClose() }

    if (isEdit && concept) {
      updateMutation.mutate({ conceptId: concept.id, data: base }, { onSuccess })
    } else {
      createMutation.mutate({ ...base, institutionId }, { onSuccess })
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? 'Editar concepto' : 'Nuevo concepto'}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(error)}
            </Alert>
          )}
          <TextInput label="Nombre" placeholder="Ej: Arancel, Comedor..." required {...form.getInputProps('name')} />
          <Select
            label="Tipo"
            required
            allowDeselect={false}
            data={FEE_CONCEPT_TYPES.map((t) => ({ value: t, label: FEE_CONCEPT_TYPE_LABELS[t] }))}
            {...form.getInputProps('type')}
          />
          <Checkbox
            label="Recurrente (se cobra todos los meses)"
            {...form.getInputProps('isRecurring', { type: 'checkbox' })}
          />
          <Textarea label="Descripción" rows={2} {...form.getInputProps('description')} />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={isPending}>Cancelar</Button>
            <Button type="submit" loading={isPending}>{isEdit ? 'Guardar cambios' : 'Crear concepto'}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
