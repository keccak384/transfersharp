import { MAGIC_PUBLIC_KEY } from '@/env';
import { Magic } from 'magic-sdk'
import dynamic from 'next/dynamic';
import { FormEvent, useEffect, useRef, useState } from 'react';

function Login() {
  const magic = useRef(new Magic(MAGIC_PUBLIC_KEY))

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>()
  useEffect(() => {
    (async () => {
      const isLoggedIn = await magic.current.user.isLoggedIn()
      setIsLoggedIn(isLoggedIn)
    })()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const email = new FormData(e.currentTarget).get('email')?.toString()

    if (!email) {
      throw new Error('Email is required')
    }

    try {
      const tokenId = await magic.current.auth.loginWithEmailOTP({ email })
      if (tokenId) {
        setIsLoggedIn(true)
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (isLoggedIn === undefined) {
    return <p>Loading...</p>
  }

  if (isLoggedIn) {
    return <p>Logged in</p>
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" required />
        <button>Login</button>
      </form>
    </div>
  )
}

// Magic SDK doesn't work on the server side
export default dynamic(() => Promise.resolve(Login), {
  ssr: false,
})
