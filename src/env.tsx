const IS_SERVER = typeof window === 'undefined'

// @todo schema validation
if (!process.env.NEXT_PUBLIC_MAGIC_PUB_KEY) {
  throw new Error('NEXT_PUBLIC_MAGIC_PUB_KEY is required')
}

if (IS_SERVER && (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_TOKEN || !process.env.TWILIO_PHONE)) {
  throw new Error('TWILIO_ACCOUNT_SID, TWILIO_TOKEN and TWILIO_PHONE are required')
}

/**
 * Environmental variables prefixed with NEXT_PUBLIC_ are exposed to the browser
 * You can set them in `.env.local`
 */
export const MAGIC_PUBLIC_KEY = process.env.NEXT_PUBLIC_MAGIC_PUB_KEY

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_TOKEN = process.env.TWILIO_TOKEN
export const TWILIO_PHONE = process.env.TWILIO_PHONE
