import * as Dialog from '@radix-ui/react-dialog'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import { FormEvent, useState } from 'react'

import { isLoggedInAtom, magicAtom } from '@/data'

function Send() {
  const [magic] = useAtom(magicAtom)
  const [isLoggedIn] = useAtom(isLoggedInAtom)
  const refreshLoginState = useResetAtom(isLoggedInAtom)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const email = new FormData(e.currentTarget).get('email')?.toString()

      if (!email) {
        throw new Error('Email is required')
      }

      await magic.auth.loginWithEmailOTP({ email })
      refreshLoginState()
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
