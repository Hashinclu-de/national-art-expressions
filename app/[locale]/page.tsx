import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "./components/LanguageSwitcher";
import NavDock from "./components/NavDock";

export default async function Home() {
  const t = await getTranslations("common");

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <header className="w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 flex items-center">
          <div className="flex-1"></div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark text-center">
            {t("title")}
          </h1>
          <div className="flex-1 flex justify-end">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark mb-4">
            {t("welcome")}
          </h2>
          <p className="text-lg sm:text-xl text-primary-dark/70 mb-12">
            {t("welcomeDescription")}
          </p>
          <p className="text-base sm:text-lg text-primary-dark/60">
            {t("selectCategory")}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-8">
        <p className="text-xs sm:text-sm md:text-base text-primary-dark/60">
          © 2025 {t("title")}
        </p>
      </footer>

      {/* Navigation Dock with Language Switcher */}
      <NavDock />
    </div>
  );
}
