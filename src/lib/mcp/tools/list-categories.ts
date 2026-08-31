import { defineTool } from "@lovable.dev/mcp-js";
import { brands, categories, products } from "@/lib/catalog";

export default defineTool({
  name: "list_categories",
  title: "List categories and brands",
  description: "List all Acme Store product categories (with product counts) and available brands.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const cats = categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      productCount: products.filter((p) => p.category === c.slug).length,
    }));
    return {
      content: [
        {
          type: "text" as const,
          text: [
            "Categories:",
            ...cats.map((c) => `- ${c.name} (${c.slug}) — ${c.productCount} products`),
            "",
            `Brands: ${brands.join(", ")}`,
          ].join("\n"),
        },
      ],
      structuredContent: { categories: cats, brands },
    };
  },
});
