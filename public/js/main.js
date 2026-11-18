const LCRP = {
  connect: "play.lcrp5m.net",
  discordInvite: "lcrp5m",
  cfxCode: "",
  statusApi: "/api/status",
  statusPage: "https://status.lcrp5m.net/status/lcrp",
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

const SCAN = {
  ccso: {
    label: "CCSO",
    units: ["2-ADAM-14", "2-ADAM-22", "2-BAKER-7", "K9-3", "2-DAVID-11", "SGT-204"],
    calls: [
      "10-8, back in service off Tara Blvd at Hwy 138",
      "traffic stop, gray Charger, Jonesboro Rd SB near Lake Spivey Pkwy",
      "en route to a 10-16 domestic, Battle Creek Rd",
      "requesting a second unit, suspicious vehicle behind the Southlake Mall lot",
      "subject in custody, transporting to Harold R. Banke Justice Center",
      "show me out on a welfare check, Upper Riverdale Rd",
      "10-50 minor, Mount Zion Blvd at Mt Zion Rd, no injuries",
      "copy, clearing the scene, Old Dixie Hwy",
    ],
  },
  gsp: {
    label: "GSP",
    units: ["GSP 912", "GSP 947", "GSP 930", "TFC 4", "SCRT 21"],
    calls: [
      "clocking 108 in a 70, I-75 NB at exit 228",
      "pursuit terminated, I-285 EB past Riverdale Rd, PIT not authorized",
      "assisting CCSO, disabled vehicle in the HOV lane, I-75 SB",
      "10-38, black Mustang, I-85 SB near Flat Shoals Rd",
      "requesting wrecker, single vehicle off the ramp at exit 235",
      "show me 10-6 on a DUI checkpoint, Hwy 138 at I-75",
      "10-8, resuming patrol on I-285 toward Camp Creek",
    ],
  },
  sfpd: {
    label: "SFPD",
    units: ["SF-231", "SF-217", "SF-240", "SF-SGT-12", "SF-TRAF-3"],
    calls: [
      "shots fired call, Old National Hwy near Godby Rd, staging",
      "10-97 at the Camp Creek Marketplace, 911 hang-up",
      "foot pursuit, heading west behind the plaza on Old National",
      "traffic stop, Cascade Rd at Butner Rd, plate coming back clear",
      "requesting EMS, one down, Roosevelt Hwy at Flat Shoals",
      "code 4, suspect detained, Stonewall Tell Rd",
      "10-8, back to my beat in Union City",
    ],
  },
  fire: {
    label: "CCFES",
    units: ["ENGINE 3", "MEDIC 12", "RESCUE 7", "TRUCK 1", "BATT 2", "MEDIC 5"],
    calls: [
      "on scene, single-story residential, smoke showing, Hwy 138",
      "MVC with entrapment, I-75 SB, requesting extrication",
      "transporting one, priority 2, to Southern Regional",
      "fire under control, starting overhaul",
      "en route, possible structure fire, Morrow Rd",
      "patient refused transport, clearing",
      "available in quarters",
    ],
  },
};

function initScanner() {
  const root = $("[data-scanner]");
  if (!root) return;
  const log = $(".scanner__log", root);
  const canvas = $("canvas", root);
  const ctx = canvas.getContext("2d");
  const btns = $$(".scanner__ch button", root);
  const freq = $("[data-freq]", root);
  let channel = "all";
  let energy = 0;
  const bars = 72;
  const heights = new Array(bars).fill(0);

  const clock = () => {
    const d = new Date();
    return d.toLocaleTimeString("en-GB", { hour12: false });
  };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  function push() {
    const keys = channel === "all" ? Object.keys(SCAN) : [channel];
    const k = pick(keys);
    const dept = SCAN[k];
    const li = document.createElement("li");
    li.innerHTML = `<time>${clock()}</time><span class="u"></span><span class="m"></span>`;
    li.querySelector(".u").textContent = channel === "all" ? dept.label : pick(dept.units);
    li.querySelector(".m").textContent = (channel === "all" ? `${pick(dept.units)}, ` : "") + pick(dept.calls);
    log.prepend(li);
    while (log.children.length > 14) log.lastElementChild.remove();
    energy = 1;
  }

  btns.forEach((b) =>
    b.addEventListener("click", () => {
      channel = b.dataset.ch;
      btns.forEach((x) => x.setAttribute("aria-pressed", x === b));
      if (freq) freq.textContent = b.dataset.freq;
      log.innerHTML = "";
      push();
    })
  );

  function size() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener("resize", size);

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);

  function draw(t) {
    requestAnimationFrame(draw);
    if (!visible) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    energy *= 0.985;
    const gap = 2;
    const bw = (w - gap * (bars - 1)) / bars;
    for (let i = 0; i < bars; i++) {
      const n = Math.sin(i * 0.35 + t / 180) * Math.sin(i * 0.11 - t / 400) * 0.5 + 0.5;
      const target = 0.14 + n * 0.1 + energy * (0.25 + n * 0.75) * (0.6 + Math.random() * 0.4);
      heights[i] += (target - heights[i]) * 0.25;
      const bh = Math.max(2, heights[i] * h);
      ctx.fillStyle = energy > 0.25 ? "#e8312b" : "#5d6068";
      ctx.globalAlpha = 0.35 + heights[i] * 0.65;
      ctx.fillRect(i * (bw + gap), (h - bh) / 2, bw, bh);
    }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(draw);

  for (let i = 0; i < 5; i++) push();
  const loop = () => {
    if (visible && !document.hidden) push();
    setTimeout(loop, 2600 + Math.random() * 3400);
  };
  setTimeout(loop, 2400);
}

const DEPT_INFO = {
  ccso: ["Clayton County", "Unincorporated Clayton, county roads, the jail and courts."],
  gsp: ["Statewide", "I-75, I-85, I-285 and every state route in between."],
  sfpd: ["City of South Fulton", "Old National, Camp Creek, Cascade and the city limits."],
  fire: ["Clayton County", "Fire suppression, rescue and EMS from stations across the county."],
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
        const pings = beats.map((b) => b.ping).filter(Number.isFinite);
        const avg = pings.length ? Math.round(pings.reduce((a, b) => a + b, 0) / pings.length) : null;
        const row = document.createElement("div");
        row.className = "mon";
        row.innerHTML = `
          <div class="mon__name"><i class="dot ${last ? (up ? "is-up" : "is-down") : ""}"></i><span></span></div>
          <div class="mon__stats mono"><span>avg <b>${avg ?? "--"}</b> ms</span><span>24h <b>${Number.isFinite(uptime) ? (uptime * 100).toFixed(2) + "%" : "--"}</b></span></div>
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
          i.dataset.t = `${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${b.status === 1 ? "Up" : "Down"}${Number.isFinite(b.ping) ? ` · ${b.ping} ms` : ""}`;
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

function initYear() {
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

initNav();
initCopy();
initReveal();
initBadge();
initLive();
initScanner();
initDeptMap();
initTabs();
initBoard();
initYear();
