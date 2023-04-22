"use client";

import { containsOnlyNumbers } from "@/lib/utils";
import axios from "axios";
import { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import PDFUploader from "./PDFUploader";
import { Button } from "./ui/Button";
import { Trash2 } from "lucide-react";
import { addPDFType } from "@/pages/api/addPDF";
import { ResourceType } from "@/lib/content";

const MAX_FILE_SIZE = 10485760; // 10Mb

const cleanup = function (str: string) {
  return str.replace(/[^a-zA-Z0-9_.{}\- ]/g, "-");
};

interface Option {
  value: string;
  label: string;
}

interface ContributeFormProps {
  acadYearOptions: Array<Option>;
  moduleCodeOptions: Array<Option>;
  semesterOptions: Array<Option>;
  examTypeOptions: Array<Option> | null;
  resourceType: ResourceType;
  userID: string;
}

interface SelectProps {
  onChange: (option: Option | null) => void;
  options: Array<Option>;
}

const ContributeForm: FC<ContributeFormProps> = (props) => {
  const [acadYear, setAcadYear] = useState<string | null>(null);
  const [semester, setSemester] = useState<string | null>(null);
  const [moduleCode, setModuleCode] = useState<string | null>(null);
  const [examType, setExamType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const acadYearSelectorRef = useRef<HTMLSelectElement | null>(null);

  const fileSelectedHandler = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setFile(e.currentTarget.files[0]);
      setFileName(e.currentTarget.files[0].name);
      if (e.currentTarget.files[0].type != "application/pdf") {
        toast.error("Please upload a PDF file");
        // Set submit to disabled
        setIsDisabled(true);
      } else if (e.currentTarget.files[0].size > MAX_FILE_SIZE) {
        toast.error("Max file size: 10Mb");
        // Set submit to disabled
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  };

  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsDisabled(true);
    e.preventDefault();
    if (!acadYear || !semester || !moduleCode || !examType) {
      toast.error("Please fill in all fields!");
      setIsDisabled(false);
      return;
    }
    if (!file || file.type != "application/pdf") {
      toast.error("Please upload a PDF file");
      setIsDisabled(false);
      return;
    } else {
      try {
        let { data } = await axios.post("/api/addPDF", {
          name: fileName,
          acadYear: acadYear,
          semester: semester,
          moduleCode: moduleCode,
          examType: examType,
          userID: props.userID,
          resourceType: props.resourceType,
        } as addPDFType);

        const pdfEntryPrismaId = data.PDFentry.id;

        // If prisma does not return ID for some reason
        if (!pdfEntryPrismaId) {
          toast.error("Error uploading PDF.");
          setIsDisabled(false);
          return;
        }
        try {
          let { data } = await axios.post("/api/generateS3PutURL", {
            name: pdfEntryPrismaId,
            type: file.type,
          });

          const url = data.url;

          await axios.put(url, file, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": "inline",
              "Access-Control-Allow-Origin": "*",
            },
          });

          toast.success("PDF uploaded successfully");
        } catch (error) {
          console.log(error);
          toast.error("Error uploading PDF.");
          setIsDisabled(false);
          return;
        }
      } catch (error) {
        toast.error("Error uploading PDF.");
        setIsDisabled(false);
        return;
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setFileName(null);
      setFile(null);
      // We do not want to set these to be null for users to upload similar documents
      // setAcadYear(null);
      // setSemester(null);
      // setModuleCode(null);
      // setExamType(null);
      setIsDisabled(false);
    }
  };

  const acadYearSelectHandler = (option: Option | null) => {
    if (option) {
      setAcadYear(option.value);
    } else {
      setAcadYear(null);
    }
  };

  const semesterSelectHandler = (option: Option | null) => {
    if (option) {
      setSemester(option.value);
    } else {
      setSemester(null);
    }
  };

  const moduleCodeSelectHandler = (option: Option | null) => {
    if (option) {
      setModuleCode(option.value);
    } else {
      setModuleCode(null);
    }
  };

  const examTypeSelectHandler = (option: Option | null) => {
    if (option) {
      setExamType(option.value);
    } else {
      setExamType(null);
    }
  };

  return (
    <form
      id="contributeForm"
      onSubmit={(e) => uploadFile(e)}
      className="flex h-full w-full flex-row items-center justify-center gap-x-16"
    >
      <div className="flex w-1/3 flex-col gap-y-4">
        <AcadYearSelect
          onChange={acadYearSelectHandler}
          options={props.acadYearOptions}
        />
        <SemesterSelect
          onChange={semesterSelectHandler}
          options={props.semesterOptions}
        />
        <ModuleCodeSelect
          onChange={moduleCodeSelectHandler}
          options={props.moduleCodeOptions}
        />
        {props.examTypeOptions !== null && (
          <ExamTypeSelect
            onChange={examTypeSelectHandler}
            options={props.examTypeOptions}
          />
        )}
      </div>
      <div className="w-1/3">
        <PDFUploader
          fileSelectedHandler={fileSelectedHandler}
          fileName={fileName}
          inputRef={inputRef}
        />
        <section className="mt-4 flex w-full flex-row items-center justify-between">
          <Button
            size="sm"
            variant="default"
            isLoading={isDisabled}
            type="submit"
            form="contributeForm"
          >
            Upload
          </Button>
          <Trash2
            className="cursor-pointer text-slate-800 dark:text-slate-200"
            size={20}
            onClick={() => {
              setFileName(null);
              setFile(null);
              setIsDisabled(false);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
          />
        </section>
      </div>
    </form>
  );
};

export default ContributeForm;

const AcadYearSelect: FC<SelectProps> = ({ options, onChange }) => {
  return (
    <div>
      <label htmlFor="acadYear" className="text-slate-800 dark:text-slate-200">
        Acad Year
      </label>
      <Select
        id="acadYear"
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
        onChange={(e) => onChange(e)}
        isClearable={true}
      />
    </div>
  );
};

const ModuleCodeSelect: FC<SelectProps> = ({ options, onChange }) => {
  return (
    <div>
      <label
        htmlFor="moduleCode"
        className="text-slate-800 dark:text-slate-200"
      >
        Module Code
      </label>
      <Select
        id="moduleCode"
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
        onChange={(e) => onChange(e)}
        isClearable={true}
      />
    </div>
  );
};

const SemesterSelect: FC<SelectProps> = ({ options, onChange }) => {
  return (
    <div>
      <label htmlFor="semester" className="text-slate-800 dark:text-slate-200">
        Semester
      </label>
      <Select
        id="semester"
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
        onChange={(e) => onChange(e)}
        isClearable={true}
      />
    </div>
  );
};

const ExamTypeSelect: FC<SelectProps> = ({ options, onChange }) => {
  return (
    <div>
      <label htmlFor="examType" className="text-slate-800 dark:text-slate-200">
        Exam Type
      </label>
      <Select
        id="examType"
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
        onChange={(e) => onChange(e)}
        isClearable={true}
      />
    </div>
  );
};
