import { useTranslation } from "react-i18next";

const CHURCH_NAME = "Mision Evangelica Monte Sion";
const CHURCH_ADDRESS_LINES = [
  "9825 S Broadway",
  "Los Angeles, CA 90003",
  "United States",
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="font-semibold text-ink-900">{CHURCH_NAME}</p>
            <p className="mt-2 whitespace-pre-line text-sm text-ink-700">
              {CHURCH_ADDRESS_LINES.join("\n")}
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-sm text-ink-700">
              © {year} {CHURCH_NAME}. {t("footer.rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
