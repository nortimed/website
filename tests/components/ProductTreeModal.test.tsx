import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductTreeModal from "../../src/components/ProductTreeModal";

const mockProducts = [
  {
    name: "Product 1",
    category: "Cat A",
    subCategory: "Sub A1",
    subDivision: "Div A1-1",
    colorOptions: [],
    images: ["/img1.jpg"],
    description: "desc",
  },
  {
    name: "Product 2",
    category: "Cat A",
    subCategory: "Sub A2",
    subDivision: "Div A2-1",
    colorOptions: [],
    images: ["/img2.jpg"],
    description: "desc",
  },
  {
    name: "Product 3",
    category: "Cat B",
    subCategory: "Sub B1",
    subDivision: "Div B1-1",
    colorOptions: [],
    images: ["/img3.jpg"],
    description: "desc",
  },
];

jest.mock("../../src/data/products.json", () => mockProducts);

function openPopover() {
  fireEvent.click(screen.getByRole("combobox"));
}

describe("ProductTreeModal", () => {
  it("renders trigger button", () => {
    render(<ProductTreeModal />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("opens popover on click", () => {
    render(<ProductTreeModal />);
    openPopover();
    expect(screen.getByText(/Select category/i)).toBeInTheDocument();
  });

  it("shows all categories", () => {
    render(<ProductTreeModal />);
    openPopover();
    expect(screen.getByText("Cat A")).toBeInTheDocument();
    expect(screen.getByText("Cat B")).toBeInTheDocument();
  });

  it("calls onSelect with category only", () => {
    const onSelect = jest.fn();
    render(<ProductTreeModal onSelect={onSelect} />);
    openPopover();
    fireEvent.click(screen.getByText("Cat B"));
    expect(onSelect).toHaveBeenCalledWith({ category: "Cat B" });
  });

  it("calls onSelect with category and subCategory", () => {
    const onSelect = jest.fn();
    render(<ProductTreeModal onSelect={onSelect} />);
    openPopover();
    fireEvent.click(screen.getByText("Cat A"));
    openPopover();
    fireEvent.click(screen.getByText("Sub A2"));
    expect(onSelect).toHaveBeenCalledWith({
      category: "Cat A",
      subCategory: "Sub A2",
    });
  });

  it("calls onSelect with category, subCategory, and subDivision", () => {
    const onSelect = jest.fn();
    render(<ProductTreeModal onSelect={onSelect} />);
    openPopover();
    fireEvent.click(screen.getByText("Cat A"));
    openPopover();
    fireEvent.click(screen.getByText("Sub A1"));
    openPopover();
    fireEvent.click(screen.getByText("Div A1-1"));
    expect(onSelect).toHaveBeenCalledWith({
      category: "Cat A",
      subCategory: "Sub A1",
      subDivision: "Div A1-1",
    });
  });

  it("clears selection and calls onSelect with all", () => {
    const onSelect = jest.fn();
    render(<ProductTreeModal onSelect={onSelect} />);
    openPopover();
    fireEvent.click(screen.getByText("Cat B"));
    openPopover();
    fireEvent.click(screen.getByText("Clear"));
    expect(onSelect).toHaveBeenCalledWith({ category: "all" });
  });
});
