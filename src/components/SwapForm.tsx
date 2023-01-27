import * as Label from '@radix-ui/react-label'
import { useAtom } from 'jotai'
import Image from 'next/image'
import qs from 'qs'
import React, { useEffect } from 'react'
import { styled } from 'stitches.config'

import { inputValueAtom, quoteAtom } from '../data/swap'
import { FlexRow, Input, InputWrapper, SmallText } from './primitives'

const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const EURC = '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c'

const CurrencySymbolWrapper = styled('div', {
  fontSize: '42px',

  color: '$gray12',
})

export default function SwapForm() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const [quote, setQuote] = useAtom(quoteAtom)

  useEffect(() => {
    ;(async () => {
      const response = await fetch(
        `https://api.0x.org/swap/v1/quote?${qs.stringify({
          sellToken: USDC,
          buyToken: EURC,
          sellAmount: inputValue,
        })}`
      )
      const quote = await response.json()
      setQuote(quote)
    })()
  }, [inputValue, setQuote])

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
          {quote && <CurrencySymbolWrapper>€</CurrencySymbolWrapper>}
          <Input
            name="youReceiveValue"
            pattern="[0-9]*"
            type="number"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={quote?.buyAmount}
          />
          <FlexRow>
            {' '}
            <Image src="/EUR.png" alt="13" width={20} height={20} priority />
            EUR
          </FlexRow>
        </FlexRow>
        <SmallText css={{ color: '$grass10' }}>
          +€1.27 more than <i>Wise</i>
        </SmallText>
      </InputWrapper>
    </>
  )
}
