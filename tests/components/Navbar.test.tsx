import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../../src/components/Navbar";

describe("Navbar", () => {
  it("renders the navbar", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
