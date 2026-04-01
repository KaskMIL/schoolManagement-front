import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAlertCircle, IconArrowLeft, IconPlus, IconTrash } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { familiesApi } from '../families.api'
import type { Relationship } from '../families.types'
import { useInstitutions } from '../../institutions/hooks/use-institutions'
import { getErrorMessage } from '../../lib/api-error'
import { studentsApi } from '../../students/students.api'
import type { Gender, Level, Section, Shift } from '../../students/students.types'
import { useSystemConfig } from '../../system-config/hooks/use-system-config'

// ─── Constants ────────────────────────────────────────────────────────────────

const RELATIONSHIP_OPTIONS = [
  { value: 'padre', label: 'Padre' },
  { value: 'madre', label: 'Madre' },
  { value: 'tutor', label: 'Tutor/a' },
  { value: 'otro', label: 'Otro' },
]

const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
]

const LEVEL_OPTIONS = [
  { value: 'jardin', label: 'Jardín' },
  { value: 'primaria', label: 'Primaria' },
  { value: 'secundaria', label: 'Secundaria' },
]

const SECTION_OPTIONS = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'unico', label: 'Único' },
]

const SHIFT_OPTIONS = [
  { value: 'manana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'completo', label: 'Completo' },
]

function getGradeOptions(level: Level) {
  if (level === 'jardin') {
    return [3, 4, 5].map((n) => ({ value: String(n), label: `Sala de ${n}` }))
  }
  if (level === 'primaria') {
    return [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n}° grado` }))
  }
  return [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n}° año` }))
}

function defaultGrade(level: Level): number {
  return level === 'jardin' ? 3 : 1
}

// ─── Draft types ──────────────────────────────────────────────────────────────

interface GuardianDraft {
  _key: number
  firstName: string
  lastName: string
  relationship: Relationship
  dni: string
  phone: string
  email: string
  isPrimaryContact: boolean
}

interface StudentDraft {
  _key: number
  firstName: string
  lastName: string
  dni: string
  birthDate: string
  gender: Gender | ''
  institutionId: string
  level: Level
  grade: number
  section: Section
  shift: Shift
  academicYear: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cleanOptional(value: string): string | undefined {
  return value.trim() || undefined
}

function emptyGuardian(key: number, isPrimaryContact = false): GuardianDraft {
  return {
    _key: key,
    firstName: '',
    lastName: '',
    relationship: 'padre',
    dni: '',
    phone: '',
    email: '',
    isPrimaryContact,
  }
}

function emptyStudent(key: number, academicYear: number, institutionId = ''): StudentDraft {
  return {
    _key: key,
    firstName: '',
    lastName: '',
    dni: '',
    birthDate: '',
    gender: '',
    institutionId,
    level: 'primaria',
    grade: 1,
    section: 'A',
    shift: 'manana',
    academicYear,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateFamilyPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: systemConfig } = useSystemConfig()
  const { data: institutionsData } = useInstitutions()

  const currentYear = systemConfig?.currentAcademicYear ?? new Date().getFullYear()

  const keyCounter = useRef(0)
  const nextKey = () => ++keyCounter.current

  const [guardians, setGuardians] = useState<GuardianDraft[]>([emptyGuardian(nextKey(), true)])
  const [students, setStudents] = useState<StudentDraft[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const institutionOptions = (institutionsData ?? []).map((i) => ({
    value: i.id,
    label: i.name,
  }))

  const form = useForm({
    initialValues: {
      familyName: '',
      primaryEmail: '',
      primaryPhone: '',
      address: '',
      locality: '',
      notes: '',
    },
    validate: {
      familyName: (v) => (v.trim().length === 0 ? 'El nombre es requerido' : null),
      primaryEmail: (v) => {
        if (!v.trim()) return null
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email inválido'
      },
    },
  })

  // ── Guardian helpers ──────────────────────────────────────────────────────

  const addGuardian = () => {
    setGuardians((prev) => [...prev, emptyGuardian(nextKey())])
  }

  const removeGuardian = (idx: number) => {
    setGuardians((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      if (next.length > 0 && !next.some((g) => g.isPrimaryContact)) {
        return next.map((g, i) => (i === 0 ? { ...g, isPrimaryContact: true } : g))
      }
      return next
    })
  }

  const updateGuardian = <K extends keyof GuardianDraft>(
    idx: number,
    key: K,
    value: GuardianDraft[K],
  ) => {
    setGuardians((prev) => prev.map((g, i) => (i === idx ? { ...g, [key]: value } : g)))
  }

  const setPrimaryContact = (idx: number) => {
    setGuardians((prev) => prev.map((g, i) => ({ ...g, isPrimaryContact: i === idx })))
  }

  // ── Student helpers ───────────────────────────────────────────────────────

  const addStudent = () => {
    const defaultInstitution = institutionOptions[0]?.value ?? ''
    setStudents((prev) => [...prev, emptyStudent(nextKey(), currentYear, defaultInstitution)])
  }

  const removeStudent = (idx: number) => {
    setStudents((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateStudent = <K extends keyof StudentDraft>(
    idx: number,
    key: K,
    value: StudentDraft[K],
  ) => {
    setStudents((prev) => prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s)))
  }

  const handleLevelChange = (idx: number, level: Level) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, level, grade: defaultGrade(level) } : s)),
    )
  }

  // ── Validation ────────────────────────────────────────────────────────────

  const validateGuardians = (): string | null => {
    if (guardians.length === 0) return 'Agregá al menos un responsable.'
    for (let i = 0; i < guardians.length; i++) {
      const g = guardians[i]
      if (!g.firstName.trim()) return `Responsable ${i + 1}: el nombre es requerido.`
      if (!g.lastName.trim()) return `Responsable ${i + 1}: el apellido es requerido.`
      if (g.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email.trim())) {
        return `Responsable ${i + 1}: email inválido.`
      }
    }
    return null
  }

  const validateStudents = (): string | null => {
    if (students.length === 0) return 'Agregá al menos un alumno.'
    for (let i = 0; i < students.length; i++) {
      const s = students[i]
      if (!s.firstName.trim()) return `Alumno ${i + 1}: el nombre es requerido.`
      if (!s.lastName.trim()) return `Alumno ${i + 1}: el apellido es requerido.`
      if (!s.institutionId) return `Alumno ${i + 1}: seleccioná la institución.`
    }
    return null
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const formResult = form.validate()
    if (formResult.hasErrors) return

    const guardianError = validateGuardians()
    if (guardianError) {
      setSubmitError(guardianError)
      return
    }

    const studentError = validateStudents()
    if (studentError) {
      setSubmitError(studentError)
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    let createdFamilyId: string | null = null

    try {
      const values = form.values

      // 1. Crear familia
      const family = await familiesApi.create({
        familyName: values.familyName.trim(),
        primaryEmail: cleanOptional(values.primaryEmail),
        primaryPhone: cleanOptional(values.primaryPhone),
        address: cleanOptional(values.address),
        locality: cleanOptional(values.locality),
        notes: cleanOptional(values.notes),
      })
      createdFamilyId = family.id

      // 2. Crear responsables
      for (let i = 0; i < guardians.length; i++) {
        const g = guardians[i]
        try {
          await familiesApi.createGuardian(family.id, {
            firstName: g.firstName.trim(),
            lastName: g.lastName.trim(),
            relationship: g.relationship,
            dni: cleanOptional(g.dni),
            phone: cleanOptional(g.phone),
            email: cleanOptional(g.email),
            isPrimaryContact: g.isPrimaryContact,
          })
        } catch (err) {
          throw new Error(
            `La familia fue creada pero falló el responsable ${i + 1} (${g.firstName} ${g.lastName}): ${getErrorMessage(err)}. Podés editarla desde el detalle.`,
          )
        }
      }

      // 3. Crear alumnos + inscripciones
      for (let i = 0; i < students.length; i++) {
        const s = students[i]
        let student: { id: string }
        try {
          student = await studentsApi.create({
            familyId: family.id,
            institutionId: s.institutionId,
            firstName: s.firstName.trim(),
            lastName: s.lastName.trim(),
            dni: cleanOptional(s.dni),
            birthDate: cleanOptional(s.birthDate),
            gender: s.gender || undefined,
          })
        } catch (err) {
          throw new Error(
            `La familia fue creada pero falló el alumno ${i + 1} (${s.firstName} ${s.lastName}): ${getErrorMessage(err)}. Podés editarlo desde el detalle.`,
          )
        }

        try {
          await studentsApi.createEnrollment(student.id, {
            academicYear: s.academicYear,
            level: s.level,
            grade: s.grade,
            section: s.section,
            shift: s.shift,
            status: 'inscripto',
          })
        } catch (err) {
          throw new Error(
            `La familia fue creada pero falló la inscripción del alumno ${i + 1} (${s.firstName} ${s.lastName}): ${getErrorMessage(err)}. Podés editarla desde el detalle.`,
          )
        }
      }

      void queryClient.invalidateQueries({ queryKey: ['families', 'list'] })
      void queryClient.invalidateQueries({ queryKey: ['students', 'list'] })
      void navigate(`/familias/${family.id}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : getErrorMessage(err))
      if (createdFamilyId) {
        void queryClient.invalidateQueries({ queryKey: ['families', 'list'] })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group>
        <ActionIcon
          variant="subtle"
          size="lg"
          aria-label="Volver"
          onClick={() => void navigate('/familias')}
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>Nueva familia</Title>
      </Group>

      {submitError && (
        <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
          {submitError}
        </Alert>
      )}

      {/* Sección 1: Datos de la familia */}
      <Paper withBorder p="md" radius="md">
        <Title order={4} mb="md">
          Datos de la familia
        </Title>
        <Stack gap="sm">
          <TextInput
            label="Nombre de la familia"
            placeholder="Ej: García"
            required
            {...form.getInputProps('familyName')}
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <TextInput
              label="Email principal"
              placeholder="contacto@email.com"
              {...form.getInputProps('primaryEmail')}
            />
            <TextInput
              label="Teléfono principal"
              placeholder="11 1234-5678"
              {...form.getInputProps('primaryPhone')}
            />
            <TextInput
              label="Dirección"
              placeholder="Av. San Martín 123"
              {...form.getInputProps('address')}
            />
            <TextInput
              label="Localidad"
              placeholder="San Miguel"
              {...form.getInputProps('locality')}
            />
          </SimpleGrid>
          <Textarea
            label="Notas"
            placeholder="Observaciones adicionales"
            rows={2}
            {...form.getInputProps('notes')}
          />
        </Stack>
      </Paper>

      {/* Sección 2: Responsables */}
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>Responsables</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconPlus size={14} />}
            onClick={addGuardian}
          >
            Agregar responsable
          </Button>
        </Group>

        {guardians.length === 0 && (
          <Text c="dimmed" size="sm">
            Agregá al menos un responsable.
          </Text>
        )}

        <Stack gap="sm">
          {guardians.map((g, idx) => (
            <Box
              key={g._key}
              p="sm"
              style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8 }}
            >
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>
                  Responsable {idx + 1}
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  aria-label="Eliminar responsable"
                  onClick={() => removeGuardian(idx)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
              <Stack gap="xs">
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                  <TextInput
                    label="Nombre"
                    required
                    value={g.firstName}
                    onChange={(e) => updateGuardian(idx, 'firstName', e.currentTarget.value)}
                  />
                  <TextInput
                    label="Apellido"
                    required
                    value={g.lastName}
                    onChange={(e) => updateGuardian(idx, 'lastName', e.currentTarget.value)}
                  />
                  <Select
                    label="Vínculo"
                    data={RELATIONSHIP_OPTIONS}
                    allowDeselect={false}
                    value={g.relationship}
                    onChange={(v) =>
                      updateGuardian(idx, 'relationship', (v ?? 'padre') as Relationship)
                    }
                  />
                  <TextInput
                    label="DNI"
                    value={g.dni}
                    onChange={(e) => updateGuardian(idx, 'dni', e.currentTarget.value)}
                  />
                  <TextInput
                    label="Teléfono"
                    value={g.phone}
                    onChange={(e) => updateGuardian(idx, 'phone', e.currentTarget.value)}
                  />
                  <TextInput
                    label="Email"
                    value={g.email}
                    onChange={(e) => updateGuardian(idx, 'email', e.currentTarget.value)}
                  />
                </SimpleGrid>
                <Checkbox
                  label="Contacto principal"
                  checked={g.isPrimaryContact}
                  onChange={() => setPrimaryContact(idx)}
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Sección 3: Alumnos */}
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>Alumnos</Title>
          <Button
            size="sm"
            variant="default"
            leftSection={<IconPlus size={14} />}
            onClick={addStudent}
          >
            Agregar alumno
          </Button>
        </Group>

        {students.length === 0 && (
          <Text c="dimmed" size="sm">
            Agregá al menos un alumno.
          </Text>
        )}

        <Stack gap="sm">
          {students.map((s, idx) => {
            const gradeOptions = getGradeOptions(s.level)
            return (
              <Box
                key={s._key}
                p="sm"
                style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8 }}
              >
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>
                    Alumno {idx + 1}
                  </Text>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    aria-label="Eliminar alumno"
                    onClick={() => removeStudent(idx)}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
                <Stack gap="xs">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                    <TextInput
                      label="Nombre"
                      required
                      value={s.firstName}
                      onChange={(e) => updateStudent(idx, 'firstName', e.currentTarget.value)}
                    />
                    <TextInput
                      label="Apellido"
                      required
                      value={s.lastName}
                      onChange={(e) => updateStudent(idx, 'lastName', e.currentTarget.value)}
                    />
                    <TextInput
                      label="DNI"
                      value={s.dni}
                      onChange={(e) => updateStudent(idx, 'dni', e.currentTarget.value)}
                    />
                    <TextInput
                      label="Fecha de nacimiento"
                      type="date"
                      value={s.birthDate}
                      onChange={(e) => updateStudent(idx, 'birthDate', e.currentTarget.value)}
                    />
                    <Select
                      label="Género"
                      data={GENDER_OPTIONS}
                      value={s.gender || null}
                      onChange={(v) => updateStudent(idx, 'gender', (v ?? '') as Gender | '')}
                    />
                    <Select
                      label="Institución"
                      required
                      data={institutionOptions}
                      allowDeselect={false}
                      value={s.institutionId || null}
                      onChange={(v) => updateStudent(idx, 'institutionId', v ?? '')}
                    />
                  </SimpleGrid>
                  <Text size="xs" c="dimmed" mt={4}>
                    Inscripción
                  </Text>
                  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs">
                    <NumberInput
                      label="Año lectivo"
                      min={2020}
                      max={2099}
                      value={s.academicYear}
                      onChange={(v) => { if (v !== '') updateStudent(idx, 'academicYear', Number(v)) }}
                    />
                    <Select
                      label="Nivel"
                      required
                      data={LEVEL_OPTIONS}
                      allowDeselect={false}
                      value={s.level}
                      onChange={(v) => handleLevelChange(idx, (v ?? 'primaria') as Level)}
                    />
                    <Select
                      label="Grado / Sala"
                      required
                      data={gradeOptions}
                      allowDeselect={false}
                      value={String(s.grade)}
                      onChange={(v) => updateStudent(idx, 'grade', Number(v ?? '1'))}
                    />
                    <Select
                      label="Sección"
                      required
                      data={SECTION_OPTIONS}
                      allowDeselect={false}
                      value={s.section}
                      onChange={(v) =>
                        updateStudent(idx, 'section', (v ?? 'A') as Section)
                      }
                    />
                    <Select
                      label="Turno"
                      required
                      data={SHIFT_OPTIONS}
                      allowDeselect={false}
                      value={s.shift}
                      onChange={(v) =>
                        updateStudent(idx, 'shift', (v ?? 'manana') as Shift)
                      }
                    />
                  </SimpleGrid>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Paper>

      {/* Footer */}
      <Group justify="flex-end" pb="xl">
        <Button
          variant="default"
          onClick={() => void navigate('/familias')}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button loading={isSubmitting} onClick={() => void handleSubmit()}>
          Crear familia
        </Button>
      </Group>
    </Stack>
  )
}
