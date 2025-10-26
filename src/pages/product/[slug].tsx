import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import products from "../../data/products.json";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tooltip } from "../../components/ui/tooltip";
import { useTranslation } from "next-i18next";


const ProductDetails = () => {

  const { t } = useTranslation("common");
  const router = useRouter();
  const { slug } = router.query;


  // Always call hooks, even if router is not ready or slug is not defined
  // Use a fallback for product if slug is not ready
  let product: typeof products[0] | undefined = undefined;
  if (typeof slug === "string") {
    product = products.find(
      (p) => p.name.toLowerCase().replace(/\s+/g, "-") === slug,
    );
  }

  const [selectedColor, setSelectedColor] = useState(
    product && product.colorOptions[0] ? product.colorOptions[0] : ""
  );
  const [tooltipOpenColor, setTooltipOpenColor] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedColor) return;
    setTooltipOpenColor(selectedColor);
    const timeout = setTimeout(() => setTooltipOpenColor(null), 500);
    return () => clearTimeout(timeout);
  }, [selectedColor]);

  // Wait for router to be ready and slug to be defined
  if (!router.isReady || typeof slug !== "string") {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <span className="inline-block w-12 h-12 mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg" aria-label="Loading" />
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto py-16 px-4 mt-16">
          <Card className="overflow-hidden rounded-lg shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-3xl mb-2 text-blue-800">
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 flex flex-col items-center">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full max-w-xs h-64 object-cover rounded-lg mb-4 border border-gray-200 shadow"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith("/images/product/image.png")) {
                        target.src = "/images/product/image.png";
                      }
                    }}
                  />
                  {/* Carousel for more images can be added here */}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="mb-4 text-gray-700 text-lg leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Category:</span>{" "}
                    {product.category}
                  </div>
                  {product.subCategory && (
                    <div className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Sub-category:</span>{" "}
                      {product.subCategory}
                    </div>
                  )}
                  {product.subDivision && (
                    <div className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Sub-division:</span>{" "}
                      {product.subDivision}
                    </div>
                  )}
                  {product.colorOptions.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Color:
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {product.colorOptions.map((color) => {
                          const isSelected = selectedColor === color;
                          const open = tooltipOpenColor === color;
                          return (
                            <Tooltip
                              key={color}
                              content={color}
                              open={!!open}
                            >
                              <button
                                type="button"
                                aria-label={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all outline-none ${isSelected
                                  ? "border-blue-600 shadow-[0_0_0_4px_rgba(0,0,0,0.18)] opacity-100"
                                  : selectedColor
                                    ? "border-gray-300 opacity-40"
                                    : "border-gray-300 opacity-100"
                                  }`}
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                  transition: "opacity 0.3s",
                                }}
                              >
                                {/* If color is white, add a border for visibility */}
                                {color.toLowerCase() === "white" && (
                                  <span className="block w-6 h-6 rounded-full border border-gray-400 bg-white" />
                                )}
                              </button>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <Button
                    className="mt-6 w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.sessionStorage.setItem(
                          "quoteProduct",
                          JSON.stringify({
                            product: product.name,
                            color: selectedColor || "",
                          }),
                        );
                        // Add to cookie cart
                        let cart: any[] = [];
                        try {
                          cart = JSON.parse(Cookies.get("quoteCart") || "[]");
                        } catch { }
                        // Avoid duplicates (same product+color)
                        if (
                          !cart.some(
                            (item) =>
                              item.product === product.name &&
                              item.color === (selectedColor || ""),
                          )
                        ) {
                          cart.push({
                            product: product.name,
                            color: selectedColor || "",
                          });
                          Cookies.set("quoteCart", JSON.stringify(cart), {
                            expires: 7,
                          });
                        }
                      }
                      router.push("/request-quote");
                    }}
                  >
                    Request Product Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};


import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const locale = context.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ProductDetails;
