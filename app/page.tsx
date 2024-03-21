import { FrequentlyAskedQuestions } from "@/components/landing/FrequentlyAskedQuestions";
import Button from "@/components/ui/Button";
import { IFrame } from "@/components/ui/IFrame";
import * as motion from "@/lib/motion";
import Link from "next/link";
import localFont from "next/font/local";
import { Metadata } from "next";
import LandingOverlay from "@/components/LandingOverlay";
import Carousel from "@/components/landing/Carousel";
import { prisma } from "@/lib/prisma";
import { Balancer } from "react-wrap-balancer";

export const metadata: Metadata = {
  title: "StudyStash",
  description:
    "Studystash is a one stop solution for all your revision needs. Gain access to user contributed cheatsheets, notes, as well as past papers and solutions!",
};

export const revalidate = 120;

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
    src: "/gifs/databaseSearch.gif",
    text: "To find resources, navigate to the database page and type in the module code!",
    height: 645,
    width: 476,
  },
  {
    src: "/gifs/databaseFilters.gif",
    text: "Use the various sorts and filters to find the resources you want!",
    height: 415,
    width: 405,
  },
  {
    src: "/gifs/contextMenu.gif",
    text: "Right click on a resource for more features!",
    height: 514,
    width: 1526,
  },
  {
    src: "/gifs/sheetClosing.gif",
    text: "You can close the sheet by using the close button, clicking outside the sheet or pressing the ESC key!",
    height: 1317,
    width: 2073,
  },
  {
    src: "/gifs/rating.gif",
    text: "You can also rate resources and rate difficulty for past papers!",
    height: 1316,
    width: 1694,
  },
  {
    src: "/gifs/comments.gif",
    text: "You can also comment on resources!",
    height: 1330,
    width: 2552,
  },
  {
    src: "/gifs/solutions.gif",
    text: "View solutions with a resizable side-by-side view!",
    height: 1315,
    width: 2534,
  },
  {
    src: "/gifs/contribute.gif",
    text: "To upload a resource, navigate to the upload page via the navbar!",
    height: 666,
    width: 246,
  },
  {
    src: "/gifs/contributePrefill.gif",
    text: "You can also upload a resource, from the database page, which would autofill the various filters!",
    height: 758,
    width: 488,
  },
  {
    src: "/gifs/deleteResource.gif",
    text: "To delete resources, navigate to your profile and use the delete button or simply right click!",
    height: 283,
    width: 1130,
  },
  {
    src: "/gifs/resourceStatus.gif",
    text: "You can label resources to better categorize them!",
    height: 167,
    width: 1132,
  },
  {
    src: "/gifs/dashboardResources.gif",
    text: "View your labelled resources in the dashboard!",
    height: 1244,
    width: 1478,
  },
  {
    src: "/gifs/bookmarkedModules.gif",
    text: "Bookmark modules from the dashboard for quick access!",
    height: 552,
    width: 527,
  },
];

export default async function Home() {
  const cheatsheetCountPromise = prisma.cheatsheet.count();
  const questionPaperCountPromise = prisma.questionPaper.count();
  const notesCountPromise = prisma.notes.count();
  const solutionCountPromise = prisma.solution.count();
  const [cheatsheetCount, questionPaperCount, notesCount, solutionCount] =
    await Promise.all([
      cheatsheetCountPromise,
      questionPaperCountPromise,
      notesCountPromise,
      solutionCountPromise,
    ]);
  let totalResourceCount =
    cheatsheetCount + questionPaperCount + notesCount + solutionCount;

  return (
    <LandingOverlay>
      <section className="mx-auto flex h-screen max-w-4xl flex-col items-center justify-center gap-y-5 text-center xl:max-w-6xl">
        <div className="flex flex-col items-center">
          <motion.p
            initial="right"
            whileInView="center"
            viewport={{ once: true }}
            variants={SLIDE_IN_ANIMATION_VARIANTS}
            className="mb-3 w-fit rounded-full bg-fuchsia-100 px-3 py-1 text-sm font-semibold leading-normal text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {totalResourceCount + " resources uploaded and counting!"}
          </motion.p>
          <motion.h1
            initial="left"
            whileInView="center"
            viewport={{ once: true }}
            variants={SLIDE_IN_ANIMATION_VARIANTS}
            className={`font-heading mt-2 text-7xl font-bold ${CalSansFont.className}`}
          >
            Redefining Revision
          </motion.h1>
        </div>
        <motion.p
          initial="right"
          whileInView="center"
          viewport={{ once: true }}
          variants={SLIDE_IN_ANIMATION_VARIANTS}
          className="text-xl leading-normal text-slate-600 dark:text-slate-400"
        >
          <Balancer>
            Home to a wealth of comprehensive resources, StudyStash is the
            ultimate hub for all your revision needs, powered by a community of
            dedicated learners like yourself.
          </Balancer>
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="mt-3 flex gap-6"
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
          <Link className="w-full whitespace-nowrap" href="#features">
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
      {/* <section
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
            loading="lazy"
            title="StudyStash Video"
            height={"100%"}
            width={"100%"}
            allowFullScreen={true}
            src="https://www.youtube.com/embed/Rdhrr8w43kI?si=PrTcGfHmVIt0QrbL"
          />
        </motion.div>
      </section> */}
      <section
        id="features"
        className="mx-auto flex h-screen max-w-4xl flex-col items-center justify-center text-center xl:max-w-6xl"
      >
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
          <motion.h2
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className={`mb-6 text-7xl font-bold ${CalSansFont.className}`}
          >
            Features
          </motion.h2>
        </motion.div>
        <motion.div
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="w-full select-none"
        >
          <Carousel data={carouselData} />
        </motion.div>
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
          <motion.h2
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className={`mb-6 text-4xl font-semibold underline underline-offset-8 ${CalSansFont.className}`}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
            <FrequentlyAskedQuestions />
          </motion.div>
        </motion.div>
      </section>
    </LandingOverlay>
  );
}
