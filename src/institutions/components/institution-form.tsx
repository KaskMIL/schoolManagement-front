import { Alert, Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { getErrorMessage } from '../../lib/api-error'
import { useUpdateInstitution } from '../hooks/use-update-institution'
import type { Institution } from '../institutions.types'

interface InstitutionFormProps {
  opened: boolean
  onClose: () => void
  institution: Institution
}

function cleanOptional(value: string): string | undefined {
  return value.trim() || undefined
}

export function InstitutionForm({ opened, onClose, institution }: InstitutionFormProps) {
  const mutation = useUpdateInstitution()

  const form = useForm({
    initialValues: {
      name: institution.name,
      cue: institution.cue ?? '',
      diegepDipregep: institution.diegepDipregep ?? '',
      address: institution.address ?? '',
      phone: institution.phone ?? '',
      email: institution.email ?? '',
      logoUrl: institution.logoUrl ?? '',
    },
    validate: {
      name: (v) => (v.trim().length === 0 ? 'El nombre es requerido' : null),
      email: (v) => {
        if (!v.trim()) return null
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email inválido'
      },
    },
  })

  const handleClose = () => {
    mutation.reset()
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    mutation.mutate(
      {
        institutionId: institution.id,
        data: {
          name: values.name.trim(),
          cue: cleanOptional(values.cue),
          diegepDipregep: cleanOptional(values.diegepDipregep),
          address: cleanOptional(values.address),
          phone: cleanOptional(values.phone),
          email: cleanOptional(values.email),
          logoUrl: cleanOptional(values.logoUrl),
        },
      },
      { onSuccess: onClose },
    )
  })

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={`Editar — ${institution.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {mutation.isError && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(mutation.error)}
            </Alert>
          )}
          <TextInput
            label="Nombre"
            placeholder="Nombre de la institución"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="CUE"
            placeholder="Código Único de Establecimiento"
            {...form.getInputProps('cue')}
          />
          <TextInput
            label="DIÉGEP / DIPREGEP"
            placeholder="Número DIÉGEP / DIPREGEP"
            {...form.getInputProps('diegepDipregep')}
          />
          <TextInput
            label="Dirección"
            placeholder="Av. San Martín 123"
            {...form.getInputProps('address')}
          />
          <TextInput
            label="Teléfono"
            placeholder="011 4123-4567"
            {...form.getInputProps('phone')}
          />
          <TextInput
            label="Email"
            placeholder="info@escuela.edu.ar"
            {...form.getInputProps('email')}
          />
          <TextInput
            label="URL del logo"
            placeholder="https://..."
            {...form.getInputProps('logoUrl')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Guardar cambios
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
