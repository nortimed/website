import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import '@testing-library/jest-dom';
vi.mock("../../src/data/products.json", () => ({
  default: [
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
  ]
}));

import ProductCategoryTreeModal from "../../src/components/ProductCategoryTreeModal";

function openPopover() {
  fireEvent.click(screen.getByRole("combobox"));
}

describe("ProductCategoryTreeModal", () => {
  it("renders trigger button", () => {
    render(<ProductCategoryTreeModal />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("opens popover on click", () => {
    render(<ProductCategoryTreeModal />);
    openPopover();
  expect(screen.getByText('select_category')).toBeInTheDocument();
  });

  it("shows all categories", () => {
    render(<ProductCategoryTreeModal />);
    openPopover();
  expect(screen.getByText("Cat A")).toBeInTheDocument();
  expect(screen.getByText("Cat B")).toBeInTheDocument();
  });

  it("calls onSelect with category only", () => {
    const onSelect = vi.fn();
    render(<ProductCategoryTreeModal onSelect={onSelect} />);
    openPopover();
    fireEvent.click(screen.getByText("Cat B"));
    expect(onSelect).toHaveBeenCalledWith({ category: "Cat B" });
  });

  it("calls onSelect with category and subCategory", () => {
    const onSelect = vi.fn();
    render(<ProductCategoryTreeModal onSelect={onSelect} />);
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
    const onSelect = vi.fn();
    render(<ProductCategoryTreeModal onSelect={onSelect} />);
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
    const onSelect = vi.fn();
    render(<ProductCategoryTreeModal onSelect={onSelect} />);
    openPopover();
    fireEvent.click(screen.getByText("Cat B"));
    openPopover();
    fireEvent.click(screen.getByText("clear"));
    expect(onSelect).toHaveBeenCalledWith({ category: "all" });
  });
});
