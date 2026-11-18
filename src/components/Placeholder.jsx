export default function Placeholder({ id, title }) {
  return (
    <section
      id={id}
      className="flex min-h-full items-center px-6 py-24 md:px-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-3xl font-bold md:text-5xl">{title}</h2>
        <p className="mt-4 text-cream/60">Section à construire.</p>
      </div>
    </section>
  );
}
