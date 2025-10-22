import { Product } from "../../src/types";

describe("Product type", () => {
  it("should have the correct structure", () => {
    // Arrange
    const product: Product = {
      name: "Test",
      category: "Cat",
      subCategory: "Sub",
      subDivision: "Div",
      description: "desc",
      images: ["img.jpg"],
      colorOptions: ["red", "blue"],
    };
    // Assert
    expect(product).toMatchObject({
      name: expect.any(String),
      category: expect.any(String),
      subCategory: expect.any(String),
      subDivision: expect.any(String),
      description: expect.any(String),
      images: expect.any(Array),
      colorOptions: expect.any(Array),
    });
  });
});
