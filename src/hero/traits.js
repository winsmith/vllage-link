// Everything a random face can be made of. Colours are full cyberpunk on purpose:
// the faces are the only multi-coloured thing on an otherwise turquoise page.
// Each entry carries a weight; pickWeighted() in face.js reads it.

export const SKIN_TONES = [
  { color: '#4f2f20', weight: 10 },
  { color: '#653d27', weight: 10 },
  { color: '#7d4c2f', weight: 10 },
  { color: '#94603d', weight: 10 },
  { color: '#ad7449', weight: 10 },
  { color: '#c78d5f', weight: 10 },
  { color: '#dba67d', weight: 10 },
  { color: '#ebc09b', weight: 10 },
  { color: '#f6d6b8', weight: 10 },
  // Synthetic: chrome, android blue, lilac
  { color: '#9fabb8', weight: 3 },
  { color: '#a7d9f2', weight: 3 },
  { color: '#c9b6f2', weight: 2 },
]

export const HAIR_STYLES = [
  { name: 'bald', weight: 6 },
  { name: 'buzz', weight: 9 },
  { name: 'mohawk', weight: 9 },
  { name: 'undercut', weight: 10 },
  { name: 'spikes', weight: 8 },
  { name: 'long', weight: 10 },
  { name: 'bob', weight: 9 },
  { name: 'bun', weight: 7 },
  { name: 'braids', weight: 7 },
  { name: 'afro', weight: 7 },
  { name: 'hood', weight: 6 },
]

export const HAIR_COLORS = [
  // Natural
  { color: '#16120f', weight: 8 },
  { color: '#3b2417', weight: 7 },
  { color: '#6b4226', weight: 5 },
  { color: '#d8b26a', weight: 4 },
  { color: '#a3402a', weight: 3 },
  { color: '#c9ccd1', weight: 3 },
  // Neon
  { color: '#ff2bd6', weight: 5 },
  { color: '#21e6ff', weight: 5 },
  { color: '#9d4dff', weight: 5 },
  { color: '#a6ff2b', weight: 4 },
  { color: '#ff6a1a', weight: 4 },
  { color: '#ff3b5c', weight: 4 },
]

export const FACIAL_HAIR_STYLES = [
  { name: 'none', weight: 46 },
  { name: 'stubble', weight: 12 },
  { name: 'moustache', weight: 10 },
  { name: 'goatee', weight: 10 },
  { name: 'chinstrap', weight: 8 },
  { name: 'beard', weight: 14 },
]

export const FACIAL_HAIR_COLORS = [
  { color: '#16120f', weight: 6 },
  { color: '#3b2417', weight: 6 },
  { color: '#6b4226', weight: 4 },
  { color: '#a3402a', weight: 3 },
  { color: '#c9ccd1', weight: 3 },
  // 'hair' means: same colour as the hair, which is how the neon beards happen
  { color: 'hair', weight: 6 },
]

export const PIERCINGS = ['ear', 'septum', 'nose', 'eyebrow', 'lip']

export const PIERCING_COLORS = [
  { color: '#e3e7ec', weight: 5 },
  { color: '#f5c445', weight: 4 },
  { color: '#21e6ff', weight: 2 },
  { color: '#ff2bd6', weight: 2 },
]

export const GLASSES = [
  { name: 'none', weight: 48 },
  { name: 'round', weight: 11 },
  { name: 'shades', weight: 11 },
  { name: 'visor', weight: 12 },
  { name: 'eyepiece', weight: 9 },
  { name: 'goggles', weight: 9 },
]

export const FRAME_COLORS = [
  { color: '#e3e7ec', weight: 3 },
  { color: '#f5c445', weight: 2 },
  { color: '#ff2bd6', weight: 2 },
  { color: '#21e6ff', weight: 2 },
  { color: '#16161c', weight: 3 },
]

export const NEON = ['#ff2bd6', '#21e6ff', '#a6ff2b', '#ff6a1a', '#9d4dff', '#ff3b5c', '#ffe62b']

export const CLOTHING_COLORS = ['#1b1b2f', '#2a1740', '#0e2a2f', '#3a1020', '#202024', '#13233f', '#2f2a12']

export const BACKGROUNDS = ['#07100f', '#0b0d1a', '#120a19', '#061317', '#0d0d0f', '#0a140c', '#150b0b']

export const EYE_COLOR = '#0b0a0f'

// The app's built-in relationship types (village/docs/architecture.md, "Relationship types").
// Directed types show both readings.
export const RELATIONSHIP_LABELS = [
  'knows',
  'friend of',
  'close friend of',
  'in a relationship with',
  'married to',
  'parent of / child of',
  'sibling of',
  'relative of',
  'works with',
  'manager of / reports to',
  'mentor of / mentee of',
  'client of / vendor to',
  'introduced',
  'former colleague of',
  'neighbour of',
  'acquaintance of',
]
