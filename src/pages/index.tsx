import React from 'react';
import HeroSection from '../components/HeroSection';
import ProductShowcase from '../components/ProductShowcase';
import FeaturesSection from '../components/FeaturesSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';


import productsData from '../data/products.json';
import { useState } from 'react';

const PRODUCTS_PER_PAGE = 6;

const Home: React.FC = () => {
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products by category
  const filteredProducts = category && category !== 'all'
    ? productsData.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : productsData;

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleFilterChange = (cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <HeroSection />
      <ProductShowcase
        products={paginatedProducts}
        onFilterChange={handleFilterChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <FeaturesSection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Home;