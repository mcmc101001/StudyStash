import { fireEvent, render, screen } from "@testing-library/react";
import ModuleSearcher from "@/components/ModuleSearcher";
import { useSelectedLayoutSegments } from "next/navigation";
import "@testing-library/jest-dom/extend-expect";

const mock_module_codes = ["CS1010", "CS1231", "CS2040C", "CS2113"];

jest.mock("next/navigation", () => ({
  useSelectedLayoutSegments: jest.fn(),
}));

describe("Module Searcher", () => {
  it("should render textbox input field", async () => {
    (useSelectedLayoutSegments as jest.Mock).mockReturnValue([]);
    render(<ModuleSearcher moduleCodes={mock_module_codes} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });
  it("should show module list with correct number on user input CS", async () => {
    (
      useSelectedLayoutSegments as jest.MockedFunction<
        typeof useSelectedLayoutSegments
      >
    ).mockReturnValue([]);

    render(<ModuleSearcher moduleCodes={mock_module_codes} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "CS" } });
    const list = screen.getByRole("list");
    expect(list.childElementCount).toBe(4);
  });
  it("should show module list with correct number on user input MA", async () => {
    (useSelectedLayoutSegments as jest.Mock).mockReturnValue([]);

    render(<ModuleSearcher moduleCodes={mock_module_codes} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "MA" } });
    const list = screen.getByRole("list");
    expect(list.childElementCount).toBe(0);
  });
  it("should show highlighted module", async () => {
    (useSelectedLayoutSegments as jest.Mock).mockReturnValue([
      "CS1010",
      "cheatsheets",
    ]);

    render(<ModuleSearcher moduleCodes={mock_module_codes} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "CS" } });
    const CS1010 = screen.getByRole("link", { name: "CS1010" });
    expect(CS1010.className).toContain("border");
  });
  it("should link to selected resource type", async () => {
    (useSelectedLayoutSegments as jest.Mock).mockReturnValue([
      "CS1010",
      "past_papers",
    ]);

    render(<ModuleSearcher moduleCodes={mock_module_codes} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "CS" } });
    const CS1010 = screen.getByRole("link", { name: "CS1010" });
    expect(CS1010).toHaveAttribute("href", "/database/CS1010/past_papers");
  });
});
