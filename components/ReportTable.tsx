import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ReportType } from "@prisma/client";

export interface ReportElementType {
  reportId: string;
  type: ReportType;
  createdAt: Date;
  reporterId: string;
  resolved: boolean;
}

interface ReportTableProps {
  className?: string;
  reportArr: ReportElementType[];
}

export default function ReportTable({
  className,
  reportArr,
}: ReportTableProps) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Report ID</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Time of report</TableHead>
          <TableHead>Reporting user ID</TableHead>
          <TableHead>Resolved?</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reportArr.map((report: ReportElementType) => (
          <TableRow key={report.reportId}>
            <TableCell>{reportArr.indexOf(report) + 1}</TableCell>
            <TableCell>{report.reportId}</TableCell>
            <TableCell>{report.type}</TableCell>
            <TableCell>{report.createdAt.toString()}</TableCell>
            <TableCell>{report.reporterId}</TableCell>
            <TableCell>{report.resolved ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
