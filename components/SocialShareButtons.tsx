import { useState } from 'react'
import { FiTwitter } from '@react-icons/all-files/fi/FiTwitter'
import { FiFacebook } from '@react-icons/all-files/fi/FiFacebook'
import { FiLinkedin } from '@react-icons/all-files/fi/FiLinkedin'
import { FiLink } from '@react-icons/all-files/fi/FiLink'
import { FiShare2 } from '@react-icons/all-files/fi/FiShare2'

interface SocialShareButtonsProps {
  title: string
  url: string
  className?: string
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ 
  title, 
  url, 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const shareOptions = [
    {
      name: 'Twitter',
      icon: FiTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}\u0026url=${encodeURIComponent(url)}`,
      color: '#1DA1F2'
    },
    {
      name: 'Facebook',
      icon: FiFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: '#4267B2'
    },
    {
      name: 'LinkedIn',
      icon: FiLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: '#0077B5'
    }
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleShare = async (shareUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
          text: `Check out this article: ${title}`
        })
      } catch (err) {
        console.log('Error sharing:', err)
        window.open(shareUrl, '_blank', 'noopener,noreferrer')
      }
    } else {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={`social-share-buttons ${className}`}>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          aria-label="Share this article"
        >
          <FiShare2 className="w-4 h-4" />
          Share
        </button>

        {showMenu \u0026\u0026 (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-1">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    handleShare(option.url)
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <option.icon 
                    className="w-4 h-4" 
                    style={{ color: option.color }}
                  />
                  {option.name}
                </button>
              ))}
              
              <button
                onClick={() => {
                  copyToClipboard()
                  setShowMenu(false)
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
              >
                <FiLink className={`w-4 h-4 ${copied ? 'text-green-600' : 'text-gray-600'}`} />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}