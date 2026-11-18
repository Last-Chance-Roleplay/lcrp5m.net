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

- Server status comes from the Uptime Kuma page at status.lcrp5m.net, proxied through `functions/api/status.js` and cached for 60 seconds.
- Discord member and online counts come straight from the public invite API.
- Live player counts turn on once `cfxCode` is set at the top of `public/js/main.js`.

## Department patches

Drop PNGs with transparent backgrounds into `public/assets/img/depts/` named `ccso.png`, `gsp.png`, `sfpd.png` and `fire.png`. Until a file exists the site shows a text seal in its place.
