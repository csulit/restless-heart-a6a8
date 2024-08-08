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
  lat: number;
  long: number;
  distanceInMiles: number;
}

const stDistanceSphere = async ({
  minLat,
  maxLat,
  minLong,
  maxLong,
  lat,
  long,
  distanceInMiles,
}: StDistanceSphereArgs) => {
  return await db
    .select()
    .from(property)
    .where(
      and(
        between(property.latitude, minLat, maxLat),
        between(property.longitude, minLong, maxLong),
        sql`ST_distance_sphere(
          point(${long}, ${lat}), 
          point(${property.longitude}, ${property.latitude})
        ) * 0.000621371192 < ${distanceInMiles}`
      )
    )
    .limit(100);
};

app.get("/", async (c) => {
  const testArgs: StDistanceSphereArgs = {
    minLat: 34.0,
    maxLat: 36.0,
    minLong: -118.0,
    maxLong: -116.0,
    lat: 34.052235,
    long: -118.243683,
    distanceInMiles: 10,
  };
  const properties = await stDistanceSphere(testArgs);
  return c.json({ message: "Hello webhooks", properties });
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
