"use client";

interface ClientDateTimeProps {
  datetime: Date;
}

export default function ClientDateTime({ datetime }: ClientDateTimeProps) {
  return (
    <time>
      {datetime.toLocaleString("en-GB", {
        minute: "2-digit",
        hour: "2-digit",
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </time>
  );
}
