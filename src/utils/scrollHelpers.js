/** Smooth scrolling helpers */

export function smoothScrollToId(id, offset = 80) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

export function smoothScrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function preferReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
