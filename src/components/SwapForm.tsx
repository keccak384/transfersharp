import * as Label from '@radix-ui/react-label'
import { CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core'
import { Pool, FeeAmount, Route, SwapRouter, SwapOptions, Trade } from '@uniswap/v3-sdk'
// import { Trade } from '@uniswap/router-sdk'
import { useAtom } from 'jotai'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { styled } from 'stitches.config'

import { inputValueAtom, outputValueAtom } from '../data/swap'
import { FlexRow, Input, InputWrapper } from './primitives'

const USDC_MAINNET = new Token(
  1,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)

const EUROC_MAINNET = new Token(
  1,
  '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c',
  6,
  'EUROC',
  'EURO//C'
)

const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

function fetchQuote(amount: number) {
  return fetch(
    `https://jnru9d0d29.execute-api.us-east-1.amazonaws.com/prod/quote?tokenInAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&tokenInChainId=1&tokenOutAddress=0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c&tokenOutChainId=1&amount=${amount}&type=exactIn`
  )
}

const CurrencySymbolWrapper = styled('div', {
  fontSize: '42px',

  color: '$gray12',
})

export default function SwapForm() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const [outputValue, setOutputValue] = useAtom(outputValueAtom)

  useEffect(() => {
    // Update the document title using the browser API
    fetchQuote(inputValue).then(async (res) => {
      const json = await res.json()
      console.log(USDC_MAINNET, EUROC_MAINNET, FeeAmount.LOW, json.route[0][0]?.sqrtRatioX96, json.route[0][0]?.liquidity, parseInt(json.route[0][0]?.tickCurrent))
      const pool = new Pool(USDC_MAINNET, EUROC_MAINNET, FeeAmount.LOW, json.route[0][0]?.sqrtRatioX96, json.route[0][0]?.liquidity, parseInt(json.route[0][0]?.tickCurrent)) 

      const route = new Route([pool], USDC_MAINNET, EUROC_MAINNET)
      const inputAmount = CurrencyAmount.fromRawAmount(USDC_MAINNET, inputValue)
      const outputAmount = CurrencyAmount.fromRawAmount(EUROC_MAINNET, outputValue)

      const uncheckedTrade = Trade.createUncheckedTrade({
        route,
        inputAmount,
        outputAmount,
        tradeType: TradeType.EXACT_INPUT,
      })
      console.log(uncheckedTrade)

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
    })
  }, [inputValue, setOutputValue])

  return (
    <>
      <InputWrapper>
        <Label.Root htmlFor="youSendValue">You send</Label.Root>
        <FlexRow>
          <CurrencySymbolWrapper>$</CurrencySymbolWrapper>
          <Input
            name="youSendValue"
            pattern="[0-9]*"
            type="number"
            inputMode="numeric"
            onChange={(e) => setInputValue(+e.currentTarget.value)}
            value={inputValue}
          />
          <FlexRow>
            <Image src="/USD.png" alt="13" width={20} height={20} priority />
            USD
          </FlexRow>
        </FlexRow>
      </InputWrapper>
      <InputWrapper>
        <Label.Root htmlFor="youSendValue">They receive</Label.Root>
        <FlexRow>
          {outputValue && <CurrencySymbolWrapper>€</CurrencySymbolWrapper>}
          <Input name="youReceiveValue" pattern="[0-9]*" type="number" inputMode="numeric" value={outputValue} />
          <FlexRow>
            {' '}
            <Image src="/EUR.png" alt="13" width={20} height={20} priority />
            EUR
          </FlexRow>
        </FlexRow>
      </InputWrapper>
    </>
  )
}
