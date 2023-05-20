"use client";

import { sortOptions } from "@/lib/content";
import StyledSelect, { Option } from "@/components/ui/StyledSelect";
import useQueryParams from "@/hooks/useQueryParams";

export default function SolutionSort() {
  const { queryParams, setQueryParams } = useQueryParams();

  const handleSortChange = (option: Option | null) => {
    if (option) {
      setQueryParams({ sort: option.value });
    } else {
      setQueryParams({ sort: null });
    }
  };

  const sortQueryParam = queryParams?.get("sort");

  return (
    <StyledSelect
      label="Sort"
      placeholderText="Sort"
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
  );
}
