import React, { useRef, useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import ProductShowcase from "../components/ProductShowcase";
import FeaturesSection from "../components/FeaturesSection";
import { SectionTransition } from "../components/SectionTransition";
import { Input } from "../components/ui/input";

const Home: React.FC = () => {
  // Overlay state for filter modal
  const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);

  // Disable body scroll when overlay is open
  useEffect(() => {
    if (filterOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOverlayOpen]);

  // Scroll to products section if hash is #products on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#products") {
      setTimeout(() => {
        const el = document.getElementById("products");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const productsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      {/* Overlay: rendered after Navbar, before main content */}
      {filterOverlayOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-xs transition-opacity duration-300"
          style={{ pointerEvents: "auto" }}
          aria-hidden="true"
        />
      )}
      <HeroSection />
      <div ref={productsRef} id="products" className="mt-16 scroll-mt-16">
        {/* Filter bar is now inside ProductShowcase */}
        <SectionTransition animate={false}>
          <ProductShowcase onFilterModalOpenChange={setFilterOverlayOpen} />
        </SectionTransition>
      </div>
      <FeaturesSection />
    </div>
  );
};

export default Home;
