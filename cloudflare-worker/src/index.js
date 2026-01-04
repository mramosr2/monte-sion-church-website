/**
 * Cloudflare Worker — Contact form email endpoint (Resend)
 *
 * - Server-side email sending via Resend API
 * - Per-IP rate limiting via Durable Object
 * - Honeypot spam protection
 * - CORS allowlist
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

function parseAllowedOrigins(env) {
  const raw = (env.ALLOWED_ORIGINS || "").trim();
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function withCorsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowlist = parseAllowedOrigins(env);

  if (allowlist.length === 0) return {};
  if (!allowlist.includes(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin, accept-encoding",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "600",
  };
}

function escapeHtml(value) {
  return (value ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeHeader(value) {
  return (value ?? "").toString().replace(/[\r\n]+/g, " ").trim();
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function validatePayload(body) {
  const errors = {};

  const name = (body?.name ?? "").toString().trim();
  const email = (body?.email ?? "").toString().trim();
  const subject = (body?.subject ?? "").toString().trim();
  const message = (body?.message ?? "").toString().trim();

  if (!name) errors.name = "Name is required.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";

  if (!email) errors.email = "Email is required.";
  else if (email.length > 254) errors.email = "Email must be 254 characters or fewer.";
  else if (!EMAIL_RE.test(email)) errors.email = "Email format is invalid.";

  if (!subject) errors.subject = "Subject is required.";
  else if (subject.length > 150) errors.subject = "Subject must be 150 characters or fewer.";

  if (!message) errors.message = "Message is required.";
  else if (message.length > 5000) errors.message = "Message must be 5000 characters or fewer.";

  const website = (body?.website ?? "").toString().trim(); // honeypot

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: { name, email, subject, message, website },
  };
}

async function rateLimit({ env, ip }) {
  const windowMinutes = Number(env.RATE_LIMIT_WINDOW_MINUTES || 15);
  const max = Number(env.RATE_LIMIT_MAX || 5);

  const id = env.RATE_LIMITER.idFromName("global");
  const stub = env.RATE_LIMITER.get(id);

  const resp = await stub.fetch("https://rate-limiter/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip, windowMinutes, max }),
  });

  return resp.json();
}

async function sendMailWithResend({ env, name, email, subject, message }) {
  const apiKey = env.RESEND_API_KEY;
  const toEmail = env.MAIL_TO;
  const fromEmail = env.MAIL_FROM_EMAIL;
  const fromName = env.MAIL_FROM_NAME || "Monte Sion Website";
  const prefix = env.MAIL_SUBJECT_PREFIX || "[Monte Sion Website]";

  if (!apiKey) throw new Error("RESEND_API_KEY not configured");
  if (!toEmail || !fromEmail) throw new Error("MAIL_TO or MAIL_FROM_EMAIL not configured");

  const finalSubject = normalizeHeader(`${prefix} ${subject}`);

  const text =
`New contact form submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
`;

  const html = `<!doctype html>
<html>
  <body>
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;">${escapeHtml(message)}</pre>
  </body>
</html>`;

  // Resend expects:
  // - Authorization: Bearer re_...
  // - POST https://api.resend.com/emails
  // - from: "Name <email@domain>"
  // - replyTo: string
  const payload = {
    from: `${fromName} <${fromEmail}>`,
    to: [toEmail],
    subject: finalSubject,
    html,
    text,
    replyTo: email,
  };

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const details = await resp.text().catch(() => "");
    throw new Error(`Resend send failed: ${resp.status} ${details}`);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: withCorsHeaders(request, env) });
    }

    // Only allow POST /api/contact
    if (url.pathname !== "/api/contact") {
      return new Response("Not found", { status: 404 });
    }

    const corsHeaders = withCorsHeaders(request, env);
    if (Object.keys(corsHeaders).length === 0) {
      return jsonResponse(
        { ok: false, error: { code: "CORS_BLOCKED", message: "Origin not allowed." } },
        { status: 403 }
      );
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { ok: false, error: { code: "METHOD_NOT_ALLOWED", message: "Use POST." } },
        { status: 405, headers: corsHeaders }
      );
    }

    const body = await readJson(request);
    if (!body) {
      return jsonResponse(
        { ok: false, error: { code: "BAD_JSON", message: "Invalid JSON body." } },
        { status: 400, headers: corsHeaders }
      );
    }

    const { ok, errors, values } = validatePayload(body);
    if (!ok) {
      return jsonResponse(
        { ok: false, error: { code: "VALIDATION_ERROR", fieldErrors: errors } },
        { status: 400, headers: corsHeaders }
      );
    }

    // Honeypot: bots often fill this — silently succeed but do nothing
    if (values.website) {
      return jsonResponse({ ok: true }, { headers: corsHeaders });
    }

    // Rate limiting (per IP)
    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      "unknown";

    const limit = await rateLimit({ env, ip });
    if (!limit.allowed) {
      return jsonResponse(
        {
          ok: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please try again later.",
            resetAt: limit.resetAt,
          },
        },
        { status: 429, headers: { ...corsHeaders, "Cache-Control": "no-store" } }
      );
    }

    try {
      await sendMailWithResend({
        env,
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
      });

      return jsonResponse(
        { ok: true },
        { headers: { ...corsHeaders, "Cache-Control": "no-store" } }
      );
    } catch (err) {
      console.error(err);
      return jsonResponse(
        { ok: false, error: { code: "SEND_FAILED", message: "Failed to send message" } },
        { status: 500, headers: { ...corsHeaders, "Cache-Control": "no-store" } }
      );
    }
  },
};

// Durable Object: simple per-IP fixed window counter
export class RateLimiter {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname !== "/check") {
      return new Response("Not found", { status: 404 });
    }

    const body = await request.json().catch(() => null);
    if (!body?.ip) {
      return jsonResponse({ allowed: true, remaining: 0, resetAt: Date.now() });
    }

    const ip = body.ip.toString();
    const windowMinutes = Number(body.windowMinutes || 15);
    const max = Number(body.max || 5);

    const windowMs = Math.max(1, windowMinutes) * 60 * 1000;
    const now = Date.now();
    const windowId = Math.floor(now / windowMs);
    const key = `${ip}:${windowId}`;

    const record = (await this.state.storage.get(key)) || {
      count: 0,
      resetAt: (windowId + 1) * windowMs,
    };

    record.count += 1;

    const allowed = record.count <= max;
    const remaining = Math.max(0, max - record.count);

    const ttlSeconds = Math.ceil(windowMs / 1000) + 60;
    await this.state.storage.put(key, record, { expirationTtl: ttlSeconds });

    return jsonResponse({ allowed, remaining, resetAt: record.resetAt });
  }
}
