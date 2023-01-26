import * as Dialog from '@radix-ui/react-dialog'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import { FormEvent, Suspense, useState } from 'react'

import { appStateAtom, isLoggedInAtom } from '@/data'

function SendButton() {
  const magic = useAtomValue(appStateAtom)
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const refreshState = useResetAtom(appStateAtom)

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

  const handleSend = async () => {
    console.log(`Sending...`)
  }

  return (
    <div>
      <a href="#" onClick={() => (isLoggedIn ? handleSend() : setIsLoginModalOpen(true))}>
        Send
      </a>
      {isLoggedIn && <p>You are logged in</p>}
      <Dialog.Root open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <h2>
              Enter your <span>phone number</span> to get started
            </h2>
            <p>It has a public address and a nickname that is only visible to you.</p>
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
