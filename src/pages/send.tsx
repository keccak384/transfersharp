import * as Label from '@radix-ui/react-label'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FormEvent, Suspense, useState } from 'react'

import ConnectWithPhoneDialog from '@/components/ConnectWithPhoneDialog'
import { Button, Input, InputWrapper, PageWrapper, PendingButton, StyledSendForm } from '@/components/primitives'
import SwapForm from '@/components/SwapForm'
import TransactionDetails from '@/components/TransactionDetails'
import { isLoggedInAtom, stateAtom, userDataAtom } from '@/data/wallet'
import type { Transaction } from '@/db/transactions'

function SubmitButton({ handleLogin, disabled = false }: { handleLogin: () => void; disabled?: boolean }) {
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const ButtonComponent = disabled ? PendingButton : Button

  return isLoggedIn ? (
    <ButtonComponent>Notify via SMS</ButtonComponent>
  ) : (
    <ButtonComponent
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleLogin()
      }}
    >
      Sign in to send
    </ButtonComponent>
  )
}

function SendForm() {
  const userData = useAtomValue(userDataAtom)
  const refreshState = useResetAtom(stateAtom)
  const router = useRouter()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userData) {
      throw new Error('Not authenticated, please log in first')
    }
    const form = new FormData(e.currentTarget)
    const response = await fetch(`/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromWallet: userData.publicAddress,
        fromPhoneNumber: userData.phoneNumber,
        toPhoneNumber: form.get('toPhoneNumber')?.toString(),
      }),
    })
    if (response.status !== 201) {
      throw new Error('Error while creating transaction, please try again.')
    }
    const data = (await response.json()) as Transaction
    router.push(`/send/${data.id}`)
  }

  const [phoneNumber, setPhoneNumber] = useState('')
  const onPhoneNumberChange = (e: FormEvent<HTMLInputElement>) => {
    setPhoneNumber(e.currentTarget.value)
  }

  return (
    <PageWrapper>
      <StyledSendForm onSubmit={handleSend}>
        <SwapForm />
        <InputWrapper>
          <Label.Root htmlFor="toPhoneNumber">To</Label.Root>
          <Input
            onChange={onPhoneNumberChange}
            value={phoneNumber}
            type="tel"
            name="toPhoneNumber"
            placeholder="+1 800 888 8888"
          />
        </InputWrapper>
        <TransactionDetails />
        <Suspense fallback={<Button disabled>...</Button>}>
          <SubmitButton disabled={phoneNumber.length === 0} handleLogin={() => setIsLoginModalOpen(true)} />
        </Suspense>
        <ConnectWithPhoneDialog
          isOpen={isLoginModalOpen}
          setIsOpen={(isOpen) => setIsLoginModalOpen(isOpen)}
          onConnected={refreshState}
        />
      </StyledSendForm>
    </PageWrapper>
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
