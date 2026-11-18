const LCRP = {
  connect: "play.lcrp5m.net",
  discordInvite: "lcrp5m",
  cfxCode: "",
  statusApi: "/api/status",
  fivemMonitorId: 1,
};

document.documentElement.classList.remove("no-js");

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = new Intl.NumberFormat("en-US");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function toast(msg) {
  let t = $(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    document.body.append(t);
  }
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("is-on"), 2200);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function initNav() {
  const nav = $(".nav");
  if (!nav) return;
  const solid = () => nav.classList.toggle("is-solid", scrollY > 24);
  solid();
  addEventListener("scroll", solid, { passive: true });
  const toggle = $(".nav__toggle", nav);
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$(".nav__links a", nav).forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );
}

function initCopy() {
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await copy(btn.dataset.copy);
      if (!ok) return;
      const label = btn.querySelector(".hint") || btn;
      const prev = label.textContent;
      btn.classList.add("is-done");
      label.textContent = "Copied";
      toast(btn.dataset.toast || `Copied ${btn.dataset.copy}`);
      setTimeout(() => {
        btn.classList.remove("is-done");
        label.textContent = prev;
      }, 1800);
    });
  });
}

function initReveal() {
  const els = $$("[data-reveal]");
  if (!("IntersectionObserver" in window) || reduced) {
    els.forEach((e) => e.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const d = Number(en.target.dataset.reveal) || 0;
        setTimeout(() => en.target.classList.add("is-in"), d);
        io.unobserve(en.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((e) => io.observe(e));
}

function initBadge() {
  const box = $(".hero__badge");
  if (!box || reduced || matchMedia("(hover: none)").matches) return;
  const inner = $(".hero__badge-inner", box);
  const glare = $(".hero__badge-glare", box);
  let raf;
  box.addEventListener("pointermove", (e) => {
    const r = box.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      inner.style.transform = `rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 12}deg)`;
      glare.style.setProperty("--gx", `${x * 100}%`);
      glare.style.setProperty("--gy", `${y * 100}%`);
    });
  });
  box.addEventListener("pointerleave", () => {
    inner.style.transform = "";
  });
}

async function getDiscord() {
  const r = await fetch(`https://discord.com/api/v10/invites/${LCRP.discordInvite}?with_counts=true`);
  if (!r.ok) throw new Error(r.status);
  const d = await r.json();
  return { members: d.approximate_member_count, online: d.approximate_presence_count };
}

async function getStatus() {
  const r = await fetch(LCRP.statusApi, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

async function getPlayers() {
  if (!LCRP.cfxCode) return null;
  const r = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${LCRP.cfxCode}`);
  if (!r.ok) throw new Error(r.status);
  const d = (await r.json()).Data;
  return { clients: d.clients, max: d.sv_maxclients ?? d.svMaxclients };
}

function countUp(el, to) {
  if (reduced || !Number.isFinite(to)) {
    el.textContent = fmt.format(to);
    return;
  }
  const start = performance.now();
  const dur = 1100;
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function lastBeat(status, id) {
  const list = status?.heartbeatList?.[id];
  return list?.length ? list[list.length - 1] : null;
}

function initLive() {
  const live = $("[data-live]");
  const ctaCount = $$("[data-discord-members]");
  const ctaOnline = $$("[data-discord-online]");
  if (!live && !ctaCount.length) return;

  getDiscord()
    .then(({ members, online }) => {
      $$("[data-discord-members]").forEach((el) => countUp(el, members));
      $$("[data-discord-online]").forEach((el) => countUp(el, online));
    })
    .catch(() => {
      $$("[data-discord-members], [data-discord-online]").forEach((el) => (el.textContent = "--"));
    });

  if (!live) return;
  const cityV = $("[data-city]", live);
  const cityDot = $("[data-city-dot]", live);
  const citySub = $("[data-city-sub]", live);
  const upV = $("[data-uptime]", live);
  const upK = $("[data-uptime-k]", live);
  const upSub = $("[data-uptime-sub]", live);

  getStatus()
    .then((s) => {
      const beat = lastBeat(s, LCRP.fivemMonitorId);
      const up = beat?.status === 1;
      cityV.textContent = beat ? (up ? "Online" : "Down") : "Unknown";
      cityDot.className = `dot ${beat ? (up ? "is-up" : "is-down") : ""}`;
      if (beat) citySub.textContent = `${beat.ping ?? "--"} ms · checked ${timeAgo(beat.time)}`;
      const u = s?.uptimeList?.[`${LCRP.fivemMonitorId}_24`];
      if (Number.isFinite(u)) {
        upV.innerHTML = `${(u * 100).toFixed(2)}<small>%</small>`;
      }
    })
    .catch(() => {
      cityV.textContent = "Unknown";
      citySub.textContent = "Status feed unavailable";
    });

  getPlayers()
    .then((p) => {
      if (!p) return;
      upK.textContent = "Players";
      upV.innerHTML = `${p.clients}<small>/ ${p.max}</small>`;
      upSub.textContent = "In the city right now";
    })
    .catch(() => {});
}

function parseKumaTime(t) {
  return new Date(t.replace(" ", "T") + "Z");
}

function timeAgo(t) {
  const s = Math.max(0, (Date.now() - parseKumaTime(t).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  return `${Math.round(s / 3600)}h ago`;
}

const DEPT_INFO = {
  ccso: ["Clayton County", "County patrol, the jail and the courts, everywhere outside city limits."],
  gsp: ["Statewide", "Every highway and state route, plus backup for any agency that needs it."],
  sfpd: ["South Fulton", "Everything inside city limits."],
  fire: ["Clayton County", "Fire, rescue and EMS from stations across the county."],
};

function initDeptMap() {
  const map = $("[data-map]");
  if (!map) return;
  const items = $$("[data-dept]");
  const title = $("[data-map-title]", map);
  const desc = $("[data-map-desc]", map);
  const set = (k) => {
    map.dataset.focus = k;
    items.forEach((i) => i.classList.toggle("is-active", i.dataset.dept === k));
    title.textContent = DEPT_INFO[k][0];
    desc.textContent = DEPT_INFO[k][1];
  };
  items.forEach((i) => {
    i.addEventListener("pointerenter", () => set(i.dataset.dept));
    i.addEventListener("focus", () => set(i.dataset.dept));
  });
  set(items[0].dataset.dept);
}

function initTabs() {
  const tabs = $$(".dtabs a");
  if (!tabs.length) return;
  const sections = tabs.map((a) => $(a.getAttribute("href")));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        tabs.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
        const active = $(".dtabs a.is-active");
        active?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => s && io.observe(s));
}

function initRules() {
  const bar = $("[data-rbar]");
  if (!bar) return;
  const input = $("[data-rsearch]", bar);
  const chips = $$(".chip", bar);
  const count = $("[data-rcount]", bar);
  const empty = $("[data-rempty]");
  const rules = $$(".rule");
  const ruleSecs = $$(".rsec").filter((s) => s.querySelector(".rule"));
  const introSecs = $$(".rsec").filter((s) => !s.querySelector(".rule"));
  const toc = $$(".rtoc a");
  const active = new Set();
  const originals = new Map(rules.map((r) => [r, $$("h3, p, li", r).map((el) => [el, el.innerHTML])]));

  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function highlight(rule, terms) {
    originals.get(rule).forEach(([el, html]) => {
      if (!terms.length) {
        el.innerHTML = html;
        return;
      }
      const re = new RegExp(`(${terms.map(escRe).join("|")})`, "gi");
      el.innerHTML = html.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => (tag ? tag : text.replace(re, "<mark>$1</mark>")));
    });
  }

  function apply() {
    const q = input.value.trim().toLowerCase();
    const terms = q.split(/\s+/).filter((t) => t.length > 1);
    let shown = 0;
    rules.forEach((r) => {
      const codes = r.dataset.codes.split(" ");
      const okText = !terms.length || terms.every((t) => r.dataset.text.includes(t));
      const okCode = !active.size || [...active].some((c) => codes.includes(c));
      const ok = okText && okCode;
      r.hidden = !ok;
      if (ok) shown++;
      highlight(r, ok ? terms : []);
    });
    const filtering = terms.length || active.size;
    ruleSecs.forEach((s) => (s.hidden = !s.querySelector(".rule:not([hidden])")));
    introSecs.forEach((s) => (s.hidden = !!filtering));
    toc.forEach((a) => {
      const sec = $(a.getAttribute("href"));
      a.classList.toggle("is-empty", !!sec?.hidden);
    });
    empty.hidden = shown > 0;
    count.textContent = filtering ? `${shown} of ${rules.length} rules` : `${rules.length} rules`;
    const url = new URL(location.href);
    q ? url.searchParams.set("q", q) : url.searchParams.delete("q");
    active.size ? url.searchParams.set("p", [...active].join(",")) : url.searchParams.delete("p");
    history.replaceState(null, "", url);
  }

  const params = new URLSearchParams(location.search);
  if (params.get("q")) input.value = params.get("q");
  (params.get("p") || "").split(",").filter(Boolean).forEach((c) => active.add(c));
  chips.forEach((c) => c.setAttribute("aria-pressed", active.has(c.dataset.code)));

  let t;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(apply, 120);
  });
  chips.forEach((c) =>
    c.addEventListener("click", () => {
      const code = c.dataset.code;
      active.has(code) ? active.delete(code) : active.add(code);
      c.setAttribute("aria-pressed", active.has(code));
      apply();
    })
  );
  $("[data-rclear]")?.addEventListener("click", () => {
    input.value = "";
    active.clear();
    chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
    apply();
    input.focus();
  });

  addEventListener("keydown", (e) => {
    const typing = /input|textarea/i.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === "Escape" && document.activeElement === input) {
      input.value = "";
      apply();
      input.blur();
    }
  });

  $$(".rule__id").forEach((a) =>
    a.addEventListener("click", async (e) => {
      e.preventDefault();
      const hash = a.getAttribute("href");
      history.replaceState(null, "", hash);
      const rule = a.closest(".rule");
      rule.classList.remove("is-flash");
      void rule.offsetWidth;
      rule.classList.add("is-flash");
      if (await copy(`${location.origin}${location.pathname}${hash}`)) toast(`Link to rule ${a.textContent} copied`);
    })
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        toc.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
      });
    },
    { rootMargin: "-30% 0px -65% 0px" }
  );
  $$(".rsec").forEach((s) => io.observe(s));

  apply();
}

function initGallery() {
  const items = $$("[data-shot]");
  if (!items.length) return;
  const box = document.createElement("div");
  box.className = "lb";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Screenshot viewer");
  box.hidden = true;
  box.innerHTML = `
    <button class="lb__x" type="button" aria-label="Close">&times;</button>
    <button class="lb__nav lb__prev" type="button" aria-label="Previous">&#8249;</button>
    <figure><img alt=""><figcaption><span class="lb__cap"></span><span class="lb__n mono"></span></figcaption></figure>
    <button class="lb__nav lb__next" type="button" aria-label="Next">&#8250;</button>`;
  document.body.append(box);
  const img = $("img", box);
  const cap = $(".lb__cap", box);
  const n = $(".lb__n", box);
  let i = 0;
  let last;

  function show(k) {
    i = (k + items.length) % items.length;
    const el = items[i];
    img.src = el.getAttribute("href");
    img.alt = el.dataset.caption || "";
    cap.textContent = el.dataset.caption || "";
    n.textContent = `${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    [items[i + 1], items[i - 1]].forEach((x) => x && (new Image().src = x.getAttribute("href")));
  }
  function open(k) {
    last = document.activeElement;
    show(k);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lb__x", box).focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = "";
    last?.focus();
  }
  items.forEach((el, k) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      open(k);
    })
  );
  $(".lb__x", box).addEventListener("click", close);
  $(".lb__prev", box).addEventListener("click", () => show(i - 1));
  $(".lb__next", box).addEventListener("click", () => show(i + 1));
  box.addEventListener("click", (e) => e.target === box && close());
  addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(i + 1);
    if (e.key === "ArrowLeft") show(i - 1);
  });
  let sx = null;
  box.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  box.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    sx = null;
  });
}

function initBoard() {
  const board = $("[data-board]");
  if (!board) return;
  const groupsEl = $("[data-groups]", board);
  const stateEl = $("[data-state]", board);
  const stateDot = $("[data-state-dot]", board);
  const updated = $("[data-updated]", board);
  const tip = document.createElement("div");
  tip.className = "tip";
  document.body.append(tip);

  groupsEl.addEventListener("pointerover", (e) => {
    const b = e.target.closest(".beats i");
    if (!b || !b.dataset.t) return;
    tip.textContent = b.dataset.t;
    const r = b.getBoundingClientRect();
    tip.style.left = `${Math.min(innerWidth - 90, Math.max(90, r.left + r.width / 2))}px`;
    tip.style.top = `${r.top}px`;
    tip.classList.add("is-on");
  });
  groupsEl.addEventListener("pointerout", () => tip.classList.remove("is-on"));

  async function load() {
    let s;
    try {
      s = await getStatus();
    } catch {
      stateEl.textContent = "Status feed unavailable";
      stateDot.className = "dot is-warn";
      return;
    }
    const groups = s.config?.publicGroupList || [];
    let down = 0;
    let total = 0;
    groupsEl.innerHTML = "";
    groups.forEach((g) => {
      const sec = document.createElement("section");
      sec.className = "board__group";
      sec.innerHTML = `<h3></h3><div class="monitors"></div>`;
      sec.querySelector("h3").textContent = g.name;
      const list = sec.querySelector(".monitors");
      g.monitorList.forEach((m) => {
        const beats = (s.heartbeatList?.[m.id] || []).slice(-60);
        const last = beats[beats.length - 1];
        const up = last?.status === 1;
        total++;
        if (!up) down++;
        const uptime = s.uptimeList?.[`${m.id}_24`];
        const row = document.createElement("div");
        row.className = "mon";
        row.innerHTML = `
          <div class="mon__name"><i class="dot ${last ? (up ? "is-up" : "is-down") : ""}"></i><span></span></div>
          <div class="mon__stats mono"><span>24h <b>${Number.isFinite(uptime) ? (uptime * 100).toFixed(2) + "%" : "--"}</b></span></div>
          <div class="beats"></div>
          <div class="beats__axis mono"><span>${beats.length ? beats.length + "m ago" : ""}</span><span>now</span></div>`;
        row.querySelector(".mon__name span").textContent = m.name.replace(/^LCRP\s*-\s*/, "");
        const bar = row.querySelector(".beats");
        const pad = 60 - beats.length;
        for (let i = 0; i < pad; i++) bar.append(document.createElement("i"));
        beats.forEach((b) => {
          const i = document.createElement("i");
          i.className = b.status === 1 ? "u" : b.status === 0 ? "d" : "p";
          const d = parseKumaTime(b.time);
          i.dataset.t = `${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${b.status === 1 ? "Up" : "Down"}`;
          bar.append(i);
        });
        list.append(row);
      });
      groupsEl.append(sec);
    });
    if (!total) {
      stateEl.textContent = "No monitors published";
      stateDot.className = "dot";
    } else if (!down) {
      stateEl.textContent = "All systems operational";
      stateDot.className = "dot is-up";
    } else {
      stateEl.textContent = `${down} of ${total} systems reporting down`;
      stateDot.className = down === total ? "dot is-down" : "dot is-warn";
    }
    updated.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  load();
  setInterval(() => !document.hidden && load(), 60000);
}

function initPotd() {
  const root = $("[data-potd]");
  const data = $("#potd-data");
  if (!root || !data) return;
  let list;
  try {
    list = JSON.parse(data.textContent);
  } catch {
    return;
  }
  if (!list.length) return;

  const HALF_LIFE = 15;
  const KEY = "lcrp:last-shot";
  const weights = list.map((_, i) => Math.pow(0.5, i / HALF_LIFE));
  const link = $(".potd__img", root);
  const img = $("img", link);
  const cap = $("[data-potd-cap]", root);
  const count = $("[data-potd-n]", root);
  let current = -1;

  const read = () => {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  };
  const save = (v) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
  };

  function pick(avoid) {
    const total = weights.reduce((a, w, i) => a + (avoid.has(i) ? 0 : w), 0);
    let r = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      if (avoid.has(i)) continue;
      r -= weights[i];
      if (r <= 0) return i;
    }
    return 0;
  }

  function show(i) {
    current = i;
    const shot = list[i];
    link.href = shot.full;
    link.dataset.caption = shot.caption || "";
    img.classList.remove("is-in");
    img.onload = () => img.classList.add("is-in");
    img.src = shot.src;
    img.alt = shot.caption || "Screenshot from Last Chance Roleplay";
    cap.textContent = shot.caption || "";
    count.textContent = `${String(i + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
    save(shot.full);
  }

  const last = list.findIndex((s) => s.full === read());
  show(pick(new Set(list.length > 1 && last >= 0 ? [last] : [])));

  $("[data-potd-shuffle]", root)?.addEventListener("click", () => {
    show(pick(new Set(list.length > 1 ? [current] : [])));
  });
}

function initYear() {
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

initNav();
initCopy();
initReveal();
initBadge();
initLive();
initDeptMap();
initTabs();
initRules();
initGallery();
initBoard();
initPotd();
initYear();
