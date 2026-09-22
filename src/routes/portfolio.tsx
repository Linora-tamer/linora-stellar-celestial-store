import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Linora Stellar" },
      {
        name: "description",
        content: "Selected branding, print, illustration and school design work by Nora Tamer of Linora Stellar.",
      },
      { property: "og:title", content: "Portfolio — Linora Stellar" },
      { property: "og:description", content: "Real client and personal design projects by Nora Tamer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
  external_url: string | null;
};

const projectsQuery = {
  queryKey: ["portfolio_projects"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("id, slug, title, summary, cover_url, external_url")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Project[];
  },
};

function Portfolio() {
  const { data: projects = [], isLoading } = useQuery(projectsQuery);

  return (
    <div>
      <section className="starfield sky border-b border-border/60 py-16">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Star className="h-3 w-3" /> Selected work
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl">Portfolio</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Branding, print, illustration and school design projects by Nora Tamer.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading projects…</p>
        ) : projects.length === 0 ? (
          <div className="card-star rounded-2xl p-8 text-center">
            <Star className="mx-auto h-6 w-6 text-gold" />
            <h2 className="mt-4 font-display text-2xl">No projects published yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Your real portfolio pieces live here. Add them from your dashboard — cover image,
              title, description and a link — and they'll appear on this page. In the meantime you
              can see recent work on Behance.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="https://behance.net/norafayed1"
                className="rounded-md border border-gold px-4 py-2 text-sm text-gold hover:bg-primary hover:text-primary-foreground"
              >
                View on Behance
              </a>
              <Link
                to="/custom-orders"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Request a custom design
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="card-star overflow-hidden rounded-2xl">
                {p.cover_url && (
                  <img
                    src={p.cover_url}
                    alt={p.title}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h2 className="font-display text-xl">{p.title}</h2>
                  {p.summary && <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>}
                  {p.external_url && (
                    <a href={p.external_url} className="mt-3 inline-block text-sm text-gold hover:underline">
                      View project
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
