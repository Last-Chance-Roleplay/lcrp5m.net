import { basics, classes, finalPolicy, sections, special } from "./data/rules.mjs";

const SCALE = ["A", "B", "C", "D", "E", "F", "CR"];
const TAGS = ["CD", "GB", "SI"];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (id) => `r-${id.replace(/\./g, "-")}`;

function parsePenalty(p) {
  const parts = p.split("+");
  const levels = new Set();
  const tags = new Set();
  for (const part of parts) {
    const [from, to] = part.split("-");
    if (TAGS.includes(from)) { tags.add(from); continue; }
    if (to && TAGS.includes(to)) { levels.add(from); tags.add(to); continue; }
    const a = SCALE.indexOf(from);
    const b = to ? SCALE.indexOf(to) : a;
    for (let i = a; i <= b; i++) levels.add(SCALE[i]);
  }
  return { levels, tags };
}

function label(p) {
  return p.replace(/-/g, " → ").replace(/\+/g, " + ");
}

function scale({ levels, tags }) {
  const pips = SCALE.map((c) => `<i class="pip pip--${c.toLowerCase()}${levels.has(c) ? " is-on" : ""}">${c}</i>`).join("");
  const t = [...tags].map((c) => `<i class="pip pip--tag is-on">${c}</i>`).join("");
  return `<span class="scale" aria-hidden="true">${pips}${t}</span>`;
}

function list(title, items, cls) {
  if (!items?.length) return "";
  return `<div class="rule__list ${cls}"><h4>${title}</h4><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
}

function rule(r) {
  const pen = parsePenalty(r.p);
  const codes = [...pen.levels, ...pen.tags].join(" ");
  const text = [r.id, r.t, r.d, ...(r.ex || []), ...(r.ok || [])].join(" ").toLowerCase();
  return `
        <article class="rule" id="${slug(r.id)}" data-codes="${codes}" data-text="${esc(text)}">
          <header class="rule__head">
            <a class="rule__id mono" href="#${slug(r.id)}" title="Copy link to ${r.id}">${r.id}</a>
            <h3>${esc(r.t)}</h3>
            <span class="rule__pen"><span class="mono">${label(r.p)}</span>${scale(pen)}</span>
          </header>
          <p>${esc(r.d)}${r.tbd ? ' <span class="tbd mono">TBD</span>' : ""}</p>
          ${list("Examples", r.ex, "is-no")}
          ${list("What's allowed", r.ok, "is-ok")}
        </article>`;
}

export function renderRules(part) {
  if (part === "toc") {
    const items = [
      `<li><a href="#s-1"><span class="mono">01</span>Community Requirements</a></li>`,
      `<li><a href="#s-2"><span class="mono">02</span>Infractions</a></li>`,
      ...sections.map((s) => `<li><a href="#s-${s.n}"><span class="mono">${String(s.n).padStart(2, "0")}</span>${esc(s.title)}</a></li>`),
    ];
    return items.join("\n          ");
  }
  if (part === "count") {
    return String(sections.reduce((n, s) => n + s.rules.length, 0));
  }
  if (part === "chips") {
    return [...SCALE, ...TAGS].map((c) => `<button type="button" class="chip chip--${c.toLowerCase()}" data-code="${c}" aria-pressed="false">${c}</button>`).join("");
  }
  if (part === "intro") {
    const cls = classes.map((c) => `
            <div class="cls cls--${c.code.toLowerCase()}"><b>${c.code}</b><span>${esc(c.text)}</span></div>`).join("");
    const sp = special.map((c) => `
            <div class="spec"><b class="mono">${c.code}</b><div><h4>${esc(c.name)}</h4><p>${esc(c.text)}</p></div></div>`).join("");
    return `
      <section class="rsec" id="s-1">
        <div class="rsec__head"><span class="mono">SECTION 01</span><h2>Community Requirements</h2></div>
        <h3 class="rsub">1.1 Basic information</h3>
        <ul class="basics">${basics.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      </section>
      <section class="rsec" id="s-2">
        <div class="rsec__head"><span class="mono">SECTION 02</span><h2>Infractions</h2></div>
        <p class="rsec__lede">How infractions are classified, and what each level of severity means. Every rule below shows its range on this scale.</p>
        <h3 class="rsub">2.1 Standard infraction guidelines</h3>
        <div class="classes">${cls}
            <div class="cls cls--cr"><b>CR</b><span>Community Removal. Indefinite.</span></div>
        </div>
        <h3 class="rsub">2.2 Specialized infraction guidelines</h3>
        <div class="specs-grid">${sp}
        </div>
        <h3 class="rsub">2.3 Final infraction policy</h3>
        <p class="final">${esc(finalPolicy)}</p>
      </section>`;
  }
  if (part === "body") {
    return sections.map((s) => `
      <section class="rsec" id="s-${s.n}">
        <div class="rsec__head"><span class="mono">SECTION ${String(s.n).padStart(2, "0")}</span><h2>${esc(s.title)}</h2></div>
        ${s.note ? `<p class="rsec__lede">${esc(s.note)}</p>` : ""}
        ${s.rules.map(rule).join("")}
      </section>`).join("");
  }
  throw new Error(`Unknown rules part ${part}`);
}
