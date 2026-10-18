# vllage.link — Design

The reference for every later change to this site. When the page and this document disagree, fix one of them in the same commit.

Started 2026-10-18 by Daniel Jilg. The app was called Village until October 2026; the site never mentions the old name.

## Purpose

vllage is a personal relationship manager for Mac and iPhone: the people who matter to one person, private and business, with typed relationships between them, reminders of dates and todos, and help keeping in touch. It is in active development, will be free, may become open source, and will one day be self-hostable.

The page has one job now and another at launch:

| When | The one action | Primary CTA |
| --- | --- | --- |
| Before launch (now) | Follow along so you come back | Follow on Mastodon (solid), Follow on Bluesky (outline), Watch on GitHub (outline, bottom only) |
| At launch | Download the app | Download on the App Store (solid); follow links move to the footer area |

No email list, no feed. Visitors are told to check back later.

## Audience

People who keep up with many others and feel they are dropping threads: freelancers and founders with business contacts that are also friends, people with big families, anyone who has forgotten a birthday or a colleague's partner's name. They arrive mostly from Mastodon, Bluesky and word of mouth, so they already know the name and want to know what it is, whether it is real and when they can have it.

Objections the page answers: "Is it another CRM?" (no sales pipelines, never), "Where does my data go?" (yours only, hashed contact links, export, delete), "Can I get it?" (not yet, follow along), "What will it cost?" (free).

## Voice

- Plain, factual, warm. Second person ("your people", "your data").
- **One statement per line, no full stops.** Every heading, line of body copy, caption and list item makes exactly one complete statement and ends without a full stop. Body copy is a stack of such lines (`.lines`, one `<p>` each), not a paragraph. No chains of fragments like "Free. And one day, yours to host." and no "Statement. Another statement." on one line.
- "vllage" is always lowercase, also at the start of a line.
- No exclamation marks, no buzzwords ("seamless", "powerful", "streamline"), no fabricated numbers or testimonials.
- Never promise what isn't decided: say "will be free", "is planned"; do not say "open source" until it is.
- Features are described as benefits and never with version numbers. Some exist at launch, some later; the features section says so once.
- Use "people", "data" and "relationships" in copy; "graph", "edges" and "resources" are internal words.

## Page structure and copy deck

Order on the page. Each "/" below separates lines on the page.

1. **Header**: pixel logo, "vllage", links Features · Follow.
2. **Hero**: the hexagon of faces (right on desktop, above the text on mobile).
   - H1: "The people who matter". Earlier draft: "Keep the people who matter close".
   - Lines: vllage is a personal relationship manager for Mac and iPhone / It remembers who you know, how you know them and what's coming up / That makes it easier to stay in touch with family, friends and colleagues
   - Status lines, terminal style with a blinking block cursor: "> vllage is in active development" / "> It will be free when it launches"
   - Buttons: Follow on Mastodon / Follow on Bluesky
   - Caption: "Figure 1: 61 randomly generated people" / "Click a face to generate a new one". It tells people the faces are clickable and that nobody real is shown.
3. **Problem**: H2 "Your phone helps you remember". Lines: Your contacts app stores phone numbers and addresses / vllage also stores the context, such as who introduced you and whose child just started school / It reminds you of birthdays, anniversaries and promised calls before they are due. Next to it Figure 2, a box-drawing record card for Shallan Davar (married to Adolin Kholin, works with Veil, introduced by Brandon S., mentor of Gaz), caption "Figure 2: A person in vllage with relationships, dates and notes".
4. **Features**: H2 "Keep it in mind". Note: "Some features ship at launch and the rest follow in updates". Six cards: Write down what you know · See how everyone is connected · Never miss a date · Keep in touch · Bring your people with you · On your Mac and iPhone.
5. **Privacy**: H2 "Your data is yours alone". Lines: The vllage server only syncs your data between your devices / Nothing you write is shared with other users / Email addresses and phone numbers from Apple Contacts reach the server only as hashes / You can export all your data and delete your account at any time. Next to it the "vllage will never" box: share your people with another user, message anyone on your behalf, scrape LinkedIn/Mastodon/Bluesky, turn your friends into a sales pipeline.
6. **Free and self-hosting**: H2 "vllage will be free". Lines: The Mac and iPhone apps will be free to download / A package to run the sync server on your own hardware is planned. Link: Read the source on GitHub.
7. **Check back** (`#follow`): H2 "Check back for more information". Lines: vllage is not available to download yet / This page will show screenshots, a release date and more details closer to launch / Follow the project on Mastodon, Bluesky or GitHub for updates. Buttons: Mastodon, Bluesky, GitHub.
8. **Footer**: "vllage · © 2026 Daniel Jilg", then Privacy · Impressum, smallest text on the page.

Meta: title "vllage: the people who matter"; description "vllage is a personal relationship manager for Mac and iPhone that remembers who you know, how you know them and what's coming up"; Open Graph image `public/og.png` (1200×630, shows the H1, so regenerate it when the H1 changes).

The example people come from the Stormlight Archive, as in the app's test data.

### Keeping features in sync with the app

The feature list is drawn from `village/docs/architecture.md` (scope v1–v5 and the "Never" list). When the app's scope changes, update the cards and the never-list here and on the page. Things the site may claim, and their source:

| Claim | Source in the architecture doc |
| --- | --- |
| Names, nicknames, organisation, job title, notes | v1, `persons` |
| Relationships read from both sides, start and end | Relationship types, `since`/`until` |
| Map, groups, tags, search across notes | v3 See and sort |
| Birthdays, anniversaries, todos, Upcoming, Monday digest | v2 Remember, Reminders |
| Last spoke, keep-in-touch cadence, Contacts card, social profiles | v4 Connect |
| vCard / CSV / LinkedIn import with preview and duplicates | v1 Import |
| Mac and iPhone sync, readable offline | v1 client, Offline decision |
| The server only syncs your data | Requested for the site on 2026-10-18; revisit when v5 adds server-side search for the browser client and push notifications |
| Browser version, widgets, Shortcuts, Spotlight, self-host package | v5 Everywhere |
| Only hashes of contact emails and phones reach the server | Contact match hints decision |
| Export, delete account | v2 export and account deletion |
| Never share, message, scrape, sales pipelines | Scope "Never" |

## Visual system

**Turquoise on black, pixel first, in the spirit of departuremono.com**: retro technical ephemera (tickets, record cards, spec sheets), box-drawing characters, ░▒▓ shading, figure captions, hard edges and no blur anywhere.

### Rules

- **No eyebrows.** Nothing small sits above a heading: no kicker, no section number, no spec label. Captions go below figures; metadata goes inside cards, never above a heading.
- The faces in the hero are the only multi-coloured thing. Everything else uses the turquoise ramp on black.
- Hard offset shadows (`4px 4px 0`), 1–2 px borders, square corners. No rounded corners, gradients or soft shadows.
- Transitions are stepped (`steps(2)`/`steps(4)`), not eased, so they feel like pixels.
- Break the pixel style only where it serves the reader: the relationship lines in the hero are smooth curved vectors, body copy keeps a readable measure (`max-w-[40ch]`–`[52ch]`), and mobile body text is 16.5 px.

### Tokens (`src/styles.css`, `@theme`)

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#020605` | Page background |
| `ink-2` | `#051110` | Card background |
| `turq-50` | `#e8fffb` | Headings |
| `turq-200` | `#93f8ea` | Body text |
| `turq-300` / `turq-400` | `#5ff0dd` / `#2ee6d0` | Accents, links, solid buttons, icons |
| `turq-600` | `#0f9c8d` | Captions and footer; the dimmest colour allowed for text (≥ 4.5:1 on ink) |
| `turq-700`–`turq-900` | `#0b7268`–`#052a26` | Borders, rules, shading, dither |

### Type

Departure Mono only (SIL OFL, self-hosted in `public/fonts`, `OFL.txt` alongside). It is drawn on an 11 px grid, so the scale is `text-11`, `text-16` (16.5), `text-22`, `text-33`, `text-44`, `text-55`, `text-66`, `text-88`. Headings are uppercase via CSS. Font smoothing is off.

### Motifs and components

- `.ticket`: card with a dashed perforation on the left, used for features and the record card.
- `.btn .btn-solid` / `.btn .btn-line`: pixel buttons with a hard offset shadow that "press" on hover.
- `.shade-band`: a full-width line of ░▒▓ between sections.
- `.dither`: 2 px checker texture behind the free/self-host section.
- `.cursor-block`: blinking block cursor after terminal-style lines.
- `.lines`: a stack of one-statement lines with a small gap; use it for all body copy.
- Pixel icons (`src/pixel.js`, `ICONS`): 9×9 bitmaps written as `#`/`.` strings, rendered into `[data-pixel="name"]`. Draw new icons the same way.
- Logo: the app icon's V-shaped graph of five people on a 16×16 grid (`logoSvg()`), edges `turq-600`, nodes `turq-300`. `npm run favicon` regenerates `public/favicon.svg`.
- Figures: `Figure n: …` captions in `text-11` uppercase `turq-600`, below the figure.

## Hero

A hexagon made of 61 hexagonal pixel faces (`src/hero/`).

**Face generator** (`face.js`): `createRandomFace()` picks traits with anime.js `utils.random`, `utils.randomPick` and `utils.shuffle` from the weighted lists in `traits.js`; `drawFace()` paints them onto a 16×18 grid and returns colour runs, the eyes, and an optional visor highlight.

| Trait | Options |
| --- | --- |
| Skin | 9 real tones deep to light; rare synthetic chrome, android blue, lilac |
| Hair style | bald, buzz, mohawk, undercut, spikes, long, bob, bun, braids, afro, hood |
| Hair colour | black, browns, blonde, ginger, silver; neon pink, cyan, purple, acid green, orange, red |
| Facial hair | none (most), stubble, moustache, goatee, chin strap, full beard; natural colours or the hair colour |
| Piercings | 0–2 of ear, septum, nose, eyebrow, lip; silver, gold or neon |
| Glasses | none (about half), round frames, shades, neon visor, cyber eyepiece, goggles on the forehead |
| Other | eye spacing, neon implant eyes (rare), mouth 2–4 px with optional raised corner, collar style, clothing and background colour |

Eyes are always single pixels and mouths always lines. Add new traits by extending the lists in `traits.js` and a `case` in `drawFace()`; keep the 16×18 grid.

**Grid** (`hexgrid.js`): pointy-top hexagons in rows of 5-6-7-8-9-8-7-6-5, each row shifted half a hexagon against the one above, 1.5 px gaps, axial coordinates for distances. One shared `clipPath` cuts every face to a hexagon; each hexagon has a faint turquoise outline that brightens on hover and while linked.

**Motion** (anime.js 4; per-face behaviour in `life.js`, relationship lines in `motion.js`):

| Behaviour | Timing |
| --- | --- |
| Build-in | Ripple outward by hex distance (220 ms per ring), each face's pixels fade in in random order (9 ms stagger) |
| Blink | Per face, every 2–9 s; 15 % double blinks; eyes behind shades or a visor never blink, an eyepiece eye neither |
| Glance | Per face, every 6–20 s, eyes shift one pixel for 0.6–1.5 s; not with round frames or an eyepiece |
| Visor sweep | Every 3–10 s a bright column steps across the visor |
| Re-roll | Click: pixels dissolve in random order, a new face builds in |
| Relationship lines | Every 3–5 s, at most two at once, a line connects faces 2–4 hexagons apart: bent sideways by 12–18 % of its length, 1.2 px wide in face pixels, dashed (2.4 on, 1.6 off) with dashes marching from the first person to the second, and a gradient from `turq-200` to `turq-500` along it. It draws in through a mask (0.7 s), shows a label from the app's 16 relationship types at the curve's midpoint, holds 2.6 s, retracts |

Faces only animate while their group is on screen, and anime.js pauses everything while the tab is hidden. With `prefers-reduced-motion: reduce` faces render at once and stay still, and a click swaps a face instantly. The hero SVG is `aria-hidden`; nothing in it carries meaning that the text doesn't.

### Decorations

Small fragments of the honeycomb sit around the page (`src/hero/decor.js`). Each is a `<div data-faces="n">` with 1–7 faces that touch each other; add `data-shape="row"` for up to three faces side by side, which fits into a section's padding. They use the same generator and behaviour as the hero (build in the first time they scroll into view, blink, glance, re-roll on click) but have no relationship lines.

| Section | Faces | Where |
| --- | --- | --- |
| Problem | 3, row | bottom right, under the record card |
| Features | 2 | top right, beside the heading |
| Privacy | 2, row | bottom right, under the "never" box |
| Free | 5 | right of the box, on the dither |
| Check back | 4 | top right, beside the heading |
| Check back, below `xl` | 3 | inline, between the text and the buttons |

The absolutely placed ones show from `xl` (1280 px) up, where the sections have room; below that only the inline cluster appears. They must never overlap text, cards or buttons: when moving one, check at 1280, 1440 and 1920 px.

## Legal pages

Made as unobtrusive as German law allows, by request. §5 DDG asks for an imprint that is easy to recognise, directly reachable and always available; a footer link with a recognised label on every page satisfies that. So:

- One footer link labelled **Impressum** (a label courts accept), last and smallest item on the page, `turq-600` (still ≥ 4.5:1).
- No address on the main page. `/impressum/` and `/privacy/` carry `noindex`, are linked nowhere else and appear in no navigation.
- The imprint must keep an email address (fast electronic contact is mandatory). Current: Daniel Jilg, Lengerckestieg 5, 22041 Hamburg, winsmith@winsmith.de.
- The privacy notice exists because of the host's access logs (GitHub Pages) and TelemetryDeck. If either changes (another host, another analytics tool, an embed, a form), update it in the same commit.

Neither page has had a lawyer's review.

## Stack and files

Vite 8 (multi-page), Tailwind CSS 4 through `@tailwindcss/vite`, anime.js 4.5; versions pinned exactly in `package.json`.

| Path | Contents |
| --- | --- |
| `index.html` | The page |
| `impressum/index.html`, `privacy/index.html` | Legal pages, sharing `src/legal.js` |
| `src/styles.css` | Tailwind import, tokens, font face, components |
| `src/main.js` | Pixel art, hero start, optional TelemetryDeck |
| `src/pixel.js` | Icon bitmaps, logo, SVG helpers |
| `src/hero/traits.js`, `face.js`, `hexgrid.js` | Face generator and honeycomb layout |
| `src/hero/life.js` | Build-in, blinking, glancing and re-roll for any group of faces |
| `src/hero/motion.js` | The hero, with relationship lines |
| `src/hero/decor.js` | The decorations |
| `scripts/favicon.mjs` | Regenerates `public/favicon.svg` |
| `public/` | Font, favicon, `og.png` |

TelemetryDeck loads only when `VITE_TELEMETRYDECK_APP_ID` is set at build time.

### Hosting

GitHub Pages, deployed by `.github/workflows/pages.yml` on every push to `main`: `npm ci`, `npm run build`, then `dist/` is published. The canonical address is `https://www.vllage.link`, set as the custom domain in the repository's Pages settings (no `CNAME` file needed with an Actions deployment). DNS at Hetzner: `www` is a CNAME to `winsmith.github.io.` (with the trailing dot, or the zone name gets appended), and the apex `vllage.link` has GitHub's Pages A/AAAA records so GitHub redirects it to `www`. HTTPS is enforced. Absolute URLs in the page (`og:url`, `og:image`, `rel="canonical"`) and the legal pages use the `www` address. The build reads the TelemetryDeck app ID from the repository variable `TELEMETRYDECK_APP_ID`.

The site must stay served from the domain root: pages link to `/fonts/…`, `/favicon.svg`, `/impressum/` and `/privacy/` absolutely, so the `*.github.io/vllage-link/` address does not work without a Vite `base` and rewritten links.

Moved from the earlier plan of Hetzner behind Caddy on 2026-10-18.

## Open items

- Real social handles: the Mastodon (`@daniel@social.telemetrydeck.com`) and Bluesky (`breakth-esystem.bsky.social`) links are placeholders to be replaced.
- `winsmith/village` is private; the GitHub links go live when it is made public.
- TelemetryDeck app ID for production builds (repository variable `TELEMETRYDECK_APP_ID`).
- At launch: App Store button as the primary CTA, screenshots, the app's own privacy policy, refresh `og.png`.
- A German translation, if visitors ask for it.
- Final app name after trademark and App Store checks; the site lives at www.vllage.link until then.
