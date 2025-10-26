import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandList } from "./ui/command";
import { FolderSearch, CheckIcon } from "lucide-react";
import productsData from "../data/products.json";
import { Product } from "../types";
import { useTranslation } from "next-i18next";

/**
 * ProductCategoryTreeModal always renders a content-sized button with consistent spacing and no fixed width or flex-grow.
 * To customize appearance, use triggerClassName for color, border, or shadow, but do not set width, flex, min-w-0, max-w-full, or flex-grow.
 */
type ProductCategoryFilterDropdownProps = {
  onSelect?: (filter: {
    category: string;
    subCategory?: string;
    subDivision?: string;
  }) => void;
  onOpenChange?: (open: boolean) => void;
  /**
   * Additional classes for the trigger button. Do not include width, flex, min-w-0, max-w-full, or flex-grow.
   */
  triggerClassName?: string;
  popoverContentClassName?: string;
};

type ProductTree = {
  [category: string]: {
    [subCategory: string]: string[];
  };
};

function buildProductTree(products: Product[]): ProductTree {
  const tree: ProductTree = {};
  products.forEach(({ category, subCategory, subDivision }) => {
    if (!tree[category]) tree[category] = {};
    if (!tree[category][subCategory]) tree[category][subCategory] = [];
    if (subDivision && !tree[category][subCategory].includes(subDivision))
      tree[category][subCategory].push(subDivision);
  });
  return tree;
}

const ProductCategoryTreeModal: React.FC<
  ProductCategoryFilterDropdownProps
> = ({
  onSelect = () => {},
  onOpenChange,
  triggerClassName,
  popoverContentClassName,
}) => {
  const { t } = useTranslation("common");
  const tree = buildProductTree(productsData as Product[]);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [sideOffset, setSideOffset] = useState<number>(0);

  // Notify parent when popover open state changes
  useEffect(() => {
    if (onOpenChange) onOpenChange(open);
    if (open && triggerRef.current) {
      setSideOffset(-triggerRef.current.offsetHeight);
    }
  }, [open, onOpenChange]);
  const [selected, setSelected] = useState<{
    category?: string;
    subCategory?: string;
    subDivision?: string;
  }>({});
  const [, setTempSelected] = useState<{
    category?: string;
    subCategory?: string;
    subDivision?: string;
  }>({});
  // Helper to get display value
  const getDisplayValue = () => {
    if (selected.subDivision) return selected.subDivision;
    if (selected.subCategory) return selected.subCategory;
    if (selected.category) return selected.category;
    return t("select_category");
  };
  // Tree radio selection logic (immediate apply)
  const handleSelect = (cat: string, subCat?: string, subDiv?: string) => {
    const newSelection: {
      category: string;
      subCategory?: string;
      subDivision?: string;
    } = { category: cat };
    if (subCat) newSelection.subCategory = subCat;
    if (subDiv) newSelection.subDivision = subDiv;
    // Only call onSelect if the new selection is different from the current selected state
    const isSame =
      selected.category === newSelection.category &&
      selected.subCategory === newSelection.subCategory &&
      selected.subDivision === newSelection.subDivision;
    setSelected(newSelection);
    setOpen(false);
    if (onSelect && !isSame) {
      onSelect({ ...newSelection });
    }
  };

  // Helper: is this node or any of its ancestors selected?
  const isCategorySelected = (cat: string) => {
    return (
      selected.category === cat &&
      !selected.subCategory &&
      !selected.subDivision
    );
  };
  const isSubCategorySelected = (cat: string, subCat: string) => {
    return (
      (selected.category === cat &&
        selected.subCategory === subCat &&
        !selected.subDivision) ||
      isCategorySelected(cat)
    );
  };
  const isSubDivisionSelected = (
    cat: string,
    subCat: string,
    subDiv: string,
  ) => {
    return (
      (selected.category === cat &&
        selected.subCategory === subCat &&
        selected.subDivision === subDiv) ||
      isSubCategorySelected(cat, subCat)
    );
  };
  const handleClear = () => {
    setSelected({});
    setTempSelected({});
    setOpen(false);
    if (onSelect) onSelect({ category: "all" } as any);
  };
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={
              (triggerClassName ? triggerClassName + " " : "") +
              "flex items-center gap-x-2 h-12 rounded-lg border border-gray-300 bg-white shadow-md hover:shadow-lg transition-shadow duration-150 px-3 focus:!border-blue-500 focus:!ring-0 active:!border-blue-500 justify-between"
            }
          >
            <span
              className={
                getDisplayValue() === "Select category..."
                  ? "opacity-60 text-left"
                  : "text-left"
              }
            >
              {getDisplayValue()}
            </span>
            <FolderSearch className="h-4 w-4 shrink-0 opacity-50 flex-shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          sideOffset={sideOffset}
          className={`w-[380px] p-0 bg-white flex flex-col max-h-[80vh] border border-gray-300 shadow-md ${popoverContentClassName || ""}`}
        >
          <Command className="flex flex-col flex-1 min-h-0 h-full">
            <CommandList className="flex-1 min-h-0 h-full">
              <div className="p-4 pb-0 flex flex-col gap-2">
                <div className="text-lg font-semibold flex items-center gap-2">
                  {t("select_category_label")}
                </div>
              </div>
              <div className="overflow-y-auto px-4 pt-2 pb-0 flex-1">
                <ul className="space-y-1">
                  {Object.entries(tree).map(([category, subCats]) => (
                    <li key={category}>
                      <div
                        className={`flex items-center gap-2 cursor-pointer py-1 ${isCategorySelected(category) ? "font-semibold text-primary" : ""}`}
                        onClick={() => handleSelect(category)}
                        style={{ minWidth: 0 }}
                      >
                        <span
                          className={`w-5 h-5 flex items-center justify-center rounded-full border ${isCategorySelected(category) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                          style={{ flexShrink: 0 }}
                        >
                          {isCategorySelected(category) && (
                            <CheckIcon className="w-4 h-4 text-white" />
                          )}
                        </span>
                        <span
                          className="text-base truncate"
                          style={{ minWidth: 0, maxWidth: "100%" }}
                          title={category}
                        >
                          {category}
                        </span>
                      </div>
                      {Object.entries(subCats).length > 0 && (
                        <ul className="pl-7">
                          {Object.entries(subCats).map(
                            ([subCategory, subDivisions]) => (
                              <li key={subCategory}>
                                <div
                                  className={`flex items-center gap-2 cursor-pointer py-1 ${isSubCategorySelected(category, subCategory) ? "font-semibold text-primary" : ""}`}
                                  onClick={() =>
                                    handleSelect(category, subCategory)
                                  }
                                >
                                  <span
                                    className={`w-5 h-5 flex items-center justify-center rounded-full border ${isSubCategorySelected(category, subCategory) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                                  >
                                    {isSubCategorySelected(
                                      category,
                                      subCategory,
                                    ) && (
                                      <CheckIcon className="w-4 h-4 text-white" />
                                    )}
                                  </span>
                                  <span>{subCategory}</span>
                                </div>
                                {subDivisions.length > 0 && (
                                  <ul className="pl-7">
                                    {subDivisions.map((subDivision) => (
                                      <li key={subDivision}>
                                        <div
                                          className={`flex items-center gap-2 cursor-pointer py-1 ${isSubDivisionSelected(category, subCategory, subDivision) ? "font-semibold text-primary" : ""}`}
                                          onClick={() =>
                                            handleSelect(
                                              category,
                                              subCategory,
                                              subDivision,
                                            )
                                          }
                                        >
                                          <span
                                            className={`w-5 h-5 flex items-center justify-center rounded-full border ${isSubDivisionSelected(category, subCategory, subDivision) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                                          >
                                            {isSubDivisionSelected(
                                              category,
                                              subCategory,
                                              subDivision,
                                            ) && (
                                              <CheckIcon className="w-4 h-4 text-white" />
                                            )}
                                          </span>
                                          <span>{subDivision}</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </CommandList>
            <div className="flex justify-end gap-2 p-4 mt-2 sticky bottom-0 bg-white">
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white px-4"
                variant="default"
                size="sm"
                onClick={handleClear}
              >
                {t("clear")}
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ProductCategoryTreeModal;
