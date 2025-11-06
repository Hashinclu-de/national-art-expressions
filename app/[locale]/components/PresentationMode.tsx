"use client";

import { useState, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, X, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Artwork } from "@/lib/artworks";
import { getEmbedUrl } from "@/lib/embedUtils";
import { detectArtworkType } from "@/lib/artworkTypeDetector";
import { useTranslations, useLocale } from "next-intl";

interface PresentationModeProps {
  artworks: Artwork[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function PresentationMode({
  artworks,
  isOpen,
  onClose,
  initialIndex = 0
}: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interval, setIntervalTime] = useState(30); // seconds
  const t = useTranslations("common");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const currentArtwork = artworks[currentIndex];
  const embedUrl = currentArtwork ? getEmbedUrl(currentArtwork.driveLink) : '';
  const typeInfo = currentArtwork ? detectArtworkType(currentArtwork.driveLink, currentArtwork.requirement) : null;

  // Get localized artwork info
  const artworkTitle = currentArtwork && isArabic ? currentArtwork.artWorkTitleArabic : currentArtwork?.artWorkTitle;
  const schoolName = currentArtwork && isArabic ? currentArtwork.schoolNameArabic : currentArtwork?.schoolName;
  const studentName = currentArtwork && isArabic ? currentArtwork.studentNameArabic : currentArtwork?.studentName;
  const grade = currentArtwork && isArabic ? currentArtwork.gradeArabic : currentArtwork?.grade;

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || !isOpen) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artworks.length);
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [isPlaying, interval, artworks.length, isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          next();
          break;
        case 'ArrowLeft':
          previous();
          break;
        case 'Escape':
          onClose();
          break;
        case 'p':
        case 'P':
          setIsPlaying(!isPlaying);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isPlaying, currentIndex]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  if (!currentArtwork) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-[200]"
        >
          {/* Main Content Area */}
          <div className="h-full w-full flex flex-col">
            {/* Artwork Display */}
            <div className="flex-1 relative">
              {typeInfo?.canEmbed ? (
                <iframe
                  key={currentIndex}
                  src={embedUrl}
                  className="w-full h-full border-0"
                  title={artworkTitle}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary-mid to-primary-light">
                  <div className="text-center p-8 max-w-2xl">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      {artworkTitle}
                    </h2>
                    <p className="text-xl text-white/80 mb-8">
                      {schoolName} • {grade}
                    </p>
                    <button
                      onClick={() => window.open(currentArtwork.driveLink, '_blank')}
                      className="px-8 py-4 bg-white text-primary-dark rounded-lg hover:bg-primary-light transition-colors flex items-center gap-3 mx-auto text-lg font-medium"
                    >
                      <Maximize className="h-6 w-6" />
                      {t("openInNewWindow")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Control Bar */}
            <div className="bg-primary-dark/95 backdrop-blur-sm px-6 py-4" dir={isArabic ? "rtl" : "ltr"}>
              <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg truncate">
                    {artworkTitle}
                  </h3>
                  <p className="text-white/70 text-sm truncate">
                    {schoolName} • {studentName}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {/* Previous */}
                  <button
                    onClick={isArabic ? next : previous}
                    className="p-3 hover:bg-primary-mid/30 rounded-lg transition-colors"
                    title={`${t("previous")} (←)`}
                  >
                    <SkipBack className={`h-5 w-5 text-white ${isArabic ? "rotate-180" : ""}`} />
                  </button>

                  {/* Play/Pause */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 hover:bg-primary-mid/30 rounded-lg transition-colors"
                    title={`${isPlaying ? t("pause") : t("play")} (P)`}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-white" />
                    ) : (
                      <Play className="h-5 w-5 text-white" />
                    )}
                  </button>

                  {/* Next */}
                  <button
                    onClick={isArabic ? previous : next}
                    className="p-3 hover:bg-primary-mid/30 rounded-lg transition-colors"
                    title={`${t("next")} (→ or Space)`}
                  >
                    <SkipForward className={`h-5 w-5 text-white ${isArabic ? "rotate-180" : ""}`} />
                  </button>

                  {/* Interval */}
                  <select
                    value={interval}
                    onChange={(e) => setIntervalTime(Number(e.target.value))}
                    className="px-3 py-2 bg-primary-mid/30 text-white rounded-lg text-sm"
                  >
                    <option value={15}>15s</option>
                    <option value={30}>30s</option>
                    <option value={60}>1m</option>
                    <option value={120}>2m</option>
                  </select>

                  {/* Counter */}
                  <div className="px-4 py-2 bg-primary-mid/30 text-white rounded-lg text-sm font-medium">
                    {currentIndex + 1} / {artworks.length}
                  </div>

                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="p-3 hover:bg-red-500/30 rounded-lg transition-colors"
                    title={`${t("close")} (Esc)`}
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
