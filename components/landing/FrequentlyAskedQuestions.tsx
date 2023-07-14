"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

export function FrequentlyAskedQuestions() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg">
          I want to find a module that is not offered this academic year. How do
          I do that?
        </AccordionTrigger>
        <AccordionContent className="text-base opacity-80">
          We only show modules that are offered for the current academic year.
          If you would like to find a module from a previous year, you can
          manually edit the URL of the database page. However, we do not support
          uploading resources for those modules.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg">
          What file formats are accepted?
        </AccordionTrigger>
        <AccordionContent className="text-base opacity-80">
          Currently, only PDFs are accepted, up to a maximum of 10MB. You can
          convert your files or scan physical materials using sites like{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://ilovepdf.com"
            className="text-violet-700 opacity-100 hover:underline dark:text-violet-500"
          >
            ilovepdf.com
          </a>
          !
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg">
          What is todo and completed supposed to mean for cheatsheets and notes?
        </AccordionTrigger>
        <AccordionContent className="text-base opacity-80">
          It can be what you want it to be! You could use it to mark notes that
          you have not studied, or mark cheatsheets that you have not edited.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger className="text-lg">
          How can I submit bug reports, feedback or suggestions?
        </AccordionTrigger>
        <AccordionContent className="text-base opacity-80">
          You can submit a new Issue on{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/mcmc101001/Orbital2023/issues"
            className="text-violet-700 opacity-100 hover:underline dark:text-violet-500"
          >
            Github
          </a>
          , or drop us an email at studystashorbital2023@gmail.com!
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
