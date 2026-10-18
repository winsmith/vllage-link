# vllage.link

The website for vllage, a personal relationship manager for Mac and iPhone. One static page plus an imprint and a privacy notice, built with Vite, Tailwind CSS and anime.js.

Read [DESIGN.md](DESIGN.md) before changing anything: it holds the copy, the visual rules and the hero spec.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/
npm run favicon    # regenerate public/favicon.svg from the logo bitmap
```

## Configuration

Set `VITE_TELEMETRYDECK_APP_ID` (in `.env.local` or the build environment) to turn on TelemetryDeck page views. Without it the site loads nothing from third parties.

## Licences

Departure Mono by Helena Zhang, SIL Open Font License 1.1 (`public/fonts/OFL.txt`).
