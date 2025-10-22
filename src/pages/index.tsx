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
  const [subCategory, setSubCategory] = useState('all');
  const [subDivision, setSubDivision] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products by category, subCategory, subDivision
  const filteredProducts = productsData.filter((p) => {
    const catMatch = category === 'all' || p.category.toLowerCase() === category.toLowerCase();
    const subCatMatch = subCategory === 'all' || p.subCategory.toLowerCase() === subCategory.toLowerCase();
    const subDivMatch = subDivision === 'all' || p.subDivision.toLowerCase() === subDivision.toLowerCase();
    return catMatch && subCatMatch && subDivMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
  };
  const handleSubCategoryChange = (subCat: string) => {
    setSubCategory(subCat);
    setCurrentPage(1);
  };
  const handleSubDivisionChange = (subDiv: string) => {
    setSubDivision(subDiv);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handler for tree dropdown filter
  const handleFilterChange = (filter: { category: string; subCategory?: string; subDivision?: string }) => {
    setCategory(filter.category || 'all');
    setSubCategory(filter.subCategory || 'all');
    setSubDivision(filter.subDivision || 'all');
    setCurrentPage(1);
  };

  return (
    <div>
      <HeroSection />
      <ProductShowcase
        products={paginatedProducts}
        category={category}
        subCategory={subCategory}
        subDivision={subDivision}
        onCategoryChange={handleCategoryChange}
        onSubCategoryChange={handleSubCategoryChange}
        onSubDivisionChange={handleSubDivisionChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
      />
      <FeaturesSection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Home;