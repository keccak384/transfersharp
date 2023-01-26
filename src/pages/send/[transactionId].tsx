import * as Label from '@radix-ui/react-label'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import { styled } from '@/../stitches.config'
import { Button, FlexRowFixed, Input, Spinner } from '@/components/primitives'
import SwapForm from '@/components/SwapForm'
import TransactionDetails from '@/components/TransactionDetails'
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

const PageWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
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

const InvitePendingMessage = styled('p', {
  padding: '24px',
  backgroundColor: '$blue2',
  color: '$blue10',
  borderRadius: '24px',
})

const SmallText = styled('span', {
  fontSize: '$1',
  color: '$gray9',
})

const PendingText = styled(SmallText, {
  color: '$blue10',
})

function SendTransaction({ transaction }: { transaction: Transaction }) {
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
          <FlexRowFixed>
            <Spinner />
            <PendingText>Waiting for them to join</PendingText>
          </FlexRowFixed>
          <InvitePendingMessage>
            We will text you when the recipient joins to complete your transfer! You can safely leave this page.
          </InvitePendingMessage>
        </InputWrapper>
        <TransactionDetails />
        <Button>Send</Button>
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
