import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "./components/LanguageSwitcher";
import NavDock from "./components/NavDock";
import WaveBackground from "./components/WaveBackground";

export default async function Home() {
  const t = await getTranslations("common");

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

      {/* Welcome Section */}
      <section className="w-full relative z-10">
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
      <footer className="w-full text-center py-8 relative z-10">
        <p className="text-xs sm:text-sm md:text-base text-primary-dark/60">
          © 2025 {t("title")}
        </p>
      </footer>

      {/* Navigation Dock with Language Switcher */}
      <NavDock />
    </div>
  );
}
