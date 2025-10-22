import {
  filterProductsByCategory,
  searchProducts,
} from "../../src/utils/helpers";

describe("filterProductsByCategory", () => {
  it("returns only products in the given category", () => {
    // Arrange
    const products = [
      { name: "A", category: "cat1" },
      { name: "B", category: "cat2" },
      { name: "C", category: "cat1" },
    ];
    // Act
    const result = filterProductsByCategory(products, "cat1");
    // Assert
    expect(result).toEqual([
      { name: "A", category: "cat1" },
      { name: "C", category: "cat1" },
    ]);
  });
});

describe("searchProducts", () => {
  it("returns products whose name or description matches the search term (case-insensitive)", () => {
    // Arrange
    const products = [
      { name: "Alpha", description: "First" },
      { name: "Beta", description: "Second" },
      { name: "Gamma", description: "Alpha stuff" },
    ];
    // Act
    const result = searchProducts(products, "alpha");
    // Assert
    expect(result).toEqual([
      { name: "Alpha", description: "First" },
      { name: "Gamma", description: "Alpha stuff" },
    ]);
  });
});
