import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { SiteFooter } from "@/components/store/SiteFooter";
import { SiteHeader } from "@/components/store/SiteHeader";

const CartBlade = lazy(() => import("@/components/blade/CartBlade"));

const title = "Your Cart — Review Items & Checkout | Acme Store";
const description =
  "Review the items in your Acme Store cart, update quantities, apply coupons and checkout securely with Razorpay.";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <ClientOnly
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">
              Loading your cart…
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">
                Loading your cart…
              </div>
            }
          >
            <CartBlade />
          </Suspense>
        </ClientOnly>
      </main>
      <SiteFooter />
    </div>
  );
}
