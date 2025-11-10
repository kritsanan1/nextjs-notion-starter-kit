import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from '@react-icons/all-files/fi/FiSun'

interface DarkModeToggleProps {
  className?: string
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check if dark mode is enabled in localStorage or system preference
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const isDark = storedTheme === 'dark' || (storedTheme === null && prefersDark)
    setIsDarkMode(isDark)
    setMounted(true)

    // Apply the theme
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) {
    return (
      <button
        className={`dark-mode-toggle ${className}`}
        aria-label="Toggle dark mode"
        disabled
      >
        <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={`dark-mode-toggle ${className}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <FiSun className="w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
      ) : (
        <FiMoon className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
      )}
    </button>
  )
}