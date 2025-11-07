"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Film,
  Gamepad2,
  Gamepad,
  Globe,
  Presentation,
} from "lucide-react";
import PresentationMode from "./PresentationMode";
import { loadArtworks } from "@/lib/artworks";

export default function NavDock({ artworks }: { artworks: any[] }) {
  const t = useTranslations("categories");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const navItems = [
    {
      title: t("3dModeling"),
      icon: <Box className="h-full w-full" />,
      href: "#3d-modeling",
    },
    {
      title: t("animation"),
      icon: <Film className="h-full w-full" />,
      href: "#animation",
    },
    {
      title: t("gameDesign"),
      icon: <Gamepad2 className="h-full w-full" />,
      href: "#game-design",
    },
    {
      title: t("videoGameDesign"),
      icon: <Gamepad className="h-full w-full" />,
      href: "#video-game-design",
    },
    {
      title: t("webDesign"),
      icon: <Globe className="h-full w-full" />,
      href: "#web-design",
    },
  ];

  const languageNames: { [key: string]: string } = {
    en: "EN",
    ar: "ع"
  };

  const locales = ["en", "ar"];
  const otherLocale = locale === "en" ? "ar" : "en";

  // Left element: Presentation Mode button
  const leftElement = (
    <button
      onClick={() => setIsPresentationMode(true)}
      className="p-2.5 lg:p-3 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 transition-all"
      title={tCommon("presentationMode")}
    >
      <Presentation className="h-4 w-4 lg:h-5 lg:w-5" />
    </button>
  );

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
    <>
      <div className="fixed bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] lg:w-auto">
        <FloatingDock items={navItems} leftElement={leftElement} rightElement={rightElement} />
      </div>

      <PresentationMode
        artworks={artworks}
        isOpen={isPresentationMode}
        onClose={() => setIsPresentationMode(false)}
      />
    </>
  );
}
