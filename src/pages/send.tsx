import * as Dialog from '@radix-ui/react-dialog'
import * as Label from '@radix-ui/react-label'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FormEvent, Suspense, useState } from 'react'

import { styled } from '@/../stitches.config'
import { isLoggedInAtom, stateAtom, userDataAtom } from '@/data/wallet'

const SendButton = styled('button', {
  backgroundColor: '$blue9',
  color: '$gray1',
  border: 'none',
  padding: '$2',
  borderRadius: '20px',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: '500',
  display: 'inline-block',
  '&:hover': {
    backgroundColor: '$blue5',
  },
})

function SubmitButton({ handleLogin }: { handleLogin: () => void }) {
  const isLoggedIn = useAtomValue(isLoggedInAtom)

  return isLoggedIn ? (
    <SendButton>Send</SendButton>
  ) : (
    <SendButton as="a" href="#" onClick={handleLogin}>
      Login to send
    </SendButton>
  )
}

const PageWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
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
})

const StyledInput = styled('input', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '42px',
  appearance: 'none',
  color: '$gray11',
  width: '100%',
  '&::placeholder': {
    color: '$gray5',
  },
  '&:focus': {
    outline: 'none',
  },
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
  const magic = useAtomValue(stateAtom)
  const userData = useAtomValue(userDataAtom)
  const refreshState = useResetAtom(stateAtom)
  const router = useRouter()

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
    if (!userData) {
      throw new Error('Not authenticated, please log in first')
    }
    router.push(`/receive/${userData.publicAddress}`)
  }

  return (
    <PageWrapper>
      <StyledSendForm onSubmit={handleSend}>
        <InputWrapper>
          <Label.Root htmlFor="youSendValue">You send</Label.Root>
          <FlexRow>
            <StyledInput name="youSendValue" placeholder="$1000" pattern="[0-9]*" type="text" inputmode="numeric" />
            <FlexRow>
              <Image src="/USD.png" alt="13" width={20} height={20} priority />
              USD
            </FlexRow>
          </FlexRow>
        </InputWrapper>

        <InputWrapper>
          <Label.Root htmlFor="youSendValue">They receive</Label.Root>
          <FlexRow>
            <StyledInput
              name="youReceiveValue"
              placeholder="€920.26"
              pattern="[0-9]*"
              type="text"
              inputmode="numeric"
            />
            <FlexRow>
              {' '}
              <Image src="/EUR.png" alt="13" width={20} height={20} priority />
              EUR
            </FlexRow>
          </FlexRow>
        </InputWrapper>

        <InputWrapper>
          <Label.Root htmlFor="toPhoneNumber">To</Label.Root>
          <StyledInput type="tel" name="toPhoneNumber" placeholder="+1 800 888 8888" />
        </InputWrapper>

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
                <SendButton>Login</SendButton>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
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
