import { Facebook, Instagram, Twitter, Youtube, Lock } from "lucide-react";

import { Logo } from "./SiteHeader";

const footerCols = [
  {
    title: "Shop",
    links: ["All Products", "Laptops", "Mobile", "Accessories", "Audio", "Deals"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(1,0.8fr)_1.2fr]">
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
  );
}
