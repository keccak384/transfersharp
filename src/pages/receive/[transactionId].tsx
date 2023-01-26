import { useAtomValue } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import ConnectWithPhoneDialog from '@/components/ConnectWithPhoneDialog'
import { SendButton } from '@/components/primitives'
import { stateAtom, userDataAtom } from '@/data/wallet'
import { getTransactionById, Transaction } from '@/db/transactions'

export async function getServerSideProps({ params: { transactionId } }: { params: { transactionId: string } }) {
  const transaction = await getTransactionById(transactionId)

  if (!transaction) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      transaction,
    },
  }
}

function ReceiveTransaction({ transaction }: { transaction: Transaction }) {
  const userData = useAtomValue(userDataAtom)
  const refreshState = useResetAtom(stateAtom)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const onConnected = () => {
    refreshState()
    // @todo notify backend that user has connected
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Pending transaction: {JSON.stringify(transaction)}</h2>
      {userData ? (
        <p>Connected</p>
      ) : (
        <SendButton as="a" href="#" onClick={() => setIsLoginModalOpen(true)}>
          Sign in to send
        </SendButton>
      )}
      <ConnectWithPhoneDialog
        isOpen={isLoginModalOpen}
        setIsOpen={(isOpen) => setIsLoginModalOpen(isOpen)}
        onConnected={onConnected}
      />
    </div>
  )
}

export default dynamic(() => Promise.resolve(ReceiveTransaction), {
  ssr: false,
})
