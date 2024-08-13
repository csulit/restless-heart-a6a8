import { preprocessNumber } from "@/utils/preprocess-number";
import { z } from "zod";

export const PropertyListingQuerySchema = z.object({
  page: z
    .preprocess(preprocessNumber, z.number())
    .describe("Page number for pagination")
    .optional(),
  pageSize: z
    .preprocess(preprocessNumber, z.number())
    .describe("Number of items per page")
    .optional(),
  listingType: z.string().optional().describe("Type of offer (optional)"),
  propertyType: z.string().optional(),
});

export type PropertyListingQuery = z.infer<typeof PropertyListingQuerySchema>;
