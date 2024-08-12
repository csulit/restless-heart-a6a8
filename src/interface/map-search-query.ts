import { z } from "zod";

export const MapSearchQuerySchema = z.object({
  minLat: z.number(),
  maxLat: z.number(),
  minLong: z.number(),
  maxLong: z.number(),
  pointOfInterestLat: z.number(),
  pointOfInterestLong: z.number(),
  distanceInKilometers: z.number(),
  offerType: z.string().optional(),
  cursor: z.number().optional(),
  prevCursor: z.number().optional(),
});

export type MapSearchQuery = z.infer<typeof MapSearchQuerySchema>;
