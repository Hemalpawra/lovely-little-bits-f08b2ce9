import { useAiChat } from "@/components/blade/AiChatProvider";
import { Link, useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";
import { useState } from "react";

import { categories } from "@/lib/catalog";

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-primary">
        <span className="block h-3 w-3 skew-x-[-12deg] rounded-[2px] bg-primary-foreground" />
      </span>
      <span className="text-lg font-bold tracking-tight">Acme Store</span>
    </span>
  );
}

export function SiteHeader({ initialQuery = "" }: { initialQuery?: string }) {
  const { openChat } = useAiChat();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);

  return (
    <>
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

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5">
          <Link to="/">
            <Logo />
          </Link>
          <form
            className="relative ml-2 hidden flex-1 items-center md:flex"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/products", search: { q: query, page: 1 } });
            }}
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, categories or brands"
              aria-label="Search products"
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-14 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <kbd className="absolute right-3 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </form>
          <nav className="ml-auto hidden items-center gap-5 text-sm font-medium lg:flex">
            <Link to="/products" className="flex items-center gap-1.5 hover:text-primary">
              <LayoutGrid className="h-4 w-4" /> Categories
            </Link>
            <Link to="/products" className="flex items-center gap-1.5 hover:text-primary">
              <Package className="h-4 w-4" /> Products
            </Link>
          </nav>
          <button onClick={() => openChat()} className="hidden items-center gap-1.5 rounded-lg border border-primary/40 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-brand-soft sm:flex">
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
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/products"
                  search={{ category: c.slug, page: 1 }}
                  className="whitespace-nowrap hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/products"
                search={{ onSale: true, page: 1 }}
                className="whitespace-nowrap font-medium text-sale"
              >
                Deals
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
