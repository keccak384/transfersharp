import * as Dialog from '@radix-ui/react-dialog'
import { Magic } from 'magic-sdk'
import dynamic from 'next/dynamic'
import { FormEvent, useEffect, useRef, useState } from 'react'

import { MAGIC_PUBLIC_KEY } from '@/env'

function Send() {
  const magic = useRef(new Magic(MAGIC_PUBLIC_KEY))

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>()
  useEffect(() => {
    ;(async () => {
      const isLoggedIn = await magic.current.user.isLoggedIn()
      setIsLoggedIn(isLoggedIn)
    })()
  }, [])

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const email = new FormData(e.currentTarget).get('email')?.toString()

      if (!email) {
        throw new Error('Email is required')
      }

      const tokenId = await magic.current.auth.loginWithEmailOTP({ email })
      if (tokenId) {
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.log(`Error while logging in with MagicLink: ${error}`)
    } finally {
      setIsLoginModalOpen(false)
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
      <a href="#" onClick={() => setIsLoginModalOpen(true)}>
        Send
      </a>
      <Dialog.Root open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <form onSubmit={handleLogin}>
              <input type="email" name="email" required />
              <button>Login</button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

// Magic SDK doesn't work on the server side
export default dynamic(() => Promise.resolve(Send), {
  ssr: false,
})
