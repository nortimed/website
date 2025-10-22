import React, { useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./ui/select";
import productsData from "../data/products.json";
import { Product } from "../types";

// Helper to build tree structure from products
type ProductTree = {
  [category: string]: {
    [subCategory: string]: {
      [subDivision: string]: true;
    };
  };
};

function buildProductTree(products: Product[]): ProductTree {
  const tree: ProductTree = {};
  products.forEach((product) => {
    const { category, subCategory, subDivision } = product;
    if (!tree[category]) tree[category] = {};
    if (!tree[category][subCategory]) tree[category][subCategory] = {};
    if (!tree[category][subCategory][subDivision])
      tree[category][subCategory][subDivision] = true;
  });
  return tree;
}

interface ProductFilterDropdownProps {
  onFilterChange?: (filter: {
    category: string;
    subCategory: string;
    subDivision: string;
  }) => void;
  treeVisual?: boolean;
}

const ProductFilterDropdown: React.FC<ProductFilterDropdownProps> = ({
  onFilterChange,
  treeVisual,
}) => {
  const productTree = useMemo(
    () => buildProductTree(productsData as Product[]),
    [],
  );
  const [, setSelected] = useState<{
    category: string;
    subCategory: string;
    subDivision: string;
  }>({ category: "", subCategory: "", subDivision: "" });

  // Flatten tree for Select options
  const options = useMemo(() => {
    const opts: {
      category: string;
      subCategory: string;
      subDivision: string;
      value: string;
    }[] = [];
    Object.entries(productTree).forEach(([category, subCats]) => {
      Object.entries(subCats).forEach(([subCategory, subDivs]) => {
        Object.keys(subDivs).forEach((subDivision) => {
          opts.push({
            category,
            subCategory,
            subDivision,
            value: JSON.stringify({ category, subCategory, subDivision }),
          });
        });
      });
    });
    return opts;
  }, [productTree]);

  const handleChange = (value: string) => {
    const parsed = JSON.parse(value);
    setSelected(parsed);
    if (onFilterChange) onFilterChange(parsed);
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filtrar por categoria, subcategoria e subdivisão" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Produtos</SelectLabel>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {treeVisual ? (
                <span>
                  <span style={{ fontWeight: "bold" }}>{opt.category}</span>
                  <span style={{ marginLeft: 12, fontStyle: "italic" }}>
                    {">"} {opt.subCategory}
                  </span>
                  <span style={{ marginLeft: 24 }}>
                    {">"} {opt.subDivision}
                  </span>
                </span>
              ) : (
                `${opt.category} / ${opt.subCategory} / ${opt.subDivision}`
              )}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ProductFilterDropdown;
