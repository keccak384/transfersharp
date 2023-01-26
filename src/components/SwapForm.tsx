import * as Label from '@radix-ui/react-label'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { styled } from 'stitches.config'

import { FlexRow, Input, InputWrapper } from './primitives'

function fetchQuote(amount: number) {
  return fetch(
    `https://jnru9d0d29.execute-api.us-east-1.amazonaws.com/prod/quote?tokenInAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&tokenInChainId=1&tokenOutAddress=0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c&tokenOutChainId=1&amount=${amount}&type=exactIn`
  )
}

const CurrencySymbolWrapper = styled('div', {
  fontSize: '42px',

  color: '$gray12',
})

const inputValueAtom = atomWithStorage('currencyInputValue', 1000)
const outputValueAtom = atomWithStorage('currencyOutputValue', 1000)

export default function SwapForm() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const [outputValue, setOutputValue] = useAtom(outputValueAtom)

  useEffect(() => {
    // Update the document title using the browser API
    fetchQuote(inputValue).then(async (res) => {
      const json = await res.json()
      setOutputValue(json.quote)
    })
  }, [inputValue])

  return (
    <>
      <InputWrapper>
        <Label.Root htmlFor="youSendValue">You send</Label.Root>
        <FlexRow>
          <CurrencySymbolWrapper>$</CurrencySymbolWrapper>
          <Input
            name="youSendValue"
            placeholder="1000"
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
          <CurrencySymbolWrapper>€</CurrencySymbolWrapper>
          <Input
            name="youReceiveValue"
            placeholder="€920.26"
            pattern="[0-9]*"
            type="number"
            inputMode="numeric"
            value={outputValue}
          />
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
