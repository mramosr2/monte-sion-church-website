import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";
import ContactForm from "../components/ContactForm.jsx";

const CHURCH_NAME = "Mision Evangelica Monte Sion";
const CHURCH_ADDRESS_LINES = [
  "9825 S Broadway",
  "Los Angeles, CA 90003",
  "United States",
];

const CONTACT_EMAIL = "MisionMonteSionLA@gmail.com";
const CONTACT_PHONE = "+1 (310) 433–0310";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Section title={t("contact.title")} eyebrow="contact">
      <p className="max-w-prose text-ink-700">{t("contact.subtitle")}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="font-display text-xl text-ink-900">
            {t("contact.infoTitle")}
          </h2>

          <dl className="mt-4 space-y-5 text-ink-800">
            <div>
              <dt className="text-sm font-semibold text-ink-900">
                {t("contact.churchLabel")}
              </dt>
              <dd className="mt-1">{CHURCH_NAME}</dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-ink-900">
                {t("home.addressLabel")}
              </dt>
              <dd className="mt-1 whitespace-pre-line">
                {CHURCH_ADDRESS_LINES.join("\n")}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-ink-900">
                {t("home.phoneLabel")}
              </dt>
              <dd className="mt-1">{CONTACT_PHONE}</dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-ink-900">
                {t("contact.emailFaxLabel")}
              </dt>
              <dd className="mt-1">
                <a
                  className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="font-display text-xl text-ink-900">
            {t("contact.formTitle")}
          </h2>
          <p className="mt-2 text-sm text-ink-700">{t("contact.formNote")}</p>

          {/* Disabled/Under construction overlay */}
          <div className="relative mt-6">
            {/* Render the form, but prevent focus/clicks and dim it */}
            <div
              className="opacity-40 grayscale"
              aria-hidden="true"
              inert=""
            >
              <ContactForm />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-5 text-center shadow-sm backdrop-blur">
                <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                  <span
                    className="h-2 w-2 rounded-full bg-amber-400"
                    aria-hidden="true"
                  />
                  {t("contact.formDisabled.badge")}
                </p>

                <h3 className="mt-3 font-display text-lg text-ink-900">
                  {t("contact.formDisabled.title")}
                </h3>

                <p className="mt-2 text-sm text-ink-700">
                  {t("contact.formDisabled.body", {
                    email: CONTACT_EMAIL,
                    phone: CONTACT_PHONE,
                  })}
                </p>

                <a
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  href={`mailto:${CONTACT_EMAIL}`}
                >
                  {t("contact.formDisabled.cta")}
                </a>
              </div>
            </div>
          </div>
          {/* End disabled overlay */}
        </div>
      </div>
    </Section>
  );
}
