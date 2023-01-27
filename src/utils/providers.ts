import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/providers'

export enum TransactionState {
  Failed = 'Failed',
  New = 'New',
  Rejected = 'Rejected',
  Sending = 'Sending',
  Sent = 'Sent',
}

export async function sendTransaction(provider: any, transaction: TransactionRequest): Promise<TransactionState> {
  if (!provider) {
    return TransactionState.Failed
  }

  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value)
  }

  const signer = provider.getSigner()

  const txRes = await signer.sendTransaction(transaction)
  let receipt = null

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash)

      if (receipt === null) {
        continue
      }
    } catch (e) {
      console.log(`Receipt error:`, e)
      break
    }
  }

  if (receipt) {
    return TransactionState.Sent
  } else {
    return TransactionState.Failed
  }
}
