const IS_SERVER = typeof window === 'undefined'

// @todo schema validation
if (!process.env.NEXT_PUBLIC_MAGIC_PUB_KEY) {
  throw new Error('NEXT_PUBLIC_MAGIC_PUB_KEY is required')
}

if (IS_SERVER && (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_TOKEN || !process.env.TWILIO_PHONE)) {
  throw new Error('TWILIO_ACCOUNT_SID, TWILIO_TOKEN and TWILIO_PHONE are required')
}

if (IS_SERVER && (!process.env.FX_AWS_ACCESS_KEY || !process.env.FX_AWS_SECRET_KEY || !process.env.FX_AWS_REGION)) {
  throw new Error('FX_AWS_ACCESS_KEY, FX_AWS_SECRET_KEY and FX_AWS_REGION are required')
}

/**
 * Environmental variables prefixed with NEXT_PUBLIC_ are exposed to the browser
 * You can set them in `.env.local`
 */
export const MAGIC_PUBLIC_KEY = process.env.NEXT_PUBLIC_MAGIC_PUB_KEY

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string
export const TWILIO_TOKEN = process.env.TWILIO_TOKEN as string
export const TWILIO_PHONE = process.env.TWILIO_PHONE as string

export const AWS_ACCESS_KEY = process.env.FX_AWS_ACCESS_KEY as string
export const AWS_SECRET_KEY = process.env.FX_AWS_SECRET_KEY as string
export const AWS_REGION = process.env.FX_AWS_REGION as string
export const AWS_BUCKET_NAME = 'transfersharp'
