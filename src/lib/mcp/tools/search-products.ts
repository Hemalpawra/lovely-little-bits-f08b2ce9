import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { brands, categories, products } from "@/lib/catalog";

const serialize = (p: (typeof products)[number]) => ({
  slug: p.slug,
  name: p.name,
  subtitle: p.subtitle,
  brand: p.brand,
  category: p.category,
  price: p.price,
  mrp: p.mrp ?? null,
  rating: p.rating,
  reviews: p.reviews,
  stock: p.stock,
  badge: p.badge ?? null,
});

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Search the Acme Store catalog by keyword, category, brand, price range or stock status. Returns matching products with prices in INR.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free-text search over name, subtitle and brand."),
    category: z
      .string()
      .optional()
      .describe(`Category slug. One of: ${categories.map((c) => c.slug).join(", ")}`),
    brand: z.string().optional().describe(`Brand name. One of: ${brands.join(", ")}`),
    maxPrice: z.number().positive().optional().describe("Maximum price in INR."),
    minPrice: z.number().nonnegative().optional().describe("Minimum price in INR."),
    inStockOnly: z.boolean().optional().describe("Only return products that are in stock."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, brand, maxPrice, minPrice, inStockOnly, limit }) => {
    const q = query?.toLowerCase();
    const results = products
      .filter((p) => {
        if (q && !`${p.name} ${p.subtitle} ${p.brand}`.toLowerCase().includes(q)) return false;
        if (category && p.category !== category) return false;
        if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) return false;
        if (typeof maxPrice === "number" && p.price > maxPrice) return false;
        if (typeof minPrice === "number" && p.price < minPrice) return false;
        if (inStockOnly && p.stock !== "In stock") return false;
        return true;
      })
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit ?? 10)
      .map(serialize);

    return {
      content: [
        {
          type: "text" as const,
          text: results.length
            ? results
                .map((r) => `${r.name} (${r.slug}) — ₹${r.price.toLocaleString("en-IN")} — ${r.brand} — ${r.stock}`)
                .join("\n")
            : "No products matched those filters.",
        },
      ],
      structuredContent: { count: results.length, products: results },
    };
  },
});
