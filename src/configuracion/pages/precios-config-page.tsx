import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconPencil, IconPlus, IconToggleLeft, IconToggleRight, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { FeeConceptForm } from '../../fee-concepts/components/fee-concept-form'
import { FEE_CONCEPT_TYPE_LABELS, type FeeConcept } from '../../fee-concepts/fee-concepts.types'
import { useFeeConcepts } from '../../fee-concepts/hooks/use-fee-concepts'
import { useToggleFeeConcept } from '../../fee-concepts/hooks/use-toggle-fee-concept'
import { FeePriceForm } from '../../fee-prices/components/fee-price-form'
import { useDeleteFeePrice } from '../../fee-prices/hooks/use-delete-fee-price'
import { useFeePrices } from '../../fee-prices/hooks/use-fee-prices'
import type { FeePrice } from '../../fee-prices/fee-prices.types'
import { useInstitutions } from '../../institutions/hooks/use-institutions'
import { notifyError } from '../../lib/notifications'

function formatMoney(amount: string) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
    Number(amount),
  )
}

interface PricesSectionProps {
  institutionId: string
}

function PricesSection({ institutionId }: PricesSectionProps) {
  const currentYear = new Date().getFullYear()
  const { data: concepts = [] } = useFeeConcepts(institutionId)

  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null)
  const [academicYear, setAcademicYear] = useState<number>(currentYear)
  const [editPrice, setEditPrice] = useState<FeePrice | null>(null)
  const [addPriceOpen, setAddPriceOpen] = useState(false)

  const { data: prices = [], isLoading: pricesLoading } = useFeePrices(selectedConceptId, academicYear)
  const deleteMutation = useDeleteFeePrice(selectedConceptId ?? '')

  const conceptOptions = concepts.map((c) => ({ value: c.id, label: c.name }))

  function handleDeletePrice(priceId: string) {
    deleteMutation.mutate(priceId, { onError: notifyError })
  }

  return (
    <Stack gap="sm">
      <Group>
        <Select
          placeholder="Seleccionar concepto..."
          data={conceptOptions}
          value={selectedConceptId}
          onChange={setSelectedConceptId}
          w={240}
          clearable
        />
        <NumberInput
          value={academicYear}
          onChange={(v) => setAcademicYear(Number(v))}
          min={2020}
          max={2099}
          w={100}
        />
        {selectedConceptId && (
          <Button
            size="sm"
            leftSection={<IconPlus size={14} />}
            onClick={() => setAddPriceOpen(true)}
          >
            Agregar precio
          </Button>
        )}
      </Group>

      {selectedConceptId && (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Ciclo</Table.Th>
              <Table.Th>Año</Table.Th>
              <Table.Th>Monto</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pricesLoading && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" size="sm" ta="center">Cargando...</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {!pricesLoading && prices.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" size="sm" ta="center">Sin precios para este concepto y año</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {prices.map((price) => (
              <Table.Tr key={price.id}>
                <Table.Td>
                  <Text size="sm">{price.priceTier?.name ?? '—'}</Text>
                </Table.Td>
                <Table.Td><Text size="sm">{price.academicYear}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={500}>{formatMoney(price.amount)}</Text></Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <Tooltip label="Editar">
                      <ActionIcon variant="subtle" color="gray" onClick={() => setEditPrice(price)}>
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Eliminar">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeletePrice(price.id)}
                        loading={deleteMutation.isPending && deleteMutation.variables === price.id}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      {selectedConceptId && addPriceOpen && (
        <FeePriceForm
          opened
          onClose={() => setAddPriceOpen(false)}
          feeConceptId={selectedConceptId}
        />
      )}
      {editPrice && (
        <FeePriceForm
          opened
          onClose={() => setEditPrice(null)}
          feeConceptId={selectedConceptId!}
          price={editPrice}
        />
      )}
    </Stack>
  )
}

interface ConceptsSectionProps {
  institutionId: string
}

function ConceptsSection({ institutionId }: ConceptsSectionProps) {
  const { data: concepts = [], isLoading } = useFeeConcepts(institutionId)
  const toggleMutation = useToggleFeeConcept(institutionId)

  const [formOpen, setFormOpen] = useState(false)
  const [editConcept, setEditConcept] = useState<FeeConcept | null>(null)

  function handleToggle(concept: FeeConcept) {
    toggleMutation.mutate(
      { conceptId: concept.id, active: !concept.isActive },
      { onError: notifyError },
    )
  }

  return (
    <>
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={500}>Conceptos de cobro</Text>
          <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => setFormOpen(true)}>
            Nuevo concepto
          </Button>
        </Group>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Recurrente</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text c="dimmed" size="sm" ta="center">Cargando...</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {concepts.map((concept) => (
              <Table.Tr key={concept.id}>
                <Table.Td><Text size="sm" fw={500}>{concept.name}</Text></Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">{FEE_CONCEPT_TYPE_LABELS[concept.type]}</Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{concept.isRecurring ? 'Sí' : 'No'}</Text>
                </Table.Td>
                <Table.Td>
                  {concept.isActive
                    ? <Badge color="green" variant="light" size="sm">Activo</Badge>
                    : <Badge color="red" variant="light" size="sm">Inactivo</Badge>}
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <Tooltip label="Editar">
                      <ActionIcon variant="subtle" color="gray" onClick={() => setEditConcept(concept)}>
                        <IconPencil size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={concept.isActive ? 'Desactivar' : 'Activar'}>
                      <ActionIcon
                        variant="subtle"
                        color={concept.isActive ? 'orange' : 'green'}
                        onClick={() => handleToggle(concept)}
                        loading={toggleMutation.isPending && toggleMutation.variables?.conceptId === concept.id}
                      >
                        {concept.isActive ? <IconToggleRight size={16} /> : <IconToggleLeft size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      <FeeConceptForm opened={formOpen} onClose={() => setFormOpen(false)} institutionId={institutionId} />
      {editConcept && (
        <FeeConceptForm
          opened
          onClose={() => setEditConcept(null)}
          institutionId={institutionId}
          concept={editConcept}
        />
      )}
    </>
  )
}

export default function PreciosConfigPage() {
  const { data: institutions = [], isLoading } = useInstitutions()
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const selectedInstitutionId = activeTab ?? institutions[0]?.id ?? null

  if (isLoading) return null

  return (
    <Stack gap="lg">
      <Title order={4}>Precios</Title>
      <Tabs value={selectedInstitutionId} onChange={setActiveTab}>
        <Tabs.List mb="md">
          {institutions.map((inst) => (
            <Tabs.Tab key={inst.id} value={inst.id}>{inst.name}</Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {selectedInstitutionId && (
        <Stack gap="xl">
          <ConceptsSection institutionId={selectedInstitutionId} />
          <Stack gap="sm">
            <Text fw={500}>Precios por concepto</Text>
            <PricesSection institutionId={selectedInstitutionId} />
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
