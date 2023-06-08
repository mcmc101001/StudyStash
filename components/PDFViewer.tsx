"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, FileDown } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

interface PDFViewerProps {
  className?: string;
  url: string;
}

export default function PDFViewer({ className, url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currPage, setCurrPage] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [renderedPage, setRenderedPage] = useState<number | null>(null);
  const [rotate, setRotate] = useState(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const zoomIn = () => (zoom < 5.0 ? setZoom(zoom + 0.25) : null);
  const zoomOut = () => (zoom > 0.5 ? setZoom(zoom - 0.25) : null);
  const rotateRight = () => setRotate(rotate + 90);
  const rotateLeft = () => setRotate(rotate - 90);

  const isLoading = renderedPage !== currPage;

  console.log(`renderedPage: ${renderedPage}, currPage: ${currPage}`);
  console.log(`isLoading: ${isLoading}`);

  return (
    <div
      className={cn(
        "h-5/6 overflow-hidden rounded-md border-2 border-slate-500",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 bg-slate-950 py-2">
        <div>
          <Button
            onClick={() => setCurrPage(currPage - 1)}
            disabled={currPage <= 1}
          >
            Prev pg
          </Button>
          <Button disabled>
            {currPage}/{numPages}
          </Button>
          <Button
            onClick={() => setCurrPage(currPage + 1)}
            disabled={currPage >= numPages}
          >
            Next pg
          </Button>
        </div>

        <div>
          <Button onClick={zoomOut}>
            <ZoomOut />
          </Button>
          <Button onClick={zoomIn}>
            <ZoomIn />
          </Button>
        </div>

        <div>
          <Button onClick={rotateLeft}>
            <RotateCcw />
          </Button>
          <Button onClick={rotateRight}>
            <RotateCw />
          </Button>
        </div>

        <div className="flex flex-row">
          <a
            className="rounded-md bg-slate-300 p-2.5 text-black"
            href={url}
            download
          >
            <FileDown />
          </a>
          <a
            className="rounded-md bg-slate-300 p-2.5 text-black"
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open in new tab
          </a>
        </div>
      </div>

      <div className="flex h-full justify-center overflow-auto bg-slate-800">
        <Document
          file={{ url: url }}
          onLoadSuccess={onDocumentLoadSuccess}
          loading=""
        >
          {/* {isLoading && renderedPage ? (
            <Page
              key={renderedPage}
              className="absolute z-10"
              pageNumber={renderedPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={zoom}
            />
          ) : null} */}
          <Page
            className={isLoading ? "hidden" : ""}
            key={currPage}
            pageNumber={currPage}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onRenderSuccess={() => setRenderedPage(currPage)}
            scale={zoom}
            rotate={rotate}
          />
          {/* {Array.from({ length: numPages }, (_, index) => (
        <Page height={1000} key={`page_${index + 1}`} pageNumber={index + 1} />
      ))} */}
        </Document>
      </div>
    </div>
  );
}
