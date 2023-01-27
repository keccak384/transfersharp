import { styled } from '@stitches/react'
import { useAtom, useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Web3 from 'web3'

import ConnectWithPhoneDialog from '@/components/ConnectWithPhoneDialog'
import { loginModalAtom } from '@/data/modal'
import { isLoggedInAtom, stateAtom } from '@/data/wallet'

import { FlexColumn, FlexRowFixed, SmallText } from '../components/primitives'

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

const erc20abi = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
]

function App({ Component, pageProps }: AppProps) {
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const magic = useAtomValue(stateAtom)
  const refreshState = useResetAtom(stateAtom)
  const [isLoginModalOpen, setIsLoginModalOpen] = useAtom(loginModalAtom)

  const [address, setUserAddress] = useState('')
  const [number, setUserNumber] = useState('')
  const [ETHbalance, setUserETHbalance] = useState('')
  const [USDbalance, setUserUSDbalance] = useState('')
  const [EURbalance, setUserEURBalance] = useState('')

  useEffect(() => {
    async function getUserData() {
      magic.user.isLoggedIn().then((isLoggedIn) => {
        if (isLoggedIn) {
          magic.user.getMetadata().then((metadata) => {
            setUserAddress(metadata.publicAddress)
            setUserNumber(metadata.phoneNumber)
          })
        }
      })
    }
    getUserData()
  })

  const getBalances = async () => {
    const web3 = new Web3(magic.rpcProvider)
    const address = (await web3.eth.getAccounts())[0]
    const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    const EUR_ADDRESS = '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c'

    const ETHbalance = web3.utils.fromWei(
      await web3.eth.getBalance(address) // Balance is in wei
    )
    setUserETHbalance(ETHbalance)

    const EURcontract = new web3.eth.Contract(erc20abi, EUR_ADDRESS)

    EURcontract.methods.balanceOf(address).call((error, balance) => {
      console.log(web3.utils.fromWei(balance) + ' EUR')
      const balanceInWei = web3.utils.fromWei(balance)
      setUserEURBalance(balanceInWei)
    })

    const USDcontract = new web3.eth.Contract(erc20abi, USDC_ADDRESS)

    USDcontract.methods.balanceOf(address).call((error, balance) => {
      console.log(web3.utils.fromWei(balance) + ' USD')
      const balanceInWei = web3.utils.fromWei(balance)
      setUserUSDBalance(balanceInWei)
    })
  }

  getBalances()

  return (
    <AppWrapper>
      <Header>
        <Link href="/">
          <Image src="/uPay.png" alt="13" width={56} height={56} priority />
        </Link>
        {isLoggedIn ? (
          <FlexRowFixed>
            <FlexColumn>
              <a
                href="#"
                onClick={async () => {
                  await magic.user.logout()
                  refreshState()
                }}
              >
                Log out
              </a>
              <SmallText css={{ color: '$gray12' }}>{number}</SmallText>
              <SmallText css={{ color: '$gray8' }}>{address}</SmallText>
              <SmallText css={{ color: '$gray8' }}>{ETHbalance} ETH</SmallText>
              <SmallText css={{ color: '$gray8' }}>${USDbalance} USDC</SmallText>
              <SmallText css={{ color: '$gray8' }}>€{EURbalance} EUROC</SmallText>
            </FlexColumn>
          </FlexRowFixed>
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
