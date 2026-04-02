import { Spotlight } from '@mantine/spotlight'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSchool, IconSearch, IconUsers } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { familiesApi } from '../families/families.api'
import { studentsApi } from '../students/students.api'

export function SpotlightSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 300)

  const enabled = debouncedQuery.length >= 2

  const { data: familiesData } = useQuery({
    queryKey: ['spotlight', 'families', debouncedQuery],
    queryFn: () => familiesApi.list({ search: debouncedQuery, limit: 8 }),
    enabled,
  })

  const { data: studentsData } = useQuery({
    queryKey: ['spotlight', 'students', debouncedQuery],
    queryFn: () => studentsApi.list({ search: debouncedQuery, limit: 8 }),
    enabled,
  })

  const familyActions = (familiesData?.items ?? []).map((f) => ({
    id: `family-${f.id}`,
    label: f.familyName,
    onClick: () => void navigate(`/familias/${f.id}`),
    leftSection: <IconUsers size={18} />,
  }))

  const studentActions = (studentsData?.items ?? []).map((s) => ({
    id: `student-${s.id}`,
    label: `${s.firstName} ${s.lastName}`,
    description: `→ ${s.family.familyName}`,
    onClick: () => void navigate(`/familias/${s.family.id}`),
    leftSection: <IconSchool size={18} />,
  }))

  const actions = [
    ...(familyActions.length > 0 ? [{ group: 'Familias', actions: familyActions }] : []),
    ...(studentActions.length > 0 ? [{ group: 'Alumnos', actions: studentActions }] : []),
  ]

  const nothingFound =
    debouncedQuery.length < 2
      ? 'Escribí al menos 2 caracteres para buscar'
      : `No se encontraron resultados para "${debouncedQuery}"`

  return (
    <Spotlight
      actions={actions}
      query={query}
      onQueryChange={setQuery}
      shortcut="mod + K"
      nothingFound={nothingFound}
      searchProps={{
        leftSection: <IconSearch size={18} />,
        placeholder: 'Buscar familias y alumnos...',
      }}
    />
  )
}
