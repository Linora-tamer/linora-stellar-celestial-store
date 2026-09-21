import { createFileRoute, Link } from "@tanstack/react-router";

import hero from "@/assets/hero-stellar.jpg";
import { Star } from "@/components/site/Star";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Linora Stellar" },
      {
        name: "description",
        content:
          "How Linora Stellar began: a designer in Egypt, a four-pointed star, and a belief that everyday things deserve beauty.",
      },
      { property: "og:title", content: "Our Story — Linora Stellar" },
      {
        property: "og:description",
        content: "The brand story behind the navy-and-gold celestial studio.",
      },
    ],
  }),
  component: StoryPage,
});

const CHAPTERS = [
  {
    title: "It started with a sky",
    body: "Linora Stellar began with a habit: sketching stars in the margins of notebooks. What started as a doodle became a four-pointed star, and that star became a signature that now sits on every label, planner and invitation we make.",
  },
  {
    title: "Navy, gold and nothing loud",
    body: "The palette was chosen for calm. Deep navy for depth, gold for the small moment of ceremony, cream for breathing room. It is a quiet luxury that works just as well on a classroom chart as it does on a wedding suite.",
  },
  {
    title: "Designed in Egypt, sent anywhere",
    body: "Every piece is designed by Nora Tamer in Egypt. Digital files travel instantly; printed pieces and merch ship across the country with delivery confirmed personally over WhatsApp.",
  },
  {
    title: "Made to carry your name",
    body: "Most products can be personalised — a name, a date, a short line. That is the point of the studio: the design is ours, the story on it is yours.",
  },
];

function StoryPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Night sky with gold constellations"
          width={1600}
          height={912}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-28 text-center lg:px-8">
          <Star className="mx-auto h-6 w-6 text-gold" />
          <h1 className="mt-6 font-display text-5xl lg:text-6xl">Our story</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A small studio with a large sky.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <div className="space-y-12">
          {CHAPTERS.map((c, i) => (
            <article key={c.title}>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Chapter {i + 1}</p>
              <h2 className="mt-3 font-display text-3xl">{c.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{c.body}</p>
            </article>
          ))}
        </div>
        <div className="gold-rule my-14" />
        <div className="text-center">
          <p className="font-display text-2xl">Want something made for you?</p>
          <Link
            to="/custom-orders"
            className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground"
          >
            Start a custom order
          </Link>
        </div>
      </section>
    </div>
  );
}
