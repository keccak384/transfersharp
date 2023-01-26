import * as Label from '@radix-ui/react-label'
import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { styled } from 'stitches.config'

import ConnectWithPhoneDialog from '@/components/ConnectWithPhoneDialog'
import { Button, InvitePendingMessage, PageWrapper, PendingText, SmallText, Spinner } from '@/components/primitives'
import { stateAtom, userDataAtom } from '@/data/wallet'
import { getTransactionById, Transaction } from '@/db/transactions'

import { FlexRowFixed } from '../../components/primitives'

const ReceiveWrapper = styled('div', {
  maxWidth: '500px',
  padding: '24px',
  border: '1px solid $gray6',
  borderRadius: '24px',
})

const InviteWrapper = styled(ReceiveWrapper, {
  backgroundColor: '$gray2',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

const BigText = styled('span', {
  fontSize: '42px',
  appearance: 'none',
  color: '$gray12',
})

const MediumText = styled('span', {
  fontSize: '20px',
  appearance: 'none',
  color: '$gray12',
})

const FlexColumn = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

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

function ReceiveTransaction({ transaction }: { transaction: Transaction }) {
  const userData = useAtomValue(userDataAtom)
  const refreshState = useResetAtom(stateAtom)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    if (userData && !transaction.toWallet) {
      // @todo notify backend that user has connected
    }
  }, [userData, transaction])

  return (
    <PageWrapper>
      <ReceiveWrapper>
        <FlexColumn>
          <Label.Root htmlFor="youSendValue">
            <MediumText>Hey there, you got an invite to receive funds!</MediumText>
          </Label.Root>

          <InviteWrapper>
            <SmallText>Your friend</SmallText>
            <BigText>{transaction.fromPhoneNumber}</BigText>
            <SmallText>Wants to send you</SmallText>
            <FlexRowFixed>
              <Image src="/EUR.png" alt="13" width={36} height={36} priority />
              <BigText>EURO</BigText>
            </FlexRowFixed>
          </InviteWrapper>

          {userData ? (
            <>
              <FlexRowFixed>
                <Spinner />
                <PendingText>Waiting for the funds to arrive. You can close this page and come back later.</PendingText>
              </FlexRowFixed>
            </>
          ) : (
            <>
              <InvitePendingMessage>
                {`Signing up is free and easy. There are no fees and we'll never share your phone number without your consent.`}
              </InvitePendingMessage>
              <Button as="a" href="#" onClick={() => setIsLoginModalOpen(true)}>
                Sign up to receive
              </Button>
            </>
          )}

          <ConnectWithPhoneDialog
            isOpen={isLoginModalOpen}
            setIsOpen={(isOpen) => setIsLoginModalOpen(isOpen)}
            onConnected={refreshState}
            phoneNumber={transaction.toPhoneNumber}
          />
        </FlexColumn>
      </ReceiveWrapper>
    </PageWrapper>
  )
}

export default dynamic(() => Promise.resolve(ReceiveTransaction), {
  ssr: false,
})
