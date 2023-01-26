import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import Twilio from 'twilio'

import { saveTransaction, Transaction } from '@/db/transactions'
import { TWILIO_ACCOUNT_SID, TWILIO_PHONE, TWILIO_TOKEN } from '@/env'

const client = new Twilio.Twilio(TWILIO_ACCOUNT_SID, TWILIO_TOKEN)

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

  await saveTransaction(transaction)

  const url = `https://${req.headers.host}/receive/${transaction.id}`

  await client.messages.create({
    from: TWILIO_PHONE,
    to: req.body.toPhoneNumber,
    body: `Hey, ${req.body.fromPhoneNumber} wants to send you some money! Visit ${url} to accept the transaction!`,
  })

  res.status(201).json(transaction)
}
