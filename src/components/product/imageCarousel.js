// Pure helpers for the ProductCard front/back image carousel.

export const SWIPE_THRESHOLD = 40

export const wrapIndex = (index, total) => ((index % total) + total) % total

// Resolve the image a horizontal drag lands on. Swiping left shows the next
// image, swiping right the previous one, and both directions wrap around.
// The active index is returned unchanged when there is nothing to swipe to, or
// when the drag was shorter than the threshold (so a tap still opens the product).
export const getSwipedIndex = (activeIndex, distance, total, threshold = SWIPE_THRESHOLD) => {
  if (total < 2 || Math.abs(distance) < threshold) return activeIndex
  return wrapIndex(activeIndex + (distance < 0 ? 1 : -1), total)
}
