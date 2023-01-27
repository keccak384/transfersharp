import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { AWS_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET_KEY } from '@/env'

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
})

export type Transaction = BaseTransaction | CompletedTransaction | AuthorizedTransaction

export type BaseTransaction = {
  id: string
  fromWallet: string
  fromPhoneNumber: string
  toPhoneNumber: string
}

// Receiver authorised transaction and logged in with a phone number
export type AuthorizedTransaction = BaseTransaction & {
  toWallet: string
}

// Sender performed actual transaction
export type CompletedTransaction = AuthorizedTransaction & {
  buyAmount: string
  sellAmount: string
  buyTokenAddress: string
  sellTokenAddress: string
  hash: string
}

export function isAuthorizedTransaction(transaction: Transaction): transaction is AuthorizedTransaction {
  return 'toWallet' in transaction
}

export function isCompletedTransaction(transaction: Transaction): transaction is CompletedTransaction {
  return 'hash' in transaction
}

export const getTransactionById = async (id: string): Promise<Transaction> => {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: id,
    })
  )

  const body = await response.Body?.transformToString()

  if (!body) {
    throw new Error('Invalid transaction')
  }

  return JSON.parse(body)
}

export const saveTransaction = async (transaction: Transaction) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: transaction.id,
      Body: JSON.stringify(transaction),
    })
  )
  return transaction
}
