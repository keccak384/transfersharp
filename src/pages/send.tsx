import * as Label from '@radix-ui/react-label'
import { useAtomValue, useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FormEvent, Suspense, useState } from 'react'

import InfoBox from '@/components/InfoBox'
import {
  Button,
  Input,
  InputWrapper,
  InviteButton,
  PageWrapper,
  PendingButton,
  SmallText,
  StyledSendForm,
} from '@/components/primitives'
import SwapForm from '@/components/SwapForm'
import TransactionDetails from '@/components/TransactionDetails'
import { loginModalAtom } from '@/data/modal'
import { isLoggedInAtom, userDataAtom } from '@/data/wallet'
import type { Transaction } from '@/db/transactions'

function LoginButton({ handleLogin }: { handleLogin: () => void }) {
  const isLoggedIn = useAtomValue(isLoggedInAtom)

  return isLoggedIn ? (
    <PendingButton>Send</PendingButton>
  ) : (
    <Button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleLogin()
      }}
    >
      Sign in to send
    </Button>
  )
}

function SendForm() {
  const userData = useAtomValue(userDataAtom)
  const setIsLoginModalOpen = useSetAtom(loginModalAtom)
  const router = useRouter()

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

  // @todo better validation
  const isValidPhoneNumber = phoneNumber.length !== 0

  return (
    <PageWrapper>
      <InfoBox />
      <StyledSendForm onSubmit={handleSend}>
        <SwapForm />
        {userData && (
          <InputWrapper>
            <Label.Root htmlFor="toPhoneNumber">To</Label.Root>
            <Input
              onChange={onPhoneNumberChange}
              value={phoneNumber}
              type="tel"
              name="toPhoneNumber"
              placeholder="+1 800 888 8888"
            />
            <SmallText>
              {`You can send to any phone number. We'll text them an invite to join to receive the funds.`}
            </SmallText>
            {isValidPhoneNumber && <InviteButton>Invite via SMS</InviteButton>}
          </InputWrapper>
        )}
        <TransactionDetails />
        <Suspense fallback={<Button disabled>...</Button>}>
          <LoginButton handleLogin={() => setIsLoginModalOpen(true)} />
        </Suspense>
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
