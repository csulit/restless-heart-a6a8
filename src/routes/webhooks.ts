import { Hono } from "hono";
import db from "@/database";
import { property } from "@/database/schema";
import { and, between, sql } from "drizzle-orm";

const app = new Hono();

interface StDistanceSphereArgs {
  minLat: number;
  maxLat: number;
  minLong: number;
  maxLong: number;
  pointOfInterestLat: number;
  pointOfInterestLong: number;
  distanceInMiles: number;
}

const stDistanceSphere = async ({
  minLat,
  maxLat,
  minLong,
  maxLong,
  pointOfInterestLat,
  pointOfInterestLong,
  distanceInMiles,
}: StDistanceSphereArgs) => {
  return await db
    .select({
      id: property.id,
      latitude: property.latitude,
      longitude: property.longitude,
      primaryImageUrl: property.primaryImageUrl,
      jsonData: sql`JSON_EXTRACT(${property.jsonData}, '$.title')`,
    })
    .from(property)
    .where(
      and(
        between(property.latitude, minLat, maxLat),
        between(property.longitude, minLong, maxLong),
        sql`ST_distance_sphere(
          point(${pointOfInterestLong}, ${pointOfInterestLat}), 
          point(${property.longitude}, ${property.latitude})
        ) * 0.000621371192 < ${distanceInMiles}`
      )
    )
    .limit(100);
};

app.get("/properties/map-search", async (c) => {
  const query = c.req.query() as unknown as StDistanceSphereArgs;
  const properties = await stDistanceSphere(query);
  return c.json({ properties });
});

app.post("/properties", async (c) => {
  const data = await c.req.json();

  const create = await db.insert(property).values({
    latitude: data.latitude,
    longitude: data.longitude,
    primaryImageUrl: data.primaryImageUrl,
    jsonData: data.jsonData,
  });

  return c.json({ message: "Hello webhooks", created: create });
});

export default app;
