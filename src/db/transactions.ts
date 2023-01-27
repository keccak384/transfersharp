import * as fs from 'fs/promises'

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
  return JSON.parse(await fs.readFile(`/tmp/${id}.json`, 'utf8'))
}

export const saveTransaction = async (transaction: Transaction) => {
  await fs.writeFile(`/tmp/${transaction.id}.json`, JSON.stringify(transaction))
  return transaction
}
