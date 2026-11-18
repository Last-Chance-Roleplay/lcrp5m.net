const STATUS_ORIGIN = "https://status.lcrp5m.net";
const STATUS_SLUG = "lcrp";
const STATUS_TTL = 60;

const json = (body, status = 200, cache = `public, max-age=${STATUS_TTL}`) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache },
  });

async function status(request, ctx) {
  const cache = caches.default;
  const key = new Request(new URL("/api/status", request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  try {
    const get = (path) => fetch(`${STATUS_ORIGIN}/api/status-page/${path}${STATUS_SLUG}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
    const [page, beats] = await Promise.all([get(""), get("heartbeat/")]);
    const res = json({
      config: { title: page.config?.title, publicGroupList: page.publicGroupList || [] },
      incidents: page.incidents || [],
      maintenanceList: page.maintenanceList || [],
      heartbeatList: beats.heartbeatList || {},
      uptimeList: beats.uptimeList || {},
    });
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  } catch {
    return json({ error: "upstream_unavailable" }, 502, "no-store");
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/status" && request.method === "GET") return status(request, ctx);
    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, 404, "no-store");
    return env.ASSETS.fetch(request);
  },
};
