"use client";

import usePrevious from "@/hooks/usePrevious";
import { Suspense, useState } from "react";
import useMeasure from "react-use-measure";
import Button from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import debounce from "lodash.debounce";

interface CarouselProps {
  data: { src: string; text: string; height: number; width: number }[];
}

const CAROUSEL_DELAY_SECONDS = 0.2;

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

  const [isAnimating, setIsAnimating] = useState(false);

  const setTimeOutAnimation = debounce(() => {
    setIsAnimating(false);
  }, CAROUSEL_DELAY_SECONDS * 1000);

  const setPrevSlide = () => {
    if (currentSlide === 1) return;
    if (isAnimating) return;
    setCurrentSlide(currentSlide - 1);
    setIsAnimating(true);
    setTimeOutAnimation();
  }

  const setNextSlide = () => {
    if (currentSlide === data.length) return;
    if (isAnimating) return;
    setCurrentSlide(currentSlide + 1);
    setIsAnimating(true);
    setTimeOutAnimation();
  }

  return (
    <div className="flex w-full items-center justify-center gap-x-10">
      <Button
        aria-label="Previous slide"
        disabled={currentSlide === 1}
        onClick={setPrevSlide}
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
            transition={{ type: "spring", ease: "easeInOut", duration: CAROUSEL_DELAY_SECONDS }}
            className={`absolute flex max-h-full flex-1 flex-col items-center justify-center p-10`}
          >
            <Suspense
              fallback={<Loader2 className="2-10 m-10 h-10 animate-spin" />}
            >
              <img
                // width={data[currentSlide - 1].width}
                // height={data[currentSlide - 1].height}
                className="min-h-0 flex-1"
                key={currentSlide}
                src={data[currentSlide - 1].src}
                alt={"Demo image"}
              />
            </Suspense>
            <p className="pt-6 text-white">{data[currentSlide - 1].text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <Button
        aria-label="Next slide"
        disabled={currentSlide === data.length}
        onClick={setNextSlide}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
