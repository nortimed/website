import React from 'react';
import { useRouter } from 'next/router';
import products from '../../data/products.json';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';

const ProductDetails = () => {
  const router = useRouter();
  const { slug } = router.query;

  const product = products.find(
    (p) =>
      p.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    );
  }

  const [selectedColor, setSelectedColor] = React.useState(product.colorOptions[0] || '');

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl mb-2 text-blue-800">{product.name}</CardTitle>
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
              <p className="mb-4 text-gray-700 text-lg leading-relaxed">{product.description}</p>
              <div className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Category:</span> {product.category}
              </div>
              {product.subCategory && (
                <div className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Sub-category:</span> {product.subCategory}
                </div>
              )}
              {product.subDivision && (
                <div className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Sub-division:</span> {product.subDivision}
                </div>
              )}
              {product.colorOptions.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Color:</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colorOptions.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button
                className="mt-6 w-full md:w-auto"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem('quoteProduct', JSON.stringify({
                      product: product.name,
                      color: selectedColor || '',
                    }));
                  }
                  router.push('/request-quote');
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
