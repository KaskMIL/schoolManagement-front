import { useForm } from '@mantine/form'
import { Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core'
import { useCreateFamily } from '../hooks/use-create-family'
import { useUpdateFamily } from '../hooks/use-update-family'
import type { FamilySummary } from '../families.types'

interface FamilyFormProps {
  opened: boolean
  onClose: () => void
  family?: FamilySummary
}

function cleanOptional(value: string): string | undefined {
  return value.trim() || undefined
}

export function FamilyForm({ opened, onClose, family }: FamilyFormProps) {
  const isEdit = !!family
  const createMutation = useCreateFamily()
  const updateMutation = useUpdateFamily()

  const form = useForm({
    initialValues: {
      familyName: family?.familyName ?? '',
      primaryEmail: family?.primaryEmail ?? '',
      primaryPhone: family?.primaryPhone ?? '',
      address: family?.address ?? '',
      locality: family?.locality ?? '',
      notes: family?.notes ?? '',
    },
    validate: {
      familyName: (v) => (v.trim().length === 0 ? 'El nombre es requerido' : null),
      primaryEmail: (v) => {
        if (!v.trim()) return null
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email inválido'
      },
    },
  })

  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending

  const handleSubmit = form.onSubmit((values) => {
    const data = {
      familyName: values.familyName.trim(),
      primaryEmail: cleanOptional(values.primaryEmail),
      primaryPhone: cleanOptional(values.primaryPhone),
      address: cleanOptional(values.address),
      locality: cleanOptional(values.locality),
      notes: cleanOptional(values.notes),
    }

    const onSuccess = () => {
      form.reset()
      onClose()
    }

    if (isEdit && family) {
      updateMutation.mutate({ familyId: family.id, data }, { onSuccess })
    } else {
      createMutation.mutate(data, { onSuccess })
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? 'Editar familia' : 'Nueva familia'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <TextInput
            label="Nombre de la familia"
            placeholder="Ej: García"
            required
            {...form.getInputProps('familyName')}
          />
          <TextInput
            label="Email principal"
            placeholder="contacto@email.com"
            {...form.getInputProps('primaryEmail')}
          />
          <TextInput
            label="Teléfono principal"
            placeholder="11 1234-5678"
            {...form.getInputProps('primaryPhone')}
          />
          <TextInput
            label="Dirección"
            placeholder="Av. San Martín 123"
            {...form.getInputProps('address')}
          />
          <TextInput
            label="Localidad"
            placeholder="San Miguel"
            {...form.getInputProps('locality')}
          />
          <Textarea
            label="Notas"
            placeholder="Observaciones adicionales"
            rows={3}
            {...form.getInputProps('notes')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit ? 'Guardar cambios' : 'Crear familia'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
