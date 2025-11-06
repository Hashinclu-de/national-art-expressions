import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ArtworkCard from "./components/ArtworkCard";
import PresentationButton from "./components/PresentationButton";
import { loadArtworks } from "@/lib/artworks";

export default async function Home() {
  const t = await getTranslations("common");
  const tCategories = await getTranslations("categories");
  const categoriesData = await loadArtworks();

  // Map category names to translation keys and IDs
  const categoryMap: { [key: string]: { key: string; id: string } } = {
    "3D Modeling": { key: "3dModeling", id: "3d-modeling" },
    "Animation": { key: "animation", id: "animation" },
    "Game Design": { key: "gameDesign", id: "game-design" },
    "Video Game Design": { key: "videoGameDesign", id: "video-game-design" },
    "Web Design": { key: "webDesign", id: "web-design" },
  };

  // Collect all artworks for presentation mode
  const allArtworks = categoriesData.flatMap(cat => cat.artworks);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Presentation Mode Button */}
      <PresentationButton artworks={allArtworks} />

      {/* Header */}
      <header className="w-full border-b border-primary-light">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex items-center">
          <div className="flex-1"></div>
          {/* <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-dark text-center">
            {t("title")}
          </h1> */}
          <div className="flex-1 flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Artworks Sections */}
      {categoriesData.map((categoryData) => {
        const categoryInfo = categoryMap[categoryData.category];
        if (!categoryInfo || categoryData.artworks.length === 0) return null;

        return (
          <section
            key={categoryInfo.id}
            id={categoryInfo.id}
            className="w-full scroll-mt-24"
          >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
              {/* Category Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-dark mb-6 sm:mb-8 lg:mb-12 text-left rtl:text-right">
                {tCategories(categoryInfo.key)}
              </h2>

              {/* Pinterest-style Masonry Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
                {categoryData.artworks.map((artwork) => (
                  <ArtworkCard key={artwork.no} artwork={artwork} category={categoryData.category} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Footer */}
      <footer className="w-full text-center py-8">
        <p className="text-xs sm:text-sm md:text-base text-primary-dark/60">
          © 2025 {t("title")}
        </p>
      </footer>
    </div>
  );
}
