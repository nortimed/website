import React from "react";
import { Input } from "./ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useTranslation } from "next-i18next";

interface ProductNameFilterProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const ProductNameFilter: React.FC<ProductNameFilterProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
}) => {
  const { t } = useTranslation("common");
  return (
    <div
      className={`relative rounded-lg border border-gray-300 bg-white shadow-md hover:shadow-lg transition-shadow duration-150 flex items-center px-3 h-12 focus-within:border-blue-500 w-full max-w-xl min-w-[16rem] ${className}`}
    >
      <Input
        type="text"
        placeholder={placeholder || t("search_by_product_name")}
        value={value}
        onChange={onChange}
        className="pr-10 bg-transparent !border-none !ring-0 shadow-none focus:!border-none focus:!ring-0 focus:outline-none active:!border-none h-10"
      />
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <SearchIcon className="w-5 h-5" />
      </span>
    </div>
  );
};

export default ProductNameFilter;
