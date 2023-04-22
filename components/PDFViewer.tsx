"use client";

import React, { useState } from "react";

function PDFViewer(props: { url: string }) {
  const [PDF, showPDF] = useState(false);

  const togglePDF = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    showPDF(!PDF);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={(e) => togglePDF(e)}
        className="dark:bg-amber-700 bg-amber-300 dark:text-white text-black font-bold py-2 px-4 rounded"
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
