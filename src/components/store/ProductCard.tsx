import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Star } from "lucide-react";

import { discountPct, formatPrice, type Product } from "@/lib/catalog";

export function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      <span>({reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}K` : reviews})</span>
    </span>
  );
}

export function ProductCard({ product, list = false }: { product: Product; list?: boolean }) {
  const off = discountPct(product);

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md ${
        list ? "flex gap-4 p-3" : "flex flex-col"
      }`}
    >
      <div
        className={`relative bg-muted/40 ${
          list ? "h-32 w-32 shrink-0 rounded-lg p-3" : "aspect-square p-4"
        }`}
      >
        {(product.badge || off > 0) && (
          <span
            className={`absolute left-2 top-2 z-10 rounded-md px-2 py-1 text-[10px] font-semibold ${
              off > 0
                ? "bg-sale/10 text-sale"
                : product.badge === "New"
                  ? "bg-primary/10 text-primary"
                  : "bg-success/10 text-success"
            }`}
          >
            {off > 0 ? `${off}% OFF` : product.badge}
          </span>
        )}
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          width={600}
          height={600}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold leading-snug">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="after:absolute after:inset-0 hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">{product.subtitle}</p>
        <Stars rating={product.rating} reviews={product.reviews} />
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-bold">{formatPrice(product.price)}</span>
          {product.mrp && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
          {off > 0 && <span className="text-xs font-semibold text-sale">{off}% OFF</span>}
        </p>
        <p
          className={`flex items-center gap-1.5 text-[11px] ${
            product.stock === "Low stock" ? "text-warning" : "text-success"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {product.stock}
        </p>
        <div className="relative z-10 mt-auto flex gap-2 pt-2">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold text-primary transition-colors hover:bg-brand-soft">
            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
          </button>
          <button className="flex-1 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
            Buy Now
          </button>
        </div>
      </div>
      <button
        aria-label="Add to wishlist"
        className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 text-muted-foreground hover:text-sale"
      >
        <Heart className="h-4 w-4" />
      </button>
    </article>
  );
}
