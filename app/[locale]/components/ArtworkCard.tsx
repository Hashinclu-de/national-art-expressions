"use client";

import { useState } from "react";
import { Artwork } from "@/lib/artworks";
import { Maximize2 } from "lucide-react";
import { useLocale } from "next-intl";
import ArtworkModal from "./ArtworkModal";
import { detectArtworkType } from "@/lib/artworkTypeDetector";
import { getThumbnailPath, getPlaceholderImage } from "@/lib/thumbnails";
import Image from "next/image";

interface ArtworkCardProps {
  artwork: Artwork;
  category?: string;
}

export default function ArtworkCard({ artwork, category }: ArtworkCardProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
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

  const handleClick = () => {
    // Always open in modal - let the modal handle embedding vs fallback
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="group relative block break-inside-avoid mb-4 sm:mb-6 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      >
        {/* Thumbnail Preview Area */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
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

          {/* Overlay for hover effect */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Artwork Number Badge (always visible) */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/60 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
            <span className="text-xs sm:text-sm font-bold text-white">
              #{artwork.no}
            </span>
          </div>

          {/* Hover Icon */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-2">
            <div className="bg-white/90 text-primary-dark p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-dark mb-2 line-clamp-2">
            {title}
          </h3>

          <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
            <p className="text-primary-dark/70">
              <span className="font-medium">{schoolName}</span>
            </p>

            <p className="text-primary-dark/60 line-clamp-2">
              {studentName}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-block px-2 py-1 bg-primary-light text-primary-dark rounded-md text-xs">
                {grade}
              </span>
              {medium && (
                <span className="inline-block px-2 py-1 bg-primary-mid/30 text-primary-dark rounded-md text-xs">
                  {medium}
                </span>
              )}
            </div>
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
