import { Alert, Button, Group, Modal, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { useState } from 'react'
import { getErrorMessage } from '../../lib/api-error'
import { useSystemConfig } from '../../system-config/hooks/use-system-config'
import { useGenerateInstallment } from '../hooks/use-generate-installment'

const MONTHS = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

interface GenerateInstallmentFormProps {
  opened: boolean
  onClose: () => void
  familyId: string
}

export function GenerateInstallmentForm({ opened, onClose, familyId }: GenerateInstallmentFormProps) {
  const { data: config } = useSystemConfig()
  const generateMutation = useGenerateInstallment(familyId)
  const [error, setError] = useState<unknown>(null)

  const currentMonth = new Date().getMonth() + 1
  const currentYear = config?.currentAcademicYear ?? new Date().getFullYear()

  const form = useForm({
    initialValues: {
      month: String(currentMonth),
      academicYear: currentYear,
      dueDate: '',
      notes: '',
    },
  })

  const handleClose = () => {
    generateMutation.reset()
    setError(null)
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    setError(null)
    generateMutation.mutate(
      {
        familyId,
        month: parseInt(values.month, 10),
        academicYear: values.academicYear,
        dueDate: values.dueDate,
        notes: values.notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          form.reset()
          onClose()
        },
        onError: (err) => setError(err),
      },
    )
  })

  return (
    <Modal opened={opened} onClose={handleClose} title="Generar cuota" size="sm">
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error != null && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {getErrorMessage(error)}
            </Alert>
          )}

          <Group grow>
            <Select
              label="Mes"
              required
              data={MONTHS}
              {...form.getInputProps('month')}
            />
            <NumberInput
              label="Año lectivo"
              min={2020}
              max={2099}
              required
              allowDecimal={false}
              {...form.getInputProps('academicYear')}
            />
          </Group>

          <TextInput
            label="Fecha de vencimiento"
            type="date"
            required
            {...form.getInputProps('dueDate')}
          />

          <Textarea label="Notas" rows={2} {...form.getInputProps('notes')} />

          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={generateMutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={generateMutation.isPending}>
              Generar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
