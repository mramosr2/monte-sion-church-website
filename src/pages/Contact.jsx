import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";
import ContactForm from "../components/ContactForm.jsx";

const CHURCH_NAME = "Mision Evangelica Monte Sion";
const CHURCH_ADDRESS_LINES = [
  "9825 S Broadway",
  "Los Angeles, CA 90003",
  "United States",
];

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Section title={t("contact.title")} eyebrow="contact">
      <p className="max-w-prose text-ink-700">{t("contact.subtitle")}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="font-display text-xl text-ink-900">{t("contact.infoTitle")}</h2>

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
              <dd className="mt-1">+1 (310) 433–0310</dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-ink-900">
                {t("contact.emailFaxLabel")}
              </dt>
              <dd className="mt-1">
                MisionMonteSionLA@gmail.com
                <br />
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="font-display text-xl text-ink-900">{t("contact.formTitle")}</h2>
          <p className="mt-2 text-sm text-ink-700">{t("contact.formNote")}</p>

          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
