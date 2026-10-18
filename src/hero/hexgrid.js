import { FACE_W, FACE_H } from './face.js'

const SVG_NS = 'http://www.w3.org/2000/svg'

// Gap between neighbouring hexagons, in face pixels.
const GAP = 1.5
// Pointy-top hexagons: neighbours in a row are one width apart, rows are three
// quarters of a height apart and shifted by half a width against each other.
const PITCH_X = FACE_W + GAP
const PITCH_Y = FACE_H * 0.75 + GAP * 0.866
const PAD = 2

export const HEX_POINTS = [
  [FACE_W / 2, 0],
  [FACE_W, FACE_H / 4],
  [FACE_W, (FACE_H * 3) / 4],
  [FACE_W / 2, FACE_H],
  [0, (FACE_H * 3) / 4],
  [0, FACE_H / 4],
]
  .map((p) => p.join(','))
  .join(' ')

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name)
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v)
  return node
}

/**
 * Builds a hexagon made of hexagons with `radius` rings around the centre
 * (radius 4: rows of 5-6-7-8-9-8-7-6-5, 61 cells) inside `svg`.
 * Cells use axial coordinates (q, r), so hex distance is cheap. `clipId` must be
 * unique on the page, since every grid defines its own hexagon clip path.
 */
export function buildHexGrid(svg, radius, clipId) {
  const width = (2 * radius + 1) * PITCH_X - GAP + PAD * 2
  const height = 2 * radius * PITCH_Y + FACE_H + PAD * 2
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  const defs = el('defs')
  const clip = el('clipPath', { id: clipId, clipPathUnits: 'userSpaceOnUse' })
  clip.append(el('polygon', { points: HEX_POINTS }))
  defs.append(clip)

  const faces = el('g', { class: 'faces' })
  const links = el('g', { class: 'links' })
  svg.append(defs, faces, links)

  const cells = []
  for (let r = -radius; r <= radius; r++) {
    const qMin = Math.max(-radius, -r - radius)
    const qMax = Math.min(radius, -r + radius)
    for (let q = qMin; q <= qMax; q++) {
      const cx = width / 2 + PITCH_X * (q + r / 2)
      const cy = height / 2 + PITCH_Y * r
      const group = el('g', {
        class: 'hex-face',
        transform: `translate(${cx - FACE_W / 2} ${cy - FACE_H / 2})`,
      })
      const clipped = el('g', { 'clip-path': `url(#${clipId})` })
      const pixels = el('g', { class: 'px' })
      const eyes = el('g', { class: 'eyes' })
      clipped.append(pixels, eyes)
      const outline = el('polygon', {
        class: 'hex-outline',
        points: HEX_POINTS,
        fill: 'none',
        stroke: 'var(--color-turq-400)',
        'stroke-opacity': 0.35,
        'stroke-width': 0.5,
        'shape-rendering': 'geometricPrecision',
      })
      group.append(clipped, outline)
      faces.append(group)
      cells.push({ q, r, cx, cy, group, pixels, eyes, distance: (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2 })
    }
  }

  return { cells, links, width, height }
}

/** Removes every cell except `keep` and crops the viewBox to what is left. */
export function keepCells(svg, cells, keep) {
  for (const cell of cells) if (!keep.includes(cell)) cell.group.remove()
  const half = { w: FACE_W / 2 + 0.5, h: FACE_H / 2 + 0.5 }
  const xs = keep.map((c) => c.cx)
  const ys = keep.map((c) => c.cy)
  const x = Math.min(...xs) - half.w
  const y = Math.min(...ys) - half.h
  const width = Math.max(...xs) + half.w - x
  const height = Math.max(...ys) + half.h - y
  svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)
}

export function hexDistance(a, b) {
  return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(a.q + a.r - b.q - b.r)) / 2
}

/** Replaces a cell's pixels with a drawn face; returns every new rect. */
export function paintFace(cell, drawn) {
  cell.pixels.replaceChildren()
  cell.eyes.replaceChildren()
  cell.eyes.removeAttribute('style')
  const rects = []
  for (const run of drawn.runs) {
    const rect = el('rect', { x: run.x, y: run.y, width: run.w, height: 1, fill: run.color })
    cell.pixels.append(rect)
    rects.push(rect)
  }
  cell.scanRect = null
  if (drawn.scan) {
    const s = drawn.scan
    cell.scanRect = el('rect', { x: s.x0, y: s.y, width: 1, height: s.h, fill: s.color, opacity: 0 })
    cell.pixels.append(cell.scanRect)
  }
  cell.eyeRects = drawn.eyes.map((eye) => {
    const rect = el('rect', { x: eye.x, y: eye.y, width: 1, height: 1, fill: eye.color })
    cell.eyes.append(rect)
    rects.push(rect)
    return rect
  })
  return rects
}

export const LINE_WIDTH = 1.2
export const LINE_DASH = [2.4, 1.6]
let lineCount = 0

/**
 * A relationship line from `a` to `b`: a slightly bent, dashed path with a
 * turquoise gradient along it. The path is revealed through a mask whose solid
 * stroke gets drawn in, so the dashes can march independently.
 * Returns the visible path, the mask path to draw, both end markers, the curve's
 * midpoint (for the label) and a `remove()` that cleans everything up.
 */
export function createLine(links, a, b) {
  const id = `rel-${++lineCount}`
  const dx = b.cx - a.cx
  const dy = b.cy - a.cy
  const length = Math.hypot(dx, dy)
  // Bend: push the control point sideways by 12–18 % of the length, to a random side.
  const bend = length * (0.12 + Math.random() * 0.06) * (Math.random() < 0.5 ? -1 : 1)
  const cx = (a.cx + b.cx) / 2 - (dy / length) * bend
  const cy = (a.cy + b.cy) / 2 + (dx / length) * bend
  const d = `M${a.cx} ${a.cy} Q${cx} ${cy} ${b.cx} ${b.cy}`
  const mid = { x: (a.cx + 2 * cx + b.cx) / 4, y: (a.cy + 2 * cy + b.cy) / 4 }

  const defs = el('defs')
  const gradient = el('linearGradient', {
    id: `${id}-gradient`,
    gradientUnits: 'userSpaceOnUse',
    x1: a.cx,
    y1: a.cy,
    x2: b.cx,
    y2: b.cy,
  })
  for (const [offset, color] of [
    [0, '--color-turq-200'],
    [1, '--color-turq-500'],
  ]) {
    gradient.append(el('stop', { offset, style: `stop-color: var(${color})` }))
  }
  const mask = el('mask', { id: `${id}-mask`, maskUnits: 'userSpaceOnUse' })
  const maskPath = el('path', {
    d,
    fill: 'none',
    stroke: '#fff',
    'stroke-width': LINE_WIDTH + 1,
    'stroke-linecap': 'round',
  })
  mask.append(maskPath)
  defs.append(gradient, mask)

  const path = el('path', {
    d,
    fill: 'none',
    stroke: `url(#${id}-gradient)`,
    'stroke-width': LINE_WIDTH,
    'stroke-dasharray': LINE_DASH.join(' '),
    mask: `url(#${id}-mask)`,
    'shape-rendering': 'geometricPrecision',
  })
  const ends = [a, b].map((c) =>
    el('rect', { x: c.cx - 1.25, y: c.cy - 1.25, width: 2.5, height: 2.5, fill: 'var(--color-turq-200)', opacity: 0 }),
  )
  links.append(defs, path, ...ends)

  return {
    path,
    maskPath,
    ends,
    mid,
    remove: () => [defs, path, ...ends].forEach((node) => node.remove()),
  }
}
