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

export default function Completed({ transaction }: { transaction: Transaction }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Your transaction has completed</h2>
      <p>Your receiver ${transaction.toPhoneNumber} can now withdraw money! Enjoy fast transfers!</p>
    </div>
  )
}
