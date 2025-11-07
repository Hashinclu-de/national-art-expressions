"use client";

import { useState } from "react";
import { Presentation } from "lucide-react";
import PresentationMode from "./PresentationMode";
import { Artwork } from "@/lib/artworks";
import { useTranslations, useLocale } from "next-intl";

interface PresentationButtonProps {
  artworks: Artwork[];
}

export default function PresentationButton({ artworks }: PresentationButtonProps) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const t = useTranslations("common");
  const locale = useLocale();
  const isArabic = locale === "ar";

  if (artworks.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsPresentationMode(true)}
        className={`fixed top-4 z-50 flex items-center justify-center p-3 bg-primary-dark text-primary-light rounded-lg shadow-lg hover:bg-primary-dark/90 transition-all hover:scale-105 ${
          isArabic ? "right-4" : "left-4"
        }`}
        title={t("presentationMode")}
      >
        <Presentation className="h-5 w-5" />
      </button>

      <PresentationMode
        artworks={artworks}
        isOpen={isPresentationMode}
        onClose={() => setIsPresentationMode(false)}
      />
    </>
  );
}
