// pages/users/[uid].js

import { CompletedTransaction, getTransactionById, isCompletedTransaction } from '@/db/transactions'

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

  if (!isCompletedTransaction(transaction)) {
    return {
      redirect: {
        destination: `/send/${transaction.id}`,
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

export default function Completed({ transaction }: { transaction: CompletedTransaction }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Your transaction has completed</h2>
      <p>Your receiver ${transaction.toPhoneNumber} can now withdraw money! Enjoy fast transfers!</p>
    </div>
  )
}
