import { useState } from 'react'

export const useFetch = (): [boolean, typeof fetch] => {
  const [isPending, setIsPending] = useState(false)

  const executeFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
    setIsPending(true)

    try {
      return await fetch(url, init)
    } finally {
      setIsPending(false)
    }
  }

  return [isPending, executeFetch]
}
