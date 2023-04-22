"use client";

import React, { useState } from "react";

function PDFViewer(props: { url: string }) {
  const [PDF, showPDF] = useState(false);

  const togglePDF = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    showPDF(!PDF);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={(e) => togglePDF(e)}
        className="rounded bg-amber-300 px-4 py-2 font-bold text-black dark:bg-amber-700 dark:text-white"
      >
        {" "}
        Show resume{" "}
      </button>
      <iframe
        src={
          PDF
            ? props.url
            : "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        }
        width="100%"
        height="500px"
      ></iframe>
    </div>
  );
}

export default PDFViewer;
