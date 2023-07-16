"use client";

import usePrevious from "@/hooks/usePrevious";
import { useState } from "react";
import useMeasure from "react-use-measure";
import Button from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  data: { src: string; text: string }[];
}

export default function Carousel({ data }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const prev = usePrevious(currentSlide);
  const direction = prev ? (currentSlide > prev ? 1 : -1) : 0;

  const [ref, { width }] = useMeasure();

  const variants = {
    enter: ({ direction, width }: { direction: number; width: number }) => ({
      x: direction * width,
    }),
    center: { x: 0 },
    exit: ({ direction, width }: { direction: number; width: number }) => ({
      x: -direction * width,
    }),
  };

  return (
    <div className="flex w-full items-center justify-center gap-x-10">
      <Button
        disabled={currentSlide === 1}
        onClick={() => {
          if (currentSlide === 1) return;
          setCurrentSlide(currentSlide - 1);
        }}
      >
        <ChevronLeft />
      </Button>
      <div
        ref={ref}
        className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden bg-slate-800"
      >
        <AnimatePresence custom={{ direction, width }}>
          <motion.div
            key={currentSlide}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={{ direction, width }}
            transition={{ type: "spring", ease: "easeInOut", duration: 0.3 }}
            className={`absolute flex max-h-full flex-1 flex-col items-center justify-center p-10`}
          >
            <img
              className="min-h-0 flex-1"
              key={currentSlide}
              src={data[currentSlide - 1].src}
              alt={"Demo image"}
            />
            <p className="pt-6 text-white">{data[currentSlide - 1].text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <Button
        disabled={currentSlide === data.length}
        onClick={() => {
          if (currentSlide === data.length) return;
          setCurrentSlide(currentSlide + 1);
        }}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
