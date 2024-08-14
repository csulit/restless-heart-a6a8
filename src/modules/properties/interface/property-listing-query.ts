import { preprocessNumber } from "@/utils/preprocess-number";
import { z } from "zod";

export const PropertyListingQuerySchema = z.object({
  cursor: z
    .preprocess(preprocessNumber, z.number())
    .describe(
      "Cursor (This 'Page' actually use cursor for react-query infinite query to work) number for pagination"
    )
    .optional(),
  pageSize: z
    .preprocess(preprocessNumber, z.number())
    .describe("Number of items per page")
    .optional(),
  listingType: z.string().optional().describe("Type of offer (optional)"),
  propertyType: z.string().optional(),
  sortOrder: z
    .enum(["id", "newest", "price-low-to-high", "price-high-to-low"])
    .optional(),
});

export type PropertyListingQuery = z.infer<typeof PropertyListingQuerySchema>;
