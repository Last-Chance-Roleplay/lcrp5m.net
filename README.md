# lcrp5m.net

Website for Last Chance Roleplay.

## Stack

Plain HTML, CSS and JavaScript with no runtime dependencies. Pages in `src/pages` are assembled with the partials in `src/partials` by `build.mjs`, and everything in `public` is copied as-is.

```
src/pages/       one file per route
src/partials/    head, nav, footer
public/          css, js, images, _headers, _redirects
worker/          Cloudflare Worker (serves dist, handles /api/status)
```

## Local dev

```
npm install
npm run dev
```

## Cloudflare

Deployed as a Worker with static assets, configured in `wrangler.jsonc`.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Every push to `main` builds and deploys.

## Live data

- The "City" and uptime numbers on the home page come from the Uptime Kuma page at status.lcrp5m.net, proxied through `worker/index.js` and cached for 60 seconds.
- Discord member and online counts come straight from the public invite API.
- Live player counts turn on once `cfxCode` is set at the top of `public/js/main.js`.

## Department patches

Drop PNGs with transparent backgrounds into `public/assets/img/depts/` named `ccso.png`, `gsp.png`, `sfpd.png` and `fire.png`. Until a file exists the site shows a text seal in its place.

## Gallery

Every image in `public/assets/img/gallery/` (jpg, png or webp) shows up on `/gallery`, newest first, and the latest eight also appear on the home page. Nothing else to edit.

Optional captions and ordering go in `public/assets/img/gallery/captions.json`:

```json
{
  "sandy-stop.jpg": "CCSO traffic stop in Sandy Shores",
  "ls-night.jpg": "Night shift in Los Santos"
}
```

Files listed there come first, in that order. Keep screenshots under about 1 MB each (JPG or WebP at 1920px wide is plenty) so the page stays fast.

## Rules

Rules live in `src/data/rules.mjs`. Each rule has an id, title, penalty range (for example `C-F`, `F+GB`, `SI+CD`), description, and optional `ex` (examples) and `ok` (what's allowed) lists. The page, search, filters and section list are all generated from that file.
