import { Contract } from '@ethersproject/contracts'
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { AlphaRouter, ChainId, SwapOptionsSwapRouter02, SwapRoute, SwapType } from '@uniswap/smart-order-router'

import {
  ERC20_ABI,
  EUROC_TOKEN,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  USDC_TOKEN,
  V3_SWAP_ROUTER_ADDRESS,
} from './constants'
import { fromReadableAmount } from './conversion'
import { sendTransaction, TransactionState } from './providers'

export async function generateRoute(recipient: string, inputAmount: number, provider: any): Promise<SwapRoute | null> {
  const router = new AlphaRouter({
    chainId: ChainId.MAINNET,
    provider,
  })

  const options: SwapOptionsSwapRouter02 = {
    recipient,
    slippageTolerance: new Percent(5, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  }

  const route = await router.route(
    CurrencyAmount.fromRawAmount(USDC_TOKEN, fromReadableAmount(inputAmount, 6).toString()),
    EUROC_TOKEN,
    TradeType.EXACT_INPUT,
    options
  )

  return route
}

export async function executeRoute(route: SwapRoute, walletAddress: string, provider: any): Promise<TransactionState> {
  if (!walletAddress || !provider) {
    throw new Error('Cannot execute a trade without a connected wallet')
  }

  const tokenApproval = await getTokenTransferApproval(USDC_TOKEN, walletAddress, provider)

  // Fail if transfer approvals do not go through
  if (tokenApproval !== TransactionState.Sent) {
    return TransactionState.Failed
  }

  const res = await sendTransaction(provider, {
    data: route.methodParameters?.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    // value: route?.methodParameters?.value,
    from: walletAddress,
  })

  return res
}

export async function getTokenTransferApproval(token: Token, walletAddress: string, provider: any): Promise<TransactionState> {
  if (!provider || !walletAddress) {
    console.log('No Provider Found')
    return TransactionState.Failed
  }

  try {
    const tokenContract = new Contract(token.address, ERC20_ABI, provider)

    const transaction = await tokenContract.populateTransaction.approve(
      V3_SWAP_ROUTER_ADDRESS,
      fromReadableAmount(TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, token.decimals).toString()
    )

    console.log(transaction)

    return sendTransaction(provider, {
      ...transaction,
      from: walletAddress,
    })
  } catch (e) {
    console.error(e)
    return TransactionState.Failed
  }
}
