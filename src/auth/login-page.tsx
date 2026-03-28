import { Alert, Box, Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Navigate } from 'react-router'
import { getErrorMessage } from '../lib/api-error'
import { useCurrentUser } from './hooks/use-current-user'
import { useLogin } from './hooks/use-login'

export default function LoginPage() {
  const { isSuccess } = useCurrentUser()
  const login = useLogin()

  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: (v) => (v.trim() ? null : 'Ingresá tu usuario'),
      password: (v) => (v ? null : 'Ingresá tu contraseña'),
    },
  })

  if (isSuccess) {
    return <Navigate to="/familias" replace />
  }

  return (
    <Center h="100vh" bg="gray.0">
      <Box w={360}>
        <Title order={3} ta="center" mb="xl">
          EscuelaGest
        </Title>
        <Paper withBorder shadow="sm" p="xl" radius="md">
          <form
            onSubmit={form.onSubmit((values) => {
              login.mutate(values)
            })}
          >
            <Stack gap="md">
              {login.isError && (
                <Alert color="red" variant="light">
                  {getErrorMessage(login.error)}
                </Alert>
              )}
              <TextInput
                label="Usuario"
                placeholder="usuario"
                autoComplete="username"
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label="Contraseña"
                placeholder="••••••••"
                autoComplete="current-password"
                {...form.getInputProps('password')}
              />
              <Button type="submit" loading={login.isPending} fullWidth mt="xs">
                Ingresar
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Center>
  )
}
