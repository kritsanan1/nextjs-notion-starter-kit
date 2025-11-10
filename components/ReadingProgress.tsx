import { useEffect, useState } from 'react'

interface ReadingProgressProps {
  targetSelector?: string
  height?: string
  color?: string
  backgroundColor?: string
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  targetSelector = 'article',
  height = '4px',
  color = '#3b82f6',
  backgroundColor = '#e5e7eb'
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const target = document.querySelector(targetSelector)
      if (!target) return

      const targetTop = target.getBoundingClientRect().top + window.scrollY
      const targetHeight = target.clientHeight
      const windowHeight = window.innerHeight
      
      const scrollableDistance = targetHeight - windowHeight
      const scrolledDistance = window.scrollY - targetTop
      
      let progressPercentage = (scrolledDistance / scrollableDistance) * 100
      
      // Clamp the progress between 0 and 100
      progressPercentage = Math.max(0, Math.min(100, progressPercentage))
      
      setProgress(progressPercentage)
    }

    const handleScroll = () => {
      requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [targetSelector])

  return (
    <div
      className="reading-progress-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height,
        backgroundColor,
        zIndex: 9999,
        transform: progress \u003e 0 ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease'
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: color,
          transition: 'width 0.1s ease-out'
        }}
      />
    </div>
  )
}