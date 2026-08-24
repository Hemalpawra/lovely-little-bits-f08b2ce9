import { createFileRoute, Link } from "@tanstack/react-router";
import {
  RotateCcw,
  Sparkles,
  Star,
  ArrowRight,
  CheckCircle2,
  Wallet,
  CreditCard,
  Headphones,
  Truck as TruckIcon,
  Search as SearchIcon,
  MessageSquare,
} from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import hero from "@/assets/hero-tech.jpg";
import { categories, formatPrice, products, type ProductSearch } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acme Store — Electronics, Laptops & Smart Accessories Online" },
      {
        name: "description",
        content:
          "Shop laptops, headphones, smartphones and wearables at Acme Store. 100% original products, secure payments, easy 7-day returns and pan-India delivery.",
      },
      { property: "og:title", content: "Acme Store — Electronics & Smart Accessories" },
      {
        property: "og:description",
        content:
          "Handpicked electronics, laptops, audio and wearables with secure payments and easy returns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const featured = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

const trustItems = [
  { icon: CreditCard, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: TruckIcon, title: "Fast Delivery", sub: "Pan India Delivery" },
  { icon: RotateCcw, title: "7 Day Returns", sub: "Hassle-free returns" },
  { icon: Headphones, title: "24/7 Support", sub: "We're here to help" },
  { icon: SearchIcon, title: "Order Tracking", sub: "Track your orders" },
];

function SectionHeader({
  title,
  action,
  search,
}: {
  title: string;
  action: string;
  search?: ProductSearch;
}) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      <Link
        to="/products"
        search={search ?? {}}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {action} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16">
        {/* Hero */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-brand-soft">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div className="px-6 py-10 sm:px-10">
              <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                New Arrival
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
                Technology that
                <br />
                <span className="text-primary">moves</span> with you
              </h1>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                Explore the latest electronics, smart accessories and more. Handpicked for you.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" /> Ask AI Assistant
                </button>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> 100% Original Products
                </li>
                <li className="flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" /> Secure Payments
                </li>
                <li className="flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4" /> Easy Returns
                </li>
              </ul>
            </div>
            <img
              src={hero}
              alt="Laptop, headphones, smartwatch and wireless earbuds on a display pedestal"
              width={1200}
              height={912}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="mt-12">
          <SectionHeader title="Shop by Category" action="View all categories" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/products"
                search={{ category: c.slug }}
                className="rounded-xl border border-border bg-card p-3 text-center transition-shadow hover:shadow-md"
              >
                <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-muted/60">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    width={600}
                    height={600}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {products.filter((p) => p.category === c.slug).length} products
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="mt-12">
          <SectionHeader title="Featured Products" action="View all products" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* AI assistant band */}
        <section className="mt-12 grid items-center gap-8 rounded-2xl bg-brand-soft px-6 py-9 lg:grid-cols-[1.4fr_1fr_auto] sm:px-10">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> Shopping made smarter with AI
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">
              Ask anything. Get the right answer.
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Our AI assistant can help you find the perfect product, compare options and make
              confident decisions.
            </p>
          </div>
          <ul className="space-y-2.5">
            {[
              "I need a laptop under ₹60,000",
              "Which headphones are best for travel?",
              "Compare iPhone 15 and Samsung S24",
            ].map((q) => (
              <li key={q}>
                <button className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-left text-xs font-medium hover:border-primary">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" /> {q}
                </button>
              </li>
            ))}
          </ul>
          <div className="text-center">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
              <Sparkles className="h-4 w-4" /> Ask AI Assistant
            </button>
            <p className="mt-2 text-[11px] text-muted-foreground">Powered by Merchant AI Gateway</p>
          </div>
        </section>

        {/* Trust strip */}
        <section className="mt-8 grid divide-y divide-border rounded-2xl border border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x">
          {trustItems.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 px-5 py-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-foreground" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-xs text-muted-foreground">{sub}</span>
              </span>
            </div>
          ))}
        </section>

        {/* Best sellers */}
        <section className="mt-12">
          <SectionHeader
            title="Best Sellers"
            action="View all best sellers"
            search={{ sort: "rating" }}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {bestSellers.map((b, i) => (
              <Link
                key={b.slug}
                to="/products/$slug"
                params={{ slug: b.slug }}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 hover:shadow-md"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <img
                  src={b.img}
                  alt={b.name}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="h-11 w-11 shrink-0 rounded-lg object-contain"
                />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">{b.name}</span>
                  <span className="mt-1 flex items-center gap-2 text-xs">
                    <span className="font-bold">{formatPrice(b.price)}</span>
                    <span className="flex items-center gap-0.5 text-muted-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      {b.rating.toFixed(1)}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />

      <button className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90">
        <MessageSquare className="h-4 w-4" /> Ask AI
      </button>
    </div>
  );
}
