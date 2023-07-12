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
        className="relative flex aspect-square w-1/2 items-center justify-center overflow-hidden bg-slate-800"
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
            className={`absolute flex h-full w-full flex-col items-center justify-center gap-y-6 p-10`}
          >
            <img
              key={currentSlide}
              src={data[currentSlide - 1].src}
              alt={data[currentSlide - 1].text}
            />
            <p className="text-white">{data[currentSlide - 1].text}</p>
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
