import * as motion from "@/lib/motion";

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
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export default async function Home() {
  return (
    <main
      className="flex h-screen flex-col items-center overflow-x-hidden overflow-y-scroll scroll-smooth text-slate-800
          scrollbar-track-transparent scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 
          dark:text-slate-200 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
      style={{ scrollbarGutter: "stable" }}
    >
      <section className="flex max-w-6xl flex-col items-center justify-center gap-y-6 py-32 text-center">
        <motion.h1
          initial="left"
          whileInView="center"
          viewport={{ once: true }}
          variants={SLIDE_IN_ANIMATION_VARIANTS}
          className="text-7xl font-bold"
        >
          StudyStash
        </motion.h1>
        <motion.p
          initial="right"
          whileInView="center"
          viewport={{ once: true }}
          variants={SLIDE_IN_ANIMATION_VARIANTS}
          className="text-lg leading-normal text-slate-600 dark:text-slate-400"
        >
          A one stop solution for all your revision needs.
        </motion.p>
      </section>
      <section className="flex max-w-6xl flex-col items-center justify-center gap-y-6 py-32 text-center">
        <h1 className="h-96">The video goes here</h1>
      </section>
      <section className="flex max-w-6xl flex-col items-center justify-center gap-y-6 py-32 text-center">
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
            className="text-7xl font-bold"
          >
            Features
          </motion.h1>
          <ul className="list-disc">
            <motion.li
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="text-lg leading-normal text-slate-600 dark:text-slate-400"
            >
              Upload resources, be it cheatsheets, notes, past papers or
              solutions!
            </motion.li>
            <motion.li
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="text-lg leading-normal text-slate-600 dark:text-slate-400"
            >
              Sign in to comment, bookmark modules and set status on resources!
            </motion.li>
          </ul>
        </motion.div>
      </section>
    </main>
  );
}
