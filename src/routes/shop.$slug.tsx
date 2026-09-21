import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Star } from "@/components/site/Star";
import { formatPrice, useCart } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import { CONTACT, productDetails, productsQuery } from "@/lib/store";

const COLORS = ["Midnight Navy", "Cream", "Gold", "Black"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => {
    const title = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} — Linora Stellar` },
        { name: "description", content: `${title} from the Linora Stellar celestial collection.` },
        { property: "og:title", content: `${title} — Linora Stellar` },
        {
          property: "og:description",
          content: `${title} from the Linora Stellar celestial collection.`,
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const product = products.find((p) => p.slug === slug);
  const cart = useCart();

  const [color, setColor] = useState(COLORS[0]!);
  const [size, setSize] = useState(SIZES[1]!);
  const [personalName, setPersonalName] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-sm text-gold underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const isApparel = ["stellar-tshirt", "stellar-hoodie"].includes(product.slug);
  const details = productDetails(product.details);

  function addToCart() {
    if (!product) return;
    const options: Record<string, string> = {};
    if (product.customizable) {
      if (isApparel) {
        options['Colour'] = color;
        options['Size'] = size;
      }
      if (personalName.trim()) options['Personalisation'] = personalName.trim();
    }
    cart.add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: product.image_url,
      quantity,
      options,
    });
    toast.success(`${product.name} added to your cart`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <Link to="/shop" className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <img
            src={productImage(product.slug, product.image_url)}
            alt={product.name}
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
          />
          {product.customizable && personalName.trim() && (
            <div className="absolute inset-x-0 bottom-0 bg-ink/80 p-4 text-center">
              <p className="font-display text-2xl text-gold">{personalName}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Live personalisation preview
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{product.tagline}</p>
          <h1 className="mt-3 font-display text-4xl lg:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl text-gold">{formatPrice(Number(product.price))}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {details.length > 0 && (
            <ul className="mt-6 space-y-2">
              {details.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Star className="mt-1 h-3 w-3 shrink-0 text-gold" />
                  {d}
                </li>
              ))}
            </ul>
          )}

          {product.customizable && (
            <div className="mt-8 space-y-5 rounded-xl border border-border p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Make it yours</p>
              {isApparel && (
                <>
                  <div>
                    <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Colour</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                            color === c ? "border-gold text-gold" : "border-border text-muted-foreground"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Size</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`h-9 w-10 rounded-md border text-xs transition-colors ${
                            size === s ? "border-gold text-gold" : "border-border text-muted-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div>
                <label htmlFor="personal" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Name or short message
                </label>
                <input
                  id="personal"
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                  maxLength={40}
                  placeholder="e.g. Nora"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button type="button" className="px-4 py-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button type="button" className="px-4 py-2" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              className="rounded-full bg-primary px-8 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Add to cart
            </button>
            <a
              href={`${CONTACT.whatsappLink}?text=${encodeURIComponent(`Hi Linora Stellar! I have a question about ${product.name}.`)}`}
              className="rounded-full border border-gold px-6 py-3 text-sm uppercase tracking-[0.16em] text-gold"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
