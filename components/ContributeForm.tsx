"use client";

import { containsOnlyNumbers } from "@/lib/utils";
import { FC } from "react";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface ContributeFormProps {
  acadYearOptions: Array<Option>;
  moduleCodeOptions: Array<Option>;
  semesterOptions: Array<Option>;
  examTypeOptions: Array<Option>;
  submitType: string;
}

interface SelectProps {
  options: Array<Option>;
}

const ContributeForm: FC<ContributeFormProps> = (props) => {
  return (
    <form className="w-80 flex flex-col gap-y-4">
      <AcadYearSelect options={props.acadYearOptions} />
      <SemesterSelect options={props.semesterOptions} />
      <ModuleCodeSelect options={props.moduleCodeOptions} />
      <ExamTypeSelect options={props.examTypeOptions} />      
    </form>
  );
};

export default ContributeForm;

const AcadYearSelect: FC<SelectProps> = ({ options }) => {
  return (
    <div >
      <label htmlFor="acadYear" className="text-slate-800 dark:text-slate-200">
        Acad Year
      </label>
      <Select
        id = "acadYear"
        styles={{
          option: (baseStyles, state) => {
            return {
              ...baseStyles,
              backgroundColor: state.isFocused
                ? "#AAAAAA"
                : "var(--color-slate-800)",
            };
          },
        }}
        closeMenuOnSelect={true}
        options={options}
      />
    </div>
  );
};

const ModuleCodeSelect: FC<SelectProps> = ({ options }) => {
  return (
    <div>
      <label
        htmlFor="moduleCode"
        className="text-slate-800 dark:text-slate-200"
      >
        Module Code
      </label>
      <Select
        id = "moduleCode"
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
        styles={{
          option: (baseStyles, state) => {
            return {
              ...baseStyles,
              backgroundColor: state.isFocused
                ? "#AAAAAA"
                : "var(--color-slate-800)",
            };
          },
        }}
        closeMenuOnSelect={true}
        options={options}
      />
    </div>
  )
}

const SemesterSelect: FC<SelectProps> = ({ options }) => {
  return (
    <div>
      <label htmlFor="semester" className="text-slate-800 dark:text-slate-200">
        Semester
      </label>
      <Select
        id = "semester"
        styles={{
          option: (baseStyles, state) => {
            return {
              ...baseStyles,
              backgroundColor: state.isFocused
                ? "#AAAAAA"
                : "var(--color-slate-800)",
            };
          },
        }}
        closeMenuOnSelect={true}
        options={options}
      />
    </div>
  )
}

const ExamTypeSelect: FC<SelectProps> = ({ options }) => {
  return (
    <div>
      <label htmlFor="examType" className="text-slate-800 dark:text-slate-200">
        Exam Type
      </label>
      <Select
        id = "examType"
        styles={{
          option: (baseStyles, state) => {
            return {
              ...baseStyles,
              backgroundColor: state.isFocused
                ? "#AAAAAA"
                : "var(--color-slate-800)",
            };
          },
        }}
        closeMenuOnSelect={true}
        options={options}
      />
    </div>
  )
}