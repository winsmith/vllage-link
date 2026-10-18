import { animate, createTimer, steps, utils, svg } from 'animejs'
import { buildHexGrid, hexDistance, createLine, LINE_DASH } from './hexgrid.js'
import { bringToLife, reducedMotion } from './life.js'
import { RELATIONSHIP_LABELS } from './traits.js'

const RADIUS = 4
const MAX_LINKS = 2

/**
 * Starts the hero: a hexagon of random pixel faces that build in, blink,
 * glance, re-roll on click and get connected by relationship lines.
 * `root` holds an <svg> and a `.rel-labels` overlay for the line labels.
 */
export function startHero(root) {
  const svgEl = root.querySelector('svg')
  const labels = root.querySelector('.rel-labels')
  const grid = buildHexGrid(svgEl, RADIUS, 'hexclip-hero')
  const { cells } = grid

  // Build-in: a ripple from the centre outwards, each face assembling pixel by pixel.
  const state = bringToLife(cells, root, (cell) => 250 + cell.distance * 220 + utils.random(0, 160))
  if (reducedMotion) return
  createTimer({ duration: 2600, onComplete: () => scheduleLink() })

  // Relationship lines: two faces a few hexagons apart get connected and labelled.
  let activeLinks = 0
  function scheduleLink() {
    createTimer({
      duration: utils.random(3000, 5000),
      onComplete: () => {
        if (state.visible && activeLinks < MAX_LINKS) link()
        scheduleLink()
      },
    })
  }

  function link() {
    const free = cells.filter((c) => !c.busy && !c.group.classList.contains('is-linked'))
    const a = utils.randomPick(free)
    if (!a) return
    const partners = free.filter((c) => c !== a && hexDistance(a, c) >= 2 && hexDistance(a, c) <= 4)
    const b = utils.randomPick(partners)
    if (!b) return

    activeLinks++
    a.group.classList.add('is-linked')
    b.group.classList.add('is-linked')
    const { path, maskPath, ends, mid, remove } = createLine(grid.links, a, b)
    const drawable = svg.createDrawable(maskPath)
    // The dashes march from the first person towards the second for as long as the line lives.
    const period = LINE_DASH[0] + LINE_DASH[1]
    const march = animate(path, { strokeDashoffset: [0, -period], duration: 450, ease: 'linear', loop: true })

    const label = document.createElement('span')
    label.className = 'rel-label'
    label.textContent = utils.randomPick(RELATIONSHIP_LABELS)
    label.style.left = `${(mid.x / grid.width) * 100}%`
    label.style.top = `${(mid.y / grid.height) * 100}%`
    label.style.opacity = 0
    labels.append(label)

    animate(ends, { opacity: [0, 1], duration: 1, ease: 'linear' })
    animate(drawable, {
      draw: ['0 0', '0 1'],
      duration: 700,
      ease: 'inOut(2)',
      onComplete: () => {
        animate(label, { opacity: [0, 1], duration: 160, ease: steps(4) })
        createTimer({
          duration: 2600,
          onComplete: () => {
            animate(label, { opacity: 0, duration: 160, ease: steps(4) })
            animate(ends, { opacity: 0, duration: 1, delay: 500, ease: 'linear' })
            animate(drawable, {
              draw: '1 1',
              duration: 500,
              ease: 'inOut(2)',
              onComplete: () => {
                march.cancel()
                remove()
                label.remove()
                a.group.classList.remove('is-linked')
                b.group.classList.remove('is-linked')
                activeLinks--
              },
            })
          },
        })
      },
    })
  }
}
