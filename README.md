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

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages at https://vllage.link through `.github/workflows/pages.yml`. In the repository settings, Pages must use "GitHub Actions" as its source and `vllage.link` as the custom domain. For analytics, set the repository variable `TELEMETRYDECK_APP_ID`.

## Licences

Departure Mono by Helena Zhang, SIL Open Font License 1.1 (`public/fonts/OFL.txt`).
