import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8787);

// ---- Validation ----
const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'name_required')
    .max(100, 'name_max'),
  email: z
    .string()
    .trim()
    .min(1, 'email_required')
    .max(254, 'email_max')
    .email('email_invalid'),
  subject: z
    .string()
    .trim()
    .min(1, 'subject_required')
    .max(150, 'subject_max'),
  message: z
    .string()
    .trim()
    .min(10, 'message_min')
    .max(2000, 'message_max'),
  // Honeypot
  website: z.string().optional().default(''),
});

function normalizeHeader(value) {
  // Prevent header injection. (No CR/LF in headers.)
  return (value ?? '').toString().replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(s) {
  return (s ?? '')
    .toString()
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    typeof process.env.SMTP_SECURE === 'string'
      ? process.env.SMTP_SECURE.toLowerCase() === 'true'
      : port === 465;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

function requiredEnvOrNull() {
  const transport = getTransport();
  const mailTo = process.env.MAIL_TO;
  const mailFrom = process.env.MAIL_FROM;

  if (!transport || !mailTo || !mailFrom) return null;
  return { transport, mailTo, mailFrom };
}

// ---- App ----
const app = express();

app.use(
  helmet({
    // Vite/SPA often uses inline scripts in dev; keep defaults safe for a small site.
    contentSecurityPolicy: false,
  })
);

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15);
const maxRequests = Number(process.env.RATE_LIMIT_MAX || 5);

const contactLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const parsed = ContactSchema.safeParse(req.body);

  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path?.[0];
      if (typeof field === 'string' && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return res.status(400).json({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please check the form and try again.',
        fieldErrors,
      },
    });
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot: if filled, silently accept (prevents giving bots feedback).
  if (website && website.trim().length > 0) {
    return res.json({ ok: true });
  }

  const config = requiredEnvOrNull();
  if (!config) {
    return res.status(500).json({
      ok: false,
      error: { code: 'SERVER_NOT_CONFIGURED', message: 'Email server is not configured.' },
    });
  }

  const prefix = process.env.MAIL_SUBJECT_PREFIX || '[Monte Sion Website]';
  const finalSubject = normalizeHeader(`${prefix} ${subject}`);

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>`,
    `<hr />`,
    `<pre style="white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;">${escapeHtml(
      message
    )}</pre>`,
  ].join('\n');

  try {
    await config.transport.sendMail({
      from: config.mailFrom,
      to: config.mailTo,
      replyTo: normalizeHeader(email),
      subject: finalSubject,
      text,
      html,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('contact mail send failed:', err);
    return res.status(500).json({
      ok: false,
      error: { code: 'SEND_FAILED', message: 'Failed to send message.' },
    });
  }
});

// ---- Static hosting (production) ----
// If you deploy this server, build the client with `npm run build`
// then start the server with NODE_ENV=production.
if (process.env.NODE_ENV === 'production') {
  const distDir = path.join(__dirname, '..', 'dist');
  app.use(express.static(distDir));

  // SPA fallback (non-API routes)
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
