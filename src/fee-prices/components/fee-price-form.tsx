import { Alert, Button, Group, Modal, NumberInput, Select, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import { getErrorMessage } from '../../lib/api-error'
import { usePriceTiers } from '../../price-tiers/hooks/use-price-tiers'
import { useCreateFeePrice } from '../hooks/use-create-fee-price'
import { useUpdateFeePrice } from '../hooks/use-update-fee-price'
import type { FeePrice } from '../fee-prices.types'

interface FeePriceFormProps {
  opened: boolean
  onClose: () => void
  feeConceptId: string
  price?: FeePrice
}

export function FeePriceForm({ opened, onClose, feeConceptId, price }: FeePriceFormProps) {
  const isEdit = !!price
  const { data: priceTiers = [] } = usePriceTiers()
  const createMutation = useCreateFeePrice()
  const updateMutation = useUpdateFeePrice(feeConceptId)

  const form = useForm({
    initialValues: {
      priceTierId: price?.priceTier?.id ?? '',
      academicYear: price?.academicYear ?? new Date().getFullYear(),
      amount: price ? Number(price.amount) : 0,
    },
    validate: {
      amount: (v) => (v <= 0 ? 'El monto debe ser mayor a 0' : null),
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
      priceTierId: values.priceTierId || undefined,
      academicYear: values.academicYear,
      amount: values.amount,
    }
    const onSuccess = () => { form.reset(); onClose() }

    if (isEdit && price) {
      updateMutation.mutate({ priceId: price.id, data: base }, { onSuccess })
    } else {
      createMutation.mutate({ ...base, feeConceptId }, { onSuccess })
    }
  })

  const tierOptions = [
    { value: '', label: '— Sin ciclo (servicio) —' },
    ...priceTiers.map((t) => ({ value: t.id, label: t.name })),
  ]

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? 'Editar precio' : 'Nuevo precio'}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error && (
            <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
              {getErrorMessage(error)}
            </Alert>
          )}
          <Select
            label="Ciclo de precios"
            data={tierOptions}
            allowDeselect={false}
            {...form.getInputProps('priceTierId')}
          />
          <NumberInput
            label="Año lectivo"
            min={2020}
            max={2099}
            required
            {...form.getInputProps('academicYear')}
          />
          <NumberInput
            label="Monto ($)"
            min={0}
            decimalScale={2}
            thousandSeparator="."
            decimalSeparator=","
            required
            {...form.getInputProps('amount')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={isPending}>Cancelar</Button>
            <Button type="submit" loading={isPending}>{isEdit ? 'Guardar cambios' : 'Agregar precio'}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
