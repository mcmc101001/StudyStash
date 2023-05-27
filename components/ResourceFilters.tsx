"use client";

import useQueryParams from "@/hooks/useQueryParams";
import {
  semesterOptions,
  examTypeOptions,
  ResourceType,
  sortOptions,
  papersAdditionalSortOptions,
} from "@/lib/content";
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

  const handleSortChange = (option: Option | null) => {
    if (option) {
      setQueryParams({ sort: option.value });
    } else {
      setQueryParams({ sort: null });
    }
  };

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

  const sortQueryParam = queryParams?.get("sort");
  const acadYearQueryParam = queryParams?.get("filterAcadYear");
  const semesterQueryParam = queryParams?.get("filterSemester");
  const examTypeQueryParam = queryParams?.get("filterExamType");

  return (
    <div className="flex w-full flex-col items-center gap-x-4 gap-y-4">
      <StyledSelect
        label="Sort"
        placeholderText="Sort"
        options={
          category === "Past Papers"
            ? sortOptions.concat(papersAdditionalSortOptions)
            : sortOptions
        }
        onChange={handleSortChange}
        labelExists={false}
        defaultValue={
          // choose select param accordingly based on category
          sortQueryParam
            ? category === "Past Papers"
              ? sortOptions
                  .concat(papersAdditionalSortOptions)
                  .find((option) => {
                    return option.value === sortQueryParam;
                  })
              : sortOptions.find((option) => {
                  return option.value === sortQueryParam;
                })
            : undefined
        }
      />
      {moduleCodeOptions !== undefined && (
        <StyledSelect
          label="Select Module Code"
          placeholderText="Module Code"
          onChange={handleModuleCodeChange}
          options={moduleCodeOptions}
          labelExists={false}
          noOptionsMessage={({ inputValue }) =>
            inputValue.trimStart().length < 2
              ? "Type to search..."
              : "No options"
          }
          filterOption={(
            option: { value: string; label: string },
            query: string
          ) => {
            const trimmed_query = query.trimStart();
            if (trimmed_query.length < 2) {
              return false;
            }
            // If matches prefix
            if (
              option.value.toLowerCase().startsWith(trimmed_query.toLowerCase())
            ) {
              return false;
            } else if (containsOnlyNumbers(trimmed_query)) {
              // If matches number
              if (option.value.includes(trimmed_query)) {
                return false;
              }
            }
            return false;
          }}
        />
      )}
      <StyledSelect
        label="Select Acad Year"
        placeholderText="Acad Year"
        options={acadYearOptions}
        onChange={handleAcadYearChange}
        labelExists={false}
        defaultValue={
          acadYearQueryParam
            ? { value: acadYearQueryParam, label: acadYearQueryParam }
            : undefined
        }
      />
      <StyledSelect
        label="Select Semester"
        placeholderText="Semester"
        options={semesterOptions}
        onChange={handleSemesterChange}
        labelExists={false}
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
          label="Select Exam Type"
          placeholderText="Exam Type"
          options={examTypeOptions}
          onChange={handleExamTypeChange}
          labelExists={false}
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
