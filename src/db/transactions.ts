export type Transaction = {
  id: string
  fromWallet: string
  fromPhoneNumber: string
  toPhoneNumber: string
  toWallet?: string
}

// @todo replace this beautiful state-of-the-art in-memory database with something real
const transactions = new Map<string, Transaction>()

export const addTransaction = async (transaction: Transaction) => {
  transactions.set(transaction.id, transaction)
  return transaction
}

export const getTransactionById = async (id: string) => transactions.get(id)
