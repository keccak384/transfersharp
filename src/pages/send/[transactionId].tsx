import * as Label from '@radix-ui/react-label'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'

import { styled } from '@/../stitches.config'
import ConnectWithPhoneDialog from '@/components/ConnectWithPhoneDialog'
import {
  Button,
  FlexRowFixed,
  Input,
  InputWrapper,
  PageWrapper,
  PendingButton,
  PendingText,
  Spinner,
  StyledSendForm,
  SuccessText,
} from '@/components/primitives'
import SwapForm from '@/components/SwapForm'
import TransactionDetails from '@/components/TransactionDetails'
import { isLoggedInAtom, stateAtom } from '@/data/wallet'
import { getTransactionById, Transaction } from '@/db/transactions'

export async function getServerSideProps({ params: { transactionId } }: { params: { transactionId: string } }) {
  const transaction = await getTransactionById(transactionId)

  if (!transaction) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      transaction,
    },
  }
}

const InvitePendingMessage = styled('p', {
  padding: '24px',
  backgroundColor: '$blue2',
  color: '$blue10',
  borderRadius: '24px',
})

function SendTransaction({ transaction }: { transaction: Transaction }) {
  const didReceiverAccept = false
  const ButtonComponent = didReceiverAccept ? Button : PendingButton

  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const refreshState = useResetAtom(stateAtom)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleSend = async () => {
    // @todo make an actual transaction
  }

  return (
    <PageWrapper>
      <StyledSendForm onSubmit={handleSend}>
        <SwapForm />
        <InputWrapper>
          <Label.Root htmlFor="toPhoneNumber">To</Label.Root>
          <Input type="tel" name="toPhoneNumber" placeholder="+1 800 888 8888" value="18455980032" disabled />
          {didReceiverAccept ? (
            <>
              <FlexRowFixed>
                <SuccessText>You are good to go!</SuccessText>
              </FlexRowFixed>
            </>
          ) : (
            <>
              <FlexRowFixed>
                <Spinner />
                <PendingText>Waiting for them to join</PendingText>
              </FlexRowFixed>
              <InvitePendingMessage>
                We will text you when the recipient joins to complete your transfer! You can safely leave this page.
              </InvitePendingMessage>
            </>
          )}
        </InputWrapper>
        <TransactionDetails />
        {isLoggedIn ? (
          <ButtonComponent disabled={ButtonComponent === PendingButton}>Send</ButtonComponent>
        ) : (
          <Button
            onClick={(e) => {
              e.preventDefault()
              setIsLoginModalOpen(true)
            }}
          >
            Sign in to continue
          </Button>
        )}
        <ConnectWithPhoneDialog
          isOpen={isLoginModalOpen}
          setIsOpen={(isOpen) => setIsLoginModalOpen(isOpen)}
          onConnected={refreshState}
        />
      </StyledSendForm>
    </PageWrapper>
  )
}

function Send({ transaction }: { transaction: Transaction }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SendTransaction transaction={transaction} />
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
