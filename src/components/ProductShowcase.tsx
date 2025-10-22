import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductSkeleton from "./ProductSkeleton";
import { Product } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import ProductTreeModal from "./ProductTreeModal";

interface ProductShowcaseProps {
  products: Product[];
  onFilterChange: (filter: {
    category: string;
    subCategory?: string;
    subDivision?: string;
  }) => void;
  category: string;
  subCategory?: string;
  subDivision?: string;
  onCategoryChange: (category: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onSubDivisionChange: (subDivision: string) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
  onFilterChange,
}) => {
  // Removed filterLoading for instant product animation
  const [filterBg, setFilterBg] = useState(false);
  // Filtering state for skeleton transition
  const [filtering, setFiltering] = useState(false);
  const overlapSentinelRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const prevProductsRef = useRef(products);

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

  // Scroll to top when filter changes
  useEffect(() => {
    const prevProducts = prevProductsRef.current;
    if (prevProducts !== products) {
      // Scroll to the top of the #products section
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "auto", block: "start" });
      }
      // Start filtering state for skeleton transition
      setFiltering(true);
      setTimeout(() => setFiltering(false), 900); // adjust duration as needed
    }
    prevProductsRef.current = products;
  }, [products]);

  // CODE TOGGLE: Set to true to IGNORE image load and always show product card (for dev without images)
  const IGNORE_IMAGE_LOAD = true; // set to false for real image loading behavior
  // Track loading state for each product image
  const [loaded, setLoaded] = useState<{ [name: string]: boolean }>({});
  const visibleProducts = products;

  return (
    <section id="products" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Our Products
        </h2>
        <div ref={overlapSentinelRef} style={{ height: 0 }} />
        <div
          ref={stickyRef}
          className={`flex justify-start mb-6 sticky z-40 transition-all duration-300 py-3 w-full top-16 px-4
            ${filterBg ? "bg-white shadow-2xl rounded-xl" : "bg-transparent shadow-none"}`}
        >
          <ProductTreeModal onSelect={onFilterChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* CODE TOGGLE: Remove this block for production. Set SHOW_SKELETON_LOADING above. */}
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
                    <Card className="flex flex-col h-full">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-xl"
                        onLoad={() =>
                          setLoaded((l) => ({ ...l, [product.name]: true }))
                        }
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
