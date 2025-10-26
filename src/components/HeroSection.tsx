import React from "react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  t: (key: string) => string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ t }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-100 via-white to-green-100 py-20 px-4 flex items-center justify-center min-h-screen">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">
          {t("hero_title")} <span className="text-blue-600">Nortimed</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          {t("hero_subtitle")}{" "}
          <span className="font-semibold text-green-700">{t("nursery")}</span>{" "}
          {t("and")}{" "}
          <span className="font-semibold text-blue-700">
            {t("physiotherapy")}
          </span>{" "}
          {t("products")}.
        </p>
        <Button
          asChild
          size="lg"
          className="px-8 py-3 text-lg font-semibold shadow-lg"
        >
          <a href="#products">{t("shop_now")}</a>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
