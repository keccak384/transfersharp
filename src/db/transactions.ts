import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { AWS_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET_KEY } from '@/env'

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
})

export type Transaction = {
  id: string
  fromWallet: string
  fromPhoneNumber: string
  toPhoneNumber: string

  // This will be present once receiver authorised transaction and logged in with a phone number
  toWallet?: string

  // This will be present once transaction is completed and confirmed on the blockchain
  hash?: string
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
    throw new Error('Error retrieving transaction.')
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
