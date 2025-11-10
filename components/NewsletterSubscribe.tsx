import { useState, FormEvent } from 'react'
import { FiMail } from '@react-icons/all-files/fi/FiMail'
import { FiCheck } from '@react-icons/all-files/fi/FiCheck'
import { FiAlertCircle } from '@react-icons/all-files/fi/FiAlertCircle'

interface NewsletterSubscribeProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  className?: string
}

export const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({
  title = 'Subscribe to Newsletter',
  description = 'Get the latest articles and updates delivered to your inbox.',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  className = ''
}) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      // You can integrate with your email service provider here
      // Examples: Mailchimp, ConvertKit, Buttondown, etc.
      
      // For now, we'll simulate an API call
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you for subscribing!')
        setEmail('')
        
        // Track subscription event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'newsletter_subscribe', {
            method: 'email'
          })
        }
      } else {
        const data = await response.json()
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
      console.error('Newsletter subscription error:', error)
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      if (status !== 'success') {
        setStatus('idle')
        setMessage('')
      }
    }, 5000)
  }

  return (
    <div className={`newsletter-subscribe ${className}`}>
      <div className="newsletter-content max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FiMail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {status === 'success' && <FiCheck className="w-5 h-5" />}
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : buttonText}
          </button>

          {message && (
            <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
              status === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }`}>
              {status === 'success' ? (
                <FiCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span>{message}</span>
            </div>
          )}
        </form>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  )
}

// TypeScript declaration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}