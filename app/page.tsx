import { FrequentlyAskedQuestions } from "@/components/landing/FrequentlyAskedQuestions";
import Button from "@/components/ui/Button";
import { IFrame } from "@/components/ui/IFrame";
import * as motion from "@/lib/motion";
import Link from "next/link";
import localFont from "next/font/local";
import { Metadata } from "next";
import LandingOverlay from "@/components/LandingOverlay";
import Carousel from "@/components/landing/Carousel";

export const metadata: Metadata = {
  title: "StudyStash",
  description:
    "Studystash is a one stop solution for all your revision needs. Gain access to user contributed cheatsheets, notes, as well as past papers and solutions!",
};

const CalSansFont = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff2",
  weight: "600",
  display: "swap",
  variable: "--font-heading",
});

const SLIDE_IN_ANIMATION_VARIANTS = {
  left: { opacity: 0, x: "-20vw" },
  center: {
    opacity: 1,
    x: 0,
    transition: { type: "tween", ease: "easeInOut", duration: 0.75 },
  },
  right: { opacity: 0, x: "20vw" },
};

const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", duration: 1 } },
};

const carouselData = [
  {
    src: "/gifs/resourceStatus.gif",
    text: "Step 1: Sign up for an account",
  },
  {
    src: "https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    text: "Step 2: Search for resources",
  },
];

export default async function Home() {
  return (
    <LandingOverlay>
      <section className="mx-auto flex h-screen max-w-4xl flex-col items-center justify-center gap-y-8 text-center xl:max-w-6xl">
        <motion.h1
          initial="left"
          whileInView="center"
          viewport={{ once: true }}
          variants={SLIDE_IN_ANIMATION_VARIANTS}
          className={`font-heading text-7xl font-bold ${CalSansFont.className}`}
        >
          Redefining Revision
        </motion.h1>
        <motion.p
          initial="right"
          whileInView="center"
          viewport={{ once: true }}
          variants={SLIDE_IN_ANIMATION_VARIANTS}
          className="text-xl leading-normal text-slate-600 dark:text-slate-400"
        >
          A one stop solution for all your revision needs, StudyStash is home to
          all the resources you would need, powered by users such as you.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="flex gap-6"
        >
          <Link className="w-full" href="/database">
            <Button
              size="lg"
              variant="brand"
              className="h-14 w-full text-xl font-semibold"
            >
              Try it now
            </Button>
          </Link>
          <Link className="w-full whitespace-nowrap" href="#video">
            <Button
              size="lg"
              variant={"ghost"}
              className="h-14 w-full border-2 border-slate-500 text-xl font-semibold"
            >
              Learn more
            </Button>
          </Link>
        </motion.div>
      </section>
      <section
        id="video"
        className="mx-auto flex h-screen flex-col items-center justify-center gap-y-6 text-center"
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="h-[70vh] w-[70vw]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <IFrame
            height={"100%"}
            width={"100%"}
            allowFullScreen={true}
            src="https://www.youtube.com/embed/9-R_JgcvzaA"
          />
        </motion.div>
      </section>
      <section className="mx-auto flex h-screen max-w-4xl flex-col items-center justify-center text-center xl:max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.h1
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className={`mb-6 text-7xl font-bold ${CalSansFont.className}`}
          >
            Features
          </motion.h1>
          <ul className="mb-2 list-disc">
            <motion.li
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="mt-4 text-left text-lg leading-normal text-slate-600 dark:text-slate-400"
            >
              Gain access to all your revision needs, be it cheatsheets, notes,
              or past papers and solutions!
            </motion.li>
            <motion.li
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="mt-4 text-left text-lg leading-normal text-slate-600 dark:text-slate-400"
            >
              Contribute by uploading resources or engaging in discussion!
            </motion.li>
            <motion.li
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="mt-4 text-left text-lg leading-normal text-slate-600 dark:text-slate-400"
            >
              Save resources to easily come back to them later!
            </motion.li>
          </ul>
        </motion.div>
      </section>
      <section className="mx-auto flex h-screen max-w-4xl flex-col items-center justify-center text-center xl:max-w-6xl">
        <h1 className={`mb-6 text-7xl font-bold ${CalSansFont.className}`}>
          How to use?
        </h1>
        <div className="w-full">
          <Carousel data={carouselData} />
        </div>
      </section>
      <section className="mx-auto flex h-screen max-w-4xl flex-col justify-center text-left xl:max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.h1
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className={`mb-6 text-4xl font-semibold underline underline-offset-8 ${CalSansFont.className}`}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
            <FrequentlyAskedQuestions />
          </motion.div>
        </motion.div>
      </section>
    </LandingOverlay>
  );
}
