import { ClientOnly, createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { SiteHeader } from "@/components/store/SiteHeader";
import { formatPrice, getProduct, relatedProducts } from "@/lib/catalog";

const BladeProductDetail = lazy(() => import("@/components/blade/ProductDetailBlade"));


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
    </div>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const related = relatedProducts(product);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <ClientOnly
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">
              Loading {product.name}…
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground">
                Loading {product.name}…
              </div>
            }
          >
            <BladeProductDetail product={product} related={related} />
          </Suspense>
        </ClientOnly>
      </main>
    </div>
  );
}

