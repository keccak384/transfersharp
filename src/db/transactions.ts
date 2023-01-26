<<<<<<< HEAD
import * as fs from 'fs/promises'
=======
import * as fs from 'fs'
>>>>>>> main

export type Transaction = {
  id: string
  fromWallet: string
  fromPhoneNumber: string
  toPhoneNumber: string
  toWallet?: string
}

export const addTransaction = async (transaction: Transaction) => {
<<<<<<< HEAD
  await fs.writeFile(`/tmp/${transaction.id}.json`, JSON.stringify(transaction))
=======
  fs.writeFileSync(`/tmp/${transaction.id}.json`, JSON.stringify(transaction))
>>>>>>> main
  return transaction
}

export const getTransactionById = async (id: string) => {
  try {
<<<<<<< HEAD
    return JSON.parse(await fs.readFile(`/tmp/${id}.json`, 'utf8'))
=======
    return JSON.parse(fs.readFileSync(`/tmp/${id}.json`, 'utf8'))
>>>>>>> main
  } catch (e) {
    console.log(`Error while reading transactions: ${e}`)
    return null
  }
}
