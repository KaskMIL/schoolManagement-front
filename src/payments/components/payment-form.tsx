import { Alert, Button, Group, Modal, Select, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import Decimal from 'decimal.js'
import { useState } from 'react'
import type { Installment } from '../../installments/installments.types'
import { getErrorMessage } from '../../lib/api-error'
import { useCreatePayment } from '../hooks/use-create-payment'
import type { AllocationInput, PaymentMethod } from '../payments.types'

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'mercadopago', label: 'MercadoPago' },
]

interface PaymentFormProps {
  opened: boolean
  onClose: () => void
  familyId: string
  /** Si se pasa una cuota, se pre-asigna el pago a ella. Undefined = pago a cuenta. */
  installment?: Installment
}

export function PaymentForm({ opened, onClose, familyId, installment }: PaymentFormProps) {
  const createMutation = useCreatePayment(familyId)
  const [error, setError] = useState<unknown>(null)

  const today = new Date().toISOString().substring(0, 10)

  // Monto pendiente de la cuota (total - ya pagado de allocations previas no disponible aquí;
  // usamos total como valor sugerido — el backend valida la coherencia)
  const suggestedAmount = installment ? installment.total : ''

  const form = useForm({
    initialValues: {
      amount: suggestedAmount,
      paymentDate: today,
      method: 'efectivo' as PaymentMethod,
      reference: '',
      notes: '',
    },
  })

  const handleClose = () => {
    createMutation.reset()
    setError(null)
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    setError(null)

    const allocations: AllocationInput[] = installment
      ? [{ installmentId: installment.id, allocatedAmount: values.amount }]
      : []

    createMutation.mutate(
      {
        familyId,
        allocations,
        amount: values.amount,
        paymentDate: values.paymentDate,
        method: values.method,
        reference: values.reference.trim() || undefined,
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

  const title = installment
    ? `Registrar pago — ${installment.description}`
    : 'Registrar pago a cuenta'

  return (
    <Modal opened={opened} onClose={handleClose} title={title} size="sm">
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error != null && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {getErrorMessage(error)}
            </Alert>
          )}

          {installment && (
            <Text size="sm" c="dimmed">
              Total de la cuota: <strong>${new Decimal(installment.total).toFixed(2)}</strong>
            </Text>
          )}

          {!installment && (
            <Text size="sm" c="dimmed">
              El monto quedará como saldo a favor de la familia.
            </Text>
          )}

          <TextInput
            label="Monto"
            required
            placeholder="0.00"
            {...form.getInputProps('amount')}
          />

          <TextInput
            label="Fecha de pago"
            type="date"
            required
            {...form.getInputProps('paymentDate')}
          />

          <Select
            label="Método de pago"
            required
            data={PAYMENT_METHODS}
            {...form.getInputProps('method')}
          />

          <TextInput
            label="Referencia"
            placeholder="Nro. de transferencia, ID MercadoPago..."
            {...form.getInputProps('reference')}
          />

          <Textarea label="Notas" rows={2} {...form.getInputProps('notes')} />

          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={createMutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Registrar pago
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
