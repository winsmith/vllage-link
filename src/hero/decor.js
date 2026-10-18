import { utils } from 'animejs'
import { buildHexGrid, keepCells } from './hexgrid.js'
import { bringToLife } from './life.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * Fills every [data-faces="n"] element with a small fragment of the hero's
 * honeycomb: n faces (1–7) that touch each other, alive like the hero's.
 * With data-shape="row" the faces sit side by side in one row (at most 3),
 * which fits into a section's padding.
 */
export function startDecorations() {
  document.querySelectorAll('[data-faces]').forEach((root, i) => {
    const count = Math.min(7, Math.max(1, Number(root.dataset.faces) || 1))
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.setAttribute('class', 'pixel block h-auto w-full')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('focusable', 'false')
    root.append(svg)

    const { cells } = buildHexGrid(svg, 1, `hexclip-decor-${i}`)
    const centre = cells.find((c) => c.distance === 0)
    const keep =
      root.dataset.shape === 'row'
        ? cells.filter((c) => c.r === 0).slice(0, count)
        : [centre, ...utils.shuffle(cells.filter((c) => c !== centre)).slice(0, count - 1)]
    keepCells(svg, cells, keep)

    bringToLife(keep, root, (cell) => 150 + cell.distance * 200 + utils.random(0, 200))
  })
}
