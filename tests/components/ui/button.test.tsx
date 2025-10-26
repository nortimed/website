import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "../../../src/components/ui/button";

describe("Button", () => {
  it("renders children", () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText("Click me")).toBeInTheDocument();
  });
});
