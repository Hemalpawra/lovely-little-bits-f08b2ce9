import { createFileRoute } from "@tanstack/react-router";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  ChevronDown,
  Search,
  LayoutGrid,
  Package,
  Sparkles,
  ShoppingCart,
  User,
  Star,
  ArrowRight,
  CheckCircle2,
  Wallet,
  CreditCard,
  Headphones,
  Truck as TruckIcon,
  Search as SearchIcon,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Lock,
} from "lucide-react";

import hero from "@/assets/hero-tech.jpg";
import pEarbuds from "@/assets/p-earbuds.jpg";
import pLaptop from "@/assets/p-laptop.jpg";
import pHeadphones from "@/assets/p-headphones.jpg";
import pPhone from "@/assets/p-phone.jpg";
import pWatch from "@/assets/p-watch.jpg";
import pSpeaker from "@/assets/p-speaker.jpg";

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

const navLinks = [
  "Electronics",
  "Laptops",
  "Audio",
  "Accessories",
  "Mobile",
  "Gaming",
  "Office",
  "Wearables",
];

const categories = [
  { name: "Electronics", count: "120+ products", img: pLaptop },
  { name: "Laptops", count: "85+ products", img: pLaptop },
  { name: "Audio", count: "60+ products", img: pHeadphones },
  { name: "Accessories", count: "200+ products", img: pEarbuds },
  { name: "Gaming", count: "70+ products", img: pSpeaker },
  { name: "Mobile", count: "95+ products", img: pPhone },
  { name: "Office", count: "45+ products", img: pWatch },
  { name: "Wearables", count: "50+ products", img: pWatch },
];

type Product = {
  name: string;
  img: string;
  price: string;
  mrp?: string;
  rating: string;
  reviews: string;
  badge?: { label: string; tone: "new" | "best" | "sale" };
  stock: "In stock" | "Low stock";
};

const products: Product[] = [
  {
    name: "Apple AirPods Pro (2nd Gen)",
    img: pEarbuds,
    price: "₹24,900",
    rating: "4.6",
    reviews: "(2.1K)",
    badge: { label: "Bestseller", tone: "best" },
    stock: "In stock",
  },
  {
    name: "MacBook Air M2 (13-inch)",
    img: pLaptop,
    price: "₹89,900",
    mrp: "₹99,900",
    rating: "4.7",
    reviews: "(1.2K)",
    badge: { label: "10% OFF", tone: "sale" },
    stock: "In stock",
  },
  {
    name: "Sony WH-1000XM5",
    img: pHeadphones,
    price: "₹29,990",
    rating: "4.5",
    reviews: "(880)",
    badge: { label: "New", tone: "new" },
    stock: "In stock",
  },
  {
    name: "iPhone 15 (128GB)",
    img: pPhone,
    price: "₹69,900",
    rating: "4.7",
    reviews: "(3.2K)",
    badge: { label: "Bestseller", tone: "best" },
    stock: "Low stock",
  },
  {
    name: "boAt Wave Prime 47",
    img: pWatch,
    price: "₹2,199",
    mrp: "₹2,599",
    rating: "4.4",
    reviews: "(3.1K)",
    badge: { label: "15% OFF", tone: "sale" },
    stock: "In stock",
  },
  {
    name: "JBL Flip 6 Bluetooth Speaker",
    img: pSpeaker,
    price: "₹9,999",
    rating: "4.6",
    reviews: "(870)",
    stock: "In stock",
  },
];

const bestSellers = [
  { rank: 1, name: "Apple AirPods Pro (2nd Gen)", price: "₹24,900", rating: "4.6", img: pEarbuds },
  { rank: 2, name: "boAt Rockerz 450", price: "₹1,599", rating: "4.4", img: pHeadphones },
  { rank: 3, name: "Samsung Galaxy S24", price: "₹59,999", rating: "4.6", img: pPhone },
  { rank: 4, name: "Noise ColorFit Pro 5", price: "₹3,499", rating: "4.3", img: pWatch },
  { rank: 5, name: "Dell 15 Laptop", price: "₹45,990", rating: "4.5", img: pLaptop },
];

const trustItems = [
  { icon: CreditCard, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: TruckIcon, title: "Fast Delivery", sub: "Pan India Delivery" },
  { icon: RotateCcw, title: "7 Day Returns", sub: "Hassle-free returns" },
  { icon: Headphones, title: "24/7 Support", sub: "We're here to help" },
  { icon: SearchIcon, title: "Order Tracking", sub: "Track your orders" },
];

const footerCols = [
  {
    title: "Shop",
    links: ["All Products", "Laptops", "Mobile", "Accessories", "Audio", "Deals"],
  },
  {
    title: "Help & Support",
    links: [
      "Help Center",
      "Track Order",
      "Returns & Refunds",
      "Shipping Info",
      "FAQ",
      "Contact Us",
    ],
  },
  {
    title: "Policies",
    links: [
      "Terms & Conditions",
      "Privacy Policy",
      "Cancellation Policy",
      "Return Policy",
      "Shipping Policy",
    ],
  },
];

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-primary">
        <span className="block h-3 w-3 skew-x-[-12deg] rounded-[2px] bg-primary-foreground" />
      </span>
      <span className="text-lg font-bold tracking-tight">Acme Store</span>
    </span>
  );
}

function Stars({ rating, reviews }: { rating: string; reviews: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
      <span className="font-medium text-foreground">{rating}</span>
      <span>{reviews}</span>
    </span>
  );
}

function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      <a
        href="#"
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {action} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Announcement bar */}
      <div className="border-b border-border bg-muted/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-1 px-4 py-2.5 text-[11px] text-muted-foreground sm:text-xs">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" /> Free shipping on orders above ₹1,499
          </span>
          <span className="flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> 7 Days easy returns
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure payments powered by Razorpay
          </span>
          <span className="ml-auto hidden items-center gap-1.5 lg:flex">
            <MapPin className="h-3.5 w-3.5" /> Deliver to{" "}
            <span className="font-medium text-foreground">India</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5">
          <Logo />
          <label className="relative ml-2 hidden flex-1 items-center md:flex">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search for products, categories or brands"
              aria-label="Search products"
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-14 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <kbd className="absolute right-3 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </label>
          <nav className="ml-auto hidden items-center gap-5 text-sm font-medium lg:flex">
            <a href="#" className="flex items-center gap-1.5 hover:text-primary">
              <LayoutGrid className="h-4 w-4" /> Categories <ChevronDown className="h-3.5 w-3.5" />
            </a>
            <a href="#" className="flex items-center gap-1.5 hover:text-primary">
              <Package className="h-4 w-4" /> Products
            </a>
          </nav>
          <button className="hidden items-center gap-1.5 rounded-lg border border-primary/40 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-brand-soft sm:flex">
            <Sparkles className="h-4 w-4" /> Ask AI
          </button>
          <button aria-label="Cart" className="relative rounded-lg p-2 hover:bg-muted">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              2
            </span>
          </button>
          <button aria-label="Account" className="rounded-lg p-2 hover:bg-muted">
            <User className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-auto max-w-7xl overflow-x-auto px-4">
          <ul className="flex items-center gap-7 pb-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l}>
                <a href="#" className="whitespace-nowrap hover:text-primary">
                  {l}
                </a>
              </li>
            ))}
            <li>
              <a href="#" className="whitespace-nowrap font-medium text-sale">
                Deals
              </a>
            </li>
          </ul>
        </div>
      </header>

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
                <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </button>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
            {categories.map((c) => (
              <a
                key={c.name}
                href="#"
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
                <p className="mt-0.5 text-[11px] text-muted-foreground">{c.count}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="mt-12">
          <SectionHeader title="Featured Products" action="View all products" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {products.map((p) => (
              <article
                key={p.name}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square bg-muted/40 p-4">
                  {p.badge && (
                    <span
                      className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[10px] font-semibold ${
                        p.badge.tone === "sale"
                          ? "bg-sale/10 text-sale"
                          : p.badge.tone === "new"
                            ? "bg-primary/10 text-primary"
                            : "bg-success/10 text-success"
                      }`}
                    >
                      {p.badge.label}
                    </span>
                  )}
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    width={600}
                    height={600}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <h3 className="text-sm font-semibold leading-snug">{p.name}</h3>
                  <Stars rating={p.rating} reviews={p.reviews} />
                  <p className="flex items-baseline gap-2">
                    <span className="text-base font-bold">{p.price}</span>
                    {p.mrp && (
                      <span className="text-xs text-muted-foreground line-through">{p.mrp}</span>
                    )}
                  </p>
                  <p
                    className={`flex items-center gap-1.5 text-[11px] ${
                      p.stock === "Low stock" ? "text-warning" : "text-success"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {p.stock}
                  </p>
                  <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-semibold text-primary transition-colors hover:bg-brand-soft">
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                  </button>
                </div>
              </article>
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
            <p className="mt-2 text-[11px] text-muted-foreground">
              Powered by Merchant AI Gateway
            </p>
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
          <SectionHeader title="Best Sellers" action="View all best sellers" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {bestSellers.map((b) => (
              <a
                key={b.name}
                href="#"
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 hover:shadow-md"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {b.rank}
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
                    <span className="font-bold">{b.price}</span>
                    <span className="flex items-center gap-0.5 text-muted-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      {b.rating}
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(3,0.8fr)_1.2fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Your trusted destination for the latest electronics and smart accessories.
              </p>
              <div className="mt-5 flex gap-3">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social link"
                    className="grid h-8 w-8 place-items-center rounded-full bg-background text-muted-foreground hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            {footerCols.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-primary">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="text-sm font-semibold">Stay updated</h3>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Subscribe to get special offers, free giveaways and once-in-a-lifetime deals.
              </p>
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
                <button className="rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:opacity-90">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border pt-6 text-[11px] text-muted-foreground">
            <p>© 2026 Acme Store. All rights reserved.</p>
            <div className="ml-auto flex flex-wrap items-center gap-4 font-semibold">
              <span className="italic">Razorpay</span>
              <span>VISA</span>
              <span>Mastercard</span>
              <span>RuPay</span>
              <span>UPI</span>
              <span className="flex items-center gap-1.5 font-normal">
                <Lock className="h-3 w-3" /> 100% Secure Payments
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI button */}
      <button className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90">
        <MessageSquare className="h-4 w-4" /> Ask AI
      </button>
    </div>
  );
}
