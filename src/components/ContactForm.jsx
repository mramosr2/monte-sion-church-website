import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// Simple email format check
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Prevents someone from pasting something absurdly long into a field
function clampString(value, maxLen) {
  const s = (value ?? "").toString();
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

export default function ContactForm() {
  const { t } = useTranslation();

  // In production this points to the Cloudflare Worker that handles email sending
  // Locally it falls back to the Express server running on the same machine
  const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact";

  // All the form field values live here
  // 'website' is a honeypot - it's hidden from real users but bots fill it in automatically
  // If it has a value we know it's spam and reject the submission
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot field
  });

  // Track which fields the user has already interacted with
  // We only show errors on fields they've touched so we're not yelling at them immediately
  const [touched, setTouched] = useState({});

  const [submitting, setSubmitting] = useState(false);

  // Track if the user has tried to submit at least once
  // Used to show the full error summary at the top of the form
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // 'idle' | 'success' | 'error'
  const [status, setStatus] = useState({ state: "idle", message: "" });

  // Refs let us programmatically focus specific elements
  // This is important for accessibility - after an error, focus jumps to the problem field
  const statusRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const subjectRef = useRef(null);
  const messageRef = useRef(null);

  // useMemo means this only recalculates when the actual field values change
  // not on every single render - keeps things fast
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

  // Generic field updater so we don't need a separate setter for every field
  function setField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  // Mark a field as touched when the user leaves it (onBlur)
  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  // After a failed submit, move keyboard focus to the first field with an error
  // This is a WCAG requirement - screen reader users need to know what went wrong
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

  // Used when someone clicks a field name in the error summary at the top
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

  // When the server returns an error, focus the status region
  // aria-live on the status div will announce it to screen readers,
  // but we also need focus there for keyboard users
  useEffect(() => {
    if (status.state === "error" && statusRef.current) {
      statusRef.current.focus();
    }
  }, [status.state]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: "idle", message: "" });
    setAttemptedSubmit(true);

    // Mark every field as touched so any existing errors show up
    setTouched({ name: true, email: true, subject: true, message: true });

    // Don't even hit the server if there are client-side errors
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
          website: values.website, // honeypot - server checks this too
        }),
      });

      // 429 means the user has sent too many messages - show a specific message
      if (res.status === 429) {
        setStatus({ state: "error", message: t("contact.form.errors.rateLimited") });
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // If the server sent back field-specific errors, handle them
        const serverFieldErrors = data?.error?.fieldErrors ?? null;

        if (serverFieldErrors && typeof serverFieldErrors === "object") {
          setTouched({ name: true, email: true, subject: true, message: true });
          const msg = data?.error?.message || t("contact.form.errorBody");
          setStatus({ state: "error", message: msg });

          // Focus the first field the server complained about
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

        // Server isn't configured yet (missing email credentials in env vars)
        const code = data?.error?.code;
        if (code === "SERVER_NOT_CONFIGURED") {
          setStatus({ state: "error", message: t("contact.form.errors.serverConfig") });
          return;
        }

        setStatus({ state: "error", message: t("contact.form.errorBody") });
        return;
      }

      // Success - clear the form and show a confirmation message
      setValues({ name: "", email: "", subject: "", message: "", website: "" });
      setTouched({});
      setAttemptedSubmit(false);
      setStatus({ state: "success", message: t("contact.form.successBody") });
    } catch (err) {
      // Network error or the fetch itself failed
      setStatus({ state: "error", message: t("contact.form.errorBody") });
    } finally {
      setSubmitting(false);
    }
  }

  // Only show an error on a field if the user has already touched it
  const showError = (field) => Boolean(touched[field] && errors[field]);

  // Build the aria-describedby string - links an input to its hint/error text
  // Screen readers read this text when the input is focused
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

  // Used in the error summary so the error links say "Name: required" not just "required"
  const fieldLabels = {
    name: t("contact.form.nameLabel"),
    email: t("contact.form.emailLabel"),
    subject: t("contact.form.subjectLabel"),
    message: t("contact.form.messageLabel"),
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
      {/* Honeypot - hidden from real users, bots fill it in
          If website field has a value, the server rejects the submission as spam */}
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

      {/* Status region - aria-live means screen readers announce changes automatically
          tabIndex={-1} lets us programmatically focus it after a server error */}
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

      {/* Validation summary - only shows after the user tries to submit
          Each error is a clickable link that jumps focus to the problem field
          This is an accessibility pattern for complex forms */}
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
          // aria-invalid tells screen readers the field has an error
          aria-invalid={showError("name") ? "true" : "false"}
          // aria-describedby links this input to its error message element by ID
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
          // This input has both a hint and a possible error - both are listed here
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
        {/* Show different text while the request is in flight */}
        {submitting ? t("contact.form.submitting") : t("contact.form.submit")}
      </button>
    </form>
  );
}
