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
  transaction.hash = req.body.hash

  await saveTransaction(transaction)

  const url = `https://${req.headers.host}/withdraw/${transaction.id}`

  await client.messages.create({
    from: TWILIO_PHONE,
    to: transaction.toPhoneNumber,
    body: `Hey, ${req.body.fromPhoneNumber} just sent you some money! Go to ${url} to withdraw!`,
  })

  res.status(200).json(transaction)
}
