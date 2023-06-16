"use client";

interface ClientDateTimeProps {
  datetime: Date;
}

export default function ClientDateTime({ datetime }: ClientDateTimeProps) {
  return (
    <time>
      {datetime.toLocaleString("en-SG", {
        minute: "2-digit",
        hour: "numeric",
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </time>
  );
}
