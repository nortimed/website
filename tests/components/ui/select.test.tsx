import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Select } from "../../../src/components/ui/select";

describe("Select", () => {
  it("renders select element", () => {
    const { container } = render(<Select />);
    expect(container.querySelector("select")).toBeInTheDocument();
  });
});
