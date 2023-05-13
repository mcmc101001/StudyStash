"use client";

import useQueryParams from "@/hooks/useQueryParams";
import { semesterOptions, examTypeOptions, ResourceType } from "@/lib/content";
import StyledSelect, { Option } from "@/components/ui/StyledSelect";
import { containsOnlyNumbers } from "@/lib/utils";

interface ResourceFiltersProps {
  acadYearOptions: Option[];
  category: ResourceType;
  moduleCodeOptions?: Option[];
}

export default function ResourceFilters({
  acadYearOptions,
  category,
  moduleCodeOptions,
}: ResourceFiltersProps) {
  const { queryParams, setQueryParams } = useQueryParams();

  const handleModuleCodeChange = (option: Option | null) => {
    if (option) {
      setQueryParams({ filterModuleCode: option.value });
    } else {
      setQueryParams({ filterModuleCode: null });
    }
  };

  const handleAcadYearChange = (option: Option | null) => {
    if (option) {
      setQueryParams({ filterAcadYear: option.value });
    } else {
      setQueryParams({ filterAcadYear: null });
    }
  };

  const handleSemesterChange = (option: Option | null) => {
    if (option) {
      setQueryParams({ filterSemester: option.value });
    } else {
      setQueryParams({ filterSemester: null });
    }
  };

  const handleExamTypeChange = (option: Option | null) => {
    if (option) {
      setQueryParams({ filterExamType: option.value });
    } else {
      setQueryParams({ filterExamType: null });
    }
  };

  const acadYearQueryParam = queryParams?.get("filterAcadYear");
  const semesterQueryParam = queryParams?.get("filterSemester");
  const examTypeQueryParam = queryParams?.get("filterExamType");

  return (
    <div className="flex w-full flex-col items-center gap-x-4 gap-y-4">
      {moduleCodeOptions !== undefined && (
        <StyledSelect
          label="Module Code"
          onChange={handleModuleCodeChange}
          options={moduleCodeOptions}
          placeholder={true}
          noOptionsMessage={({ inputValue }) =>
            inputValue.trimStart().length < 2
              ? "Type to search..."
              : "No options"
          }
          filterOption={(
            option: { value: string; label: string },
            query: string
          ) => {
            if (query.trimStart().length < 2) {
              return false;
            }
            // If matches prefix
            if (
              option.value
                .toLowerCase()
                .startsWith(query.trimStart().toLowerCase())
            ) {
              return true;
            } else if (containsOnlyNumbers(query.trimStart())) {
              // If matches number
              if (option.value.includes(query.trimStart())) {
                return true;
              }
            }
            return false;
          }}
        />
      )}
      <StyledSelect
        label="Acad Year"
        options={acadYearOptions}
        onChange={handleAcadYearChange}
        placeholder={true}
        defaultValue={
          acadYearQueryParam
            ? { value: acadYearQueryParam, label: acadYearQueryParam }
            : undefined
        }
      />
      <StyledSelect
        label="Semester"
        options={semesterOptions}
        onChange={handleSemesterChange}
        placeholder={true}
        defaultValue={
          semesterQueryParam
            ? {
                value: semesterQueryParam,
                label: `Semester ${semesterQueryParam}`,
              }
            : undefined
        }
      />
      {category !== "Notes" && (
        <StyledSelect
          label="Exam Type"
          options={examTypeOptions}
          onChange={handleExamTypeChange}
          placeholder={true}
          defaultValue={
            examTypeQueryParam
              ? { value: examTypeQueryParam, label: examTypeQueryParam }
              : undefined
          }
        />
      )}
    </div>
  );
}
