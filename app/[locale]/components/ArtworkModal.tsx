"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ExternalLink, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEmbedUrl } from "@/lib/embedUtils";
import { detectPlatform, getLocalVideoPath } from "@/lib/platformHandler";
import { getThumbnailPath } from "@/lib/thumbnails";
import Image from "next/image";

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  requirement?: string;
  artworkNo?: string | number;
}

export default function ArtworkModal({ isOpen, onClose, url, title, requirement, artworkNo }: ArtworkModalProps) {
  const [iframeError, setIframeError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [proxyAttempted, setProxyAttempted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Detect platform and get rendering strategy
  const platformConfig = useMemo(() => detectPlatform(url, requirement), [url, requirement]);

  // Determine URL to use
  const embedUrl = useMemo(() => {
    const baseUrl = getEmbedUrl(url);

    // If platform is not embeddable and we should try reverse proxy
    if (!platformConfig.canEmbed && platformConfig.strategy.includes('reverse-proxy') && proxyAttempted) {
      // Use our reverse proxy
      return `/api/proxy?url=${encodeURIComponent(baseUrl)}`;
    }

    return baseUrl;
  }, [url, platformConfig, proxyAttempted]);

  // Reset error state when modal opens/closes or URL changes
  useEffect(() => {
    setIframeError(false);
    setProxyAttempted(false);
    setIframeLoaded(false);
    setIframeKey((prev) => prev + 1);
  }, [isOpen, url]);

  // Detect iframe loading errors
  // COMPLETELY DISABLED for embeddable platforms (Figma, websites, etc.)
  // Only detect errors for known blocked platforms (TinkerCAD, SharePoint, etc.)
  useEffect(() => {
    if (!isOpen) return;

    // Skip error detection entirely for embeddable platforms
    if (platformConfig.canEmbed) {
      console.log(`✓ Platform ${platformConfig.type} is embeddable, skipping error detection`);
      return;
    }

    // For non-embeddable platforms, automatically open in new tab after 5 seconds
    const timeout = 5000;

    const timer = setTimeout(() => {
      if (iframeLoaded) {
        console.log(`✓ Iframe loaded successfully for ${platformConfig.type}`);
        return;
      }

      console.log(`✗ Content not loading, opening in new tab: ${platformConfig.type}`);
      // Automatically open in new tab and close modal
      window.open(url, '_blank', 'noopener,noreferrer');
      onClose();
    }, timeout);

    return () => clearTimeout(timer);
  }, [isOpen, iframeKey, platformConfig.type, platformConfig.canEmbed, iframeLoaded, url, onClose]);

  const handleIframeError = () => {
    // For non-embeddable platforms, automatically open in new tab
    if (!platformConfig.canEmbed) {
      console.log(`✗ Iframe error, opening in new tab: ${platformConfig.type}`);
      window.open(url, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOpenInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRefresh = () => {
    setIframeError(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl"
            style={{ height: "98vh" }}
          >
            {/* Content Area - Full Height */}
            <div className="h-full w-full relative bg-gray-50 rounded-t-3xl overflow-hidden">
              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                {platformConfig.canEmbed && platformConfig.type !== 'local-video' && (
                  <button
                    onClick={handleRefresh}
                    className="flex-shrink-0 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-lg"
                    aria-label="Refresh"
                    title="Refresh"
                  >
                    <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 text-primary-dark" />
                  </button>
                )}
                {!platformConfig.canEmbed && (
                  <button
                    onClick={handleOpenInNewTab}
                    className="flex-shrink-0 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-lg"
                    aria-label="Open in new tab"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 text-primary-dark" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-lg"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-primary-dark" />
                </button>
              </div>
              {!iframeError ? (
                <>
                  {/* Loading Indicator - Hide when loaded */}
                  {!iframeLoaded && platformConfig.type !== 'local-video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary-mid to-primary-light z-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                    </div>
                  )}

                  {/* Local Video Player for Playwriting */}
                  {platformConfig.type === 'local-video' ? (
                    <div className="w-full h-full bg-black rounded-t-3xl overflow-hidden">
                      <video
                        key={iframeKey}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'bottom' }}
                        onLoadedData={() => {
                          console.log(`✓ Video loaded for local-video`);
                          setIframeLoaded(true);
                        }}
                      >
                        <source src={getLocalVideoPath(url)} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    /* Iframe for other platforms */
                    <iframe
                      key={iframeKey}
                      id="artwork-iframe"
                      src={embedUrl}
                      className="w-full h-full border-0 relative z-10 rounded-t-3xl"
                      title={title}
                      // Remove sandbox for Figma and other embeddable platforms to avoid restrictions
                      {...(platformConfig.canEmbed ? {} : {
                        sandbox: "allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-presentation"
                      })}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      onLoad={() => {
                        console.log(`✓ Iframe onLoad triggered for ${platformConfig.type}`);
                        setIframeLoaded(true);
                      }}
                      onError={() => {
                        console.log(`✗ Iframe onError triggered for ${platformConfig.type}`);
                        handleIframeError();
                      }}
                    />
                  )}
                </>
              ) : (
                // Fallback UI when iframe is blocked
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary-mid to-primary-light">
                  <div className="text-center p-8 max-w-2xl">
                    <div className="text-6xl mb-6">🔒</div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Content Cannot Be Embedded
                    </h2>
                    <p className="text-xl text-white/80 mb-4">
                      This content cannot be displayed within the catalog due to security restrictions.
                    </p>
                    {proxyAttempted && (
                      <p className="text-lg text-white/70 mb-4">
                        ⚠️ Reverse proxy attempt also failed
                      </p>
                    )}
                    <p className="text-lg text-white/70 mb-2">
                      <strong>Platform:</strong> {platformConfig.type}
                    </p>
                    <p className="text-lg text-white/70 mb-8">
                      {title}
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                      <button
                        onClick={handleOpenInNewTab}
                        className="px-8 py-4 bg-white text-primary-dark rounded-lg hover:bg-primary-light transition-colors flex items-center gap-3 text-lg font-medium shadow-lg"
                      >
                        <ExternalLink className="h-6 w-6" />
                        Open in New Window
                      </button>
                      <button
                        onClick={handleRefresh}
                        className="px-8 py-4 bg-primary-mid/30 text-white rounded-lg hover:bg-primary-mid/50 transition-colors flex items-center gap-3 text-lg font-medium"
                      >
                        <RefreshCw className="h-6 w-6" />
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
