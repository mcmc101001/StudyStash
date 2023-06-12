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
  return (
    <Split gutterSize={8} className="split" minSize={0} snapOffset={450}>
      <div className="h-full w-full">{leftPanel}</div>
      <div className="h-full w-full">{rightPanel}</div>
    </Split>
  );
}
