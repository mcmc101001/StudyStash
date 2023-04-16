'use client'

import { getAcadYearOptions } from "@/lib/nusmods"
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
          control: (baseStyles, state) => {
            return {
              ...baseStyles,
              backgroundColor: 'var(--color-slate-800)',
            }            
          },
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
          if (query.length < 2) {
            return false;
          }
          if (option.value.toLowerCase().startsWith(query.toLowerCase())) {
            return true;
          }
          return false;
        }}
        styles={{
          // control: (baseStyles, state) => {
          //   return {
          //     ...baseStyles,
          //     backgroundColor: 'var(--color-slate-800)',
          //   }            
          // },
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