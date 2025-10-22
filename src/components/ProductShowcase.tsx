import React from 'react';
import { Product } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';
import ProductTreeModal from './ProductTreeModal';

interface ProductShowcaseProps {
  products: Product[];
  onFilterChange: (filter: { category: string; subCategory?: string; subDivision?: string }) => void;
  category: string;
  subCategory?: string;
  subDivision?: string;
  onCategoryChange: (category: string) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onSubDivisionChange: (subDivision: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
  onFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  category,
  subCategory,
  subDivision,
  onCategoryChange,
  onSubCategoryChange,
  onSubDivisionChange,
}) => {
  return (
    <section id="products" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Our Products</h2>
        {/* Modal-based tree filter for category/sub-category/sub-division */}
        <div className="flex justify-start mb-6">
          <ProductTreeModal onSelect={onFilterChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.name} className="flex flex-col h-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-gray-600 text-sm mb-2 flex-1">{product.description}</p>
                {product.colorOptions.length > 0 && (
                  <div className="text-xs text-gray-500 mb-2">Colors: {product.colorOptions.join(', ')}</div>
                )}
                <Button asChild className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white" variant="default">
                  <Link href={`/product/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-10">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
          >
            Previous
          </Button>
          <span className="text-gray-700 font-semibold">{currentPage} of {totalPages}</span>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="default"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;