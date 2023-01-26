import { styled } from '@stitches/react'
import { useAtom, useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

import ConnectWithPhoneDialog from '@/components/ConnectWithPhoneDialog'
import { loginModalAtom } from '@/data/modal'
import { isLoggedInAtom, stateAtom } from '@/data/wallet'

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
  const magic = useAtomValue(stateAtom)
  const refreshState = useResetAtom(stateAtom)
  const [isLoginModalOpen, setIsLoginModalOpen] = useAtom(loginModalAtom)

  return (
    <AppWrapper>
      <Header>
        <Link href="/">
          <Image src="/uPay.png" alt="13" width={56} height={56} priority />
        </Link>
        {isLoggedIn ? (
          <a
            href="#"
            onClick={async () => {
              await magic.user.logout()
              refreshState()
            }}
          >
            Log out
          </a>
        ) : (
          <>
            <a href="#" onClick={() => setIsLoginModalOpen(true)}>
              Log in
            </a>
          </>
        )}
      </Header>

      <Component {...pageProps} />

      <ConnectWithPhoneDialog
        isOpen={isLoginModalOpen}
        setIsOpen={(isOpen) => setIsLoginModalOpen(isOpen)}
        onConnected={refreshState}
      />
    </AppWrapper>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
})
