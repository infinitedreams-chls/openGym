/* Element.animate on the test clock. happy-dom 21 implements the Web Animations API, but its
   animations never finish under vi.useFakeTimers(), so a swipe-delete waits forever for the row
   collapse's onfinish (happy-dom 20 had no animate(), and use-swipe-row committed at once). This
   stand-in finishes after the animation's duration on whatever clock setTimeout is — the fake one
   in these tests — so the delete path runs as it does in a browser. Not a *.test.js file, so
   vitest does not run it on its own. */
import { afterAll, beforeAll } from 'vitest'

export function animateOnTestClock() {
  let real
  beforeAll(() => {
    real = Element.prototype.animate
    Element.prototype.animate = function (_keyframes, options) {
      const anim = {
        onfinish: null,
        cancel() { clearTimeout(timer) },
      }
      const ms = typeof options === 'number' ? options : options?.duration ?? 0
      const timer = setTimeout(() => anim.onfinish?.(), ms)
      return anim
    }
  })
  afterAll(() => { Element.prototype.animate = real })
}
