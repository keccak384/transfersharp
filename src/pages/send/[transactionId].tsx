import { Web3Provider } from '@ethersproject/providers'
import * as Label from '@radix-ui/react-label'
import { useAtomValue, useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Suspense, useEffect } from 'react'

import {
  Button,
  FlexRowFixed,
  Input,
  InputWrapper,
  InvitePendingMessage,
  PageWrapper,
  PendingButton,
  PendingText,
  Spinner,
  StyledSendForm,
  SuccessText,
} from '@/components/primitives'
import SwapForm from '@/components/SwapForm'
import TransactionDetails from '@/components/TransactionDetails'
import { loginModalAtom } from '@/data/modal'
import { inputValueAtom } from '@/data/swap'
import { isLoggedInAtom, magicAtom, userDataAtom } from '@/data/wallet'
import { getTransactionById, Transaction } from '@/db/transactions'
import { executeRoute, generateRoute } from '@/utils/routing'

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

function SendTransaction({ transaction }: { transaction: Transaction }) {
  const didReceiverAccept = !!transaction.toWallet
  const ButtonComponent = didReceiverAccept ? Button : PendingButton
  const magic = useAtomValue(magicAtom)
  const userData = useAtomValue(userDataAtom)
  const provider = new Web3Provider(magic.rpcProvider)
  const inputAmount = useAtomValue(inputValueAtom)

  const isLoggedIn = useAtomValue(isLoggedInAtom)

  const setIsLoginModalOpen = useSetAtom(loginModalAtom)

  const handleSend = async (e) => {
    e.preventDefault()
    const route = await generateRoute('0x703491e54970dc622c3b77d49b6727d5b69eb45c', inputAmount, provider)
    await executeRoute(route, userData.publicAddress, provider)
  }

  // Check every 10 seconds whether there is an update to the `transaction`
  const router = useRouter()
  useEffect(() => {
    if (transaction.toWallet) {
      return
    }
    const id = setInterval(() => {
      router.replace(router.asPath)
    }, 10 * 1000)
    return () => clearInterval(id)
  }, [router, transaction])

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
                Great! We texted them. When the recipient signs up you can complete your transfer! You can safely leave
                this page.
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
