export default async function Home() {
  return (
    <main
      className="flex flex-col items-center overflow-x-hidden overflow-y-scroll scroll-smooth text-slate-800 scrollbar-thin 
          scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 
          dark:text-slate-200 dark:scrollbar-thumb-slate-800 dark:hover:scrollbar-thumb-slate-700"
      style={{ scrollbarGutter: "stable" }}
    >
      <section className="flex max-w-6xl flex-col items-center justify-center gap-y-6 py-32 text-center">
        <h1 className="text-7xl font-bold">StudyStash</h1>
        <p className="text-lg leading-normal text-slate-600 dark:text-slate-400">
          A one stop solution for all your revision needs.
        </p>
      </section>
      <section className="flex max-w-6xl flex-col items-center justify-center gap-y-6 py-32 text-center">
        <h1 className="text-7xl font-bold">Features</h1>
        <p className="text-lg leading-normal text-slate-600 dark:text-slate-400">
          A one stop solution for all your revision needs
        </p>
      </section>
    </main>
  );
}
