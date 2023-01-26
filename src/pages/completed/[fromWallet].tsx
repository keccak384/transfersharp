// pages/users/[uid].js
import { useRouter } from 'next/router'

export default function Completed() {
  const router = useRouter()
  const query = router.query

  const walletAddress = query.fromWallet as string

  return (
    <div style={{ padding: 40 }}>
      <h2>You've received money from {walletAddress}</h2>
    </div>
  )
}
