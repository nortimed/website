import { useRouter } from 'next/router';
import products from '../../data/products.json';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/components/ui/card';
import { Button } from '../../components/components/ui/button';

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

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl mb-2">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              {/* Carousel for more images can be added here */}
            </div>
            <div className="flex-1">
              <p className="mb-4 text-gray-700">{product.description}</p>
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
                <div className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Colors:</span> {product.colorOptions.join(', ')}
                </div>
              )}
              <Button className="mt-6" onClick={() => router.push('/#contact')}>Request Product Quote</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
