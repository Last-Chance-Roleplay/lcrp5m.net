import { existsSync } from "node:fs";
import { mkdir, readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const DIR = "public/assets/img/gallery";
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function size(buf, ext) {
  if (ext === ".png") return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (ext === ".webp") {
    const kind = buf.toString("ascii", 12, 16);
    if (kind === "VP8X") return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
    if (kind === "VP8L") {
      const b = buf.readUInt32LE(21);
      return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
    }
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const m = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  return null;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

export async function loadGallery() {
  if (!existsSync(DIR)) return [];
  let captions = {};
  if (existsSync(join(DIR, "captions.json"))) captions = JSON.parse(await readFile(join(DIR, "captions.json"), "utf8"));
  const files = (await readdir(DIR)).filter((f) => EXT.has(extname(f).toLowerCase()));
  const shots = [];
  for (const f of files) {
    const path = join(DIR, f);
    const buf = await readFile(path);
    const dim = size(buf, extname(f).toLowerCase()) || [1600, 900];
    shots.push({ f, w: dim[0], h: dim[1], caption: captions[f] || "", thumb: null });
  }
  const order = Object.keys(captions);
  const byName = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  return shots.sort((a, b) => {
    const ia = order.indexOf(a.f);
    const ib = order.indexOf(b.f);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
    return byName.compare(b.f, a.f);
  });
}

export async function makeThumbs(shots, out) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("sharp not installed, gallery will use full-size images");
    return;
  }
  const dir = join(out, "assets/img/gallery/_thumbs");
  await mkdir(dir, { recursive: true });
  await Promise.all(
    shots.map(async (s) => {
      const name = s.f.replace(/\.[^.]+$/, "") + ".webp";
      const info = await sharp(join(DIR, s.f)).rotate().resize({ width: 720, withoutEnlargement: true }).webp({ quality: 72 }).toFile(join(dir, name));
      s.thumb = `/assets/img/gallery/_thumbs/${encodeURIComponent(name)}`;
      s.tw = info.width;
      s.th = info.height;
    })
  );
}

function tile(s, cls) {
  const src = `/assets/img/gallery/${encodeURIComponent(s.f)}`;
  const img = s.thumb || src;
  return `<a class="${cls}" href="${src}" data-shot data-caption="${esc(s.caption)}"><img src="${img}" alt="${esc(s.caption || "Last Chance Roleplay screenshot")}" width="${s.tw || s.w}" height="${s.th || s.h}" loading="lazy" decoding="async">${s.caption ? `<span>${esc(s.caption)}</span>` : ""}</a>`;
}

export function renderGallery(part, shots) {
  if (part === "count") return String(shots.length);
  if (part === "grid") {
    if (!shots.length) {
      return `<div class="gempty"><h3>No shots yet</h3><p>Screenshots from the city will show up here soon. Got a good one? Post it in the Discord.</p></div>`;
    }
    return `<div class="ggrid">${shots.map((s) => tile(s, "gtile")).join("")}</div>`;
  }
  if (part === "strip") {
    if (!shots.length) return "";
    return `
  <section class="section section--tight gstrip-sec" style="padding-top:0">
    <div class="wrap">
      <div class="gstrip__head" data-reveal>
        <div><span class="eyebrow">From the city</span><h2>Caught on <span class="slash">camera</span></h2></div>
        <a class="btn btn--ghost" href="/gallery">View all ${shots.length}</a>
      </div>
    </div>
    <div class="gstrip" data-reveal>${shots.slice(0, 8).map((s) => tile(s, "gstrip__item")).join("")}</div>
  </section>`;
  }
  throw new Error(`Unknown gallery part ${part}`);
}
