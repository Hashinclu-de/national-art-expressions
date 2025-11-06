"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n/request";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Get the current pathname without the locale
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    router.push(newPath);
  };

  // Language names in their native form
  const languageNames = {
    en: "EN",
    ar: "ع"
  };

  return (
    <div className="flex gap-0.5 border border-primary-mid rounded-lg overflow-hidden">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            locale === loc
              ? "bg-primary-dark text-primary-light"
              : "bg-primary-light text-primary-dark hover:bg-primary-mid"
          }`}
          style={{
            fontFamily: loc === "ar"
              ? "var(--font-graphik-arabic), sans-serif"
              : "var(--font-gopher), sans-serif"
          }}
          aria-label={`Switch to ${languageNames[loc as keyof typeof languageNames]}`}
        >
          {languageNames[loc as keyof typeof languageNames]}
        </button>
      ))}
    </div>
  );
}
