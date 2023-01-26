import * as Label from '@radix-ui/react-label'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FormEvent, Suspense, useState } from 'react'
import { useEffect } from 'react'

import { styled } from '@/../stitches.config'
import ConnectWithPhoneDialog from '@/components/ConnectWithPhoneDialog'
import { Input, SendButton } from '@/components/primitives'
import { isLoggedInAtom, stateAtom, userDataAtom } from '@/data/wallet'
import type { Transaction } from '@/db/transactions'

function SubmitButton({ handleLogin }: { handleLogin: () => void }) {
  const isLoggedIn = useAtomValue(isLoggedInAtom)

  return isLoggedIn ? (
    <SendButton>Send</SendButton>
  ) : (
    <SendButton as="a" href="#" onClick={handleLogin}>
      Sign in to send
    </SendButton>
  )
}

const PageWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  margin: 'auto',
  backgroundColor: 'white',
  color: 'black',
})

const StyledSendForm = styled('form', {
  fontSize: '$3',
  border: '0',
  maxWidth: '420px',
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

const InputWrapper = styled('div', {
  padding: '24px',
  border: '1px solid $gray5',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  color: '$gray12',
})

const CurrencySymbolWrapper = styled('div', {
  fontSize: '42px',

  color: '$gray12',
})

const TransactionDetails = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  color: '$gray10',
  padding: '16px',
})

const FlexRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: '$2',
})

const DarkText = styled('span', { color: '$gray11' })

function SendForm() {
  const userData = useAtomValue(userDataAtom)
  const refreshState = useResetAtom(stateAtom)
  const router = useRouter()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleSend = async (e: ChangeEvent<HTMLInputElement>) => {
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

  const [inputValue, setInputValue] = useState(1000)
  const [outputValue, setOutputValue] = useState(1000)
  const [rate] = useState(0.92)
  const onInputChange = (e: FormEvent<HTMLInputElement>) => {
    const newPrice = (e.target.value * rate).toFixed(2)
    setOutputValue(parseInt(newPrice))
    setInputValue(e.target.value)
  }

  useEffect(() => {
    // Update the document title using the browser API
    const newPrice = (inputValue * rate).toFixed(2)
    setOutputValue(parseInt(newPrice))
  }, [inputValue, rate])

  return (
    <PageWrapper>
      <StyledSendForm onSubmit={handleSend}>
        <InputWrapper>
          <Label.Root htmlFor="youSendValue">You send</Label.Root>
          <FlexRow>
            <CurrencySymbolWrapper>$</CurrencySymbolWrapper>
            <Input
              name="youSendValue"
              placeholder="1000"
              pattern="[0-9]*"
              type="number"
              inputMode="numeric"
              onChange={onInputChange}
              value={inputValue}
            />
            <FlexRow>
              <Image src="/USD.png" alt="13" width={20} height={20} priority />
              USD
            </FlexRow>
          </FlexRow>
        </InputWrapper>
        <InputWrapper>
          <Label.Root htmlFor="youSendValue">They receive</Label.Root>
          <FlexRow>
            <CurrencySymbolWrapper>€</CurrencySymbolWrapper>
            <Input
              name="youReceiveValue"
              placeholder="€920.26"
              pattern="[0-9]*"
              type="number"
              inputMode="numeric"
              value={outputValue}
            />
            <FlexRow>
              {' '}
              <Image src="/EUR.png" alt="13" width={20} height={20} priority />
              EUR
            </FlexRow>
          </FlexRow>
        </InputWrapper>
        {userData ? (
          <InputWrapper>
            <Label.Root htmlFor="toPhoneNumber">To</Label.Root>
            <Input type="tel" name="toPhoneNumber" placeholder="+1 800 888 8888" />
          </InputWrapper>
        ) : null}
        <TransactionDetails>
          <FlexRow>
            <span>Current rate</span>
            <DarkText>$1 = $0.92</DarkText>
          </FlexRow>
          <FlexRow>
            <span>Total fees</span>
            <DarkText>$1.23</DarkText>
          </FlexRow>
          <FlexRow>
            <span>Arrival</span>
            <DarkText>In seconds</DarkText>
          </FlexRow>
          <p style={{ fontSize: '12px' }}>
            Our rate (including any fees) is currently 0.14% better than the European Central Bank (ECB). This
            comparison rate is typically one of the best available.
          </p>
        </TransactionDetails>
        <Suspense fallback={<SendButton disabled>...</SendButton>}>
          <SubmitButton handleLogin={() => setIsLoginModalOpen(true)} />
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
