"use client";

import { useState } from "react";
import { Artwork } from "@/lib/artworks";
import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ArtworkModal from "./ArtworkModal";
import { detectArtworkType } from "@/lib/artworkTypeDetector";
import { getThumbnailPath, getPlaceholderImage } from "@/lib/thumbnails";
import { detectPlatform } from "@/lib/platformHandler";
import Image from "next/image";

interface ArtworkCardProps {
  artwork: Artwork;
  category?: string;
}

export default function ArtworkCard({ artwork, category }: ArtworkCardProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("common");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  const title = isArabic ? artwork.artWorkTitleArabic : artwork.artWorkTitle;
  const schoolName = isArabic ? artwork.schoolNameArabic : artwork.schoolName;
  const studentName = isArabic ? artwork.studentNameArabic : artwork.studentName;
  const grade = isArabic ? artwork.gradeArabic : artwork.grade;
  const medium = isArabic ? artwork.mediumArabic : artwork.medium;

  const artworkTypeInfo = detectArtworkType(artwork.driveLink, artwork.requirement);
  const thumbnailPath = getThumbnailPath(artwork.no, category);
  const placeholderImage = getPlaceholderImage(category, artwork.no);
  const platformConfig = detectPlatform(artwork.driveLink, artwork.requirement);

  const handleClick = () => {
    // Check if content can be embedded
    if (!platformConfig.canEmbed) {
      // Non-embeddable content - open directly in new tab
      window.open(artwork.driveLink, '_blank', 'noopener,noreferrer');
    } else {
      // Embeddable content - open in modal
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="group flex flex-col cursor-pointer">
        {/* Thumbnail Preview Area */}
        <div
          onClick={handleClick}
          className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {!thumbnailError ? (
            // Try local thumbnail first, then Unsplash placeholder
            <Image
              src={usePlaceholder ? placeholderImage : thumbnailPath}
              alt={title}
              fill
              className="object-cover"
              onError={() => {
                if (!usePlaceholder) {
                  // Try Unsplash placeholder
                  setUsePlaceholder(true);
                } else {
                  // Both failed, show gradient
                  setThumbnailError(true);
                }
              }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              unoptimized={usePlaceholder} // Don't optimize Unsplash images
            />
          ) : (
            // Final fallback to gradient if both thumbnail and placeholder fail
            <div className={`absolute inset-0 bg-gradient-to-br ${artworkTypeInfo.color} flex items-center justify-center`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              {/* Artwork Number */}
              <div className="relative z-10 text-white text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg">
                #{artwork.no}
              </div>
            </div>
          )}

          {/* Gradient Overlay for hover effect - bottom to top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent group-hover:from-black/80 group-hover:via-black/40 group-hover:to-transparent transition-all duration-300" />

          {/* Hover Content */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 sm:p-6">
            <div className="space-y-2">
              {/* Title */}
              <div>
                <h3 className="text-white text-base sm:text-lg md:text-xl font-bold line-clamp-2">
                  {title}
                </h3>
              </div>

              {/* Medium tag and Icon - parallel */}
              <div className="flex items-center justify-between gap-4">
                {medium && (
                  <span className="inline-block px-2 py-1 bg-white/90 text-primary-dark rounded text-xs font-medium uppercase tracking-wide">
                    {medium}
                  </span>
                )}
                <div className="flex-shrink-0">
                  <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content - No card background */}
        <div className="pt-3 sm:pt-4 space-y-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-primary-dark line-clamp-2 mb-1">
              {title}
            </h3>
            <div className="flex items-start gap-x-2">
              <span className="text-sm sm:text-base text-primary-dark/40 font-normal">{t("by")}</span>
              <div className="flex flex-col gap-y-0.5">
                {studentName.split(',').map((name, index) => (
                  <p key={index} className="text-sm sm:text-base text-primary-dark/60 font-medium">
                    {name.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block px-2 py-1 bg-primary-mid/30 text-primary-dark rounded text-xs font-medium">
              {schoolName}
            </span>
            <span className="inline-block px-2 py-1 bg-primary-light/30 text-primary-dark rounded text-xs font-medium">
              {grade}
            </span>
          </div>
        </div>
      </div>

      {/* Modal - Opens for all content */}
      <ArtworkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        url={artwork.driveLink}
        title={title}
        requirement={artwork.requirement}
        artworkNo={artwork.no}
      />
    </>
  );
}
