import { useState } from "react";

export function IFrame({ src }: { src: string }) {
  const [shareURL, setShareURL] = useState<string>(src);
  return (
    <iframe
      title="PDF Resource"
      src={shareURL}
      width="100%"
      height="80%"
    ></iframe>
  );
}
