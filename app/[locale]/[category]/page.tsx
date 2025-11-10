import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ArtworkCard from "../components/ArtworkCard";
import LanguageSwitcher from "../components/LanguageSwitcher";
import WaveBackground from "../components/WaveBackground";
import { loadArtworks } from "@/lib/artworks";

// Map URL slugs to category names and translation keys
const categoryMap: { [key: string]: { name: string; key: string } } = {
  "3d-modeling": { name: "3D Modeling", key: "3dModeling" },
  "animation": { name: "Animation", key: "animation" },
  "game-design": { name: "Game Design", key: "gameDesign" },
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
    <div className="min-h-screen pb-32 relative">
      <WaveBackground />
      {/* Header */}
      <header className="w-full relative z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 flex items-center">
          <div className="flex-1"></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark text-center">
            {t("title")}
          </h1>
          <div className="flex-1 flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>
        {/* Decorative Separator */}
        <div className="w-full overflow-hidden" style={{ height: '30px' }}>
          <svg
            viewBox="0 0 1200 30"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,15 Q150,5 300,15 T600,15 Q750,5 900,15 T1200,15"
              fill="none"
              stroke="#2D5F3F"
              strokeWidth="2"
              opacity="0.3"
            />
            <circle cx="300" cy="15" r="3" fill="#6B9F7F" opacity="0.5" />
            <circle cx="600" cy="15" r="3" fill="#6B9F7F" opacity="0.5" />
            <circle cx="900" cy="15" r="3" fill="#6B9F7F" opacity="0.5" />
            <circle cx="150" cy="10" r="2" fill="#A8D5BA" opacity="0.4" />
            <circle cx="450" cy="10" r="2" fill="#A8D5BA" opacity="0.4" />
            <circle cx="750" cy="10" r="2" fill="#A8D5BA" opacity="0.4" />
            <circle cx="1050" cy="10" r="2" fill="#A8D5BA" opacity="0.4" />
          </svg>
        </div>
      </header>

      {/* Category Title */}
      <section className="w-full relative z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary-mid">
            {tCategories(categoryInfo.key)}
          </h2>
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="w-full relative z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 pb-8 sm:pb-12 lg:pb-16">
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

    </div>
  );
}
