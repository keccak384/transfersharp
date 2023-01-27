import { useAtomValue } from 'jotai'
import React from 'react'
import { styled } from 'stitches.config'

import { quoteAtom } from '../data/swap'
import { DarkText, FlexRow } from './primitives'

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  color: '$gray10',
  padding: '16px',
})

const GWEI_PRICE = 0.000002

export default function TransactionDetails() {
  const swapQuote = useAtomValue(quoteAtom)

  return (
    <Wrapper>
      <FlexRow>
        <span>Current rate</span>
        {swapQuote ? (
          <DarkText>$1 = €{Math.round((+swapQuote.buyAmount / +swapQuote.sellAmount) * 100) / 100}</DarkText>
        ) : (
          '...'
        )}
      </FlexRow>
      <FlexRow>
        <span>Total fees</span>
        <DarkText>
          {swapQuote ? <DarkText>${(+swapQuote.estimatedGas * GWEI_PRICE).toFixed(2)}</DarkText> : '...'}
        </DarkText>
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
