import { useState, useEffect } from 'react'
import { smoothScrollToTop } from '../../utils/scrollHelpers.js'
import './ScrollToTopButton.css'

const SCROLL_THRESHOLD = 300

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      setIsVisible(scrollY > SCROLL_THRESHOLD)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <button
      className="scroll-to-top-button"
      onClick={smoothScrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <svg
        className="scroll-to-top-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}

export default ScrollToTopButton
