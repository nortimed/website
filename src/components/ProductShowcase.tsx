import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ProductSkeleton from "./ProductSkeleton";
import productsDataRaw from "../data/products.json";
import type { Product } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import ProductCategoryTreeModal from "./ProductCategoryTreeModal";
import ProductNameFilter from "./ProductNameFilter";

interface ProductShowcaseProps {
  onFilterModalOpenChange?: (open: boolean) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onFilterModalOpenChange,
}) => {
  const { t } = useTranslation("common");
  // Load and preprocess product data
  const products: Product[] = (productsDataRaw as any[]).map((p: any) => ({
    ...p,
    subDivision: p.subDivision === null ? "" : p.subDivision,
  }));
  // Local filter state
  const [category, setCategory] = useState<string>("all");
  const [subCategory, setSubCategory] = useState<string>("all");
  const [subDivision, setSubDivision] = useState<string>("all");
  const [nameFilter, setNameFilter] = useState<string>("");
  // Removed filterLoading for instant product animation
  const [filterBg, setFilterBg] = useState(false);
  // Filtering state for skeleton transition
  const [filtering, setFiltering] = useState(false);
  const overlapSentinelRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  // Track previous visible products for animation
  const prevVisibleProductsRef = useRef<string>("");

  // Show sticky background when filter overlaps the first row (sentinel)
  useEffect(() => {
    if (!overlapSentinelRef.current || !stickyRef.current) return;
    const sentinel = overlapSentinelRef.current;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setFilterBg(entry.intersectionRatio === 0);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `-${stickyRef.current.offsetHeight}px 0px 0px 0px`,
      },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // CODE TOGGLE: Set to true to IGNORE image load and always show product card (for dev without images)
  const IGNORE_IMAGE_LOAD = true; // set to false for real image loading behavior
  // Track loading state for each product image
  const [loaded, setLoaded] = useState<{ [name: string]: boolean }>({});
  const visibleProducts = React.useMemo(() => {
    return products.filter((p: Product) => {
      const catMatch =
        category === "all" ||
        p.category.toLowerCase() === category.toLowerCase();
      const subCatMatch =
        subCategory === "all" ||
        p.subCategory.toLowerCase() === subCategory.toLowerCase();
      const subDivMatch =
        subDivision === "all" ||
        (p.subDivision || "").toLowerCase() ===
          (subDivision || "").toLowerCase();
      const nameMatch =
        !nameFilter.trim() ||
        p.name.toLowerCase().includes(nameFilter.trim().toLowerCase());
      return catMatch && subCatMatch && subDivMatch && nameMatch;
    });
  }, [products, category, subCategory, subDivision, nameFilter]);

  // Filtering state for skeleton transition (no scroll)
  useEffect(() => {
    const visibleProductsHash = JSON.stringify(
      visibleProducts.map((p) => p.name),
    );
    if (prevVisibleProductsRef.current !== visibleProductsHash) {
      setFiltering(true);
      setTimeout(() => setFiltering(false), 900); // adjust duration as needed
    }
    prevVisibleProductsRef.current = visibleProductsHash;
  }, [visibleProducts]);

  return (
    <section id="products" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          {t("our_products")}
        </h2>
        <div ref={overlapSentinelRef} style={{ height: 0 }} />
        <div
          ref={stickyRef}
          className="flex flex-col sm:flex-row justify-start mb-6 sticky z-40 transition-all duration-300 py-3 w-full top-16 pl-0 bg-transparent overflow-x-auto sm:overflow-x-visible"
        >
          <div className="flex flex-row items-stretch w-auto gap-x-3">
            <div className="shrink-0">
              <ProductCategoryTreeModal
                onSelect={({
                  category: cat,
                  subCategory: subCat,
                  subDivision: subDiv,
                }) => {
                  setCategory(cat || "all");
                  setSubCategory(subCat || "all");
                  setSubDivision(subDiv || "all");
                }}
                onOpenChange={onFilterModalOpenChange}
                triggerClassName=""
                popoverContentClassName="border border-gray-300 shadow-md"
              />
            </div>
            <ProductNameFilter
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder={t("search_by_product_name")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filtering
              ? // Show skeletons with breath animation while filtering
                visibleProducts.map((product, idx) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                  >
                    <ProductSkeleton />
                  </motion.div>
                ))
              : visibleProducts.map((product, idx) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                  >
                    <Link
                      href={`/product/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`}
                      className="block group"
                      style={{ textDecoration: "none" }}
                    >
                      <Card className="flex flex-col h-96 rounded-lg shadow-lg border border-gray-200 transition-transform duration-200 group-hover:scale-102 group-hover:shadow-lg cursor-pointer">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-xl"
                          onLoad={() =>
                            setLoaded((l) => ({ ...l, [product.name]: true }))
                          }
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (
                              !target.src.endsWith("/images/product/image.png")
                            ) {
                              target.src = "/images/product/image.png";
                            }
                          }}
                          style={{
                            display:
                              loaded[product.name] || IGNORE_IMAGE_LOAD
                                ? "block"
                                : "none",
                          }}
                        />
                        {(loaded[product.name] || IGNORE_IMAGE_LOAD) && (
                          <>
                            <CardHeader className="flex-1 flex flex-col items-center justify-center pb-2">
                              <CardTitle className="text-lg text-center">
                                {product.name}
                              </CardTitle>
                            </CardHeader>
                          </>
                        )}
                      </Card>
                    </Link>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
