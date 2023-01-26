import * as Label from '@radix-ui/react-label'
import Image from 'next/image'
import React, { FormEvent, useEffect, useState } from 'react'
import { styled } from 'stitches.config'

import { FlexRow, Input, InputWrapper } from './primitives'

const CurrencySymbolWrapper = styled('div', {
  fontSize: '42px',

  color: '$gray12',
})

export default function SwapForm() {
  const [inputValue, setInputValue] = useState(1000)
  const [outputValue, setOutputValue] = useState(1000)
  const [rate] = useState(0.92)

  const onInputChange = (e: FormEvent<HTMLInputElement>) => {
    const value = +e.currentTarget.value
    const newPrice = (value * rate).toFixed(2)
    setOutputValue(parseInt(newPrice))
    setInputValue(value)
  }

  useEffect(() => {
    const newPrice = (inputValue * rate).toFixed(2)
    setOutputValue(parseInt(newPrice))
  }, [inputValue, rate])

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
            onChange={onInputChange}
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
