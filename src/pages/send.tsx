import * as Label from '@radix-ui/react-label'
import BigNumber from 'bignumber.js'
import { useAtomValue, useSetAtom } from 'jotai'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import qs from 'query-string'
import { FormEvent, Suspense, useState } from 'react'
import { useEffect } from 'react'
import Web3 from 'web3'

import {
  Button,
  Input,
  InputWrapper,
  InviteButton,
  PageWrapper,
  PendingButton,
  SmallText,
  StyledSendForm,
} from '@/components/primitives'
import SwapForm from '@/components/SwapForm'
import TransactionDetails from '@/components/TransactionDetails'
import { loginModalAtom } from '@/data/modal'
import { isLoggedInAtom, stateAtom, userDataAtom } from '@/data/wallet'
import type { Transaction } from '@/db/transactions'

import { inputValueAtom } from '../data/swap'

function LoginButton({ handleLogin }: { handleLogin: () => void }) {
  const isLoggedIn = useAtomValue(isLoggedInAtom)

  return isLoggedIn ? (
    <PendingButton>Send</PendingButton>
  ) : (
    <Button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleLogin()
      }}
    >
      Sign in to send
    </Button>
  )
}

function SendForm() {
  const userData = useAtomValue(userDataAtom)
  const setIsLoginModalOpen = useSetAtom(loginModalAtom)
  const router = useRouter()
  const magic = useAtomValue(stateAtom)
  const [inputValue, setInputValue] = useAtom(inputValueAtom)

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userData) {
      throw new Error('Not authenticated, please log in first')
    }
    const form = new FormData(e.currentTarget)
    const response = await fetch(`/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromWallet: userData.publicAddress,
        fromPhoneNumber: userData.phoneNumber,
        toPhoneNumber: form.get('toPhoneNumber')?.toString(),
      }),
    })
    if (response.status !== 201) {
      throw new Error('Error while creating transaction, please try again.')
    }
    const data = (await response.json()) as Transaction
    router.push(`/send/${data.id}`)
  }

  const [phoneNumber, setPhoneNumber] = useState('')
  const onPhoneNumberChange = (e: FormEvent<HTMLInputElement>) => {
    setPhoneNumber(e.currentTarget.value)
  }

  // @todo better validation
  const isValidPhoneNumber = phoneNumber.length !== 0

  const [address, setUserAddress] = useState('')

  useEffect(() => {
    async function getUserData() {
      magic.user.isLoggedIn().then((isLoggedIn) => {
        if (isLoggedIn) {
          magic.user.getMetadata().then((metadata) => {
            setUserAddress(metadata.publicAddress)
          })
        }
      })
    }
    getUserData()
  })

  const SendTransaction = async () => {
    const web3 = new Web3(magic.rpcProvider)
    const fromAddress = (await web3.eth.getAccounts())[0]

    const destination = fromAddress
    const amount = web3.utils.toWei('0.001') // Convert 1 ether to wei

    // Submit transaction to the blockchain and wait for it to be mined
    const receipt = await web3.eth.sendTransaction({
      from: fromAddress,
      to: destination,
      value: amount,
    })
    return receipt
  }

  const SwapTokens = async () => {
    const web3 = new Web3(magic.rpcProvider)
    const fromAddress = (await web3.eth.getAccounts())[0]
    console.log(inputValue)

    const erc20abi = [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_from',
            type: 'address',
          },
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ]

    const ZERO_EX_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'
    const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

    // Selling 100 DAI for ETH.
    const params = {
      sellToken: 'USDC',
      buyToken: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c',
      // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
      sellAmount: inputValue * 10 ** 6,
      takerAddress: fromAddress,
    }

    const ERC20TokenContract = new web3.eth.Contract(erc20abi, USDC_ADDRESS)
    const ApprovalAmount = params.sellAmount

    console.log(ApprovalAmount)

    const currentAllowance = new BigNumber(
      ERC20TokenContract.methods.allowance(params.takerAddress, ZERO_EX_ADDRESS).call()
    )
    if (currentAllowance.isLessThan(params.sellAmount)) {
      const tx = await ERC20TokenContract.methods
        .approve(ZERO_EX_ADDRESS, ApprovalAmount)
        .send({ from: fromAddress })
        .then((tx) => {
          console.log('tx: ', tx)
        })
    }

    // Fetch the swap quote.
    const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`)

    console.log('Quote: ', response)

    // Perform the swap.
    await web3.eth.sendTransaction(await response.json())
  }

  return (
    <PageWrapper>
      {/* This button approves USDC for the input amount and swaps it for  EUROC to self */}
      <Button onClick={SwapTokens}>Approve and Swap</Button>
      {/* This button sends EUROC to self */}
      <Button onClick={SendTransaction}>Send 001 ETH to self (proof of send)</Button>

      {/* Both of these can be wrapped together in the functions above since they don't need to be signed */}

      {/* I'm sory about the code quality :( */}

      <StyledSendForm onSubmit={handleSend}>
        <SwapForm />
        {userData && (
          <InputWrapper>
            <Label.Root htmlFor="toPhoneNumber">To</Label.Root>
            <Input
              onChange={onPhoneNumberChange}
              value={phoneNumber}
              type="tel"
              name="toPhoneNumber"
              placeholder="+1 800 888 8888"
            />
            <SmallText>
              {`You can send to any phone number. We'll text them an invite to join to receive the funds.`}
            </SmallText>
            {isValidPhoneNumber && <InviteButton>Invite via SMS</InviteButton>}
          </InputWrapper>
        )}
        <TransactionDetails />
        <Suspense fallback={<Button disabled>...</Button>}>
          <LoginButton handleLogin={() => setIsLoginModalOpen(true)} />
        </Suspense>
      </StyledSendForm>
    </PageWrapper>
  )
}

function Send() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SendForm />
    </Suspense>
  )
}

/**
 * Magic doesn't work with SSR. The following code will prevent the page from being
 * rendered on the server.
 */
export default dynamic(() => Promise.resolve(Send), {
  ssr: false,
})
