import { ReactNode, useId } from "react";
import Select from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  onChange: (option: Option | null) => void;
  options: Array<Option>;
  labelExists?: boolean;
  placeholderText?: string;
  filterOption?: (option: Option, query: string) => boolean;
  noOptionsMessage?: (obj: { inputValue: string }) => ReactNode;
  defaultValue?: Option;
  inputLike?: boolean;
  value?: Option | null;
  autofocus?: boolean;
}

export default function StyledSelect({
  label,
  options,
  onChange,
  labelExists = true,
  placeholderText,
  filterOption,
  noOptionsMessage,
  defaultValue,
  value,
  inputLike = false,
  autofocus,
}: SelectProps) {
  return (
    <div className="flex w-full flex-col gap-y-1">
      {labelExists ? (
        <label
          htmlFor="acadYear"
          className="text-slate-800 dark:text-slate-200"
        >
          {label}
        </label>
      ) : null}
      <Select
        id={label}
        value={value}
        instanceId={useId()}
        aria-label={placeholderText}
        aria-labelledby={placeholderText}
        classNamePrefix={label}
        autoFocus={autofocus}
        classNames={{
          option: (state) =>
            `text-slate-800 dark:text-slate-200 ` +
            `${
              state.isFocused
                ? "bg-slate-200 dark:bg-slate-800 "
                : "bg-slate-100 dark:bg-slate-950 "
            }` +
            `${state.isSelected ? "font-bold" : ""}`,
          menuList: () =>
            "p-0 border dark:border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950",
          control: () =>
            "border border-slate-700 dark:border-slate-300 bg-slate-100 dark:bg-slate-950 text-sm", // border colour does not apply for some reason (most likely clashing styles)
          placeholder: () => "text-slate-500 dark:text-slate-400",
          input: () => "text-slate-800 dark:text-slate-200 whitespace-nowrap",
          singleValue: () => "text-slate-800 dark:text-slate-200",
          indicatorSeparator: () => (inputLike ? " invisible" : ""),
          dropdownIndicator: () =>
            "text-slate-800 dark:text-slate-200 hover:text-slate-500 dark:hover:text-slate-400" +
            (inputLike ? " invisible" : ""),
          clearIndicator: () =>
            "text-slate-800 dark:text-slate-200 hover:text-slate-500 dark:hover:text-slate-400" +
            (inputLike ? " disabled invisible" : ""),
        }}
        // does not look the best for dark mode
        styles={{
          menuList: (base) => ({
            ...base,

            "::-webkit-scrollbar": {
              width: "4px",
            },
            "::-webkit-scrollbar-track": {
              background: "#52525b", // zinc-600
            },
            "::-webkit-scrollbar-thumb": {
              background: "#94a3b8", // slate-400
            },
            "::-webkit-scrollbar-thumb:hover": {
              background: "#64748b", // slate-500
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 100,
          }),
          control: (base) => ({
            ...base,
            backgroundColor: "#f1f5f9", // slate-100
          }),
          option: (base, state) => ({
            // text-sm
            ...base,
            lineHeight: "1.25rem",
            fontSize: "0.875rem",
          }),
        }}
        placeholder={placeholderText}
        closeMenuOnSelect={true}
        options={options}
        onChange={(e) => onChange(e)}
        isClearable={true}
        filterOption={filterOption}
        noOptionsMessage={noOptionsMessage}
        defaultValue={defaultValue}
      />
    </div>
  );
}
