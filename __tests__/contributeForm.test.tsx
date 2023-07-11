import { fireEvent, render, screen } from "@testing-library/react";
import ContributeForm from "@/components/ContributeForm";
import "@testing-library/jest-dom/extend-expect";
import { ResourceType } from "@/lib/content";
import { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const mock_acadYearOptions = [
  { label: "2020/2021", value: "2020/2021" },
  { label: "2021/2022", value: "2021/2022" },
  { label: "2022/2023", value: "2022/2023" },
];
const mock_semesterOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
];
const mock_moduleCodeOptions = [
  { label: "CS1010", value: "CS1010" },
  { label: "CS1231", value: "CS1231" },
  { label: "CS2040C", value: "CS2040C" },
  { label: "CS2113", value: "CS2113" },
];
const mock_examTypeOptions = [
  { label: "Midterms", value: "Midterms" },
  { label: "Finals", value: "Finals" },
];
const mock_user_id = "1234567890";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

describe("ContributeForm", () => {
  const resourceTypes: ResourceType[] = ["Notes", "Past Papers", "Cheatsheets"];
  (
    useSearchParams as jest.MockedFunction<typeof useSearchParams>
  ).mockReturnValue(null);

  resourceTypes.map((resourceType) => {
    it(`should render correct form output for ${resourceType}`, async () => {
      render(
        <ContributeForm
          acadYearOptions={mock_acadYearOptions}
          semesterOptions={mock_semesterOptions}
          moduleCodeOptions={mock_moduleCodeOptions}
          examTypeOptions={
            resourceType !== "Notes" ? mock_examTypeOptions : null
          }
          resourceType={resourceType}
          userId={mock_user_id}
        />
      );
      const selects = screen.getAllByRole("combobox");
      if (resourceType === "Notes") {
        expect(selects.length).toBe(3);
      } else if (resourceType === "Cheatsheets") {
        expect(selects.length).toBe(4);
      } else {
        expect(selects.length).toBe(5);
      }
    });
  });
});
