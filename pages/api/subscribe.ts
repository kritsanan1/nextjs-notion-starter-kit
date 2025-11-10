import type { NextApiRequest, NextApiResponse } from 'next'

type SubscribeResponse = {
  success?: boolean
  error?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubscribeResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  // Validate email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    // Integration options (uncomment the one you want to use):

    // ============================================================================
    // Option 1: Mailchimp
    // ============================================================================
    /*
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
    const MAILCHIMP_DC = process.env.MAILCHIMP_DC // e.g., 'us1'

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_DC) {
      throw new Error('Mailchimp environment variables not set')
    }

    const url = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.title === 'Member Exists') {
        return res.status(400).json({ error: 'You are already subscribed!' })
      }
      throw new Error(data.detail || 'Subscription failed')
    }
    */

    // ============================================================================
    // Option 2: ConvertKit
    // ============================================================================
    /*
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID

    if (!CONVERTKIT_API_KEY || !CONVERTKIT_FORM_ID) {
      throw new Error('ConvertKit environment variables not set')
    }

    const url = `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Subscription failed')
    }
    */

    // ============================================================================
    // Option 3: Buttondown
    // ============================================================================
    /*
    const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY

    if (!BUTTONDOWN_API_KEY) {
      throw new Error('Buttondown API key not set')
    }

    const url = 'https://api.buttondown.email/v1/subscribers'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 409) {
        return res.status(400).json({ error: 'You are already subscribed!' })
      }
      throw new Error(data.detail || 'Subscription failed')
    }
    */

    // ============================================================================
    // Option 4: Custom implementation (store in your own database)
    // ============================================================================
    /*
    // Example with a database (you'll need to set up your database first)
    import { createSubscriber } from '@/lib/db'
    
    await createSubscriber({
      email: email,
      subscribedAt: new Date(),
    })
    */

    // ============================================================================
    // Default: Log to console (for development/testing)
    // ============================================================================
    console.log(`Newsletter subscription request: ${email}`)
    
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
    })
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return res.status(500).json({
      error: error.message || 'An error occurred. Please try again later.',
    })
  }
}
