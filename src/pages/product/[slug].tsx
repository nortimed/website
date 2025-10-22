import React from "react";
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

const ProductDetails = () => {
  const router = useRouter();
  const { slug } = router.query;

  const product = products.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-") === slug,
  );

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  const [selectedColor, setSelectedColor] = React.useState(
    product.colorOptions[0] || "",
  );
  const [tooltipOpenColor, setTooltipOpenColor] = React.useState<string | null>(
    null,
  );

  // When selectedColor changes, show tooltip for 1s
  React.useEffect(() => {
    if (!selectedColor) return;
    setTooltipOpenColor(selectedColor);
    const timeout = setTimeout(() => setTooltipOpenColor(null), 500);
    return () => clearTimeout(timeout);
  }, [selectedColor]);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 mt-16">
      <Card className="overflow-hidden">
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
                          open={open || undefined}
                        >
                          <button
                            type="button"
                            aria-label={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              isSelected
                                ? "border-blue-700 ring-2 ring-blue-300 opacity-100"
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
  );
};

export default ProductDetails;
