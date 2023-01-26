import * as fs from 'fs/promises'

export type Transaction = {
  id: string
  fromWallet: string
  fromPhoneNumber: string
  toPhoneNumber: string
  toWallet?: string
}

export const addTransaction = async (transaction: Transaction) => {
  await fs.writeFile(`/tmp/${transaction.id}.json`, JSON.stringify(transaction))
  return transaction
}

export const getTransactionById = async (id: string) => {
  try {
    return JSON.parse(await fs.readFile(`/tmp/${id}.json`, 'utf8'))
  } catch (e) {
    console.log(`Error while reading transactions: ${e}`)
    return null
  }
}
