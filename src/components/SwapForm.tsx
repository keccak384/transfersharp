import * as Label from '@radix-ui/react-label'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { styled } from 'stitches.config'

import { FlexRow, Input, InputWrapper } from './primitives'

const CurrencySymbolWrapper = styled('div', {
  fontSize: '42px',

  color: '$gray12',
})

const inputValueAtom = atomWithStorage('currencyInputValue', 1000)
const outputValueAtom = atomWithStorage('currencyOutputValue', 1000)

export default function SwapForm() {
  const [inputValue, setInputValue] = useAtom(inputValueAtom)
  const [outputValue, setOutputValue] = useAtom(outputValueAtom)

  const [rate] = useState(0.92)

  useEffect(() => {
    const newPrice = (inputValue * rate).toFixed(2)
    setOutputValue(parseInt(newPrice))
  }, [inputValue, rate, setOutputValue])

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
