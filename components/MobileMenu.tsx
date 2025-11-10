import { useState, useEffect } from 'react'
import { FiMenu } from '@react-icons/all-files/fi/FiMenu'
import { FiX } from '@react-icons/all-files/fi/FiX'
import { FiHome } from '@react-icons/all-files/fi/FiHome'
import { FiSearch } from '@react-icons/all-files/fi/FiSearch'
import Link from 'next/link'
import * as config from '@/lib/config'

interface MobileMenuProps {
  navigationLinks?: Array<{
    title: string
    pageId: string
    url?: string
  }>
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ navigationLinks = [] }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="mobile-menu-button fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-gray-800 dark:text-white" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-800 dark:text-white" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`mobile-menu-panel fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-6">
          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiHome className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            {config.isSearchEnabled && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  // Trigger search (you can integrate with your search functionality)
                  const searchButton = document.querySelector('.notion-search-button') as HTMLButtonElement
                  searchButton?.click()
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
              >
                <FiSearch className="w-5 h-5" />
                <span className="font-medium">Search</span>
              </button>
            )}

            {navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url || `/${link.pageId}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="font-medium">{link.title}</span>
              </Link>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {config.author}
            </p>
            {config.description && (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                {config.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-button,
          .mobile-menu-panel {
            display: none;
          }
        }
      `}</style>
    </>
  )
}