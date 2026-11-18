# lcrp5m.net

Website for Last Chance Roleplay.

## Stack

Plain HTML, CSS and JavaScript with no runtime dependencies. Pages in `src/pages` are assembled with the partials in `src/partials` by `build.mjs`, and everything in `public` is copied as-is.

```
src/pages/       one file per route
src/partials/    head, nav, footer
public/          css, js, images, _headers, _redirects
functions/       Cloudflare Pages Functions
```

## Local dev

```
npm run build
npx wrangler pages dev dist
```

`npx serve dist` also works, but `/api/status` only exists under Wrangler or on Cloudflare.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Functions are picked up from `functions/` automatically

## Live data

- The "City" and uptime numbers on the home page come from the Uptime Kuma page at status.lcrp5m.net, proxied through `functions/api/status.js` and cached for 60 seconds.
- Discord member and online counts come straight from the public invite API.
- Live player counts turn on once `cfxCode` is set at the top of `public/js/main.js`.

## Department patches

Drop PNGs with transparent backgrounds into `public/assets/img/depts/` named `ccso.png`, `gsp.png`, `sfpd.png` and `fire.png`. Until a file exists the site shows a text seal in its place.

## Gallery

Every image in `public/assets/img/gallery/` (jpg, png or webp) shows up on `/gallery`, newest first, and the latest eight also appear on the home page. Nothing else to edit.

Optional captions and ordering go in `public/assets/img/gallery/captions.json`:

```json
{
  "traffic-stop.jpg": "CCSO traffic stop on Tara Blvd",
  "i75-night.jpg": "Night shift on I-75"
}
```

Files listed there come first, in that order. Keep screenshots under about 1 MB each (JPG or WebP at 1920px wide is plenty) so the page stays fast.

## Rules

Rules live in `src/data/rules.mjs`. Each rule has an id, title, penalty range (for example `C-F`, `F+GB`, `SI+CD`), description, and optional `ex` (examples) and `ok` (what's allowed) lists. The page, search, filters and section list are all generated from that file.
