import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clampString(value, maxLen) {
  const s = (value ?? "").toString();
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

export default function ContactForm() {
  const { t } = useTranslation();

  // For GitHub Pages (static hosting), set this to your Cloudflare Worker URL.
  // Example: VITE_CONTACT_ENDPOINT="https://your-worker.your-subdomain.workers.dev/api/contact"
  // In local dev, this falls back to the local Express endpoint (proxied by Vite).
  const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact";

  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    // Honeypot (spam trap) — keep this hidden from real users.
    website: "",
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Track whether the user tried to submit at least once (used for an error summary).
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // status: 'idle' | 'success' | 'error'
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const statusRef = useRef(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const subjectRef = useRef(null);
  const messageRef = useRef(null);

  const errors = useMemo(() => {
    const next = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const subject = values.subject.trim();
    const message = values.message.trim();

    if (!name) next.name = t("contact.form.errors.required");
    else if (name.length > 100) next.name = t("contact.form.errors.max", { count: 100 });

    if (!email) next.email = t("contact.form.errors.required");
    else if (email.length > 254) next.email = t("contact.form.errors.max", { count: 254 });
    else if (!EMAIL_RE.test(email)) next.email = t("contact.form.errors.email");

    if (!subject) next.subject = t("contact.form.errors.required");
    else if (subject.length > 150) next.subject = t("contact.form.errors.max", { count: 150 });

    if (!message) next.message = t("contact.form.errors.required");
    else if (message.length < 5) next.message = t("contact.form.errors.minMessage");
    else if (message.length > 2000) next.message = t("contact.form.errors.max", { count: 2000 });

    return next;
  }, [t, values.email, values.message, values.name, values.subject]);

  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function focusFirstError(nextErrors) {
    const order = [
      ["name", nameRef],
      ["email", emailRef],
      ["subject", subjectRef],
      ["message", messageRef],
    ];

    for (const [key, ref] of order) {
      if (nextErrors[key] && ref.current) {
        ref.current.focus();
        return;
      }
    }
  }

  function focusField(field) {
    const map = {
      name: nameRef,
      email: emailRef,
      subject: subjectRef,
      message: messageRef,
    };
    const ref = map[field];
    if (ref?.current) ref.current.focus();
  }

  useEffect(() => {
    // If the server responds with an error, focus the status region so screen readers
    // announce it immediately.
    if (status.state === "error" && statusRef.current) {
      statusRef.current.focus();
    }
  }, [status.state]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: "idle", message: "" });

    setAttemptedSubmit(true);

    // Force all fields as touched so errors are announced/rendered.
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(errors).length > 0) {
      focusFirstError(errors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          website: values.website, // honeypot
        }),
      });

      if (res.status === 429) {
        setStatus({ state: "error", message: t("contact.form.errors.rateLimited") });
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // If server returns field errors, apply them and focus first error.
        const serverFieldErrors = data?.error?.fieldErrors ?? null;

        if (serverFieldErrors && typeof serverFieldErrors === "object") {
          // Mark touched so errors appear.
          setTouched({ name: true, email: true, subject: true, message: true });

          // We can't directly override memoized errors, so show a top-level error message.
          // (Server-side validation still protects the endpoint; client-side keeps UX smooth.)
          const msg = data?.error?.message || t("contact.form.errorBody");
          setStatus({ state: "error", message: msg });

          // Best-effort focus: try focusing the first server error.
          const order = [
            ["name", nameRef],
            ["email", emailRef],
            ["subject", subjectRef],
            ["message", messageRef],
          ];
          for (const [key, ref] of order) {
            if (serverFieldErrors[key] && ref.current) {
              ref.current.focus();
              break;
            }
          }
          return;
        }

        const code = data?.error?.code;
        if (code === "SERVER_NOT_CONFIGURED") {
          setStatus({ state: "error", message: t("contact.form.errors.serverConfig") });
          return;
        }

        setStatus({ state: "error", message: t("contact.form.errorBody") });
        return;
      }

      setValues({ name: "", email: "", subject: "", message: "", website: "" });
      setTouched({});
      setAttemptedSubmit(false);
      setStatus({ state: "success", message: t("contact.form.successBody") });
    } catch (err) {
      setStatus({ state: "error", message: t("contact.form.errorBody") });
    } finally {
      setSubmitting(false);
    }
  }

  const showError = (field) => Boolean(touched[field] && errors[field]);

  function describedByIds(...ids) {
    const filtered = ids.filter(Boolean);
    return filtered.length ? filtered.join(" ") : undefined;
  }

  const inputBase =
    "mt-1 w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition " +
    "focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:border-slate-400 " +
    "disabled:opacity-60";

  const hintTextClass = "mt-1 text-xs text-ink-600";
  const errorTextClass = "mt-1 text-sm text-rose-700";

  const fieldLabels = {
    name: t("contact.form.nameLabel"),
    email: t("contact.form.emailLabel"),
    subject: t("contact.form.subjectLabel"),
    message: t("contact.form.messageLabel"),
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
      {/* Honeypot field (hidden) */}
      <div
        className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setField("website", clampString(e.target.value, 200))}
        />
      </div>

      {/* Status message (focused on server error) */}
      <div
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
        className="outline-none"
      >
        {status.state === "success" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <p className="font-semibold">{t("contact.form.successTitle")}</p>
            <p className="mt-1">{status.message}</p>
          </div>
        ) : null}

        {status.state === "error" ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-semibold">{t("contact.form.errorTitle")}</p>
            <p className="mt-1">{status.message || t("contact.form.errorBody")}</p>
          </div>
        ) : null}
      </div>

      {/* Client-side validation summary (screen-reader friendly) */}
      {attemptedSubmit && Object.keys(errors).length > 0 ? (
        <div
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-semibold">{t("contact.form.validationTitle")}</p>
          <p className="mt-1">{t("contact.form.validationBody")}</p>
          <ul className="mt-3 list-disc pl-5">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <button
                  type="button"
                  onClick={() => focusField(field)}
                  className="rounded underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  <span className="font-semibold">{fieldLabels[field] || field}:</span> {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className="text-sm font-semibold text-ink-900">
          {t("contact.form.nameLabel")}
        </label>
        <input
          ref={nameRef}
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => setField("name", clampString(e.target.value, 100))}
          onBlur={() => markTouched("name")}
          className={`${inputBase} ${showError("name") ? "border-rose-300" : "border-slate-200"}`}
          aria-invalid={showError("name") ? "true" : "false"}
          aria-describedby={describedByIds(showError("name") ? "name-error" : null)}
          disabled={submitting}
          required
        />
        {showError("name") ? (
          <p id="name-error" className={errorTextClass}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-semibold text-ink-900">
          {t("contact.form.emailLabel")}
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(e) => setField("email", clampString(e.target.value, 254))}
          onBlur={() => markTouched("email")}
          className={`${inputBase} ${showError("email") ? "border-rose-300" : "border-slate-200"}`}
          aria-invalid={showError("email") ? "true" : "false"}
          aria-describedby={describedByIds("email-hint", showError("email") ? "email-error" : null)}
          disabled={submitting}
          required
        />
        <p id="email-hint" className={hintTextClass}>
          {t("contact.form.emailHintPrefix")} <code className="font-mono">name@example.com</code>
        </p>
        {showError("email") ? (
          <p id="email-error" className={errorTextClass}>
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="subject" className="text-sm font-semibold text-ink-900">
          {t("contact.form.subjectLabel")}
        </label>
        <input
          ref={subjectRef}
          id="subject"
          name="subject"
          type="text"
          autoComplete="off"
          value={values.subject}
          onChange={(e) => setField("subject", clampString(e.target.value, 150))}
          onBlur={() => markTouched("subject")}
          className={`${inputBase} ${showError("subject") ? "border-rose-300" : "border-slate-200"}`}
          aria-invalid={showError("subject") ? "true" : "false"}
          aria-describedby={describedByIds(showError("subject") ? "subject-error" : null)}
          disabled={submitting}
          required
        />
        {showError("subject") ? (
          <p id="subject-error" className={errorTextClass}>
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-semibold text-ink-900">
          {t("contact.form.messageLabel")}
        </label>
        <textarea
          ref={messageRef}
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) => setField("message", clampString(e.target.value, 2000))}
          onBlur={() => markTouched("message")}
          className={`${inputBase} resize-y ${showError("message") ? "border-rose-300" : "border-slate-200"}`}
          aria-invalid={showError("message") ? "true" : "false"}
          aria-describedby={describedByIds("message-hint", showError("message") ? "message-error" : null)}
          disabled={submitting}
          required
        />
        <p id="message-hint" className={hintTextClass}>
          {t("contact.form.messageHint")}
        </p>
        {showError("message") ? (
          <p id="message-error" className={errorTextClass}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t("contact.form.submitting") : t("contact.form.submit")}
      </button>
    </form>
  );
}
