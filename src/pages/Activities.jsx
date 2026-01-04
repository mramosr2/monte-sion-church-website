import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";

export default function Activities() {
  const { t } = useTranslation();

  const longRaw = t("activities.longParagraphs", { returnObjects: true });
  const longParas = Array.isArray(longRaw) ? longRaw : [];

  return (
    <Section title={t("activities.title")} eyebrow="community">
      <p className="max-w-prose text-ink-700">{t("activities.subtitle")}</p>

      <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="space-y-5 text-ink-800 leading-relaxed">
          {longParas.map((p, idx) => (
            <p key={idx} className="text-[15px] md:text-base">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {(t("activities.items", { returnObjects: true }) || []).map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur"
          >
            <p className="font-semibold text-ink-900">{item}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
