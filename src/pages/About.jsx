import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";

export default function About() {
  const { t } = useTranslation();

  const longParasRaw = t("about.longParagraphs", { returnObjects: true });
  const longParas = Array.isArray(longParasRaw) ? longParasRaw : [];

  return (
    <Section title={t("about.title")} eyebrow="about">
      <p className="max-w-prose text-ink-700">{t("about.subtitle")}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="font-display text-xl text-ink-900">
            {t("about.missionTitle")}
          </h2>
          <p className="mt-3 text-ink-800 leading-relaxed">{t("about.missionBody")}</p>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="font-display text-xl text-ink-900">
            {t("about.valuesTitle")}
          </h2>

          <ul className="mt-4 grid gap-2 text-ink-800">
            {(t("about.values", { returnObjects: true }) || []).map((v, i) => (
              <li
                key={i}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <h2 className="font-display text-2xl text-ink-900">{t("about.longTitle")}</h2>

        <div className="mt-4 space-y-5 text-ink-800 leading-relaxed">
          {longParas.map((p, idx) => (
            <p key={idx} className="text-[15px] md:text-base">
              {p}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
