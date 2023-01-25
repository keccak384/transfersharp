// @todo schema validation
if (!process.env.NEXT_PUBLIC_MAGIC_PUB_KEY) {
  throw new Error('NEXT_PUBLIC_MAGIC_PUB_KEY is required')
}

/**
 * Environmental variables prefixed with NEXT_PUBLIC_ are exposed to the browser
 * You can set them in `.env.local`
 */
export const MAGIC_PUBLIC_KEY = process.env.NEXT_PUBLIC_MAGIC_PUB_KEY
