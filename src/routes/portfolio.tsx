import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Star } from "@/components/site/Star";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Linora Stellar" },
      {
        name: "description",
        content:
          "Selected branding, print, illustration and school design work by Nora Tamer of Linora Stellar.",
      },
      { property: "og:title", content: "Portfolio — Linora Stellar" },
      {
        property: "og:description",
        content: "Real client and personal design projects by Nora Tamer.",
      },
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
  title_ar?: string;
  summary: string | null;
  summary_ar?: string;
  cover_url: string | null;
  external_url: string | null;
};

const projectsQuery = {
  queryKey: ["portfolio_projects"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Project[];
  },
};

function Portfolio() {
  const { data: projects = [], isLoading } = useQuery(projectsQuery);
  const { t, pick } = useI18n();

  return (
    <div>
      <section className="starfield sky border-b border-border/60 py-16">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold">
            <Star className="h-3 w-3" /> {t("portfolio.badge")}
          </p>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl">{t("portfolio.title")}</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{t("portfolio.lead")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : projects.length === 0 ? (
          <div className="card-star rounded-2xl p-8 text-center">
            <Star className="mx-auto h-6 w-6 text-gold" />
            <h2 className="mt-4 font-display text-2xl">{t("portfolio.emptyTitle")}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              {t("portfolio.lead")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="https://behance.net/norafayed1"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-gold px-4 py-2 text-sm text-gold hover:bg-primary hover:text-primary-foreground"
              >
                {t("portfolio.behance")}
              </a>
              <Link
                to="/custom-orders"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {t("portfolio.request")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const displayTitle = pick(p, "title");
              const displaySummary = pick(p, "summary");

              return (
                <article key={p.id} className="card-star overflow-hidden rounded-2xl">
                  {p.cover_url && (
                    <img
                      src={p.cover_url}
                      alt={displayTitle}
                      loading="lazy"
                      className="h-56 w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h2 className="font-display text-xl">{displayTitle}</h2>
                    {displaySummary && (
                      <p className="mt-2 text-sm text-muted-foreground">{displaySummary}</p>
                    )}
                    {p.external_url && (
                      <a
                        href={p.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm text-gold hover:underline"
                      >
                        {t("portfolio.view")} →
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
