import { Center, Loader } from '@mantine/core'
import { Navigate, Outlet } from 'react-router'
import { useCurrentUser } from './hooks/use-current-user'

export default function AuthGuard() {
  const { isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    )
  }

  if (isError) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
