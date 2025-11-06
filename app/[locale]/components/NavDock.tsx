"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { useTranslations } from "next-intl";
import {
  Box,
  Film,
  Gamepad2,
  Gamepad,
  Globe,
} from "lucide-react";

export default function NavDock() {
  const t = useTranslations("categories");

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

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock items={navItems} />
    </div>
  );
}
