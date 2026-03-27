import { useForm } from '@mantine/form'
import { Button, Checkbox, Group, Modal, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useCreateGuardian } from '../hooks/use-create-guardian'
import { useUpdateGuardian } from '../hooks/use-update-guardian'
import type { Guardian, Relationship } from '../families.types'

interface GuardianFormProps {
  opened: boolean
  onClose: () => void
  familyId: string
  guardian?: Guardian
}

const RELATIONSHIP_OPTIONS = [
  { value: 'padre', label: 'Padre' },
  { value: 'madre', label: 'Madre' },
  { value: 'tutor', label: 'Tutor/a' },
  { value: 'otro', label: 'Otro' },
]

function cleanOptional(value: string): string | undefined {
  return value.trim() || undefined
}

export function GuardianForm({ opened, onClose, familyId, guardian }: GuardianFormProps) {
  const isEdit = !!guardian
  const createMutation = useCreateGuardian()
  const updateMutation = useUpdateGuardian()

  const form = useForm({
    initialValues: {
      firstName: guardian?.firstName ?? '',
      lastName: guardian?.lastName ?? '',
      relationship: (guardian?.relationship ?? 'padre') as Relationship,
      dni: guardian?.dni ?? '',
      cuitCuil: guardian?.cuitCuil ?? '',
      phone: guardian?.phone ?? '',
      email: guardian?.email ?? '',
      isPrimaryContact: guardian?.isPrimaryContact ?? false,
      occupation: guardian?.occupation ?? '',
      employer: guardian?.employer ?? '',
      notes: guardian?.notes ?? '',
    },
    validate: {
      firstName: (v) => (v.trim().length === 0 ? 'Requerido' : null),
      lastName: (v) => (v.trim().length === 0 ? 'Requerido' : null),
      email: (v) => {
        if (!v.trim()) return null
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email inválido'
      },
    },
  })

  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending

  const handleSubmit = form.onSubmit((values) => {
    const data = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      relationship: values.relationship,
      dni: cleanOptional(values.dni),
      cuitCuil: cleanOptional(values.cuitCuil),
      phone: cleanOptional(values.phone),
      email: cleanOptional(values.email),
      isPrimaryContact: values.isPrimaryContact,
      occupation: cleanOptional(values.occupation),
      employer: cleanOptional(values.employer),
      notes: cleanOptional(values.notes),
    }

    const onSuccess = () => {
      form.reset()
      onClose()
    }

    if (isEdit && guardian) {
      updateMutation.mutate({ familyId, guardianId: guardian.id, data }, { onSuccess })
    } else {
      createMutation.mutate({ familyId, data }, { onSuccess })
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? 'Editar responsable' : 'Agregar responsable'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              label="Nombre"
              placeholder="Juan"
              required
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Apellido"
              placeholder="García"
              required
              {...form.getInputProps('lastName')}
            />
          </Group>
          <Select
            label="Vínculo"
            required
            data={RELATIONSHIP_OPTIONS}
            {...form.getInputProps('relationship')}
          />
          <Group grow>
            <TextInput label="DNI" placeholder="12345678" {...form.getInputProps('dni')} />
            <TextInput
              label="CUIT/CUIL"
              placeholder="20-12345678-9"
              {...form.getInputProps('cuitCuil')}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Teléfono"
              placeholder="11 1234-5678"
              {...form.getInputProps('phone')}
            />
            <TextInput
              label="Email"
              placeholder="juan@email.com"
              {...form.getInputProps('email')}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Ocupación"
              placeholder="Comerciante"
              {...form.getInputProps('occupation')}
            />
            <TextInput
              label="Empleador"
              placeholder="Empresa S.A."
              {...form.getInputProps('employer')}
            />
          </Group>
          <Checkbox
            label="Contacto principal"
            {...form.getInputProps('isPrimaryContact', { type: 'checkbox' })}
          />
          <Textarea
            label="Notas"
            placeholder="Observaciones adicionales"
            rows={2}
            {...form.getInputProps('notes')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={onClose} disabled={isPending}>
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
