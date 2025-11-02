/**
 * Database retry utility for handling transient connection failures
 * Implements exponential backoff with jitter
 */

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

export class DatabaseConnectionError extends Error {
  constructor(message: string, public readonly originalError: any) {
    super(message)
    this.name = 'DatabaseConnectionError'
  }
}

/**
 * Retry a database operation with exponential backoff
 * @param operation - Async function to retry
 * @param options - Retry configuration options
 * @returns Result of the operation
 */
export async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 100,
    maxDelay = 5000,
    backoffMultiplier = 2,
  } = options

  let lastError: any
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

      // Check if it's a database connection error (P1001)
      const isConnectionError =
        error?.code === 'P1001' ||
        error?.message?.includes("Can't reach database server") ||
        error?.message?.includes('Connection refused')

      // If it's not a connection error or we've exhausted retries, throw immediately
      if (!isConnectionError || attempt === maxRetries) {
        if (isConnectionError) {
          throw new DatabaseConnectionError(
            `Database connection failed after ${attempt + 1} attempts: ${error.message}`,
            error
          )
        }
        throw error
      }

      // Log retry attempt
      console.warn(
        `Database connection attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
        error.code || error.message
      )

      // Wait before retrying with exponential backoff + jitter
      const jitter = Math.random() * 0.3 * delay // 0-30% jitter
      await new Promise(resolve => setTimeout(resolve, delay + jitter))

      // Increase delay for next retry
      delay = Math.min(delay * backoffMultiplier, maxDelay)
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError
}
