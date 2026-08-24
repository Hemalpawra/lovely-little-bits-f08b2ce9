import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const Smoke = lazy(() => import("@/components/blade/BladeSmoke"));

export const Route = createFileRoute("/blade-smoke")({
  component: () => (
    <ClientOnly fallback={<p>Loading…</p>}>
      <Suspense fallback={<p>Loading…</p>}>
        <Smoke />
      </Suspense>
    </ClientOnly>
  ),
});
