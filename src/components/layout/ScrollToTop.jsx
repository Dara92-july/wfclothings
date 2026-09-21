import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Browsers remember the scroll offset of every history entry and re-apply it
// after the router swaps the page, which drops the shopper in the middle (or at
// the bottom) of the product detail page. Taking the restoration over makes the
// reset below always win.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

// Reset every element that can carry the page scroll offset.
const resetScroll = () => {
  window.scrollTo(0, 0)
  if (document.documentElement) document.documentElement.scrollTop = 0
  if (document.body) document.body.scrollTop = 0
}

const ScrollToTop = () => {
  const { pathname, search, hash, key } = useLocation()

  useLayoutEffect(() => {
    // Runs before the browser paints, so the page that was just opened is never
    // shown at the offset of the page the shopper came from.
    resetScroll()

    // Two frames after the commit: the first one catches the scroll the browser
    // re-applies once the new page is painted, the second one catches a layout
    // shift straight after that (images / reviews loading in).
    let secondFrame = 0
    const firstFrame = requestAnimationFrame(() => {
      resetScroll()
      secondFrame = requestAnimationFrame(resetScroll)
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [pathname, search, hash, key])

  return null
}

export default ScrollToTop