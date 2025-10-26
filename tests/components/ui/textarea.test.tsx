import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Textarea } from "../../../src/components/ui/textarea";

describe("Textarea", () => {
  it("renders textarea element", () => {
    const { getByRole } = render(<Textarea />);
    expect(getByRole("textbox")).toBeInTheDocument();
  });
});
