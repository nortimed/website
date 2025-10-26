import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductShowcase from "../../src/components/ProductShowcase";

describe("ProductShowcase", () => {
  it("renders the product showcase section", () => {
    render(<ProductShowcase />);
    expect(
      screen.getByRole("heading", { name: /products/i }),
    ).toBeInTheDocument();
  });
});
