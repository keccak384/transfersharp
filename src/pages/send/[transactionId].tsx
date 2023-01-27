import * as Label from '@radix-ui/react-label'
import { useAtomValue, useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FormEvent, Suspense, useEffect } from 'react'

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
import { quoteAtom } from '@/data/swap'
import { isLoggedInAtom, web3Atom } from '@/data/wallet'
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

  if (transaction.hash) {
    return {
      redirect: {
        destination: `/completed/${transaction.id}`,
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

  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const setIsLoginModalOpen = useSetAtom(loginModalAtom)

  const web3 = useAtomValue(web3Atom)
  const swapQuote = useAtomValue(quoteAtom)

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // @todo Load ETH and USDC via Moonpay

    // Check whether we have an active swap quote
    if (!swapQuote || !transaction.toWallet) {
      throw new Error('No swap quote found. Please go back and try again.')
    }

    // Make sure there is enough ETH to cover gas fees
    const userBalance = +(await web3.eth.getBalance(transaction.fromWallet))
    if (userBalance <= +swapQuote.estimatedGas) {
      throw new Error('You have no funds to cover this transaction')
    }

    // @todo Check there is enough USDC balance
    // @todo Perform actual swap transaction
    // const receipt = await web3.eth.sendTransaction({
    //   ...swapQuote,
    //   from: transaction.fromWallet,
    // })
    // @todo Transfer EURC to receiver

    // Right now, for demo purposes, I am just going to transfer ETH between senders and receivers
    // to simplify the demo process
    try {
      const receipt = await web3.eth.sendTransaction({
        to: transaction.toWallet,
        from: transaction.fromWallet,
        value: web3.utils.toWei('0.0001'),
      })
      await fetch(`/api/confirm/${transaction.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash: receipt.transactionHash,
        }),
      })
      router.push(`/completed/${transaction.id}`)
    } catch (error) {
      console.log(error)
      throw new Error('There was an error sending transaction. Please try again.')
    }
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
          <Input type="tel" name="toPhoneNumber" value={transaction.toPhoneNumber} disabled />
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
