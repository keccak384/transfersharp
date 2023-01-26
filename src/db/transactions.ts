import * as fs from 'fs'

export type Transaction = {
  id: string
  fromWallet: string
  fromPhoneNumber: string
  toPhoneNumber: string
  toWallet?: string
}

export const addTransaction = async (transaction: Transaction) => {
  fs.writeFileSync(`/tmp/${transaction.id}.json`, JSON.stringify(transaction))
  return transaction
}

export const getTransactionById = async (id: string) => {
  try {
    return JSON.parse(fs.readFileSync(`/tmp/${id}.json`, 'utf8'))
  } catch (e) {
    console.log(`Error while reading transactions: ${e}`)
    return null
  }
}
