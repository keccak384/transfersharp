import type { NextApiRequest, NextApiResponse } from 'next'
import Twilio from 'twilio'

import { getTransactionById, saveTransaction, Transaction } from '@/db/transactions'
import { TWILIO_ACCOUNT_SID, TWILIO_PHONE, TWILIO_TOKEN } from '@/env'

const client = new Twilio.Twilio(TWILIO_ACCOUNT_SID, TWILIO_TOKEN)

export default async function handler(req: NextApiRequest, res: NextApiResponse<Transaction>) {
  if (req.method !== 'POST') {
    return
  }

  const transaction = await getTransactionById(req.query.transactionId as string)
  transaction.toWallet = req.body.toWallet

  await saveTransaction(transaction)

  const url = `https://${req.headers.host}/send/${transaction.id}`

  await client.messages.create({
    from: TWILIO_PHONE,
    to: transaction.fromPhoneNumber,
    body: `Hey, ${req.body.toPhoneNumber} accepted your invite! Go to ${url} to continue the transaction!`,
  })

  res.status(200).json(transaction)
}
