import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

import { addTransaction, Transaction } from '@/db/transactions'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Transaction>) {
  if (req.method !== 'POST') {
    return
  }

  const transaction: Transaction = {
    id: randomUUID(),
    fromWallet: req.body.fromWallet,
    fromPhoneNumber: req.body.fromPhoneNumber,
    toPhoneNumber: req.body.toPhoneNumber,
  }

  res.status(201).json(await addTransaction(transaction))
}
