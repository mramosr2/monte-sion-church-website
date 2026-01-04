import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";
import { MapPin, Phone } from "lucide-react";

const FOOD_LOCATION = "4405 E Olympic Blvd, Los Angeles, CA 90023";
const CONTACT_NAME = "Karen Ramos";
const CONTACT_PHONE_DISPLAY = "(310)-433-0310";
const CONTACT_PHONE_TEL = "+13104330310";

export default function Food() {
  const { t } = useTranslation();

  const paragraphsRaw = t("food.programParagraphs", {
    returnObjects: true,
    foodLocation: FOOD_LOCATION,
    contactName: CONTACT_NAME,
    contactPhone: CONTACT_PHONE_DISPLAY,
  });

  const paragraphs = Array.isArray(paragraphsRaw) ? paragraphsRaw : [];

  return (
    <Section title={t("food.title")} eyebrow="service">
      <p className="max-w-prose text-ink-700">{t("food.subtitle")}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="font-display text-2xl text-ink-900">
            {t("food.programTitle")}
          </h2>

          <div className="mt-5 space-y-5 text-ink-800 leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-[15px] md:text-base">
                {p}
              </p>
            ))}

            <blockquote className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-ink-900">
              <p className="text-[15px] md:text-base">{t("food.verseText")}</p>
              <footer className="mt-3 text-sm text-ink-700">
                {t("food.verseRef")}
              </footer>
            </blockquote>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h3 className="text-sm font-semibold tracking-wide text-ink-900">
              {t("food.sidebar.locationTitle")}
            </h3>

            <div className="mt-3 flex items-start gap-3 text-ink-800">
              <MapPin className="mt-0.5 h-5 w-5 text-ink-700" aria-hidden="true" />
              <p className="text-[15px] leading-relaxed">{FOOD_LOCATION}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h3 className="text-sm font-semibold tracking-wide text-ink-900">
              {t("food.sidebar.contactTitle")}
            </h3>

            <p className="mt-2 text-[15px] text-ink-800">
              <span className="font-semibold">{CONTACT_NAME}</span>
            </p>

            <a
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[15px] font-semibold text-ink-900 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
              href={`tel:${CONTACT_PHONE_TEL}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h3 className="text-sm font-semibold tracking-wide text-ink-900">
              {t("food.sidebar.donationsTitle")}
            </h3>

            <p className="mt-2 text-[15px] text-ink-800 leading-relaxed">
              {t("food.sidebar.donationsBody")}
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
