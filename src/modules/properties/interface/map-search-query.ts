import { z } from "zod";

export const MapSearchQuerySchema = z
  .object({
    minLat: z.number().describe("Minimum latitude for the search area"),
    maxLat: z.number().describe("Maximum latitude for the search area"),
    minLong: z.number().describe("Minimum longitude for the search area"),
    maxLong: z.number().describe("Maximum longitude for the search area"),
    pointOfInterestLat: z
      .number()
      .describe("Latitude of the point of interest"),
    pointOfInterestLong: z
      .number()
      .describe("Longitude of the point of interest"),
    distanceInKilometers: z.number().describe("Search radius in kilometers"),
    offerType: z.string().optional().describe("Type of offer (optional)"),
    cursor: z.number().optional().describe("Cursor for pagination (optional)"),
    prevCursor: z
      .number()
      .optional()
      .describe("Previous cursor for pagination (optional)"),
  })
  .refine(
    (data) => data.cursor === undefined || data.prevCursor === undefined,
    {
      message: "Both cursor and prevCursor cannot be defined at the same time",
      path: ["cursor", "prevCursor"],
    }
  );

export type MapSearchQuery = z.infer<typeof MapSearchQuerySchema>;
