/** Smooth scrolling helpers */

// Global scroll lock to prevent scroll-spy from overriding manual clicks
let isScrollLocked = false
let scrollLockTimer = null

/**
 * Temporarily disable scroll-spy to allow manual scroll
 * @param {number} duration - How long to lock scroll (ms)
 */
export function lockScroll(duration = 1200) {
  isScrollLocked = true
  
  // Clear any existing timer
  if (scrollLockTimer) {
    clearTimeout(scrollLockTimer)
  }
  
  // Unlock after duration
  scrollLockTimer = setTimeout(() => {
    isScrollLocked = false
    scrollLockTimer = null
  }, duration)
}

/**
 * Check if scroll is currently locked
 */
export function isScrollLocked_() {
  return isScrollLocked
}

/**
 * Manually unlock scroll (for programmatic release)
 */
export function unlockScroll() {
  isScrollLocked = false
  if (scrollLockTimer) {
    clearTimeout(scrollLockTimer)
    scrollLockTimer = null
  }
}

export function smoothScrollToId(id, offset = 80) {
  const el = document.getElementById(id)
  if (!el) {
    console.warn(`[scrollHelpers] Element with ID "${id}" not found in DOM`)
    return
  }
  
  // Engage scroll lock during manual scroll
  lockScroll(1200)
  
  // Calculate target position
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  
  // Update hash immediately
  window.history.replaceState(null, '', `#${id}`)
  
  // Perform smooth scroll
  window.scrollTo({ top, behavior: 'smooth' })
  
  // After scroll completes, fire one scroll-spy check to ensure correct section is active
  // Use a longer timeout to wait for smooth scroll to finish (~1000ms)
  setTimeout(() => {
    // Scroll spy will take over from here
  }, 1000)
}

export function smoothScrollToTop() {
  lockScroll(1200)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function preferReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Auto-scroll to a section based on URL hash on page load.
 * Waits for DOM elements to be available before scrolling.
 */
export function scrollToHashOnLoad() {
  if (!window.location.hash) return

  const id = window.location.hash.slice(1) // Remove '#' prefix
  const el = document.getElementById(id)
  
  if (el) {
    // Use small delay to ensure DOM is fully ready
    setTimeout(() => {
      lockScroll(1200)
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }, 100)
  } else {
    // Retry if element not found
    setTimeout(() => {
      const retryEl = document.getElementById(id)
      if (retryEl) {
        lockScroll(1200)
        const offset = 80
        const top = retryEl.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 200)
  }
}

/**
 * Set up automatic hash updates as user scrolls between sections.
 * Respects scroll lock to prevent overriding manual scrolls.
 * @param {Array<{id: string, title: string}>} toc - Table of contents entries
 * @param {Function} onSectionActive - Callback to update active section
 */
export function setupScrollSpyHashUpdates(toc, onSectionActive) {
  if (!toc || toc.length === 0) {
    console.warn('[setupScrollSpyHashUpdates] TOC is empty or missing')
    return
  }

  const handleScroll = () => {
    // CRITICAL: Do NOT update if scroll is locked (manual scroll in progress)
    if (isScrollLocked) {
      return
    }

    let activeId = null
    const scrollOffset = 120

    // Find which section is currently in view
    for (const entry of toc) {
      const el = document.getElementById(entry.id)
      if (!el) {
        console.debug(`[setupScrollSpyHashUpdates] Section "${entry.id}" not found in DOM`)
        continue
      }

      const rect = el.getBoundingClientRect()
      // Section is in view if its top is above the fold (with offset)
      if (rect.top <= scrollOffset) {
        activeId = entry.id
      }
    }

    // Only update if we found a section AND it's different from current hash
    if (activeId) {
      const currentHash = window.location.hash.slice(1)
      if (currentHash !== activeId) {
        window.history.replaceState(null, '', `#${activeId}`)
        if (onSectionActive) {
          onSectionActive(activeId)
        }
      }
    }
  }

  // Debounce scroll events for performance
  let scrollTimeout
  const debouncedHandleScroll = () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(handleScroll, 100)
  }

  window.addEventListener('scroll', debouncedHandleScroll, { passive: true })

  // Call once on setup to establish initial state
  handleScroll()

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', debouncedHandleScroll)
    clearTimeout(scrollTimeout)
    unlockScroll()
  }
}
