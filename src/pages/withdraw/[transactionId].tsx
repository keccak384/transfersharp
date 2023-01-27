// pages/users/[uid].js

import { getTransactionById, Transaction } from '@/db/transactions'

export async function getServerSideProps({ params: { transactionId } }: { params: { transactionId: string } }) {
  const transaction = await getTransactionById(transactionId)

  if (!transaction || !transaction.hash) {
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

export default function Withdraw({ transaction }: { transaction: Transaction }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>You received money from {transaction.fromPhoneNumber}</h2>
      <p>Click here to withdraw</p>
    </div>
  )
}
