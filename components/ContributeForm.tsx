'use client'

import { getAcadYearOptions } from "@/lib/nusmods"
import { containsOnlyNumbers } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import Select from "react-select"

interface Option {
  value: string;
  label: string;
}

interface ContributeFormProps {
  acadYearOptions: Array<Option>;
  moduleCodeList: Array<Option>;
}

const ContributeForm:FC<ContributeFormProps> = (props) => {
  
  let moduleCodeOptions = props.moduleCodeList;

  return (
    <form className="w-80">
      <label htmlFor="acadYear" className="text-slate-800 dark:text-slate-200">Acad Year</label>
      <Select
        styles={{
          option: (baseStyles, state) => {
            return {
              ...baseStyles,
              backgroundColor: state.isFocused ? '#AAAAAA' : 'var(--color-slate-800)',
            }            
          },
        }}
        closeMenuOnSelect={true}
        options={props.acadYearOptions}
      />
      
      <label htmlFor="moduleCode" className="text-slate-800 dark:text-slate-200">Module Code</label>
      <Select
        // isSearchable={true}
        filterOption={(option: {value: string, label: string}, query: string) => {
          if (query.trimStart().length < 2) {
            return false;
          }
          // If matches prefix
          if (option.value.toLowerCase().startsWith(query.trimStart().toLowerCase())) {
            return true;
          } else if (containsOnlyNumbers(query.trimStart())) {
            // If matches number
            if (option.value.includes(query.trimStart())) {
              return true;
            }
          }
          return false;
        }}
        styles={{
          option: (baseStyles, state) => {
            return {
              ...baseStyles,
              backgroundColor: state.isFocused ? '#AAAAAA' : 'var(--color-slate-800)',
            }            
          },
        }}
        closeMenuOnSelect={true}
        options={moduleCodeOptions}
      />
    </form>
  )
}

export default ContributeForm