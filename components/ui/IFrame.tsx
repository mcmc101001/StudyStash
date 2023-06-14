"use client";

import { useState } from "react";

interface IFrameProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  src: string;
}

export function IFrame({ src, ...props }: IFrameProps) {
  const [shareURL, setShareURL] = useState<string>(src);
  return <iframe src={shareURL} {...props}></iframe>;
}
