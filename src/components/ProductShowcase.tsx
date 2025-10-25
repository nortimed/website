import React, { useRef, useEffect, useState } from "react";
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
import { Input } from "./ui/input";
import { Search as SearchIcon } from "lucide-react";

interface ProductShowcaseProps {
  onFilterModalOpenChange?: (open: boolean) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  onFilterModalOpenChange,
}) => {
  // Load and preprocess product data
  const DEFAULT_IMAGE = "/favicon.ico"; // You can replace this with a better placeholder
  const products: Product[] = (productsDataRaw as any[]).map((p: any) => {
    let images = p.images;
    if (!images || !Array.isArray(images) || images.length === 0) {
      images = [DEFAULT_IMAGE];
    }
    return {
      ...p,
      images,
      subDivision: p.subDivision === null ? "" : p.subDivision,
    };
  });
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
          Our Products
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
                triggerClassName="w-[260px] max-w-xs h-12 rounded-lg border border-gray-300 bg-white shadow-md hover:shadow-lg transition-shadow duration-150 flex items-center px-3 focus:!border-blue-500 focus:!ring-0 active:!border-blue-500 justify-between"
                popoverContentClassName="border border-gray-300 shadow-md"
              />
            </div>
            <div className="relative w-[260px] max-w-xs h-12">
              <div className="rounded-lg border border-gray-300 bg-white shadow-md hover:shadow-lg transition-shadow duration-150 flex items-center px-3 h-12 focus-within:border-blue-500">
                <Input
                  type="text"
                  placeholder="Search by product name..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="pr-10 bg-transparent !border-none !ring-0 shadow-none focus:!border-none focus:!ring-0 focus:outline-none active:!border-none h-10"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <SearchIcon className="w-5 h-5" />
                </span>
              </div>
            </div>
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
                    <Card className="flex flex-col h-full rounded-lg shadow-lg border border-gray-200">
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
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {product.name}
                            </CardTitle>
                            <CardDescription>
                              {product.category}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-between">
                            <p className="text-gray-600 text-sm mb-2 flex-1">
                              {product.description}
                            </p>
                            {product.colorOptions.length > 0 && (
                              <div className="text-xs text-gray-500 mb-2">
                                Colors: {product.colorOptions.join(", ")}
                              </div>
                            )}
                            <Button
                              asChild
                              className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white"
                              variant="default"
                            >
                              <Link
                                href={`/product/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`}
                              >
                                View Details
                              </Link>
                            </Button>
                          </CardContent>
                        </>
                      )}
                    </Card>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
