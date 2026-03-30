import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconAlertCircle, IconPencil } from '@tabler/icons-react'
import { useState } from 'react'
import { getErrorMessage } from '../../lib/api-error'
import { notifyError } from '../../lib/notifications'
import type { Discount } from '../discounts.types'
import { AUTOMATIC_DISCOUNT_TYPES, DISCOUNT_TYPE_LABELS } from '../discounts.types'
import { useDiscounts } from '../hooks/use-discounts'
import { useToggleDiscount } from '../hooks/use-toggle-discount'
import { useUpdateDiscount } from '../hooks/use-update-discount'

interface EditDiscountFormProps {
  discount: Discount
  opened: boolean
  onClose: () => void
}

function EditDiscountForm({ discount, opened, onClose }: EditDiscountFormProps) {
  const updateMutation = useUpdateDiscount()
  const [error, setError] = useState<unknown>(null)

  const form = useForm({
    initialValues: {
      name: discount.name,
      percentage: Number(discount.percentage),
    },
  })

  const handleClose = () => {
    updateMutation.reset()
    setError(null)
    form.reset()
    onClose()
  }

  const handleSubmit = form.onSubmit((values) => {
    setError(null)
    updateMutation.mutate(
      {
        id: discount.id,
        data: { name: values.name, percentage: String(values.percentage) },
      },
      {
        onSuccess: () => {
          onClose()
        },
        onError: (err) => setError(err),
      },
    )
  })

  return (
    <Modal opened={opened} onClose={handleClose} title="Editar descuento" size="sm">
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {error != null && (
            <Alert color="red" icon={<IconAlertCircle size={16} />}>
              {getErrorMessage(error)}
            </Alert>
          )}
          <TextInput label="Nombre" required {...form.getInputProps('name')} />
          <NumberInput
            label="Porcentaje"
            required
            min={0}
            max={100}
            decimalScale={2}
            suffix="%"
            {...form.getInputProps('percentage')}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={handleClose} disabled={updateMutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              Guardar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export function DiscountCatalog() {
  const { data: discounts = [], isLoading } = useDiscounts()
  const toggleMutation = useToggleDiscount()
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount)
    openEdit()
  }

  if (isLoading) return null

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="md">
        <div>
          <Title order={4}>Descuentos</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Los descuentos automáticos (hermano y pronto pago) se aplican sin intervención manual.
            Los manuales (beca, hijo de docente) se asignan individualmente en el detalle del alumno.
          </Text>
        </div>

        <Table.ScrollContainer minWidth={500}>
          <Table withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Porcentaje</Table.Th>
                <Table.Th>Aplicación</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {discounts.map((discount) => (
                <Table.Tr key={discount.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{discount.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{DISCOUNT_TYPE_LABELS[discount.type]}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{discount.percentage}%</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      variant="light"
                      color={AUTOMATIC_DISCOUNT_TYPES.includes(discount.type) ? 'blue' : 'violet'}
                    >
                      {AUTOMATIC_DISCOUNT_TYPES.includes(discount.type) ? 'Automático' : 'Manual'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="sm" variant="light" color={discount.isActive ? 'green' : 'gray'}>
                      {discount.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon
                        variant="subtle"
                        aria-label="Editar descuento"
                        onClick={() => handleEdit(discount)}
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <Button
                        size="compact-xs"
                        variant="subtle"
                        color={discount.isActive ? 'red' : 'green'}
                        loading={toggleMutation.isPending}
                        onClick={() =>
                          toggleMutation.mutate(discount.id, { onError: notifyError })
                        }
                      >
                        {discount.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>

      {editingDiscount && (
        <EditDiscountForm
          key={editingDiscount.id}
          discount={editingDiscount}
          opened={editOpened}
          onClose={() => { closeEdit(); setEditingDiscount(null) }}
        />
      )}
    </Paper>
  )
}
