import * as fs from 'fs/promises'

export type Transaction = {
  id: string
  fromWallet: string
  fromPhoneNumber: string
  toPhoneNumber: string
  toWallet?: string
}

export const getTransactionById = async (id: string): Promise<Transaction> => {
  return JSON.parse(await fs.readFile(`/tmp/${id}.json`, 'utf8'))
}

export const saveTransaction = async (transaction: Transaction) => {
  await fs.writeFile(`/tmp/${transaction.id}.json`, JSON.stringify(transaction))
  return transaction
}
