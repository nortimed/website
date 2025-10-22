import React, { useRef, useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import ProductShowcase from "../components/ProductShowcase";
import FeaturesSection from "../components/FeaturesSection";
import productsDataRaw from "../data/products.json";
import type { Product } from "../types";
import { SectionTransition } from "../components/SectionTransition";

const Home: React.FC = () => {
  // Scroll to products section if hash is #products on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#products") {
      setTimeout(() => {
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);
  // ...existing code...
  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");
  const [subDivision, setSubDivision] = useState("all");
  const productsRef = useRef<HTMLDivElement>(null);
  // ...existing code...

  // ...existing code...

  // ...existing code...

  // ...existing code...

  // Remove pendingContactScroll logic, now handled above

  const productsData: Product[] = productsDataRaw.map((p: any) => ({
    ...p,
    subDivision: p.subDivision === null ? "" : p.subDivision,
  }));

  const filteredProducts = productsData.filter((p: Product) => {
    const catMatch =
      category === "all" || p.category.toLowerCase() === category.toLowerCase();
    const subCatMatch =
      subCategory === "all" ||
      p.subCategory.toLowerCase() === subCategory.toLowerCase();
    const subDivMatch =
      subDivision === "all" ||
      (p.subDivision || "").toLowerCase() === (subDivision || "").toLowerCase();
    return catMatch && subCatMatch && subDivMatch;
  });

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
  };
  const handleSubCategoryChange = (subCat: string) => {
    setSubCategory(subCat);
  };
  const handleSubDivisionChange = (subDiv: string) => {
    setSubDivision(subDiv);
  };
  const handleFilterChange = (filter: {
    category: string;
    subCategory?: string;
    subDivision?: string;
  }) => {
    setCategory(filter.category || "all");
    setSubCategory(filter.subCategory || "all");
    setSubDivision(filter.subDivision || "all");
  };

  return (
    <div>
      <HeroSection />
      <div ref={productsRef} id="products" className="mt-16 scroll-mt-16">
        <SectionTransition animate={false}>
          <ProductShowcase
            products={filteredProducts}
            category={category}
            subCategory={subCategory}
            subDivision={subDivision}
            onCategoryChange={handleCategoryChange}
            onSubCategoryChange={handleSubCategoryChange}
            onSubDivisionChange={handleSubDivisionChange}
            onFilterChange={handleFilterChange}
          />
        </SectionTransition>
      </div>
      <FeaturesSection />
      {/* Contact section removed. See /contact page. */}
    </div>
  );
};

export default Home;
