import { atomWithStorage } from 'jotai/utils'

export const inputValueAtom = atomWithStorage('currencyInputValue', 1000)
export const outputValueAtom = atomWithStorage('currencyOutputValue', undefined)
