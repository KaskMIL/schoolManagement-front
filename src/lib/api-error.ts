export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Returns a user-facing error message in Spanish based on the HTTP status code.
 * For 409 conflicts the backend message is used directly since it's already informative.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Los datos ingresados no son válidos.'
      case 403:
        return 'No tenés permiso para realizar esta acción.'
      case 404:
        return 'El recurso solicitado no fue encontrado.'
      case 409:
        return error.message
      case 500:
        return 'Error del servidor. Intentá de nuevo más tarde.'
      default:
        return error.message || 'Ocurrió un error inesperado.'
    }
  }
  return 'Ocurrió un error inesperado.'
}
