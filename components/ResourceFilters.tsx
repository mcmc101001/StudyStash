"use client";

import useQueryParams from "@/hooks/useQueryParams";
import { semesterOptions, examTypeOptions } from "@/lib/content";
import StyledSelect, { Option } from "@/components/ui/StyledSelect";

interface ResourceFiltersProps {
  acadYearOptions: Option[];
}

export default function ResourceFilters({
  acadYearOptions,
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

  return (
    <div className="flex flex-col items-center gap-x-4 gap-y-4">
      <StyledSelect
        label="Acad Year"
        options={acadYearOptions}
        onChange={handleAcadYearChange}
        placeholder={true}
      />
      <StyledSelect
        label="Semester"
        options={semesterOptions}
        onChange={handleSemesterChange}
        placeholder={true}
      />
      <StyledSelect
        label="Exam Type"
        options={examTypeOptions}
        onChange={handleExamTypeChange}
        placeholder={true}
      />
    </div>
  );
}
