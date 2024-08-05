import { Hono } from "hono";
import db from "@/database";
import { user } from "@/database/schema";

const app = new Hono();

app.get("/", async (c) => {
  const users = await db.select().from(user);
  return c.json({ message: "Hello webhooks", users });
});

app.post("/properties", async (c) => {
  return c.json({ message: "Hello webhooks" });
});

export default app;

/**
 * select * from addresses
 * where
 *  latitude between <min_lat> and <min_lat>
 * and
 *  longitude between <min_long> and <max_long>
 * and
 *   ST_distance_sphere(
 *     point(<long>, <lat>),
 *     point(longitude, latitude)
 * ) * 0.000621371192 < 10
 *
 * alter table properties add index lat(latitude);
 * alter table properties add index long(longitude);
 */
