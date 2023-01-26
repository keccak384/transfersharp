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

export default function SendTransaction({ transaction }: { transaction: Transaction }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Pending transaction: {JSON.stringify(transaction)}</h2>
    </div>
  )
}
