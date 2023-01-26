import * as Label from '@radix-ui/react-label'
import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core'
import { FeeAmount, Pool, Route, SwapOptions, SwapRouter, Trade } from '@uniswap/v3-sdk'
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

function fetchQuote(amount: number) {
  return fetch(
    `https://jnru9d0d29.execute-api.us-east-1.amazonaws.com/prod/quote?tokenInAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&tokenInChainId=1&tokenOutAddress=0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c&tokenOutChainId=1&amount=${amount}&type=exactIn`
  )
}

const MAINNET_CHAIN_ID = 1

const USDC_MAINNET = new Token(MAINNET_CHAIN_ID, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
const EUROC_MAINNET = new Token(MAINNET_CHAIN_ID, '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c', 6, 'EUROC', 'EURO//C')

const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

function SendTransaction({ transaction }: { transaction: Transaction }) {
  const didReceiverAccept = !!transaction.toWallet
  const ButtonComponent = didReceiverAccept ? Button : PendingButton

  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const magic = useAtomValue(stateAtom)

  const setIsLoginModalOpen = useSetAtom(loginModalAtom)

  const handleSend = async () => {
    fetchQuote(inputValue).then(async (res) => {
      const json = await res.json()
      const pool = new Pool(
        USDC_MAINNET,
        EUROC_MAINNET,
        FeeAmount.LOW,
        json.route[0][0]?.sqrtRatioX96,
        json.route[0][0]?.liquidity,
        parseInt(json.route[0][0]?.tickCurrent)
      )

      const route = new Route([pool], USDC_MAINNET, EUROC_MAINNET)
      const inputAmount = CurrencyAmount.fromRawAmount(USDC_MAINNET, inputValue)
      const outputAmount = CurrencyAmount.fromRawAmount(EUROC_MAINNET, outputValue)

      const uncheckedTrade = Trade.createUncheckedTrade({
        route,
        inputAmount,
        outputAmount,
        tradeType: TradeType.EXACT_INPUT,
      })

      const options: SwapOptions = {
        slippageTolerance: new Percent(500, 10000), // 50 bips, or 0.50%
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
        recipient: '0x703491E54970DC622c3b77D49B6727d5b69Eb45C',
      }

      const methodParameters = SwapRouter.swapCallParameters([uncheckedTrade], options)

      const tx = {
        data: methodParameters.calldata,
        to: SWAP_ROUTER_ADDRESS,
        value: methodParameters.value,
        from: walletAddress,
      }

      const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
      provider.sendTransaction(tx)
    })
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
