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
        destination: `/receive/${transaction.id}`,
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

export default function Withdraw({ transaction }: { transaction: CompletedTransaction }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>You received money from {transaction.fromPhoneNumber}</h2>
      <p>Click here to withdraw</p>
    </div>
  )
}
