"use client";

import { FC } from "react";
import {
  AcadYearSelect,
  ExamTypeSelect,
  Option,
  SemesterSelect,
} from "@/components/ContributeForm";
import useQueryParams from "@/hooks/useQueryParams";
import { semesterOptions, examTypeOptions } from "@/lib/content";

interface ResourceFiltersProps {
  acadYearOptions: Option[];
}

const ResourceFilters: FC<ResourceFiltersProps> = ({ acadYearOptions }) => {
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
    <div className="flex flex-row items-center justify-between gap-x-4">
      <AcadYearSelect
        options={acadYearOptions}
        onChange={handleAcadYearChange}
        placeholder={true}
      />
      <SemesterSelect
        options={semesterOptions}
        onChange={handleSemesterChange}
        placeholder={true}
      />
      <ExamTypeSelect
        options={examTypeOptions}
        onChange={handleExamTypeChange}
        placeholder={true}
      />
    </div>
  );
};

export default ResourceFilters;
