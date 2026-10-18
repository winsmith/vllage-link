import './styles.css'
import { renderPixelArt } from './pixel.js'
import { startHero } from './hero/motion.js'
import { startDecorations } from './hero/decor.js'

renderPixelArt()

const hero = document.querySelector('[data-hero]')
if (hero) startHero(hero)
startDecorations()

// TelemetryDeck page views, only in builds that set VITE_TELEMETRYDECK_APP_ID (see README).
const appID = import.meta.env.VITE_TELEMETRYDECK_APP_ID
if (appID) {
  const script = document.createElement('script')
  script.src = 'https://cdn.telemetrydeck.com/websdk/telemetrydeck.min.js'
  script.dataset.appId = appID
  script.async = true
  document.head.append(script)
}
