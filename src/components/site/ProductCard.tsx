import { Link } from "@tanstack/react-router";

import { formatPrice } from "@/lib/cart";
import { productImage } from "@/lib/product-images";
import type { Product } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export function ProductCard({ product }: { product: Product }) {
  const { pick, lang } = useI18n();
  const name = pick(product, "name");
  return (
    <Link
      to="/shop/$slug"
      params={{ slug: product.slug }}
      className="card-star group flex flex-col overflow-hidden rounded-xl"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={productImage(product.slug, product.image_url)}
          alt={name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-lg leading-tight">{name}</h3>
        <p className="text-xs text-muted-foreground">{pick(product, "tagline")}</p>
        <p className="mt-auto pt-3 text-sm font-medium text-gold">{formatPrice(product.price, lang)}</p>
      </div>
    </Link>
  );
}
