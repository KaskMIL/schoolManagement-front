import { ActionIcon, Card, Group, SimpleGrid, Skeleton, Stack, Text, Title, Tooltip } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { useState } from 'react'
import { InstitutionForm } from '../components/institution-form'
import { useInstitutions } from '../hooks/use-institutions'
import type { Institution } from '../institutions.types'

export default function InstitutionsConfigPage() {
  const { data: institutions, isLoading } = useInstitutions()
  const [editInstitution, setEditInstitution] = useState<Institution | null>(null)

  return (
    <>
      <Stack gap="md">
        <Title order={4}>Instituciones</Title>
        {isLoading ? (
          <SimpleGrid cols={2}>
            <Skeleton height={200} />
            <Skeleton height={200} />
          </SimpleGrid>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {(institutions ?? []).map((institution) => (
              <Card key={institution.id} withBorder padding="lg">
                <Group justify="space-between" mb="md">
                  <Text fw={600}>{institution.name}</Text>
                  <Tooltip label="Editar">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={() => setEditInstitution(institution)}
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Stack gap="xs">
                  {institution.cue && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed" w={130}>CUE:</Text>
                      <Text size="sm">{institution.cue}</Text>
                    </Group>
                  )}
                  {institution.diegepDipregep && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed" w={130}>DIÉGEP:</Text>
                      <Text size="sm">{institution.diegepDipregep}</Text>
                    </Group>
                  )}
                  {institution.address && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed" w={130}>Dirección:</Text>
                      <Text size="sm">{institution.address}</Text>
                    </Group>
                  )}
                  {institution.phone && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed" w={130}>Teléfono:</Text>
                      <Text size="sm">{institution.phone}</Text>
                    </Group>
                  )}
                  {institution.email && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed" w={130}>Email:</Text>
                      <Text size="sm">{institution.email}</Text>
                    </Group>
                  )}
                  {!institution.cue &&
                    !institution.diegepDipregep &&
                    !institution.address &&
                    !institution.phone &&
                    !institution.email && (
                      <Text size="sm" c="dimmed">
                        Sin datos adicionales
                      </Text>
                    )}
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>

      {editInstitution && (
        <InstitutionForm
          opened
          onClose={() => setEditInstitution(null)}
          institution={editInstitution}
        />
      )}
    </>
  )
}
