"use client";

import { startsWithNumbers, trimUntilNumber } from "@/lib/utils";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import PDFUploader from "@/components/resource/PDFUploader";
import Button from "@/components/ui/Button";
import { Trash2, Upload } from "lucide-react";
import { addPDFType } from "@/pages/api/addPDF";
import { ResourceType } from "@/lib/content";
import StyledSelect, { Option } from "@/components/ui/StyledSelect";
import { ExamType, SemesterType } from "@prisma/client";
import { generateS3PutURLType } from "@/pages/api/generateS3PutURL";
import { deletePDFType } from "@/pages/api/deletePDF";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { addSolutionPDFType } from "@/pages/api/addSolutionPDF";

const MAX_FILE_SIZE = 10485760; // 10Mb

interface ContributeFormProps {
  acadYearOptions: Array<Option>;
  moduleCodeOptions: Array<Option>;
  semesterOptions: Array<Option>;
  examTypeOptions: Array<Option> | null;
  resourceType: ResourceType;
  userId: string;
}

function validQueryParamOrNull(
  query: string | null | undefined,
  options: Array<Option> | null
) {
  if (query === null || query === undefined || options === null) {
    return null;
  }
  if (options.find((e) => e.value === query)) {
    return query;
  }
  return null;
}

const ContributeForm = (props: ContributeFormProps) => {
  const queryParams = useSearchParams();
  const [acadYear, setAcadYear] = useState<string | null>(
    validQueryParamOrNull(
      queryParams?.get("filterAcadYear"),
      props.acadYearOptions
    )
  );
  const [semester, setSemester] = useState<SemesterType | null>(
    validQueryParamOrNull(
      queryParams?.get("filterSemester"),
      props.semesterOptions
    ) as SemesterType
  );
  const [moduleCode, setModuleCode] = useState<string | null>(
    validQueryParamOrNull(
      queryParams?.get("filterModuleCode"),
      props.moduleCodeOptions
    )
  );
  const [examType, setExamType] = useState<ExamType | null>(
    validQueryParamOrNull(
      queryParams?.get("filterExamType"),
      props.examTypeOptions
    ) as ExamType
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [solutionFileName, setSolutionFileName] = useState<string | null>(null);
  const [solutionIncluded, setSolutionIncluded] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const solutionInputRef = useRef<HTMLInputElement | null>(null);

  const fileSelectedHandler = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setFile(e.currentTarget.files[0]);
      setFileName(e.currentTarget.files[0].name);
      if (e.currentTarget.files[0].type !== "application/pdf") {
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

  const solutionFileSelectedHandler = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setSolutionFile(e.currentTarget.files[0]);
      setSolutionFileName(e.currentTarget.files[0].name);
      if (e.currentTarget.files[0].type !== "application/pdf") {
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

  const fileDropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
      if (e.dataTransfer.files[0].type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        // Set submit to disabled
        setIsDisabled(true);
      } else if (e.dataTransfer.files[0].size > MAX_FILE_SIZE) {
        toast.error("Max file size: 10Mb");
        // Set submit to disabled
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  };

  const solutionFileDropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSolutionFile(e.dataTransfer.files[0]);
      setSolutionFileName(e.dataTransfer.files[0].name);
      if (e.dataTransfer.files[0].type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        // Set submit to disabled
        setIsDisabled(true);
      } else if (e.dataTransfer.files[0].size > MAX_FILE_SIZE) {
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
    let resourceId: string | null = null;
    if (
      !acadYear ||
      !semester ||
      !moduleCode ||
      !(examType || props.resourceType === "Notes") ||
      !(solutionIncluded || props.resourceType !== "Past Papers")
    ) {
      toast.error("Please fill in all fields!");
      setIsDisabled(false);
      return;
    }

    if (!file || !fileName || file.type != "application/pdf") {
      toast.error("Please upload a PDF file");
      setIsDisabled(false);
      return;
    }

    // if file name exceeds length of varchar(191) in mysql
    if (fileName.length > 191) {
      toast.error("File name too long!");
      setIsDisabled(false);
      return;
    }

    if (solutionIncluded === "Included in separate file") {
      if (
        !solutionFile ||
        !solutionFileName ||
        solutionFile.type != "application/pdf"
      ) {
        toast.error("Please upload a solution PDF file");
        setIsDisabled(false);
        return;
      }

      if (solutionFileName.length > 191) {
        toast.error("File name too long!");
        setIsDisabled(false);
        return;
      }
    }

    try {
      // Create database entry
      const newFileName = fileName.replace(/\.[^/.]+$/, "");
      let body: addPDFType = {
        name: newFileName,
        acadYear: acadYear,
        semester: semester,
        moduleCode: moduleCode,
        examType: examType ? examType : undefined,
        userId: props.userId,
        solutionIncluded:
          solutionIncluded === "Included in same file" ? true : undefined,
        resourceType: props.resourceType,
      };
      let { data } = await axios.post("/api/addPDF", body);

      resourceId = data.PDFentry.id;

      // If prisma does not return ID for some reason
      if (!resourceId) {
        toast.error("Error uploading PDF.");
        setIsDisabled(false);
        return;
      }
      // Upload file to S3
      try {
        let body: generateS3PutURLType = {
          userId: props.userId,
          name: resourceId,
        };
        let { data } = await axios.post("/api/generateS3PutURL", body);

        const url = data.url;

        await axios.put(url, file, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline",
            "Access-Control-Allow-Origin": "*",
          },
        });

        if (solutionIncluded !== "Included in separate file") {
          toast.success("PDF uploaded successfully!");
        }
      } catch (error) {
        // Delete the database entry if s3 upload fails
        try {
          let body: deletePDFType = {
            userId: props.userId,
            id: resourceId,
            category: props.resourceType,
          };
          await axios.post("/api/deletePDF", body);
        } catch (error) {
          toast.error("Error uploading PDF.");
          setIsDisabled(false);
          return;
        }
        toast.error("Error uploading PDF.");
        setIsDisabled(false);
        return;
      }
    } catch (error) {
      toast.error("Error uploading PDF.");
      setIsDisabled(false);
      return;
    }
    if (solutionIncluded === "Included in separate file") {
      if (!solutionFileName) {
        return;
      }
      try {
        const newSolutionFileName = solutionFileName.replace(/\.[^/.]+$/, "");
        let body: addSolutionPDFType = {
          name: newSolutionFileName,
          userId: props.userId,
          questionPaperId: resourceId,
        };
        let { data } = await axios.post("/api/addSolutionPDF", body);

        const solutionId = data.SolutionEntry.id;

        // If prisma does not return ID for some reason
        if (!solutionId) {
          toast.error(
            "Error uploading solution, question paper has been uploaded."
          );
          setIsDisabled(false);
          return;
        }
        try {
          let body: generateS3PutURLType = {
            userId: props.userId,
            name: solutionId,
          };
          let { data } = await axios.post("/api/generateS3PutURL", body);

          const solutionUrl = data.url;

          await axios.put(solutionUrl, solutionFile, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": "inline",
              "Access-Control-Allow-Origin": "*",
            },
          });

          toast.success("Question paper and solution uploaded successfully");
        } catch (error) {
          // Delete the database entry if s3 upload fails
          try {
            let body: deletePDFType = {
              userId: props.userId,
              id: solutionId,
              category: "Solutions",
            };
            await axios.post("/api/deletePDF", body);
          } catch (error) {
            toast.error(
              "Error uploading solution, question paper has been uploaded."
            );
            setIsDisabled(false);
            return;
          }
          toast.error(
            "Error uploading solution, question paper has been uploaded."
          );
          setIsDisabled(false);
          return;
        }
      } catch (error) {
        toast.error(
          "Error uploading solution, question paper has been uploaded."
        );
        setIsDisabled(false);
        return;
      }
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (solutionInputRef.current) {
      solutionInputRef.current.value = "";
    }
    setFileName(null);
    setFile(null);
    setSolutionFileName(null);
    setSolutionFile(null);
    // We do not want to set these to be null for users to upload similar documents
    // setAcadYear(null);
    // setSemester(null);
    // setModuleCode(null);
    // setExamType(null);
    setIsDisabled(false);
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
      setSemester(option.value as SemesterType);
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
      setExamType(option.value as ExamType);
    } else {
      setExamType(null);
    }
  };

  const solutionsIncludedSelectHandler = (option: Option | null) => {
    if (option) {
      setSolutionIncluded(option.value);
    } else {
      setSolutionIncluded(null);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ContributeForm"
        className="flex h-full w-full items-center justify-center pb-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <form
          id="contributeForm"
          onSubmit={(e) => uploadFile(e)}
          className="flex w-full flex-row items-center justify-center gap-x-16"
        >
          <div className="flex w-1/3 flex-col gap-y-4">
            <StyledSelect
              label="Acad Year"
              placeholderText="Select Acad Year"
              onChange={acadYearSelectHandler}
              options={props.acadYearOptions}
              defaultValue={
                acadYear ? { value: acadYear, label: acadYear } : undefined
              }
            />
            <StyledSelect
              label="Semester"
              placeholderText="Select Semester"
              onChange={semesterSelectHandler}
              options={props.semesterOptions}
              defaultValue={
                semester
                  ? {
                      value: semester,
                      label: props.semesterOptions.find(
                        (option) => option.value === semester
                      )!.label,
                    }
                  : undefined
              }
            />
            <StyledSelect
              label="Module Code"
              placeholderText="Select Module Code"
              onChange={moduleCodeSelectHandler}
              options={props.moduleCodeOptions}
              noOptionsMessage={({ inputValue }) =>
                inputValue.trimStart().length < 1
                  ? "Type to search..."
                  : "No options"
              }
              filterOption={(
                option: { value: string; label: string },
                query: string
              ) => {
                const trimmed_query = query.trimStart();
                if (trimmed_query.length < 1) {
                  return false;
                }
                // If matches prefix
                if (
                  option.value
                    .toLowerCase()
                    .startsWith(trimmed_query.toLowerCase())
                ) {
                  return true;
                } else if (startsWithNumbers(trimmed_query)) {
                  // If matches number
                  const trimmedOption = trimUntilNumber(
                    option.value.toLowerCase()
                  );
                  if (trimmedOption.startsWith(trimmed_query.toLowerCase())) {
                    return true;
                  }
                }
                return false;
              }}
              defaultValue={
                moduleCode
                  ? {
                      value: moduleCode,
                      label: moduleCode,
                    }
                  : undefined
              }
            />
            {props.examTypeOptions !== null && (
              <StyledSelect
                label="Exam Type"
                placeholderText="Select Exam Type"
                onChange={examTypeSelectHandler}
                options={props.examTypeOptions}
                defaultValue={
                  examType ? { value: examType, label: examType } : undefined
                }
              />
            )}
            {props.resourceType === "Past Papers" && (
              <StyledSelect
                label="Solutions"
                placeholderText="Select Included/Excluded"
                onChange={solutionsIncludedSelectHandler}
                options={[
                  {
                    value: "Included in same file",
                    label: "Included in same file",
                  },
                  {
                    value: "Included in separate file",
                    label: "Included in separate file",
                  },
                  { value: "Excluded", label: "Excluded" },
                ]}
              />
            )}
          </div>

          <div className="flex h-full w-1/3 flex-col justify-center gap-y-3">
            <PDFUploader
              fileDropHandler={fileDropHandler}
              fileSelectedHandler={fileSelectedHandler}
              fileName={fileName}
              inputRef={inputRef}
              label="Select or drop pdf file"
            />
            <AnimatePresence>
              {solutionIncluded === "Included in separate file" && (
                <motion.div
                  key="solutionSubmit"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <PDFUploader
                    fileDropHandler={solutionFileDropHandler}
                    fileSelectedHandler={solutionFileSelectedHandler}
                    fileName={solutionFileName}
                    inputRef={solutionInputRef}
                    label="Select or drop solution pdf file"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <section className="flex w-full flex-row items-center justify-between gap-2">
              <Button
                variant="dangerous"
                type="button"
                className="w-1/2 gap-1 truncate text-lg"
                onClick={() => {
                  setFileName(null);
                  setFile(null);
                  setSolutionFileName(null);
                  setSolutionFile(null);
                  setIsDisabled(false);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                  if (solutionInputRef.current) {
                    solutionInputRef.current.value = "";
                  }
                }}
              >
                <div>
                  <Trash2 size={25} />
                </div>
                <p>Clear PDF</p>
              </Button>
              <Button
                variant="default"
                isLoading={isDisabled}
                type="submit"
                form="contributeForm"
                className="w-1/2 gap-1 text-lg"
              >
                <Upload size={25} /> <p>Upload</p>
              </Button>
            </section>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContributeForm;
