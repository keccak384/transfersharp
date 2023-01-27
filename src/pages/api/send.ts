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

  // In case we run out of quota, silently ignore failed messages. This is not production-ready.
  try {
    await client.messages.create({
      from: TWILIO_PHONE,
      to: transaction.toPhoneNumber,
      body: `Hey, ${transaction.fromPhoneNumber} wants to send you some money! Visit ${url} to accept the transaction!`,
    })
  } catch (e) {
    console.log(e)
  }

  res.status(201).json(transaction)
}
