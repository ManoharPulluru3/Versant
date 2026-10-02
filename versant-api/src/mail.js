import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

function fail(message) {
  const error = new Error(message)
  error.status = 422
  throw error
}

export async function sendResetCode({ to, name, code }) {
  const region = process.env.AWS_REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const from = process.env.SES_FROM_EMAIL
  if (!region || !accessKeyId || !secretAccessKey || !from) {
    fail('Password reset email is not configured')
  }

  const first = String(name ?? '').trim().split(/\s+/)[0]
  const text = [
    first ? `Hello ${first},` : 'Hello,',
    '',
    `Your ElytEdu password reset code is ${code}.`,
    'It expires in 15 minutes.',
    '',
    'If you did not ask to reset your password, you can ignore this email.',
  ].join('\n')

  const client = new SESClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  })

  try {
    await client.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: 'Your ElytEdu password reset code', Charset: 'UTF-8' },
          Body: { Text: { Data: text, Charset: 'UTF-8' } },
        },
      }),
    )
  } catch (cause) {
    console.error('SES send failed', cause?.name || 'Error')
    fail('Could not send the reset email. Try again in a minute.')
  }
}
