import * as Label from '@radix-ui/react-label'
import { useAtomValue, useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FormEvent, Suspense, useEffect, useState } from 'react'

import {
  Button,
  FlexRowFixed,
  Input,
  InputWrapper,
  InvitePendingMessage,
  InvitePendingMessageWarning,
  PageWrapper,
  PendingText,
  Spinner,
  StyledSendForm,
  SuccessText,
} from '@/components/primitives'
import SwapForm from '@/components/SwapForm'
import TransactionDetails from '@/components/TransactionDetails'
import { loginModalAtom, phoneNumberAtom } from '@/data/modal'
import { inputValueAtom, quoteAtom } from '@/data/swap'
import { magicAtom, userDataAtom, web3Atom } from '@/data/wallet'
import {
  AuthorizedTransaction,
  BaseTransaction,
  getTransactionById,
  isAuthorizedTransaction,
  isCompletedTransaction,
  Transaction,
} from '@/db/transactions'
import { executeRoute, generateRoute } from '@/utils/routing'

import { useFetch } from '../util'

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

function SendTransaction({ transaction }: { transaction: BaseTransaction | AuthorizedTransaction }) {
  const didReceiverAccept = isAuthorizedTransaction(transaction)

  const setIsLoginModalOpen = useSetAtom(loginModalAtom)
  const setLoginModalPhoneNumber = useSetAtom(phoneNumberAtom)

  const web3 = useAtomValue(web3Atom)
  const swapQuote = useAtomValue(quoteAtom)

  const magic = useAtomValue(magicAtom)
  const userData = useAtomValue(userDataAtom)
  const provider = new Web3Provider(magic.rpcProvider)
  const inputAmount = useAtomValue(inputValueAtom)

  const [isPendingFetch, fetch] = useFetch()
  const [isPendingTransaction, setIsPendingTransaction] = useState(false)

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsPendingTransaction(true)

    // @todo Load ETH and USDC via Moonpay

    // Check whether we have an active swap quote
    if (!swapQuote || !didReceiverAccept) {
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
      const route = await generateRoute('0x703491e54970dc622c3b77d49b6727d5b69eb45c', inputAmount, provider)
      await executeRoute(route, userData.publicAddress, provider)
      await fetch(`/api/confirm/${transaction.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash: receipt.transactionHash,
          buyAmount: swapQuote.buyAmount,
          sellAmount: swapQuote.sellAmount,
          buyTokenAddress: swapQuote.buyTokenAddress,
          sellTokenAddress: swapQuote.sellTokenAddress,
        }),
      })
      router.push(`/completed/${transaction.id}`)
    } catch (error) {
      console.log(error)
      throw new Error('There was an error sending transaction. Please try again.')
    } finally {
      setIsPendingTransaction(false)
    }
  }

  // Check every 10 seconds whether there is an update to the `transaction`
  const router = useRouter()
  useEffect(() => {
    if (didReceiverAccept) {
      return
    }
    const id = setInterval(() => {
      router.replace(router.asPath)
    }, 10 * 1000)
    return () => clearInterval(id)
  }, [router, didReceiverAccept])

  const userData = useAtomValue(userDataAtom)

  const isPending = isPendingTransaction || isPendingFetch

  const footer = (() => {
    switch (true) {
      case userData && userData.phoneNumber === transaction.fromPhoneNumber:
        return <Button disabled={!didReceiverAccept || isPending}>{isPending ? 'Sending...' : 'Send'}</Button>
      case !userData: {
        return (
          <Button
            onClick={(e) => {
              e.preventDefault()
              setLoginModalPhoneNumber(transaction.toPhoneNumber)
              setIsLoginModalOpen(true)
            }}
          >
            Sign in to continue
          </Button>
        )
      }
    }
  })()

  return (
    <PageWrapper>
      <StyledSendForm onSubmit={handleSend}>
        {userData && userData.phoneNumber !== transaction.fromPhoneNumber && (
          <InvitePendingMessageWarning style={{ marginBottom: 10 }}>
            You can only send this transaction if you are logged in with the phone number created it.
          </InvitePendingMessageWarning>
        )}
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
        {footer}
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
