type ProductTreeDropdownProps = {
    onSelect?: (filter: { category: string; subCategory?: string; subDivision?: string }) => void;
};
import React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import productsData from "../data/products.json";
import { Product } from "../types";

// Build tree structure: Category > Sub-category > Sub-division
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
        if (!tree[category][subCategory].includes(subDivision)) tree[category][subCategory].push(subDivision);
    });
    return tree;
}


const ProductTreeDropdown: React.FC<ProductTreeDropdownProps> = ({ onSelect = () => {} }) => {
    const tree = buildProductTree(productsData as Product[]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-center text-center text-sm">Filtrar produtos</Button>
            </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border rounded-lg shadow-lg w-40 min-w-40 max-w-40 max-h-[320px] overflow-y-auto p-2 z-50 text-sm">
                    <DropdownMenuLabel className="text-center justify-center px-2 py-1 font-semibold text-gray-700">Categoria</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                {Object.entries(tree).map(([category, subCats]) => (
                    <DropdownMenuSub key={category}>
                        <DropdownMenuSubTrigger
                            onClick={() => typeof onSelect === 'function' && onSelect({ category })}
                                className="text-center justify-center text-sm"
                        >
                            {category}
                        </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-white border rounded-lg shadow-lg w-40 min-w-40 max-w-40 max-h-[320px] overflow-y-auto p-2 z-50 text-sm">
                            {Object.entries(subCats).map(([subCategory, subDivisions]) => (
                                <React.Fragment key={subCategory}>
                                    <DropdownMenuItem
                                        onClick={() => typeof onSelect === 'function' && onSelect({ category, subCategory })}
                                            className="px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-100 transition-colors text-sm text-gray-800 text-center"
                                    >
                                        {subCategory}
                                    </DropdownMenuItem>
                                    {subDivisions.map((subDivision) => (
                                        <DropdownMenuItem
                                            key={subDivision}
                                            onClick={() => typeof onSelect === 'function' && onSelect({ category, subCategory, subDivision })}
                                                className="px-3 py-2 rounded-md hover:bg-gray-100 focus:bg-gray-200 transition-colors text-sm text-gray-700 text-center"
                                        >
                                            {subDivision}
                                        </DropdownMenuItem>
                                    ))}
                                </React.Fragment>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProductTreeDropdown;
