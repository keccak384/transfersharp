import * as Dialog from '@radix-ui/react-dialog'
import * as Label from '@radix-ui/react-label'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import { FormEvent, Suspense, useState } from 'react'

import { isLoggedInAtom, stateAtom } from '@/data/wallet'

function SubmitButton({ handleLogin }: { handleLogin: () => void }) {
  const isLoggedIn = useAtomValue(isLoggedInAtom)

  return isLoggedIn ? (
    <button>Send</button>
  ) : (
    <a href="#" onClick={handleLogin}>
      Login to send
    </a>
  )
}

function SendForm() {
  const magic = useAtomValue(stateAtom)
  const refreshState = useResetAtom(stateAtom)

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

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(`Sending...`)
  }

  return (
    <form onSubmit={handleSend}>
      <Label.Root htmlFor="youSendValue">You send</Label.Root>
      <input type="number" name="youSendValue" />

      <Label.Root htmlFor="youSendValue">You receive</Label.Root>
      <input type="number" name="youReceiveValue" />

      <Label.Root htmlFor="toPhoneNumber">To</Label.Root>
      <input type="tel" name="toPhoneNumber" />

      <div>
        <div>
          <span>Current rate</span>
          <span>$1 = $0.92</span>
        </div>
        <div>
          <span>Total fees</span>
          <span>$1.23</span>
        </div>
        <div>
          <span>Arrival</span>
          <span>In seconds</span>
        </div>
        <p>
          Our rate (including any fees) is currently 0.14% better than the European Central Bank (ECB). This comparison
          rate is typically one of the best available.
        </p>
      </div>

      <Suspense fallback={<button disabled>...</button>}>
        <SubmitButton handleLogin={() => setIsLoginModalOpen(true)} />
      </Suspense>

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
    </form>
  )
}

function Send() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SendForm />
    </Suspense>
  )
}

/**
 * Magic doesn't work with SSR. The following code will prevent the page from being
 * rendered on the server.
 */
export default dynamic(() => Promise.resolve(Send), {
  ssr: false,
})
