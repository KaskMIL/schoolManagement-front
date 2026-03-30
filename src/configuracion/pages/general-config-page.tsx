import { Alert, Button, NumberInput, Paper, Stack, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../lib/api-error'
import { useSystemConfig } from '../../system-config/hooks/use-system-config'
import { useUpdateSystemConfig } from '../../system-config/hooks/use-update-system-config'

export default function GeneralConfigPage() {
  const { data: config, isLoading } = useSystemConfig()
  const updateMutation = useUpdateSystemConfig()
  const [error, setError] = useState<unknown>(null)

  const form = useForm({
    initialValues: {
      currentAcademicYear: new Date().getFullYear(),
      earlyPaymentCutoffDay: 10,
    },
  })

  useEffect(() => {
    if (config) {
      form.setValues({
        currentAcademicYear: config.currentAcademicYear,
        earlyPaymentCutoffDay: config.earlyPaymentCutoffDay,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  const handleSubmit = form.onSubmit((values) => {
    setError(null)
    updateMutation.mutate(
      {
        currentAcademicYear: values.currentAcademicYear,
        earlyPaymentCutoffDay: values.earlyPaymentCutoffDay,
      },
      { onError: (err) => setError(err) },
    )
  })

  if (isLoading) return null

  return (
    <Paper withBorder p="md" radius="md" maw={480}>
      <Stack gap="md">
        <Title order={4}>Configuración general</Title>

        {error != null && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            {getErrorMessage(error)}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <NumberInput
              label="Año lectivo activo"
              description="Se usa para generar cuotas y determinar precios vigentes."
              min={2020}
              max={2099}
              allowDecimal={false}
              {...form.getInputProps('currentAcademicYear')}
            />
            <NumberInput
              label="Día de corte para pronto pago"
              description="Pagos registrados hasta este día del mes aplican el descuento por pronto pago."
              min={1}
              max={28}
              allowDecimal={false}
              suffix=" del mes"
              {...form.getInputProps('earlyPaymentCutoffDay')}
            />
            <Button type="submit" loading={updateMutation.isPending} mt="xs">
              Guardar
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}
