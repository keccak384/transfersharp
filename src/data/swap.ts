import { atomWithStorage } from 'jotai/utils'

export const inputValueAtom = atomWithStorage('currencyInputValue', 1000)
export const outputValueAtom = atomWithStorage('currencyOutputValue', undefined)

// https://docs.0x.org/0x-api-swap/api-references/get-swap-v1-quote
type SwapQuote = {
  chainId: number
  price: string
  guaranteedPrice: string
  estimatedPriceImpact: string
  to: string
  data: string
  value: string
  gas: string
  estimatedGas: string
  gasPrice: string
  protocolFee: string
  minimumProtocolFee: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  sellAmount: string
  allowanceTarget: string
  sellTokenToEthRate: string
  buyTokenToEthRate: string
}

export const quoteAtom = atomWithStorage<SwapQuote | undefined>('transaction', undefined)
