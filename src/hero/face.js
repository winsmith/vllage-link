import { utils } from 'animejs'
import {
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  FACIAL_HAIR_STYLES,
  FACIAL_HAIR_COLORS,
  PIERCINGS,
  PIERCING_COLORS,
  GLASSES,
  FRAME_COLORS,
  NEON,
  CLOTHING_COLORS,
  BACKGROUNDS,
  EYE_COLOR,
} from './traits.js'

// A face is a 16×18 pixel map: pointy-top hexagon proportions, clipped to the hexagon later.
export const FACE_W = 16
export const FACE_H = 18

// Head outline per row: [first x, last x].
const HEAD = {
  3: [5, 10],
  4: [4, 11],
  5: [4, 11],
  6: [4, 11],
  7: [4, 11],
  8: [4, 11],
  9: [4, 11],
  10: [4, 11],
  11: [5, 10],
  12: [5, 10],
  13: [6, 9],
}

const EYE_Y = 8
const MOUTH_Y = 11

function pickWeighted(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0)
  let roll = utils.random(0, total, 3)
  for (const item of items) {
    roll -= item.weight
    if (roll <= 0) return item
  }
  return items[items.length - 1]
}

function chance(p) {
  return utils.random(0, 1, 4) < p
}

export function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ch = (p, shift) => (p >> shift) & 255
  const c = (shift) => Math.round(ch(pa, shift) + (ch(pb, shift) - ch(pa, shift)) * t)
  return '#' + ((1 << 24) | (c(16) << 16) | (c(8) << 8) | c(0)).toString(16).slice(1)
}

/**
 * Picks a random set of traits. Uses anime.js' random helpers throughout,
 * so the whole hero runs on one randomness source.
 */
export function createRandomFace() {
  const hair = pickWeighted(HAIR_COLORS).color
  const facialHairColor = pickWeighted(FACIAL_HAIR_COLORS).color
  const piercingCount = pickWeighted([
    { n: 0, weight: 45 },
    { n: 1, weight: 35 },
    { n: 2, weight: 20 },
  ]).n

  return {
    skin: pickWeighted(SKIN_TONES).color,
    hairStyle: pickWeighted(HAIR_STYLES).name,
    hairColor: hair,
    facialHair: pickWeighted(FACIAL_HAIR_STYLES).name,
    facialHairColor: facialHairColor === 'hair' ? hair : facialHairColor,
    piercings: utils.shuffle([...PIERCINGS]).slice(0, piercingCount),
    piercingColor: pickWeighted(PIERCING_COLORS).color,
    glasses: pickWeighted(GLASSES).name,
    frameColor: pickWeighted(FRAME_COLORS).color,
    neon: utils.randomPick(NEON),
    eyeSide: utils.randomPick(['left', 'right']),
    earSide: utils.randomPick(['left', 'right']),
    eyes: chance(0.6) ? [6, 9] : [5, 10],
    implantEyes: chance(0.12) ? utils.randomPick(NEON) : null,
    mouthLength: utils.random(2, 4),
    mouthShift: utils.randomPick([0, 0, -1, 1]),
    smirk: chance(0.25) ? utils.randomPick(['left', 'right']) : null,
    clothing: utils.randomPick(CLOTHING_COLORS),
    collar: utils.randomPick(['plain', 'trim', 'high']),
    background: utils.randomPick(BACKGROUNDS),
    spikeTips: Array.from({ length: 4 }, () => utils.random(0, 1)),
  }
}

/**
 * Draws traits into pixels. Returns merged horizontal runs for the static
 * pixels, the eyes as separate pixels so they can blink and glance, and an
 * optional visor highlight that sweeps across.
 */
export function drawFace(t) {
  const grid = Array.from({ length: FACE_H }, () => Array(FACE_W).fill(t.background))
  const set = (x, y, color) => {
    if (x >= 0 && x < FACE_W && y >= 0 && y < FACE_H) grid[y][x] = color
  }
  const hline = (x0, x1, y, color) => {
    for (let x = x0; x <= x1; x++) set(x, y, color)
  }
  const vline = (x, y0, y1, color) => {
    for (let y = y0; y <= y1; y++) set(x, y, color)
  }

  const skinShade = mix(t.skin, '#000000', 0.2)
  const mouthColor = mix(t.skin, '#000000', 0.5)
  const hair = t.hairColor
  const hairDark = mix(hair, '#000000', 0.35)
  const [eyeL, eyeR] = t.eyes

  // Shoulders and neck
  hline(3, 12, 15, t.clothing)
  hline(2, 13, 16, t.clothing)
  hline(1, 14, 17, t.clothing)
  hline(6, 9, 14, skinShade)
  if (t.collar === 'trim') {
    hline(3, 5, 15, t.neon)
    hline(10, 12, 15, t.neon)
    set(6, 15, skinShade)
    set(9, 15, skinShade)
  } else if (t.collar === 'high') {
    hline(5, 10, 14, t.clothing)
    hline(5, 10, 15, mix(t.clothing, '#ffffff', 0.12))
  } else {
    hline(6, 9, 15, skinShade)
  }

  // Head, ears, a shadow down the right side
  for (const [y, [x0, x1]] of Object.entries(HEAD)) {
    hline(x0, x1, Number(y), t.skin)
    set(x1, Number(y), skinShade)
  }
  vline(3, 8, 9, t.skin)
  vline(12, 8, 9, skinShade)

  // Facial hair, before the mouth so the mouth stays visible
  const fh = t.facialHairColor
  let lipColor = mouthColor
  switch (t.facialHair) {
    case 'stubble':
      for (let y = 10; y <= 13; y++) {
        const [x0, x1] = HEAD[y]
        for (let x = x0; x <= x1; x++) if ((x + y) % 2 === 0) set(x, y, mix(fh, t.skin, 0.45))
      }
      break
    case 'moustache':
      hline(6, 9, 10, fh)
      break
    case 'goatee':
      vline(7, 12, 13, fh)
      vline(8, 12, 13, fh)
      if (chance(0.5)) hline(6, 9, 10, fh)
      break
    case 'chinstrap':
      for (const [x, y] of [[4, 9], [4, 10], [11, 9], [11, 10], [5, 11], [10, 11], [5, 12], [10, 12]]) set(x, y, fh)
      hline(6, 9, 13, fh)
      break
    case 'beard':
      hline(4, 11, 10, fh)
      hline(5, 10, 11, fh)
      hline(5, 10, 12, fh)
      hline(6, 9, 13, fh)
      hline(6, 9, 14, fh)
      lipColor = mix(t.skin, '#7a2a2a', 0.55)
      break
  }

  // Mouth: a line, sometimes with one raised corner
  const mouthStart = Math.max(5, Math.min(10 - t.mouthLength + 1, 8 - Math.ceil(t.mouthLength / 2) + t.mouthShift))
  const mouthEnd = mouthStart + t.mouthLength - 1
  hline(mouthStart, mouthEnd, MOUTH_Y, lipColor)
  if (t.smirk === 'left') set(mouthStart - 1, MOUTH_Y - 1, lipColor)
  if (t.smirk === 'right') set(mouthEnd + 1, MOUTH_Y - 1, lipColor)

  // Hair
  switch (t.hairStyle) {
    case 'bald':
      set(6, 4, mix(t.skin, '#ffffff', 0.25))
      break
    case 'buzz':
      for (let y = 3; y <= 4; y++) {
        const [x0, x1] = HEAD[y]
        for (let x = x0; x <= x1; x++) set(x, y, (x + y) % 2 ? hair : mix(hair, t.skin, 0.5))
      }
      set(4, 5, hair)
      set(11, 5, hair)
      break
    case 'mohawk':
      vline(7, 0, 5, hair)
      vline(8, 0, 5, hairDark)
      for (let y = 3; y <= 4; y++) {
        set(5, y, mix(hair, t.skin, 0.6))
        set(10, y, mix(hair, t.skin, 0.6))
      }
      break
    case 'undercut':
      hline(5, 10, 2, hair)
      hline(4, 11, 3, hair)
      hline(4, 11, 4, hair)
      hline(4, 9, 5, hair)
      hline(4, 6, 6, hairDark)
      vline(11, 5, 7, mix(hair, t.skin, 0.6))
      break
    case 'spikes':
      hline(4, 11, 3, hair)
      hline(4, 11, 4, hairDark)
      set(4, 5, hair)
      set(11, 5, hair)
      ;[4, 6, 8, 10].forEach((sx, i) => {
        set(sx, 2, hair)
        set(sx + 1, 2, hair)
        set(sx + (i % 2), t.spikeTips[i], hair)
        set(sx + (i % 2), 1, hair)
      })
      break
    case 'long':
      hline(5, 10, 2, hair)
      hline(4, 11, 3, hair)
      hline(4, 11, 4, hair)
      hline(4, 6, 5, hair)
      hline(9, 11, 5, hair)
      vline(3, 4, 15, hair)
      vline(12, 4, 15, hairDark)
      vline(2, 12, 16, hair)
      vline(13, 12, 16, hairDark)
      set(4, 6, hair)
      set(11, 6, hairDark)
      break
    case 'bob':
      hline(4, 11, 2, hair)
      for (let y = 3; y <= 5; y++) hline(3, 12, y, hair)
      for (const x of [4, 5, 6, 9, 10, 11]) set(x, 6, hairDark)
      vline(3, 6, 12, hair)
      vline(12, 6, 12, hairDark)
      set(4, 7, hair)
      set(11, 7, hairDark)
      break
    case 'bun':
      hline(7, 8, 0, hair)
      hline(6, 9, 1, hair)
      hline(6, 9, 2, hairDark)
      hline(5, 10, 3, hair)
      hline(4, 11, 4, hair)
      set(4, 5, hair)
      set(11, 5, hair)
      break
    case 'braids':
      hline(5, 10, 2, hair)
      hline(4, 11, 3, hair)
      hline(4, 11, 4, hairDark)
      for (let y = 4; y <= 15; y++) {
        set(3, y, y % 2 ? hair : hairDark)
        set(12, y, y % 2 ? hairDark : hair)
      }
      set(3, 16, t.neon)
      set(12, 16, t.neon)
      break
    case 'afro':
      hline(5, 10, 0, hair)
      hline(3, 12, 1, hair)
      for (let y = 2; y <= 5; y++) hline(2, 13, y, hair)
      for (let y = 6; y <= 10; y++) {
        hline(2, 3, y, hair)
        hline(12, 13, y, hair)
      }
      for (let y = 0; y <= 10; y++)
        for (let x = 2; x <= 13; x++) if ((x * 3 + y * 5) % 7 === 0 && grid[y][x] === hair) set(x, y, hairDark)
      break
    case 'hood': {
      const hood = mix(t.clothing, '#ffffff', 0.08)
      hline(5, 10, 1, hood)
      hline(4, 11, 2, hood)
      hline(3, 12, 3, hood)
      hline(3, 12, 4, hood)
      hline(4, 11, 5, t.neon)
      for (let y = 5; y <= 15; y++) {
        hline(2, 3, y, hood)
        hline(12, 13, y, hood)
      }
      break
    }
  }

  // Glasses
  const eyes = []
  let scan = null
  const blinkable = { left: true, right: true }
  let canGlance = true
  const eyeColor = t.implantEyes ?? EYE_COLOR

  switch (t.glasses) {
    case 'round':
      for (const ex of t.eyes) {
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++) if (dx || dy) set(ex + dx, EYE_Y + dy, t.frameColor)
        set(ex, EYE_Y, t.skin)
      }
      if (eyeR - eyeL > 3) hline(eyeL + 2, eyeR - 2, EYE_Y - 1, t.frameColor)
      canGlance = false
      break
    case 'shades': {
      const lens = '#0a0a12'
      hline(eyeL - 1, eyeR + 1, EYE_Y - 1, lens)
      hline(eyeL - 1, eyeL + 1, EYE_Y, lens)
      hline(eyeR - 1, eyeR + 1, EYE_Y, lens)
      set(eyeL - 1, EYE_Y - 1, '#6a6a8e')
      set(eyeR - 1, EYE_Y - 1, '#6a6a8e')
      blinkable.left = blinkable.right = false
      break
    }
    case 'visor':
      hline(3, 12, EYE_Y - 1, t.neon)
      hline(3, 12, EYE_Y, mix(t.neon, '#000000', 0.3))
      scan = { x0: 3, x1: 12, y: EYE_Y - 1, h: 2, color: mix(t.neon, '#ffffff', 0.7) }
      blinkable.left = blinkable.right = false
      break
    case 'eyepiece': {
      const ex = t.eyeSide === 'left' ? eyeL : eyeR
      const metal = '#8a94a0'
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) if (dx || dy) set(ex + dx, EYE_Y + dy, metal)
      set(ex, EYE_Y, t.neon)
      const toEar = t.eyeSide === 'left' ? [ex - 2, 3] : [ex + 2, 12]
      hline(Math.min(...toEar), Math.max(...toEar), EYE_Y, mix(metal, '#000000', 0.3))
      blinkable[t.eyeSide] = false
      canGlance = false
      break
    }
    case 'goggles': {
      const strap = '#26262c'
      hline(3, 12, 4, strap)
      for (const lx of [5, 9]) {
        hline(lx, lx + 1, 4, t.neon)
        hline(lx, lx + 1, 5, mix(t.neon, '#000000', 0.35))
        set(lx, 4, mix(t.neon, '#ffffff', 0.6))
      }
      break
    }
  }

  // Piercings
  const pc = t.piercingColor
  for (const p of t.piercings) {
    if (p === 'ear' && t.hairStyle !== 'hood') set(t.earSide === 'left' ? 3 : 12, 10, pc)
    if (p === 'septum') set(utils.randomPick([7, 8]), MOUTH_Y - 1, pc)
    if (p === 'nose') set(eyeR, EYE_Y + 1, pc)
    if (p === 'eyebrow' && t.glasses !== 'visor') set(eyeR + 1, EYE_Y - 2, pc)
    if (p === 'lip') set(Math.min(mouthEnd, 9), MOUTH_Y + 1, pc)
  }

  // Eyes the glasses leave visible
  if (blinkable.left || t.glasses === 'eyepiece')
    if (!(t.glasses === 'eyepiece' && t.eyeSide === 'left')) eyes.push({ x: eyeL, y: EYE_Y, color: eyeColor })
  if (blinkable.right || t.glasses === 'eyepiece')
    if (!(t.glasses === 'eyepiece' && t.eyeSide === 'right')) eyes.push({ x: eyeR, y: EYE_Y, color: eyeColor })

  return { runs: toRuns(grid), eyes, scan, canGlance: canGlance && eyes.length > 0 }
}

function toRuns(grid) {
  const runs = []
  grid.forEach((row, y) => {
    let start = 0
    for (let x = 1; x <= row.length; x++) {
      if (x === row.length || row[x] !== row[start]) {
        runs.push({ x: start, y, w: x - start, color: row[start] })
        start = x
      }
    }
  })
  return runs
}
