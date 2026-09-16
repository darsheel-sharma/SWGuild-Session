import { useState, useCallback } from 'react'
import { api } from '../services/api.js'

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

export function useCouncil() {
  const [status, setStatus] = useState(STATUS.IDLE)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const convene = useCallback(async (question) => {
    setStatus(STATUS.LOADING)
    setResult(null)
    setError(null)

    try {
      const data = await api.startCouncil(question)
      setResult(data)
      setStatus(STATUS.SUCCESS)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setStatus(STATUS.ERROR)
    }
  }, [])

  const reset = useCallback(() => {
    setStatus(STATUS.IDLE)
    setResult(null)
    setError(null)
  }, [])

  return {
    status,
    result,
    error,
    isLoading: status === STATUS.LOADING,
    isSuccess: status === STATUS.SUCCESS,
    isError: status === STATUS.ERROR,
    convene,
    reset,
  }
}
