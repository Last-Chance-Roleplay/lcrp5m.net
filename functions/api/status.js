const ORIGIN = "https://status.lcrp5m.net";
const SLUG = "lcrp";
const TTL = 60;

export async function onRequestGet({ request, waitUntil }) {
  const cache = caches.default;
  const key = new Request(new URL("/api/status", request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  try {
    const [page, beats] = await Promise.all([
      fetch(`${ORIGIN}/api/status-page/${SLUG}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${ORIGIN}/api/status-page/heartbeat/${SLUG}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
    ]);

    const body = JSON.stringify({
      config: { title: page.config?.title, publicGroupList: page.publicGroupList || [] },
      incidents: page.incidents || [],
      maintenanceList: page.maintenanceList || [],
      heartbeatList: beats.heartbeatList || {},
      uptimeList: beats.uptimeList || {},
    });

    const res = new Response(body, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": `public, max-age=${TTL}`,
      },
    });
    waitUntil(cache.put(key, res.clone()));
    return res;
  } catch {
    return new Response(JSON.stringify({ error: "upstream_unavailable" }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  }
}
