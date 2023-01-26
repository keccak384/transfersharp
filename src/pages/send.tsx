import * as Dialog from '@radix-ui/react-dialog'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import { FormEvent, Suspense, useState } from 'react'

import { isLoggedInAtom, magicAtom } from '@/data'

function SendButton() {
  const [magic] = useAtom(magicAtom)
  const [isLoggedIn] = useAtom(isLoggedInAtom)
  const refreshState = useResetAtom(magicAtom)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const email = new FormData(e.currentTarget).get('email')?.toString()

      if (!email) {
        throw new Error('Email is required')
      }

      await magic.auth.loginWithEmailOTP({ email })
      refreshState()
    } catch (error) {
      console.log(`Error while logging in with MagicLink: ${error}`)
    } finally {
      setIsLoginModalOpen(false)
    }
  }

  return (
    <div>
      <a href="#" onClick={() => setIsLoginModalOpen(true)}>
        Send
      </a>
      {isLoggedIn && <p>You are logged in</p>}
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

function Send() {
  return (
    <div>
      <p>You send</p>
      <div>$1000</div>
      <p>You receive</p>
      <div>$1000</div>

      <Suspense fallback={<p>Loading...</p>}>
        <SendButton />
      </Suspense>
    </div>
  )
}

/**
 * Magic doesn't work with SSR. The following code will prevent the page from being
 * rendered on the server.
 */
export default dynamic(() => Promise.resolve(Send), {
  ssr: false,
})
