export const filterProductsByCategory = (products, category) => {
  return products.filter((product) => product.category === category);
};

export const searchProducts = (products, searchTerm) => {
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};
