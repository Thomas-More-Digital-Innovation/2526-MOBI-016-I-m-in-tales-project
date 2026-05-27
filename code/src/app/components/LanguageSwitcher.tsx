import { useI18nContext } from "@/i18n/i18n-react";
import type { Locales } from "@/i18n/i18n-types";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18nContext();

  const switchLocale = (next: Locales) => {
    localStorage.setItem("lang", next);
    setLocale(next);
  };

  const activeClass =
    "bg-[#0d4254] shadow-[0px_1px_2px_1px_#6e8e98] text-white font-bold";
  const inactiveClass =
    "bg-[#0d4254]/40 text-white/70 hover:bg-[#0d4254]/60 font-semibold";

  return (
    <div className="flex rounded overflow-hidden">
      <button
        onClick={() => switchLocale("en")}
        className={`cursor-pointer text-sm py-2 px-3 transition-all duration-150 ${locale === "en" ? activeClass : inactiveClass}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("nl")}
        className={`cursor-pointer text-sm py-2 px-3 transition-all duration-150 ${locale === "nl" ? activeClass : inactiveClass}`}
      >
        NL
      </button>
    </div>
  );
}
