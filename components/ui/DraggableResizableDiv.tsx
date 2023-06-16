"use client";

import Split from "react-split";

interface DraggableResizableDivProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export default function DraggableResizableDiv({
  leftPanel,
  rightPanel,
}: DraggableResizableDivProps) {
  let storageSizes = localStorage.getItem("split-sizes");
  let sizes = [50, 50];
  if (storageSizes) {
    sizes = JSON.parse(storageSizes);
  }

  return (
    <Split
      sizes={sizes}
      gutterSize={8}
      className="split"
      minSize={0}
      snapOffset={400}
      onDragEnd={(sizes) => {
        localStorage.setItem("split-sizes", JSON.stringify(sizes));
      }}
    >
      <div className="h-full w-full">{leftPanel}</div>
      <div className="h-full w-full">{rightPanel}</div>
    </Split>
  );
}
