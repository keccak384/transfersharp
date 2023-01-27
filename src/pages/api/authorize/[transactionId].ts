import type { NextApiRequest, NextApiResponse } from 'next'
import Twilio from 'twilio'

import { AuthorizedTransaction, getTransactionById, saveTransaction } from '@/db/transactions'
import { TWILIO_ACCOUNT_SID, TWILIO_PHONE, TWILIO_TOKEN } from '@/env'

const client = new Twilio.Twilio(TWILIO_ACCOUNT_SID, TWILIO_TOKEN)

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthorizedTransaction>) {
  if (req.method !== 'POST') {
    return
  }

  const transaction = await getTransactionById(req.query.transactionId as string)
  const authorizedTransaction = {
    ...transaction,
    toWallet: req.body.toWallet,
  }

  await saveTransaction(authorizedTransaction)

  const url = `https://${req.headers.host}/send/${authorizedTransaction.id}`

  // In case we run out of quota, silently ignore failed messages. This is not production-ready.
  try {
    await client.messages.create({
      from: TWILIO_PHONE,
      to: authorizedTransaction.fromPhoneNumber,
      body: `Hey, ${authorizedTransaction.toPhoneNumber} accepted your invite! Go to ${url} to continue the transaction!`,
    })
  } catch (e) {
    console.log(e)
  }

  res.status(200).json(authorizedTransaction)
}
