import * as Label from '@radix-ui/react-label'
import { useAtomValue, useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { styled } from 'stitches.config'

import {
  Button,
  FlexRowFixed,
  InvitePendingMessage,
  PageWrapper,
  PendingText,
  SmallText,
  Spinner,
} from '@/components/primitives'
import { loginModalAtom, phoneNumberAtom } from '@/data/modal'
import { userDataAtom } from '@/data/wallet'
import {
  AuthorizedTransaction,
  BaseTransaction,
  getTransactionById,
  isAuthorizedTransaction,
  isCompletedTransaction,
} from '@/db/transactions'

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

  if (isCompletedTransaction(transaction)) {
    return {
      redirect: {
        destination: `/withdraw/${transaction.id}`,
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

const ReceiveWrapper = styled('div', {
  maxWidth: '500px',
  width: '100%',
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

function ReceiveTransaction({ transaction }: { transaction: BaseTransaction | AuthorizedTransaction }) {
  const userData = useAtomValue(userDataAtom)
  const router = useRouter()

  const setLoginModalPhoneNumber = useSetAtom(phoneNumberAtom)
  const setIsLoginModalOpen = useSetAtom(loginModalAtom)

  const approveTransaction = async () => {
    if (userData && !('toWallet' in transaction)) {
      const response = await fetch(`/api/authorize/${transaction.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toWallet: userData.publicAddress,
        }),
      })

      // Refresh `server.side` props to get fresh transaction
      if (response.status === 200) {
        router.replace(router.asPath)
        return
      }

      throw new Error('Something went wrong. Please try again later.')
    }
  }

  // Check every 10 seconds whether there is an update to the `transaction`
  useEffect(() => {
    const id = setInterval(() => {
      router.replace(router.asPath)
    }, 10 * 1000)
    return () => clearInterval(id)
  }, [router, transaction])

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
          {isAuthorizedTransaction(transaction) ? (
            <>
              <FlexRowFixed>
                <Spinner />
                <PendingText>Waiting for the funds to arrive. You can close this page and come back later.</PendingText>
              </FlexRowFixed>
            </>
          ) : userData ? (
            <>
              <Button as="a" href="#" onClick={approveTransaction}>
                Approve
              </Button>
            </>
          ) : (
            <>
              <InvitePendingMessage>
                {`Signing up is free and easy. There are no fees and we'll never share your phone number without your consent.`}
              </InvitePendingMessage>
              <Button
                as="a"
                href="#"
                onClick={() => {
                  setLoginModalPhoneNumber(transaction.toPhoneNumber)
                  setIsLoginModalOpen(true)
                }}
              >
                Sign up to receive
              </Button>
            </>
          )}
        </FlexColumn>
      </ReceiveWrapper>
    </PageWrapper>
  )
}

export default dynamic(() => Promise.resolve(ReceiveTransaction), {
  ssr: false,
})
