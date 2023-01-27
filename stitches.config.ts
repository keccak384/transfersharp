import { blue, grass, gray, green, red } from '@radix-ui/colors'
import { createStitches, globalCss } from '@stitches/react'

export const { styled, getCssText } = createStitches({
  theme: {
    fonts: {
      system: 'system-ui',
    },
    colors: {
      ...gray,
      ...blue,
      ...red,
      ...green,
      ...grass,
    },
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
    },
    fontSizes: {
      1: '14px',
      2: '16px',
      3: '18px',
    },
  },
  media: {
    bp1: '(min-width: 640px)',
    bp2: '(min-width: 768px)',
    bp3: '(min-width: 1024px)',
  },
})

const GlobalStyles = globalCss({
  '*': { margin: 0, padding: 0, boxSizing: 'border-box' },
  input: {
    appearance: 'textfield',
  },
  html: {
    maxWidth: '100vw',
    overflowX: 'hidden',
  },
  body: {
    maxWidth: '100vw',
    overflowX: 'hidden',
    background: '$background',
    color: '$gray12',
    fontSize: '$2',
    fontFamily: '$system',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  h2: {
    fontWeight: 500,
  },
})

GlobalStyles()
