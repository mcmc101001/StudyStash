"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

interface SolutionCommentAccordianProps {
  children: React.ReactNode;
  commentCount: number;
}

export default function SolutionCommentAccordian({
  children,
  commentCount,
}: SolutionCommentAccordianProps) {
  return (
    <Accordion type="single" collapsible className="">
      <AccordionItem value="item-1">
        <AccordionTrigger>{`Solution Discussion (${commentCount})`}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
