import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProduct, relatedProducts } from "@/lib/catalog";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Get full details for one Acme Store product by its slug: price, discount, rating, stock, description, highlights, specifications and related products.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Product slug, e.g. from search_products."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const product = getProduct(slug);
    if (!product) throw new ToolError(`No product found with slug "${slug}".`);

    const detail = {
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      brand: product.brand,
      category: product.category,
      price: product.price,
      mrp: product.mrp ?? null,
      rating: product.rating,
      reviews: product.reviews,
      stock: product.stock,
      description: product.description,
      highlights: product.highlights,
      specs: product.specs,
      related: relatedProducts(product).map((r) => ({ slug: r.slug, name: r.name, price: r.price })),
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(detail, null, 2) }],
      structuredContent: { product: detail },
    };
  },
});
