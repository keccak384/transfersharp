import { atomWithDefault } from 'jotai/utils'
import { Magic } from 'magic-sdk'

import { MAGIC_PUBLIC_KEY } from './env'

export const magicAtom = atomWithDefault(() => new Magic(MAGIC_PUBLIC_KEY))

export const isLoggedInAtom = atomWithDefault(async (get) => await get(magicAtom).user.isLoggedIn())
