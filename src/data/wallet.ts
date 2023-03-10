import { atom } from 'jotai'
import { atomWithDefault, RESET } from 'jotai/utils'
import { Magic } from 'magic-sdk'
import Web3 from 'web3'

import { MAGIC_PUBLIC_KEY } from '../env'

const createMagicClient = () => new Magic(MAGIC_PUBLIC_KEY)

/**
 * Magic doesn't work on the server. We use `atomWithDefault` to call it lazily
 * when the component is mounted on the client.
 */
const magicAtom = atomWithDefault(createMagicClient)

// Resettable top-level atom to refresh all other atoms and keep the client in sync
export const stateAtom = atom(
  (get) => get(magicAtom),
  (_, set, action) => (action === RESET ? set(magicAtom, createMagicClient()) : undefined)
)

// @ts-ignore types are not compatible, but that's what docs say
// https://magic.link/docs/auth/blockchains/ethereum/javascript#web3.js-2
export const web3Atom = atom((get) => new Web3(get(magicAtom).rpcProvider))

// https://magic.link/docs/auth/api-reference/client-side-sdks/web#isloggedin
export const isLoggedInAtom = atom(async (get) => await get(magicAtom).user.isLoggedIn())

// https://magic.link/docs/auth/api-reference/client-side-sdks/web#getmetadata
export const userDataAtom = atom(async (get) =>
  (await get(isLoggedInAtom)) ? await get(magicAtom).user.getMetadata() : null
)
