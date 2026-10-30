export default function Doc({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl [&_a]:text-brand [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_li]:mt-1 [&_li]:text-slate-600 [&_p]:mt-2 [&_p]:text-slate-600 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
      <h1 className="text-3xl">{title}</h1>{updated && <p className="!text-sm !text-slate-500">Last updated: {updated}</p>}{children}
    </article>
  );
}
