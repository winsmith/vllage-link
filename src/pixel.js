// Pixel-art icons and the logo, as bitmaps. '#' is a pixel, '.' is empty.
// toSvg() has no DOM dependency so scripts/favicon.mjs can reuse it.

export const ICONS = {
  note: [
    '#######..',
    '#.....##.',
    '#.###..##',
    '#.......#',
    '#.#####.#',
    '#.......#',
    '#.####..#',
    '#.......#',
    '#########',
  ],
  graph: [
    '##.....##',
    '##.....##',
    '..#...#..',
    '...###...',
    '...###...',
    '...###...',
    '..#...#..',
    '##.....##',
    '##.....##',
  ],
  calendar: [
    '.#.....#.',
    '#########',
    '#.......#',
    '#########',
    '#.#.#.#.#',
    '#.......#',
    '#.#.#.#.#',
    '#.......#',
    '#########',
  ],
  bubble: [
    '#########',
    '#.......#',
    '#.#.#.#.#',
    '#.......#',
    '#########',
    '..##.....',
    '.##......',
    '##.......',
    '.........',
  ],
  import: [
    '....#....',
    '....#....',
    '..#.#.#..',
    '...###...',
    '....#....',
    '#.......#',
    '#.......#',
    '#.......#',
    '#########',
  ],
  devices: [
    '#######..',
    '#.....#..',
    '#.....###',
    '#.....#.#',
    '#######.#',
    '..###.#.#',
    '#######.#',
    '......###',
    '.........',
  ],
  lock: [
    '..#####..',
    '.##...##.',
    '.#.....#.',
    '.#.....#.',
    '#########',
    '####.####',
    '###...###',
    '####.####',
    '#########',
  ],
  never: [
    '##.....##',
    '.##...##.',
    '..##.##..',
    '...###...',
    '..##.##..',
    '.##...##.',
    '##.....##',
  ],
  arrow: [
    '....#..',
    '.....#.',
    '#######',
    '.....#.',
    '....#..',
  ],
}

/** One <path> of unit squares per colour; `layers` maps colour to a list of [x, y]. */
export function toSvg(width, height, layers, attrs = '') {
  const paths = Object.entries(layers)
    .map(([color, pixels]) => {
      const d = pixels.map(([x, y]) => `M${x} ${y}h1v1h-1z`).join('')
      return `<path fill="${color}" d="${d}"/>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges" ${attrs}>${paths}</svg>`
}

export function bitmapSvg(rows, color = 'currentColor', attrs = '') {
  const pixels = []
  rows.forEach((row, y) => [...row].forEach((c, x) => c === '#' && pixels.push([x, y])))
  return toSvg(rows[0].length, rows.length, { [color]: pixels }, attrs)
}

// The logo: the app icon's V-shaped graph of five people, redrawn on a 16×16 grid.
function line(x0, y0, x1, y1) {
  const out = []
  const dx = Math.abs(x1 - x0)
  const dy = -Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx + dy
  for (;;) {
    out.push([x0, y0])
    if (x0 === x1 && y0 === y1) return out
    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      x0 += sx
    }
    if (e2 <= dx) {
      err += dx
      y0 += sy
    }
  }
}

function block(x0, y0, size) {
  const out = []
  for (let y = y0; y < y0 + size; y++) for (let x = x0; x < x0 + size; x++) out.push([x, y])
  // Round the corners of anything bigger than 3 px
  return size > 3 ? out.filter(([x, y]) => !((x === x0 || x === x0 + size - 1) && (y === y0 || y === y0 + size - 1))) : out
}

export function logoSvg({ node = '#5ff0dd', edge = '#0f9c8d', attrs = '' } = {}) {
  const edges = [
    ...line(2, 2, 5, 8),
    ...line(13, 2, 10, 8),
    ...line(5, 8, 10, 8),
    ...line(5, 8, 7, 12),
    ...line(10, 8, 8, 12),
  ]
  const nodes = [...block(1, 1, 3), ...block(12, 1, 3), ...block(4, 7, 3), ...block(9, 7, 3), ...block(6, 11, 4)]
  return toSvg(16, 16, { [edge]: edges, [node]: nodes }, attrs)
}

/** Fills every [data-pixel="name"] element with its icon, and [data-logo] with the logo. */
export function renderPixelArt(root = document) {
  root.querySelectorAll('[data-pixel]').forEach((node) => {
    const rows = ICONS[node.dataset.pixel]
    if (rows) node.innerHTML = bitmapSvg(rows, 'currentColor', 'class="pixel h-full w-auto" aria-hidden="true"')
  })
  root.querySelectorAll('[data-logo]').forEach((node) => {
    node.innerHTML = logoSvg({ attrs: 'class="pixel h-full w-full" aria-hidden="true"' })
  })
}
