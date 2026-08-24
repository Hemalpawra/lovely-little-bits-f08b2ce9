import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ChevronRight,
  CreditCard,
  Heart,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";

import { ProductCard, Stars } from "@/components/store/ProductCard";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import {
  categoryName,
  discountPct,
  formatPrice,
  getProduct,
  relatedProducts,
} from "@/lib/catalog";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product not found — Acme Store" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — Buy Online at ${formatPrice(product.price)} | Acme Store`;
    const description = `${product.name} (${product.subtitle}) at ${formatPrice(product.price)}. 100% original, secure payments and 7-day easy returns at Acme Store.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-12 text-center text-sm">
      {error.message}
    </div>
  ),
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Browse all products
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const off = discountPct(product);
  const related = relatedProducts(product);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16">
        <nav className="flex flex-wrap items-center gap-1.5 py-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to="/products"
            search={{ category: product.category }}
            className="hover:text-primary"
          >
            {categoryName(product.category)}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/30 p-8">
            <img
              src={product.img}
              alt={`${product.name} — ${product.subtitle}`}
              width={800}
              height={800}
              className="mx-auto h-full max-h-[420px] w-full object-contain"
            />
          </div>

          <div>
            {product.badge && (
              <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                {product.badge}
              </span>
            )}
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{product.subtitle}</p>
            <div className="mt-3">
              <Stars rating={product.rating} reviews={product.reviews} />
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.mrp && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
              {off > 0 && <span className="text-sm font-semibold text-sale">{off}% OFF</span>}
            </div>
            <p
              className={`mt-2 flex items-center gap-1.5 text-xs ${
                product.stock === "Low stock" ? "text-warning" : "text-success"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {product.stock}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-primary hover:bg-brand-soft">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
              <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Buy Now
              </button>
              <button
                aria-label="Add to wishlist"
                className="rounded-lg border border-border p-3 text-muted-foreground hover:text-sale"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, text: "100% original product" },
                { icon: CreditCard, text: "Secure payments via Razorpay" },
                { icon: RotateCcw, text: "7 days easy returns" },
                { icon: Truck, text: "Fast pan-India delivery" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-4 w-4 text-foreground" /> {text}
                </li>
              ))}
            </ul>

            <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <ul className="mt-5 space-y-2 text-sm">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {h}
                </li>
              ))}
            </ul>

            <button className="mt-7 flex items-center gap-2 rounded-lg border border-primary/40 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-brand-soft">
              <Sparkles className="h-4 w-4" /> Ask AI about this product
            </button>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight">Specifications</h2>
          <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {product.specs.map((s) => (
              <div key={s.label} className="flex gap-3 bg-card px-4 py-3 text-sm">
                <dt className="w-32 shrink-0 text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold tracking-tight">You may also like</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
