import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Collapse,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconArrowLeft,
  IconBan,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
  IconCreditCard,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import Decimal from 'decimal.js'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { GenerateInstallmentForm } from '../../installments/components/generate-installment-form'
import { useAnnulInstallment } from '../../installments/hooks/use-annul-installment'
import { useInstallments } from '../../installments/hooks/use-installments'
import type { Installment } from '../../installments/installments.types'
import { notifyError } from '../../lib/notifications'
import { PaymentForm } from '../../payments/components/payment-form'
import { usePayments } from '../../payments/hooks/use-payments'
import { FamilyForm } from '../components/family-form'
import { GuardianForm } from '../components/guardian-form'
import { useDeactivateFamily } from '../hooks/use-deactivate-family'
import { useDeleteGuardian } from '../hooks/use-delete-guardian'
import { useFamily } from '../hooks/use-family'
import { useReactivateFamily } from '../hooks/use-reactivate-family'
import type { Guardian, Relationship } from '../families.types'

const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  padre: 'Padre',
  madre: 'Madre',
  tutor: 'Tutor/a',
  otro: 'Otro',
}

const INSTALLMENT_STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  pagada: 'Pagada',
  vencida: 'Vencida',
  anulada: 'Anulada',
}

const INSTALLMENT_STATUS_COLORS: Record<string, string> = {
  pendiente: 'yellow',
  parcial: 'orange',
  pagada: 'green',
  vencida: 'red',
  anulada: 'gray',
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  mercadopago: 'MercadoPago',
}

function formatMoney(amount: string) {
  return new Decimal(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

interface InfoFieldProps {
  label: string
  value: string | null
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <Text size="xs" c="dimmed" mb={2}>
        {label}
      </Text>
      <Text size="sm">{value ?? '—'}</Text>
    </div>
  )
}

export default function FamilyDetailPage() {
  const { familyId } = useParams<{ familyId: string }>()
  const navigate = useNavigate()
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [addGuardianOpened, { open: openAddGuardian, close: closeAddGuardian }] =
    useDisclosure(false)
  const [generateInstallmentOpened, { open: openGenerateInstallment, close: closeGenerateInstallment }] =
    useDisclosure(false)
  const [editGuardian, setEditGuardian] = useState<Guardian | null>(null)
  const [payingInstallment, setPayingInstallment] = useState<Installment | null | undefined>(null)
  // null = modal cerrado, undefined = pago a cuenta sin cuota, Installment = pago de cuota específica
  const [expandedInstallment, setExpandedInstallment] = useState<string | null>(null)

  const { data: family, isLoading } = useFamily(familyId!)
  const { data: installments = [] } = useInstallments(familyId!)
  const { data: payments = [] } = usePayments(familyId!)
  const deactivateMutation = useDeactivateFamily()
  const reactivateMutation = useReactivateFamily()
  const deleteGuardianMutation = useDeleteGuardian()
  const annulInstallmentMutation = useAnnulInstallment(familyId!)

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    )
  }

  if (!family) return null

  const isActive = family.status === 'activa'

  return (
    <Stack gap="lg">
      {/* Encabezado */}
      <Group>
        <ActionIcon
          variant="subtle"
          size="lg"
          aria-label="Volver"
          onClick={() => void navigate('/familias')}
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>{family.familyName}</Title>
        <Badge color={isActive ? 'green' : 'gray'} variant="light" size="lg">
          {isActive ? 'Activa' : 'Inactiva'}
        </Badge>
      </Group>

      {/* Acciones */}
      <Group>
        <Button variant="default" leftSection={<IconPencil size={16} />} onClick={openEdit}>
          Editar
        </Button>
        {isActive ? (
          <Button
            variant="light"
            color="red"
            leftSection={<IconBan size={16} />}
            loading={deactivateMutation.isPending}
            onClick={() => deactivateMutation.mutate(family.id, { onError: notifyError })}
          >
            Desactivar
          </Button>
        ) : (
          <Button
            variant="light"
            color="green"
            leftSection={<IconCircleCheck size={16} />}
            loading={reactivateMutation.isPending}
            onClick={() => reactivateMutation.mutate(family.id, { onError: notifyError })}
          >
            Activar
          </Button>
        )}
      </Group>

      {/* Datos de la familia */}
      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="md">
          Información general
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <InfoField label="Email principal" value={family.primaryEmail} />
          <InfoField label="Teléfono principal" value={family.primaryPhone} />
          <InfoField label="Dirección" value={family.address} />
          <InfoField label="Localidad" value={family.locality} />
          {family.notes && (
            <div style={{ gridColumn: '1 / -1' }}>
              <InfoField label="Notas" value={family.notes} />
            </div>
          )}
        </SimpleGrid>
      </Paper>

      <Divider />

      {/* Responsables */}
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Responsables</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconPlus size={14} />}
            onClick={openAddGuardian}
          >
            Agregar responsable
          </Button>
        </Group>

        <Table.ScrollContainer minWidth={700}>
          <Table withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Vínculo</Table.Th>
                <Table.Th>DNI</Table.Th>
                <Table.Th>Teléfono</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {family.guardians.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text c="dimmed">Sin responsables registrados</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                family.guardians.map((guardian) => (
                  <Table.Tr key={guardian.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>
                          {guardian.firstName} {guardian.lastName}
                        </Text>
                        {guardian.isPrimaryContact && (
                          <Badge size="xs" color="blue" variant="light">
                            Principal
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>{RELATIONSHIP_LABELS[guardian.relationship]}</Table.Td>
                    <Table.Td c={guardian.dni ? undefined : 'dimmed'}>
                      {guardian.dni ?? '—'}
                    </Table.Td>
                    <Table.Td c={guardian.phone ? undefined : 'dimmed'}>
                      {guardian.phone ?? '—'}
                    </Table.Td>
                    <Table.Td c={guardian.email ? undefined : 'dimmed'}>
                      {guardian.email ?? '—'}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          variant="subtle"
                          aria-label="Editar responsable"
                          onClick={() => setEditGuardian(guardian)}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          aria-label="Eliminar responsable"
                          loading={deleteGuardianMutation.isPending}
                          onClick={() =>
                            deleteGuardianMutation.mutate(
                              { familyId: family.id, guardianId: guardian.id },
                              { onError: notifyError },
                            )
                          }
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>

      <Divider />

      {/* Cuotas */}
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Cuotas</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconPlus size={14} />}
            onClick={openGenerateInstallment}
          >
            Generar cuota
          </Button>
        </Group>

        <Table.ScrollContainer minWidth={700}>
          <Table withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={30} />
                <Table.Th>Descripción</Table.Th>
                <Table.Th>Vencimiento</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {installments.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6} ta="center" py="xl">
                    <Text c="dimmed">Sin cuotas generadas</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                installments.map((installment) => (
                  <>
                    <Table.Tr key={installment.id}>
                      <Table.Td>
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() =>
                            setExpandedInstallment(
                              expandedInstallment === installment.id ? null : installment.id,
                            )
                          }
                        >
                          {expandedInstallment === installment.id ? (
                            <IconChevronDown size={14} />
                          ) : (
                            <IconChevronRight size={14} />
                          )}
                        </ActionIcon>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {installment.description}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {new Date(installment.dueDate).toLocaleDateString('es-AR')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          ${formatMoney(installment.total)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={INSTALLMENT_STATUS_COLORS[installment.status]}
                          variant="light"
                          size="sm"
                        >
                          {INSTALLMENT_STATUS_LABELS[installment.status]}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          {installment.status !== 'pagada' && installment.status !== 'anulada' && (
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              aria-label="Registrar pago"
                              title="Registrar pago"
                              onClick={() => setPayingInstallment(installment)}
                            >
                              <IconCreditCard size={16} />
                            </ActionIcon>
                          )}
                          {installment.status !== 'anulada' && installment.status !== 'pagada' && (
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label="Anular cuota"
                              title="Anular cuota"
                              loading={annulInstallmentMutation.isPending}
                              onClick={() =>
                                annulInstallmentMutation.mutate(installment.id, {
                                  onError: notifyError,
                                })
                              }
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    {expandedInstallment === installment.id && (
                      <Table.Tr key={`${installment.id}-details`}>
                        <Table.Td colSpan={6} p={0}>
                          <Collapse in={expandedInstallment === installment.id}>
                            <Table withTableBorder={false} fz="xs" bg="gray.0">
                              <Table.Tbody>
                                {installment.details.map((detail) => (
                                  <Table.Tr key={detail.id}>
                                    <Table.Td pl="xl" c="dimmed">
                                      {detail.description}
                                    </Table.Td>
                                    <Table.Td ta="right" c="dimmed">
                                      ${formatMoney(detail.finalAmount)}
                                    </Table.Td>
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                          </Collapse>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>

      <Divider />

      {/* Pagos */}
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={3}>Pagos</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconCreditCard size={14} />}
            onClick={() => setPayingInstallment(undefined)}
          >
            Pago a cuenta
          </Button>
        </Group>

        <Table.ScrollContainer minWidth={600}>
          <Table withTableBorder withColumnBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Recibo</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Método</Table.Th>
                <Table.Th>Cuota</Table.Th>
                <Table.Th>Monto</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {payments.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5} ta="center" py="xl">
                    <Text c="dimmed">Sin pagos registrados</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                payments.map((payment) => (
                  <Table.Tr key={payment.id}>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {payment.receipt ? `#${payment.receipt.receiptNumber}` : '—'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {new Date(payment.paymentDate).toLocaleDateString('es-AR')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{PAYMENT_METHOD_LABELS[payment.method]}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c={payment.installment ? undefined : 'dimmed'}>
                        {payment.installment?.description ?? 'Pago a cuenta'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        ${formatMoney(payment.amount)}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>

      <FamilyForm key={family.id} opened={editOpened} onClose={closeEdit} family={family} />
      <GuardianForm
        key="add-guardian"
        opened={addGuardianOpened}
        onClose={closeAddGuardian}
        familyId={family.id}
      />
      <GuardianForm
        key={editGuardian?.id ?? 'edit-guardian'}
        opened={!!editGuardian}
        onClose={() => setEditGuardian(null)}
        familyId={family.id}
        guardian={editGuardian ?? undefined}
      />
      <GenerateInstallmentForm
        opened={generateInstallmentOpened}
        onClose={closeGenerateInstallment}
        familyId={family.id}
      />
      <PaymentForm
        opened={payingInstallment !== null}
        onClose={() => setPayingInstallment(null)}
        familyId={family.id}
        installment={payingInstallment ?? undefined}
      />
    </Stack>
  )
}
