import { useAtomValue } from 'jotai'
import React from 'react'
import { styled } from 'stitches.config'

import { inputValueAtom, outputValueAtom } from '../data/swap'
import { DarkText, FlexRow } from './primitives'

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  color: '$gray10',
  padding: '16px',
})

export default function TransactionDetails() {
  const inputValue = useAtomValue(inputValueAtom)
  const outputValue = useAtomValue(outputValueAtom)

  const rate = Math.round((outputValue / inputValue) * 100) / 100

  return (
    <Wrapper>
      <FlexRow>
        <span>Current rate</span>
        <DarkText>$1 = ${rate}</DarkText>
      </FlexRow>
      <FlexRow>
        <span>Total fees</span>
        <DarkText>$1.23</DarkText>
      </FlexRow>
      <FlexRow>
        <span>Arrival</span>
        <DarkText>In seconds</DarkText>
      </FlexRow>
      <p style={{ fontSize: '12px' }}>
        Our rate (including any fees) is currently 0.14% better than the European Central Bank (ECB). This comparison
        rate is typically one of the best available.
      </p>
    </Wrapper>
  )
}
