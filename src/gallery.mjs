import { execFileSync } from "node:child_process";
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

function dateFromName(f) {
  const m = f.match(/(20\d{2})[-_.]?(\d{2})[-_.]?(\d{2})(?:[ _-]?(\d{2})[.:]?(\d{2})[.:]?(\d{2}))?/);
  if (!m) return 0;
  const [, y, mo, d, h = "00", mi = "00", s = "00"] = m;
  const t = Date.parse(`${y}-${mo}-${d}T${h}:${mi}:${s}`);
  return Number.isFinite(t) ? t : 0;
}

function datesFromGit() {
  const added = new Map();
  try {
    const log = execFileSync("git", ["log", "--diff-filter=A", "--name-only", "--format=@%ct", "--", DIR], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    let t = 0;
    for (const line of log.split("\n")) {
      if (line.startsWith("@")) t = Number(line.slice(1)) * 1000;
      else if (line.trim()) {
        const f = line.trim().split("/").pop();
        if (!added.has(f)) added.set(f, t);
      }
    }
  } catch {}
  return added;
}

export async function loadGallery() {
  if (!existsSync(DIR)) return [];
  let captions = {};
  if (existsSync(join(DIR, "captions.json"))) captions = JSON.parse(await readFile(join(DIR, "captions.json"), "utf8"));
  const files = (await readdir(DIR)).filter((f) => EXT.has(extname(f).toLowerCase()));
  const gitDates = datesFromGit();
  const shots = [];
  for (const f of files) {
    const buf = await readFile(join(DIR, f));
    const dim = size(buf, extname(f).toLowerCase()) || [1600, 900];
    const date = dateFromName(f) || gitDates.get(f) || 0;
    shots.push({ f, w: dim[0], h: dim[1], date, caption: captions[f] || "", thumb: null, big: null });
  }
  const order = Object.keys(captions);
  const byName = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  return shots.sort((a, b) => {
    const ia = order.indexOf(a.f);
    const ib = order.indexOf(b.f);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
    return b.date - a.date || byName.compare(b.f, a.f);
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
  const thumbs = join(out, "assets/img/gallery/_thumbs");
  const bigs = join(out, "assets/img/gallery/_feature");
  await mkdir(thumbs, { recursive: true });
  await mkdir(bigs, { recursive: true });
  await Promise.all(
    shots.map(async (s) => {
      const name = s.f.replace(/\.[^.]+$/, "") + ".webp";
      const img = sharp(join(DIR, s.f)).rotate();
      const t = await img.clone().resize({ width: 720, withoutEnlargement: true }).webp({ quality: 72 }).toFile(join(thumbs, name));
      await img.clone().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(bigs, name));
      s.thumb = `/assets/img/gallery/_thumbs/${encodeURIComponent(name)}`;
      s.big = `/assets/img/gallery/_feature/${encodeURIComponent(name)}`;
      s.tw = t.width;
      s.th = t.height;
    })
  );
}

const full = (s) => `/assets/img/gallery/${encodeURIComponent(s.f)}`;

function tile(s, cls) {
  return `<a class="${cls}" href="${full(s)}" data-shot data-caption="${esc(s.caption)}"><img src="${s.thumb || full(s)}" alt="${esc(s.caption || "Last Chance Roleplay screenshot")}" width="${s.tw || s.w}" height="${s.th || s.h}" loading="lazy" decoding="async">${s.caption ? `<span>${esc(s.caption)}</span>` : ""}</a>`;
}

export function renderGallery(part, shots) {
  if (part === "count") return String(shots.length);
  if (part === "grid") {
    if (!shots.length) {
      return `<div class="gempty"><h3>No shots yet</h3><p>Screenshots from the city will show up here soon. Got a good one? Post it in the Discord.</p></div>`;
    }
    return `<div class="ggrid">${shots.map((s) => tile(s, "gtile")).join("")}</div>`;
  }
  if (part === "feature") {
    if (!shots.length) return "";
    const list = shots.map((s) => ({ full: full(s), src: s.big || full(s), caption: s.caption, date: s.date }));
    const first = list[0];
    return `
  <section class="section section--tight potd-sec" style="padding-top:0">
    <div class="wrap">
      <div class="gstrip__head" data-reveal>
        <div><span class="eyebrow">Shot of the day</span><h2>Today in <span class="slash">the city</span></h2></div>
        <a class="btn btn--ghost" href="/gallery">View all ${shots.length}</a>
      </div>
      <figure class="potd chamfer" data-potd data-reveal>
        <a class="potd__img" href="${first.full}" data-shot data-caption="${esc(first.caption)}">
          <img src="${first.src}" alt="${esc(first.caption || "Shot of the day")}" loading="lazy" decoding="async">
        </a>
        <figcaption class="potd__bar">
          <span class="mono potd__date" data-potd-date></span>
          <span class="potd__cap" data-potd-cap>${esc(first.caption)}</span>
          <span class="mono potd__next" data-potd-next></span>
        </figcaption>
      </figure>
      <script type="application/json" id="potd-data">${JSON.stringify(list).replace(/</g, "\\u003c")}</script>
    </div>
  </section>`;
  }
  throw new Error(`Unknown gallery part ${part}`);
}
