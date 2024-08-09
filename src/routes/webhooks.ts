import { Hono } from "hono";
import db from "@/database";
import { property } from "@/database/schema";
import { and, between, desc, gt, lt, sql } from "drizzle-orm";

const app = new Hono();

interface StDistanceSphereArgs {
  minLat: number;
  maxLat: number;
  minLong: number;
  maxLong: number;
  pointOfInterestLat: number;
  pointOfInterestLong: number;
  distanceInMiles: number;
  cursor?: number; // Optional cursor parameter
  prevCursor?: number; // Optional prevCursor parameter
}

const stDistanceSphere = async ({
  minLat,
  maxLat,
  minLong,
  maxLong,
  pointOfInterestLat,
  pointOfInterestLong,
  distanceInMiles,
  cursor,
  prevCursor,
}: StDistanceSphereArgs) => {
  if (cursor && prevCursor) {
    return "Invalid cursor";
  }

  const query = db
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
        ) * 0.000621371192 <= ${distanceInMiles}`,
        cursor ? gt(property.id, cursor) : undefined,
        prevCursor ? lt(property.id, prevCursor) : undefined
      )
    );

  const results = await query.orderBy(property.id).limit(100);

  const prevId = cursor
    ? await db
        .select({ id: property.id })
        .from(property)
        .where(lt(property.id, cursor))
        .orderBy(desc(property.id))
        .limit(1)
        .then((rows) => rows[0]?.id || null)
    : null;

  const nextId =
    results.length === 100
      ? await db
          .select({ id: property.id })
          .from(property)
          .where(gt(property.id, results[results.length - 1].id))
          .orderBy(property.id)
          .limit(1)
          .then((rows) => rows[0]?.id || null)
      : null;

  const prevCursorValue = results.length > 0 && prevId ? results[0].id : null;

  return {
    results,
    prevId,
    nextId,
    prevCursor: prevCursorValue,
  };
};

app.get("/properties/map-search", async (c) => {
  const query = c.req.query() as unknown as StDistanceSphereArgs;

  const properties = await stDistanceSphere(query);
  if (properties === "Invalid cursor") {
    return c.json({ message: "Invalid cursor" }, 400);
  }

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
