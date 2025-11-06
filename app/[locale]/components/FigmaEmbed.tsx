"use client";

import { useMemo } from "react";

interface FigmaEmbedProps {
  url: string;
  title: string;
}

/**
 * Figma Embed Component using official Figma embed API
 * Docs: https://www.figma.com/developers/embed
 */
export default function FigmaEmbed({ url, title }: FigmaEmbedProps) {
  // Transform Figma URL to embed format
  const embedUrl = useMemo(() => {
    // Figma's official embed format:
    // https://www.figma.com/embed?embed_host=share&url=<encoded-figma-url>

    // If it's already an embed URL, return as-is
    if (url.includes('/embed?')) {
      return url;
    }

    // For prototype links: /proto/...
    // For file links: /file/...
    // Both can be embedded directly with the embed parameter

    const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;

    return embedUrl;
  }, [url]);

  return (
    <div className="w-full h-full bg-white">
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        title={title}
        allowFullScreen
        // Figma embed specific attributes
        allow="fullscreen"
      />
    </div>
  );
}
