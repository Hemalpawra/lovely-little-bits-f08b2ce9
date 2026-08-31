import { defineMcp } from "@lovable.dev/mcp-js";

type McpTools = Parameters<typeof defineMcp>[0]["tools"];
import searchProductsTool from "./tools/search-products";
import getProductTool from "./tools/get-product";
import listCategoriesTool from "./tools/list-categories";

export default defineMcp({
  name: "warm-welcome",
  title: "Warm Welcome",
  version: "0.1.0",
  instructions:
    "Tools for the Acme Store electronics catalog. Use `list_categories` to discover categories and brands, `search_products` to find products by keyword, category, brand or price, and `get_product` for full details of a single product. All prices are in INR.",
  tools: [listCategoriesTool, searchProductsTool, getProductTool] as unknown as McpTools,
});
