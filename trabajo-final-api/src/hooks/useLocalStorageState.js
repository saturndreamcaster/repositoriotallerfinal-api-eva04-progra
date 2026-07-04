import { useEffect, useState } from 'react'

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const savedValue = window.localStorage.getItem(key)
      return savedValue ? JSON.parse(savedValue) : initialValue
    } catch (error) {
      console.error(`No se pudo leer "${key}" de localStorage`, error)
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error(`No se pudo guardar "${key}" en localStorage`, error)
    }
  }, [key, state])

  return [state, setState]
}

export default useLocalStorageState
