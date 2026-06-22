import { useState, useCallback } from 'react'

/**
 * Generic hook for API calls with built-in loading and error state.
 * Usage: const { execute, loading, error } = useApi(apiFunction)
 */
export function useApi(apiFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFn(...args)
      return result
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Something went wrong'
      setError(Array.isArray(message) ? message[0]?.msg : message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFn])

  return { execute, loading, error, clearError: () => setError(null) }
}
