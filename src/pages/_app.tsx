import { styled } from '@stitches/react'
import type { AppProps } from 'next/app'
import { globalStyles } from 'stitches.config'

const AppWrapper = styled('div', {
  display: 'flex',
  width: '100vw',
  minHeight: '100vh',
  overflow: 'scroll',
})

export default function App({ Component, pageProps }: AppProps) {
  globalStyles()

  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  )
}
