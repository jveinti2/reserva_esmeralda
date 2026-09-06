# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`).

```sh
pnpm install
pnpm dev        # dev server on localhost:4321
pnpm build      # static build to ./dist/
pnpm preview    # serve ./dist locally
pnpm astro check   # type-check (prompts to install @astrojs/check the first time)
```

There is no test suite, no linter, and no CI config in this repo.

## What this is

Marketing site for Reserva Natural La Esmeralda (Tolima, Colombia). Astro 5, static
output (no adapter configured in `astro.config.mjs`, so `pnpm build` produces plain
HTML). Content is in Spanish and hardcoded in the `.astro` files — there is no CMS,
no content collections, no data layer.

## Architecture

**Every page follows the same shape.** There is no automatic layout nesting — `Header`
and `Footer` are imported and placed by hand in each page:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Header from "../components/layout/Header.astro";
import Footer from "../components/layout/Footer.astro";
---
<BaseLayout title="..." description="...">
  <Header />
  <main>…</main>
  <Footer />
</BaseLayout>
```

`src/layouts/BaseLayout.astro` owns `<html>`/`<head>`: SEO title/description props,
an optional `preloadImage` prop (preloads the page's LCP — necessary because CSS
background heroes are invisible to the preload scanner), and self-hosted Manrope +
Fraunces from `public/fonts/`. **There are no third-party requests and exactly one
stylesheet.** Keep it that way: no CDN links, no Google Fonts. Flowbite was removed
entirely — write plain JS or reuse `Carousel.astro`.

**Routes** mirror the site's three program areas. Each area has a hub page plus a
directory of detail pages (`conservacion_investigacion.astro` + `conservacion_investigacion/*.astro`,
same for `educacion_ambiental/` and `emprendimientos/`). Internal links are written
**with a trailing slash** (`/reserva/`, `/sendero/`) — keep that, mismatches have
caused 404s in production.

**Components** split three ways: `layout/` (Header, Footer), `sections/` (whole
homepage bands with hardcoded copy — FAQ, Nosotros, Partners, Testimonials), `ui/`
(small reusable pieces). `Carousel.astro` is the workhorse — used on 12 pages,
including the three hub heroes. Props: `images: string[]`, `alt?`, plus
`wrapperClass` / `heightClass` (to override the default card sizing, e.g. for a
full-bleed hero) and `eager` (sets `fetchpriority=high` on the first slide).
The FAQ accordion is native `<details name="faq">` styled by `.faq-item` in
`global.css` — no JS at all.

**Client JS** is written as plain `<script>` blocks at the bottom of the page or
component, each wrapped in an `initX()` function that is called immediately and then
re-registered on `astro:page-load`. View transitions are *not* actually enabled, so
that listener is currently inert but harmless — follow the pattern for consistency.
The Header dropdowns are hand-rolled (click to open, 150 ms hover-out delay), not
Flowbite data-attributes.

## Styling — Tailwind v4

Tailwind is wired through `@tailwindcss/vite` in `astro.config.mjs`. All theme
configuration lives in the `@theme` block of **`src/styles/global.css`**: the
`esmeralda` brand palette (`--color-esmeralda*`, base `#2c8936`), plus the
`.btn-esmeralda`, `.btn-esmeralda-outline`, and `.text-shadow-custom` utilities.

There is no `tailwind.config.js` — all configuration lives in `global.css`.
**Tailwind v4 does not generate `bg-opacity-*`**; use the slash syntax
(`bg-black/50`). The 23 pre-existing `bg-opacity-*` usages were silently doing
nothing until they were migrated.

## Assets

Everything is a static file under `public/` referenced by absolute path — there is no
use of `astro:assets` / `<Image>`. **Images are already resized to their real
presentation width and encoded as AVIF q55**; do not add a large source image
without doing the same. Images are referenced in **7 different ways** (literal
`src`, `src={expr}` from frontmatter arrays, inline `style="background-image:url()"`,
`class="bg-[url()]"`, `images={[...]}` props on `Carousel`, `image=` props, and
`<video poster>`), so before renaming or deleting any asset, check all of them —
`bg-[url()]` in particular is compiled into the stylesheet, not the HTML, and a
rename makes the rule vanish silently. `public/_headers` caches assets for a year
as immutable, so a changed image needs a new filename. `public/tour-360/` is a prebuilt third-party 360° tour
embedded via `<iframe src="/tour-360/index.html">` in `src/pages/sendero/rv-gratis.astro`;
treat it as a vendored bundle and do not hand-edit it.

## Third-party integrations (known rough edges)

- **ePayco donations** (`vinculate.astro`, `sendero/rv-gratis.astro`): the public key
  is inlined in the page scripts with `test: false` — these are **live** payments, so
  be careful when touching amounts. The two pages have drifted: amounts, button IDs,
  and the `response`/`confirmation` return URLs differ, and `rv-gratis.astro` only
  binds its handlers when `window.innerWidth < 768`. Its labels also say "15 usd" for
  a 10 USD charge. Confirm intended prices with the user before "fixing" these.
- **Contact form** (`contactanos.astro`): posts to Web3Forms, but the enable flag is
  `WEB3FORMS_ACCESS_KEY !== "<that same literal key>"`, which is always false — the
  form silently runs in demo mode (fake 1 s delay, logs to console, shows success).
  Wiring it up for real means fixing that guard.
- `mysql2`, `nodemailer`, `zod`, `dayjs`, `sweetalert2`, and `@astrojs/node` are in
  `package.json` but unused — there is no server code or API route in `src/`. Ask
  before building on them; they may be leftovers from an earlier plan.
- `NosotrosSection.astro` links to `./200/recorrido/recorridogratis/index.html` and
  `vinculate.astro` returns to `https://www.esmeraldareservanatural.com/200/recorrido/`
  — legacy paths served by the production host, not routes in this repo.

## Conventions

- Commit messages and code comments are in Spanish; many comments and UI strings are
  written without accents. Match the surrounding file.
- Some files use double quotes in frontmatter imports, others single — follow the file
  you are editing rather than reformatting.
