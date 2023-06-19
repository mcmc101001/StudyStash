"use client";

import { sortOptions, statusOptions } from "@/lib/content";
import StyledSelect, { Option } from "@/components/ui/StyledSelect";
import useQueryParams from "@/hooks/useQueryParams";

interface SolutionSortProps {
  isSignedIn: boolean;
}

export default function SolutionSort({ isSignedIn }: SolutionSortProps) {
  const { queryParams, setQueryParams } = useQueryParams();

  const handleSortChange = (option: Option | null) => {
    if (option) {
      setQueryParams({ sort: option.value });
    } else {
      setQueryParams({ sort: null });
    }
  };

  const handleFilterStatusChange = (option: Option | null) => {
    if (option) {
      setQueryParams({ filterStatus: option.value });
    } else {
      setQueryParams({ filterStatus: null });
    }
  };

  const sortQueryParam = queryParams?.get("sort");
  const filterStatusQueryParam = queryParams?.get("filterStatus");

  return (
    <div className="flex gap-x-4">
      <div className="flex-1">
        <StyledSelect
          label="Sort"
          placeholderText="Sort by"
          options={sortOptions}
          onChange={handleSortChange}
          labelExists={false}
          defaultValue={
            sortQueryParam
              ? sortOptions.find((option) => {
                  return option.value === sortQueryParam;
                })
              : undefined
          }
        />
      </div>
      {isSignedIn && (
        <div className="flex-1">
          <StyledSelect
            label="Status"
            placeholderText="Status"
            options={statusOptions}
            onChange={handleFilterStatusChange}
            labelExists={false}
            defaultValue={
              filterStatusQueryParam
                ? statusOptions.find((option) => {
                    return option.value === filterStatusQueryParam;
                  })
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
