import React, { useState, useEffect } from "react";
import productsData from "../data/products.json";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../components/ui/select";
import { Card } from "../components/ui/card";

interface QuoteProduct {
    name: string;
    quantity: number;
    color?: string;
}

const RequestQuote: React.FC = () => {
    // Read product/color from sessionStorage if present
    const [pendingProduct, setPendingProduct] = useState<{
        product: string;
        color: string;
    } | null>(null);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = window.sessionStorage.getItem("quoteProduct");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.product) {
                        setPendingProduct({
                            product: parsed.product,
                            color: parsed.color || "",
                        });
                    }
                } catch { }
                window.sessionStorage.removeItem("quoteProduct");
            }
        }
    }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<QuoteProduct[]>([]);
    const [productToAdd, setProductToAdd] = useState("");
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [colorToAdd, setColorToAdd] = useState("");
    const [notes, setNotes] = useState("");

    // On mount, preselect product and color if provided in query
    useEffect(() => {
        if (!pendingProduct) return;
        const prod = productsData.find((p) => p.name === pendingProduct.product);
        if (!prod) return;
        const color =
            prod.colorOptions.length > 0
                ? pendingProduct.color || prod.colorOptions[0]
                : "";
        const alreadyExists = selectedProducts.some(
            (sp) =>
                sp.name === prod.name &&
                normalizeColor(sp.color) === normalizeColor(color),
        );
        if (!alreadyExists) {
            setSelectedProducts((prev) => [
                ...prev,
                {
                    name: prod.name,
                    quantity: 1,
                    color: normalizeColor(color),
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingProduct]);

    // Fix: Reset colorToAdd if it is no longer available for the selected product
    useEffect(() => {
        if (!productToAdd) return;
        let name = productToAdd;
        let color: string | undefined;
        if (productToAdd.includes("||")) {
            [name, color] = productToAdd.split("||");
        }
        const prod = productsData.find((p) => p.name === name);
        if (prod && prod.colorOptions && prod.colorOptions.length > 0) {
            const availableColors = prod.colorOptions.filter(
                (c) =>
                    !selectedProducts.some(
                        (sp) => sp.name === prod.name && sp.color === c,
                    ),
            );
            // If only one color, auto-select it
            if (availableColors.length === 1 && colorToAdd !== availableColors[0]) {
                setColorToAdd(availableColors[0]);
            } else if (colorToAdd && !availableColors.includes(colorToAdd)) {
                setColorToAdd("");
            }
        }
    }, [productToAdd, colorToAdd, selectedProducts]);

    // Helper to normalize color to '' if undefined/null
    function normalizeColor(color: string | undefined | null) {
        return typeof color === "string" && color.length > 0 ? color : "";
    }

    // Get available products (not all color variants)
    function getAvailableProducts(selectedProducts: QuoteProduct[]) {
        return productsData.filter((p) => {
            if (Array.isArray(p.colorOptions) && p.colorOptions.length > 0) {
                const availableColors = p.colorOptions.filter(
                    (color) =>
                        !selectedProducts.some(
                            (sp) => sp.name === p.name && sp.color === color,
                        ),
                );
                return availableColors.length > 0;
            } else {
                return !selectedProducts.some(
                    (sp) => sp.name === p.name && normalizeColor(sp.color) === "",
                );
            }
        });
    }
    const availableProducts = getAvailableProducts(selectedProducts);
    const noMoreProducts = availableProducts.length === 0;

    const handleAddProduct = () => {
        if (!productToAdd) return;
        // productToAdd is in the format 'name||color' for colored products, or just 'name' for colorless
        let name = productToAdd;
        let color: string = "";
        if (productToAdd.includes("||")) {
            [name, color] = productToAdd.split("||");
        }
        color = normalizeColor(color || colorToAdd);
        const prod = productsData.find((p) => p.name === name);
        if (!prod) return;
        // Prevent duplicates: check if this name+color is already in selectedProducts
        const key = `${name}|||${color}`;
        const selectedKeys = new Set(
            selectedProducts.map((sp) => `${sp.name}|||${normalizeColor(sp.color)}`),
        );
        if (selectedKeys.has(key)) {
            return;
        }
        setSelectedProducts([
            ...selectedProducts,
            {
                name: prod.name,
                quantity: quantityToAdd,
                color,
            },
        ]);
        setProductToAdd("");
        setQuantityToAdd(1);
        setColorToAdd("");
    };

    const handleProductChange = (index: number, field: string, value: any) => {
        setSelectedProducts((prev) =>
            prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
        );
    };

    const handleRemoveProduct = (index: number) => {
        setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would send the quote request to your backend or email
        alert("Quote request submitted!");
    };

    return (
        <div className="max-w-2xl mx-auto py-16 px-4 mt-16">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Request Product Quote
            </h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-1 font-medium">Phone</label>
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <div className="mb-8">
                        <label className="block mb-1 font-medium" htmlFor="notes">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            maxLength={500}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring resize-vertical min-h-[80px]"
                            placeholder="Add any relevant notes (max 500 characters)"
                        />
                        <div className="text-xs text-gray-500 text-right">
                            {notes.length}/500
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">Products</h2>
                    <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
                        <div className="flex-1">
                            <Select
                                value={productToAdd}
                                onValueChange={(val) => {
                                    setProductToAdd(val);
                                    setColorToAdd("");
                                }}
                                disabled={noMoreProducts}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            noMoreProducts
                                                ? "No more available products"
                                                : "Add a product"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableProducts.map((product) => {
                                        let label = product.name;
                                        const availableColors = Array.isArray(product.colorOptions)
                                            ? product.colorOptions.filter(
                                                (color) =>
                                                    !selectedProducts.some(
                                                        (sp) =>
                                                            sp.name === product.name && sp.color === color,
                                                    ),
                                            )
                                            : [];
                                        if (availableColors.length === 1) {
                                            label += ` (${availableColors[0]})`;
                                        }
                                        return (
                                            <SelectItem key={product.name} value={product.name}>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-8 h-8 object-cover rounded"
                                                    />
                                                    <span>{label}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            {noMoreProducts && (
                                <div className="text-sm text-gray-500 mt-2">
                                    All products have been added to the quote request.
                                </div>
                            )}
                        </div>
                        {productToAdd &&
                            (() => {
                                let name = productToAdd;
                                let color: string | undefined = undefined;
                                if (productToAdd.includes("||")) {
                                    [name, color] = productToAdd.split("||");
                                }
                                const prod = productsData.find((p) => p.name === name);
                                if (prod && prod.colorOptions && prod.colorOptions.length > 0) {
                                    // Only show colors not already selected for this product
                                    const availableColors = prod.colorOptions.filter(
                                        (c) =>
                                            !selectedProducts.some(
                                                (sp) => sp.name === prod.name && sp.color === c,
                                            ),
                                    );
                                    const onlyOneColor = availableColors.length === 1;
                                    return (
                                        <>
                                            <div>
                                                <label className="block text-xs mb-1">Quantity</label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={quantityToAdd}
                                                    onChange={(e) =>
                                                        setQuantityToAdd(Number(e.target.value))
                                                    }
                                                    className="w-20"
                                                />
                                            </div>
                                            {!onlyOneColor && (
                                                <div>
                                                    <label className="block text-xs mb-1">Color</label>
                                                    <Select
                                                        value={colorToAdd}
                                                        onValueChange={setColorToAdd}
                                                    >
                                                        <SelectTrigger className="w-28">
                                                            <SelectValue placeholder="Select color" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableColors.map((c) => (
                                                                <SelectItem key={c} value={c}>
                                                                    {c}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                            <Button
                                                type="button"
                                                onClick={handleAddProduct}
                                                className="ml-2"
                                                disabled={!colorToAdd}
                                            >
                                                Add
                                            </Button>
                                        </>
                                    );
                                } else {
                                    // No color options, just show quantity and add button
                                    return (
                                        <>
                                            <div>
                                                <label className="block text-xs mb-1">Quantity</label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={quantityToAdd}
                                                    onChange={(e) =>
                                                        setQuantityToAdd(Number(e.target.value))
                                                    }
                                                    className="w-20"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={handleAddProduct}
                                                className="ml-2"
                                            >
                                                Add
                                            </Button>
                                        </>
                                    );
                                }
                            })()}
                    </div>
                    <div className="space-y-4">
                        {selectedProducts.map((sp, idx) => {
                            const prod = productsData.find((p) => p.name === sp.name);
                            const colorStr = normalizeColor(sp.color);
                            return (
                                <Card
                                    key={sp.name + "|||" + colorStr}
                                    className="flex items-center gap-4 p-4"
                                >
                                    <img
                                        src={prod?.images?.[0] || ""}
                                        alt={sp.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">
                                            {sp.name}
                                            {colorStr ? ` (${colorStr})` : ""}
                                        </div>
                                        <div className="flex gap-4 mt-1">
                                            <div>
                                                <label className="block text-xs mb-1">Quantity</label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={sp.quantity}
                                                    onChange={(e) =>
                                                        handleProductChange(
                                                            idx,
                                                            "quantity",
                                                            Number(e.target.value),
                                                        )
                                                    }
                                                    className="w-20"
                                                />
                                            </div>
                                            {prod &&
                                                Array.isArray(prod.colorOptions) &&
                                                prod.colorOptions.length > 0 &&
                                                (() => {
                                                    const availableColors = prod.colorOptions.filter(
                                                        (color) =>
                                                            !selectedProducts.some(
                                                                (spp, i) =>
                                                                    i !== idx &&
                                                                    spp.name === prod.name &&
                                                                    normalizeColor(spp.color) === color,
                                                            ) || color === colorStr,
                                                    );
                                                    if (availableColors.length === 1) {
                                                        // If only one color, do not show picker, but auto-set color if not already set
                                                        if (colorStr !== availableColors[0]) {
                                                            setTimeout(
                                                                () =>
                                                                    handleProductChange(
                                                                        idx,
                                                                        "color",
                                                                        availableColors[0],
                                                                    ),
                                                                0,
                                                            );
                                                        }
                                                        return null;
                                                    }
                                                    return (
                                                        <div>
                                                            <label className="block text-xs mb-1">
                                                                Color
                                                            </label>
                                                            <Select
                                                                value={colorStr || availableColors[0]}
                                                                onValueChange={(val) =>
                                                                    handleProductChange(idx, "color", val)
                                                                }
                                                            >
                                                                <SelectTrigger className="w-28">
                                                                    <SelectValue placeholder="Select color" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {availableColors.map((color) => (
                                                                        <SelectItem key={color} value={color}>
                                                                            {color}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    );
                                                })()}
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => handleRemoveProduct(idx)}
                                        className="p-2 rounded-full hover:bg-red-50 group"
                                        aria-label="Remove product"
                                    >
                                        <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600 md:text-gray-400 md:group-hover:text-red-600 sm:text-red-600" />
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full py-3 font-semibold text-lg mt-8"
                >
                    Submit Quote Request
                </Button>
            </form>
        </div>
    );
};

export default RequestQuote;
