import type { Product } from '../types';

export const filterProductsByCategory = (products: Product[], category: string) => {
  return products.filter((product) => product.category === category);
};

export const searchProducts = (products: Product[], searchTerm: string) => {
  const lowerSearch = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearch) ||
      product.description.toLowerCase().includes(lowerSearch)
  );
};
