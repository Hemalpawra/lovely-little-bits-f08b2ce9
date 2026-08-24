import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { SiteHeader } from "@/components/store/SiteHeader";

const CheckoutBlade = lazy(() => import("@/components/blade/CheckoutBlade"));

const title = "Checkout — Delivery & Shipping | Acme Store";
const description =
  "Choose your delivery address and shipping method, then pay securely with Razorpay at Acme Store.";

export const Route = createFileRoute("/checkout")({
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
  component: CheckoutPage,
});

function CheckoutPage() {
  const fallback = (
    <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">
      Loading checkout…
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <ClientOnly fallback={fallback}>
          <Suspense fallback={fallback}>
            <CheckoutBlade />
          </Suspense>
        </ClientOnly>
      </main>
    </div>
  );
}
