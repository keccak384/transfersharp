import { styled } from '@stitches/react'
import { useAtomValue } from 'jotai'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { isLoggedInAtom } from '@/data/wallet'

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

function App({ Component, pageProps }: AppProps) {
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  return (
    <AppWrapper>
      <Header>
        <Image src="/uPay.png" alt="13" width={56} height={56} priority />
        {isLoggedIn ? <a>Log out</a> : <a>Log in</a>}
      </Header>
      <Component {...pageProps} />
    </AppWrapper>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
})
