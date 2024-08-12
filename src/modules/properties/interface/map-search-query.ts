import { z } from "zod";

const preprocessNumber = (value: unknown) => {
  if (typeof value === "string") {
    return parseFloat(value);
  }
  return value;
};

export const MapSearchQuerySchema = z
  .object({
    minLat: z
      .preprocess(preprocessNumber, z.number())
      .describe("Minimum latitude for the search area"),
    maxLat: z
      .preprocess(preprocessNumber, z.number())
      .describe("Maximum latitude for the search area"),
    minLong: z
      .preprocess(preprocessNumber, z.number())
      .describe("Minimum longitude for the search area"),
    maxLong: z
      .preprocess(preprocessNumber, z.number())
      .describe("Maximum longitude for the search area"),
    pointOfInterestLat: z
      .preprocess(preprocessNumber, z.number())
      .describe("Latitude of the point of interest"),
    pointOfInterestLong: z
      .preprocess(preprocessNumber, z.number())
      .describe("Longitude of the point of interest"),
    distanceInKilometers: z
      .preprocess(preprocessNumber, z.number())
      .describe("Search radius in kilometers"),
    offerType: z.string().optional().describe("Type of offer (optional)"),
    cursor: z
      .preprocess(preprocessNumber, z.number().optional())
      .describe("Cursor for pagination (optional)"),
    prevCursor: z
      .preprocess(preprocessNumber, z.number().optional())
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
