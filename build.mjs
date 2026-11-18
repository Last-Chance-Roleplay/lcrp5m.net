import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderRules } from "./src/rules.mjs";
import { loadGallery, makeThumbs, renderGallery } from "./src/gallery.mjs";

const out = "dist";
const partials = {};
for (const f of await readdir("src/partials")) {
  partials[f.replace(/\.html$/, "")] = await readFile(join("src/partials", f), "utf8");
}

function skyline(seed, w = 1600, h = 300) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  let d = `M0 ${h}`;
  let x = 0;
  while (x < w) {
    const bw = 18 + rnd() * 60;
    const center = 1 - Math.abs(x / w - 0.62) * 1.6;
    const bh = 30 + rnd() * 90 + Math.max(0, center) * rnd() * 170;
    const top = h - bh;
    d += ` L${x.toFixed(0)} ${top.toFixed(0)}`;
    if (rnd() > 0.82 && bh > 150) {
      const m = x + bw / 2;
      d += ` L${(m - 3).toFixed(0)} ${top.toFixed(0)} L${m.toFixed(0)} ${(top - 26).toFixed(0)} L${(m + 3).toFixed(0)} ${top.toFixed(0)}`;
    }
    d += ` L${(x + bw).toFixed(0)} ${top.toFixed(0)}`;
    x += bw + (rnd() > 0.7 ? 4 : 0);
    if (rnd() > 0.9) {
      d += ` L${x.toFixed(0)} ${h - 18}`;
      x += 30;
    }
  }
  return `${d} L${w} ${h} Z`;
}

const shots = await loadGallery();

function render(html, page) {
  return html
    .replace(/<!--\s*@(\w+)\s*-->/g, (_, n) => {
      if (!(n in partials)) throw new Error(`Missing partial ${n} in ${page}`);
      return partials[n];
    })
    .replace(/\{\{cur:(\w+)\}\}/g, (_, n) => (n === page ? ' aria-current="page"' : ""))
    .replace(/\{\{skyline:(\d+)\}\}/g, (_, n) => skyline(Number(n)))
    .replace(/\{\{rules:(\w+)\}\}/g, (_, part) => renderRules(part))
    .replace(/\{\{gallery:(\w+)\}\}/g, (_, part) => renderGallery(part, shots));
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp("public", out, { recursive: true });
await makeThumbs(shots, out);

for (const f of await readdir("src/pages")) {
  const page = f.replace(/\.html$/, "");
  const html = render(await readFile(join("src/pages", f), "utf8"), page === "index" ? "home" : page);
  await writeFile(join(out, f), html);
}
console.log(`built ${out} (${shots.length} gallery shots)`);
