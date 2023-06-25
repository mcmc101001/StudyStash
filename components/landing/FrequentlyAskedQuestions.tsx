"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import motion from "framer-motion";

export function FrequentlyAskedQuestions() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg">
          What is todo and completed supposed to mean for cheatsheets and notes?
        </AccordionTrigger>
        <AccordionContent className="text-base opacity-80">
          It can be what you want it to be! You could use it to mark notes that
          you have not studied, or mark cheatsheets that you have not editted.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
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
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg">
          I am facing some bugs, how can I bring them up?
        </AccordionTrigger>
        <AccordionContent className="text-base opacity-80">
          You can submit a new Issue on{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/mcmc101001/Orbital2023/issues"
            className="text-blue-800 opacity-100 hover:underline dark:text-blue-500"
          >
            Github
          </a>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
