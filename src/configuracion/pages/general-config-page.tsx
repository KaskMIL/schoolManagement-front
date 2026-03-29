import { Alert, Button, NumberInput, Paper, Stack, Text, Title } from '@mantine/core'
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
    },
  })

  useEffect(() => {
    if (config) {
      form.setValues({ currentAcademicYear: config.currentAcademicYear })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  const handleSubmit = form.onSubmit((values) => {
    setError(null)
    updateMutation.mutate(
      { currentAcademicYear: values.currentAcademicYear },
      {
        onError: (err) => setError(err),
      },
    )
  })

  if (isLoading) return null

  return (
    <Paper withBorder p="md" radius="md" maw={480}>
      <Stack gap="md">
        <Title order={4}>Configuración general</Title>
        <Text size="sm" c="dimmed">
          El año lectivo activo se usa para generar cuotas y determinar precios vigentes.
        </Text>

        {error != null && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            {getErrorMessage(error)}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <NumberInput
              label="Año lectivo activo"
              min={2020}
              max={2099}
              allowDecimal={false}
              {...form.getInputProps('currentAcademicYear')}
            />
            <Button type="submit" loading={updateMutation.isPending}>
              Guardar
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}
