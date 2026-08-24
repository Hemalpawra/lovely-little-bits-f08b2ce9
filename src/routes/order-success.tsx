import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { SiteHeader } from "@/components/store/SiteHeader";

const OrderSuccessBlade = lazy(() => import("@/components/blade/OrderSuccessBlade"));

const title = "Payment Successful — Order Confirmed | Acme Store";
const description =
  "Your Acme Store payment is complete. View your order details, download your invoice and follow live order tracking.";

export const Route = createFileRoute("/order-success")({
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
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const fallback = (
    <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">
      Loading your order…
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <ClientOnly fallback={fallback}>
          <Suspense fallback={fallback}>
            <OrderSuccessBlade />
          </Suspense>
        </ClientOnly>
      </main>
    </div>
  );
}
