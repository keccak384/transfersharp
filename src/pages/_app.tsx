import { styled } from '@stitches/react'
import type { AppProps } from 'next/app'
import Image from 'next/image'

const AppWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  minHeight: '100vh',
  overflow: 'scroll',
})

const Header = styled('header', {
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '24px',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <Header>
        <Image src="/uPay.png" alt="13" width={56} height={56} priority />
        <span>Log in</span>
      </Header>
      <Component {...pageProps} />
    </AppWrapper>
  )
}
