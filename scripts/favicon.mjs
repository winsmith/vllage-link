// Writes public/favicon.svg from the logo bitmap in src/pixel.js.
// Run with `npm run favicon` after changing the logo.
import { writeFileSync } from 'node:fs'
import { logoSvg } from '../src/pixel.js'

const svg = logoSvg({ attrs: 'width="32" height="32"' })
  // A black tile behind the mark, so it reads on light browser chrome too
  .replace('><path', '><rect width="16" height="16" fill="#020605"/><path')

writeFileSync(new URL('../public/favicon.svg', import.meta.url), svg + '\n')
