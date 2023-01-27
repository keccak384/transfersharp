import type { NextApiRequest, NextApiResponse } from 'next'
import Twilio from 'twilio'

import { CompletedTransaction, getTransactionById, isAuthorizedTransaction, saveTransaction } from '@/db/transactions'
import { TWILIO_ACCOUNT_SID, TWILIO_PHONE, TWILIO_TOKEN } from '@/env'

const client = new Twilio.Twilio(TWILIO_ACCOUNT_SID, TWILIO_TOKEN)

export default async function handler(req: NextApiRequest, res: NextApiResponse<CompletedTransaction>) {
  if (req.method !== 'POST') {
    return
  }

  const transaction = await getTransactionById(req.query.transactionId as string)

  if (!isAuthorizedTransaction(transaction)) {
    throw new Error('Receiver needs to authorize transaction before its performed.')
  }

  const completedTransaction = {
    ...transaction,
    hash: req.body.hash,
    buyAmount: req.body.buyAmount,
    sellAmount: req.body.sellAmount,
    buyTokenAddress: req.body.buyTokenAddress,
    sellTokenAddress: req.body.sellTokenAddress,
  }

  await saveTransaction(completedTransaction)

  const url = `https://${req.headers.host}/withdraw/${transaction.id}`

  // In case we run out of quota, silently ignore failed messages. This is not production-ready.
  try {
    await client.messages.create({
      from: TWILIO_PHONE,
      to: completedTransaction.toPhoneNumber,
      body: `Hey, ${completedTransaction.fromPhoneNumber} just sent you some money! Go to ${url} to withdraw!`,
    })
  } catch (e) {
    console.log(e)
  }

  res.status(200).json(completedTransaction)
}
