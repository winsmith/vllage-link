import { animate, createTimer, stagger, steps, utils } from 'animejs'
import { createRandomFace, drawFace } from './face.js'
import { paintFace } from './hexgrid.js'

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Gives a set of hex cells random faces and brings them to life: they build in
 * the first time `root` scrolls into view, then blink, glance and re-roll on click.
 * `delayFor(cell)` sets each face's build-in delay. Returns `{ visible }`,
 * which stays current while `root` enters and leaves the viewport.
 */
export function bringToLife(cells, root, delayFor) {
  const state = { visible: false, started: false }

  for (const cell of cells) {
    cell.timers = []
    cell.busy = false
    cell.drawn = drawFace(createRandomFace())
    const rects = paintFace(cell, cell.drawn)
    if (!reducedMotion) rects.forEach((r) => (r.style.opacity = 0))
    cell.group.addEventListener('click', () => reroll(cell))
  }

  if (reducedMotion) return state

  // Animations only run while their faces are on screen; anime.js also pauses on hidden tabs.
  new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting
    if (state.visible && !state.started) {
      state.started = true
      for (const cell of cells) buildIn(cell, delayFor(cell)).then(() => startLife(cell))
    }
  }).observe(root)

  function buildIn(cell, delay) {
    const rects = [...cell.pixels.children, ...cell.eyes.children].filter((r) => r !== cell.scanRect)
    cell.busy = true
    return new Promise((resolve) => {
      animate(rects, {
        opacity: [0, 1],
        duration: 90,
        ease: 'linear',
        delay: stagger(9, { start: delay, from: 'random' }),
        onComplete: () => {
          cell.busy = false
          resolve()
        },
      })
    })
  }

  // Runs `fn` again and again, a random 'min'–'max' ms apart; skips runs while off screen.
  function every(cell, min, max, fn) {
    const timer = createTimer({
      duration: utils.random(min, max),
      onComplete: () => {
        cell.timers = cell.timers.filter((t) => t !== timer)
        if (state.visible) fn()
        every(cell, min, max, fn)
      },
    })
    cell.timers.push(timer)
  }

  function startLife(cell) {
    if (cell.eyeRects.length) scheduleBlink(cell)
    if (cell.drawn.canGlance) scheduleGlance(cell)
    if (cell.scanRect) scheduleScan(cell)
  }

  function stopLife(cell) {
    cell.timers.forEach((t) => t.cancel())
    cell.timers = []
    utils.remove([...cell.eyeRects, cell.eyes, cell.scanRect].filter(Boolean))
  }

  // Blinks: every face on its own clock, 2–9 s apart, sometimes twice in a row.
  function scheduleBlink(cell) {
    every(cell, 2000, 9000, () => {
      const twice = utils.random(0, 1, 2) < 0.15
      const close = [
        { to: 0, duration: 30 },
        { to: 0, duration: 110 },
        { to: 1, duration: 30 },
      ]
      animate(cell.eyeRects, {
        opacity: twice ? [...close, { to: 1, duration: 120 }, ...close] : close,
        ease: 'linear',
      })
    })
  }

  // Glances: now and then the eyes look one pixel to the side.
  function scheduleGlance(cell) {
    every(cell, 6000, 20000, () => {
      const dir = utils.randomPick([-1, 1])
      animate(cell.eyes, {
        translateX: [
          { to: dir, duration: 1 },
          { to: dir, duration: utils.random(600, 1500) },
          { to: 0, duration: 1 },
        ],
        ease: 'linear',
      })
    })
  }

  // Visors: a bright pixel column sweeps across in eight steps.
  function scheduleScan(cell) {
    every(cell, 3000, 10000, () => {
      animate(cell.scanRect, {
        x: [3, 12],
        opacity: [{ to: 1, duration: 1 }, { to: 1, duration: 598 }, { to: 0, duration: 1 }],
        duration: 600,
        ease: steps(9),
      })
    })
  }

  // Re-roll: the face dissolves pixel by pixel and a new one builds in.
  function reroll(cell) {
    if (reducedMotion) {
      cell.drawn = drawFace(createRandomFace())
      paintFace(cell, cell.drawn)
      return
    }
    if (cell.busy) return
    cell.busy = true
    stopLife(cell)
    const old = [...cell.pixels.children, ...cell.eyes.children]
    animate(old, {
      opacity: 0,
      duration: 70,
      ease: 'linear',
      delay: stagger(5, { from: 'random' }),
      onComplete: () => {
        cell.drawn = drawFace(createRandomFace())
        paintFace(cell, cell.drawn).forEach((r) => (r.style.opacity = 0))
        buildIn(cell, 60).then(() => startLife(cell))
      },
    })
  }

  return state
}
