import { styled } from '@stitches/react'
import type { AppProps } from 'next/app'

const AppWrapper = styled('div', {
  display: 'flex',
  width: '100vw',
  minHeight: '100vh',
  overflow: 'scroll',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  )
}
