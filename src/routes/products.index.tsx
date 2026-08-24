import { useAiChat } from "@/components/blade/AiChatProvider";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Grid2X2,
  List,
  Search,
  Sparkles,
  X,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Truck,
  Headphones,
} from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/store/ProductCard";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";
import {
  brands,
  categories,
  categoryName,
  filterProducts,
  formatPrice,
  type ProductSearch,
} from "@/lib/catalog";

const MAX_PRICE = 100000;
const PER_PAGE = 8;

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    brands: Array.isArray(search["brands"]) ? search["brands"].map(String) : undefined,
    maxPrice: search["maxPrice"] !== undefined ? Number(search["maxPrice"]) || undefined : undefined,
    inStock: search["inStock"] === true || search["inStock"] === "true" ? true : undefined,
    onSale: search["onSale"] === true || search["onSale"] === "true" ? true : undefined,
    minRating:
      search["minRating"] !== undefined ? Number(search["minRating"]) || undefined : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
    view: search["view"] === "list" ? "list" : undefined,
    page: search["page"] !== undefined ? Number(search["page"]) || 1 : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All Products — Acme Store Electronics Catalog" },
      {
        name: "description",
        content:
          "Browse the full Acme Store catalog: headphones, laptops, smartphones, wearables, speakers and accessories. Filter by category, brand, price and rating.",
      },
      { property: "og:title", content: "Shop All Products — Acme Store" },
      {
        property: "og:description",
        content: "Filter and compare electronics by category, brand, price and rating.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" },
];

const assurances = [
  { icon: ShieldCheck, title: "100% Original Products", sub: "Sourced directly from brands" },
  { icon: CreditCard, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: RotateCcw, title: "Easy Returns", sub: "7 days easy returns" },
  { icon: Truck, title: "Fast Delivery", sub: "Quick and reliable delivery" },
  { icon: Headphones, title: "Customer Support", sub: "24/7 customer support" },
];

function ProductsPage() {
  const { openChat } = useAiChat();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [priceInput, setPriceInput] = useState(String(search.maxPrice ?? MAX_PRICE));

  const q = search.q ?? "";
  const category = search.category ?? "";
  const selectedBrands = search.brands ?? [];
  const maxPrice = search.maxPrice ?? MAX_PRICE;
  const inStock = search.inStock ?? false;
  const onSale = search.onSale ?? false;
  const minRating = search.minRating ?? 0;
  const sort = search.sort ?? "popularity";
  const view = search.view ?? "grid";
  const page = Math.max(1, search.page ?? 1);

  const go = (next: ProductSearch) => navigate({ to: "/products", search: next });
  const setSearch = (patch: ProductSearch) => go({ ...search, page: 1, ...patch });

  const results = filterProducts({
    q,
    category,
    brands: selectedBrands,
    maxPrice,
    inStock,
    onSale,
    minRating,
    sort,
  });

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const chips: { label: string; clear: ProductSearch }[] = [
    ...(q ? [{ label: `"${q}"`, clear: { q: undefined } }] : []),
    ...(category ? [{ label: categoryName(category), clear: { category: undefined } }] : []),
    ...selectedBrands.map((b) => ({
      label: b,
      clear: { brands: selectedBrands.filter((x) => x !== b) },
    })),
    ...(inStock ? [{ label: "In Stock", clear: { inStock: undefined } }] : []),
    ...(onSale ? [{ label: "On Sale", clear: { onSale: undefined } }] : []),
    ...(minRating ? [{ label: `${minRating}★ & above`, clear: { minRating: undefined } }] : []),
    ...(maxPrice < MAX_PRICE
      ? [{ label: `Under ${formatPrice(maxPrice)}`, clear: { maxPrice: undefined } }]
      : []),
  ];

  const clearAll = () => {
    setPriceInput(String(MAX_PRICE));
    go({});
  };


  const toggleBrand = (brand: string) =>
    setSearch({
      brands: selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand],
    });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader initialQuery={q} />

      <main className="mx-auto max-w-7xl px-4 pb-16">
        <nav className="flex items-center gap-1.5 py-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          {category && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{categoryName(category)}</span>
            </>
          )}
        </nav>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_280px]">
          {/* Filters */}
          <aside className="h-max rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Filters</h2>
              <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
                Clear all
              </button>
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-semibold">Category</h3>
              <select
                value={category}
                onChange={(e) => setSearch({ category: e.target.value || undefined })}
                aria-label="Filter by category"
                className="mt-2 h-9 w-full rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-semibold">Price Range</h3>
              <input
                type="range"
                min={499}
                max={MAX_PRICE}
                step={500}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                onMouseUp={() => setSearch({ maxPrice: Number(priceInput) })}
                onTouchEnd={() => setSearch({ maxPrice: Number(priceInput) })}
                onKeyUp={() => setSearch({ maxPrice: Number(priceInput) })}
                aria-label="Maximum price"
                className="mt-3 w-full accent-primary"
              />
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="flex-1 rounded-md border border-border px-2 py-1.5">₹499</span>
                <span className="text-muted-foreground">–</span>
                <span className="flex-1 rounded-md border border-border px-2 py-1.5">
                  {formatPrice(Number(priceInput))}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-semibold">Brand</h3>
              <ul className="mt-2 space-y-2 text-xs">
                {brands.map((b) => (
                  <li key={b}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleBrand(b)}
                        className="h-3.5 w-3.5 accent-primary"
                      />
                      {b}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-semibold">Customer Rating</h3>
              <ul className="mt-2 space-y-2 text-xs">
                {[4.5, 4, 3.5].map((r) => (
                  <li key={r}>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r}
                        onChange={() => setSearch({ minRating: r })}
                        className="h-3.5 w-3.5 accent-primary"
                      />
                      {r}★ &amp; above
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-semibold">Availability &amp; Offers</h3>
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setSearch({ inStock: e.target.checked || undefined })}
                  className="h-3.5 w-3.5 accent-primary"
                />
                In Stock
              </label>
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => setSearch({ onSale: e.target.checked || undefined })}
                  className="h-3.5 w-3.5 accent-primary"
                />
                On Sale
              </label>
            </div>

            <button
              onClick={clearAll}
              className="mt-6 w-full rounded-lg border border-primary/40 py-2.5 text-xs font-semibold text-primary hover:bg-brand-soft"
            >
              Clear all filters
            </button>
          </aside>

          {/* Results */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {category ? categoryName(category) : q ? `Results for "${q}"` : "All Products"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  High-quality tech for every moment.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {results.length === 0
                  ? "No products found"
                  : `Showing ${(current - 1) * PER_PAGE + 1} – ${Math.min(current * PER_PAGE, results.length)} of ${results.length} products`}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setSearch(c.clear)}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                >
                  {c.label} <X className="h-3 w-3 text-muted-foreground" />
                </button>
              ))}
              {chips.length > 0 && (
                <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
                  Clear all
                </button>
              )}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort by:</span>
                <select
                  value={sort}
                  aria-label="Sort products"
                  onChange={(e) => setSearch({ sort: e.target.value })}
                  className="h-9 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-primary"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  aria-label="Grid view"
                  onClick={() => setSearch({ view: undefined })}
                  className={`rounded-lg border p-2 ${view === "grid" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {pageItems.length === 0 ? (
              <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center">
                <Search className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">No products match your filters</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try removing a filter or searching for something else.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div
                className={`mt-5 grid gap-4 ${view === "list" ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3"}`}
              >
                {pageItems.map((product) => (
                  <ProductCard key={product.slug} product={product} list={view === "list"} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => go({ ...search, page: n })}
                    aria-current={n === current ? "page" : undefined}
                    className={`h-9 w-9 rounded-lg border text-xs font-semibold ${
                      n === current
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => go({ ...search, page: Math.min(totalPages, current + 1) })}
                  aria-label="Next page"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:border-primary"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </nav>
            )}
          </section>

          {/* AI + assurance rail */}
          <aside className="hidden h-max space-y-4 xl:block">
            <div className="rounded-xl border border-border p-4">
              <p className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="h-4 w-4 text-primary" /> AI Shopping Assistant
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Not sure which product to choose? Our AI assistant can help you find the perfect one.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "I need wireless headphones under ₹5,000",
                  "Compare these headphones",
                  "Which laptop is best for office?",
                ].map((s) => (
                  <li key={s}>
                    <button className="w-full rounded-lg border border-border px-3 py-2 text-left text-xs font-medium text-primary hover:bg-brand-soft">
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => openChat()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
                <Sparkles className="h-4 w-4" /> Ask AI Assistant
              </button>
            </div>
            <div className="space-y-4 rounded-xl border border-border p-4">
              {assurances.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>
                    <span className="block text-xs font-semibold">{title}</span>
                    <span className="block text-[11px] text-muted-foreground">{sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
