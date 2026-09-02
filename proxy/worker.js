/**
 * Cloudflare Worker: CORS proxy for the Google Apps Script API.
 *
 * Environment variables:
 *   GAS_API_URL   = https://script.google.com/macros/s/....../exec
 *   ALLOWED_ORIGIN = https://YOUR_GITHUB_USERNAME.github.io
 *
 * Do NOT put Google credentials or Sheet IDs here.
 */
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin, env)
      });
    }

    const allowed = isAllowedOrigin(origin, env.ALLOWED_ORIGIN);
    if (!allowed) {
      return json({ ok: false, error: "Origin không được phép.", code: "FORBIDDEN_ORIGIN" }, 403, origin, env);
    }

    const incoming = new URL(request.url);
    const target = new URL(env.GAS_API_URL);

    // Preserve query string for GET.
    for (const [key, value] of incoming.searchParams) {
      target.searchParams.set(key, value);
    }

    const init = {
      method: request.method,
      headers: new Headers(),
      redirect: "follow"
    };

    // Forward JSON/text body for POST/PUT/PATCH.
    if (!["GET", "HEAD"].includes(request.method)) {
      const body = await request.arrayBuffer();
      init.body = body;
      const ct = request.headers.get("Content-Type");
      if (ct) init.headers.set("Content-Type", ct);
    }

    try {
      const upstream = await fetch(target.toString(), init);
      const text = await upstream.text();

      return new Response(text, {
        status: upstream.status,
        headers: {
          ...corsHeaders(origin, env.ALLOWED_ORIGIN),
          "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    } catch (err) {
      return json({
        ok: false,
        error: "Không kết nối được Google Apps Script.",
        detail: String(err && err.message || err),
        code: "UPSTREAM_ERROR"
      }, 502, origin, env);
    }
  }
};

function isAllowedOrigin(origin, configured) {
  if (!configured) return false;
  return configured.split(",").map(x => x.trim()).filter(Boolean).includes(origin);
}

function corsHeaders(origin, configured) {
  const allow = isAllowedOrigin(origin, configured) ? origin : "null";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(data, status, origin, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(origin, env.ALLOWED_ORIGIN),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
