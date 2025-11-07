import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ArtworkCard from "../components/ArtworkCard";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { loadArtworks } from "@/lib/artworks";

// Map URL slugs to category names and translation keys
const categoryMap: { [key: string]: { name: string; key: string } } = {
  "3d-modeling": { name: "3D Modeling", key: "3dModeling" },
  "animation": { name: "Animation", key: "animation" },
  "game-design": { name: "Game Design", key: "gameDesign" },
  "video-game-design": { name: "Video Game Design", key: "videoGameDesign" },
  "web-design": { name: "Web Design", key: "webDesign" },
};

export function generateStaticParams() {
  return Object.keys(categoryMap).map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;

  // Validate category
  const categoryInfo = categoryMap[category];
  if (!categoryInfo) {
    notFound();
  }

  const t = await getTranslations("common");
  const tCategories = await getTranslations("categories");
  const categoriesData = await loadArtworks();

  // Find artworks for this category
  const categoryData = categoriesData.find(
    (cat) => cat.category.toLowerCase() === categoryInfo.name.toLowerCase()
  );

  if (!categoryData || categoryData.artworks.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <header className="w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark mb-4">
              {t("title")}
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary-mid">
              {tCategories(categoryInfo.key)}
            </h2>
          </div>
          <div className="flex-1 flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Artworks Grid */}
      <section className="w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categoryData.artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.no}
                artwork={artwork}
                category={categoryData.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-8">
        <p className="text-xs sm:text-sm md:text-base text-primary-dark/60">
          © 2025 {t("title")}
        </p>
      </footer>
    </div>
  );
}
