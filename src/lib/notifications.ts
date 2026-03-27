import { notifications } from '@mantine/notifications'
import { getErrorMessage } from './api-error'

export function notifyError(error: unknown) {
  notifications.show({
    color: 'red',
    title: 'Error',
    message: getErrorMessage(error),
  })
}
