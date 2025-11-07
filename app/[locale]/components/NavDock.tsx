"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Box,
  Film,
  Gamepad2,
  Gamepad,
  Globe,
} from "lucide-react";

export default function NavDock() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();

  const navItems = [
    {
      title: t("3dModeling"),
      icon: <Box className="h-full w-full" />,
      href: `/${locale}/3d-modeling`,
    },
    {
      title: t("animation"),
      icon: <Film className="h-full w-full" />,
      href: `/${locale}/animation`,
    },
    {
      title: t("gameDesign"),
      icon: <Gamepad2 className="h-full w-full" />,
      href: `/${locale}/game-design`,
    },
    {
      title: t("videoGameDesign"),
      icon: <Gamepad className="h-full w-full" />,
      href: `/${locale}/video-game-design`,
    },
    {
      title: t("webDesign"),
      icon: <Globe className="h-full w-full" />,
      href: `/${locale}/web-design`,
    },
  ];

  const languageNames: { [key: string]: string } = {
    en: "EN",
    ar: "ع"
  };

  const locales = ["en", "ar"];
  const otherLocale = locale === "en" ? "ar" : "en";

  // Right element: Language Switcher
  const rightElement = (
    <button
      onClick={() => router.push(`/${otherLocale}`)}
      className="px-3 py-2 lg:px-4 lg:py-2.5 bg-white text-primary-dark rounded-lg font-semibold text-xs lg:text-sm hover:bg-white/80 transition-all"
    >
      {languageNames[otherLocale]}
    </button>
  );

  return (
    <div className="fixed bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] lg:w-auto">
      <FloatingDock items={navItems} rightElement={rightElement} />
    </div>
  );
}
