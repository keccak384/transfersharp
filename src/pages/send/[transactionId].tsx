import { getTransactionById, Transaction } from '@/db/transactions'

export async function getServerSideProps({ params: { transactionId } }: { params: { transactionId: string } }) {
  const transcation = await getTransactionById(transactionId)

  if (!transcation) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      transcation,
    },
  }
}

export default function SendTransaction({ transaction }: { transaction: Transaction }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>Pending transaction: {transaction.id}</h2>
    </div>
  )
}
