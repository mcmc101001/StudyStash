"use client";

import useQueryParams from "@/hooks/useQueryParams";
import { semesterOptions, examTypeOptions, ResourceType } from "@/lib/content";
import StyledSelect, { Option } from "@/components/ui/StyledSelect";

interface ResourceFiltersProps {
  acadYearOptions: Option[];
  category: ResourceType;
}

export default function ResourceFilters({
  acadYearOptions,
  category,
}: ResourceFiltersProps) {
  const { queryParams, setQueryParams } = useQueryParams();

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
            ? { value: semesterQueryParam, label: semesterQueryParam }
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
