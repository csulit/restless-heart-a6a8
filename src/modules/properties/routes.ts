import { Hono } from "hono";
import db from "@/database";
import { property } from "@/database/schema";
import { zValidator } from "@hono/zod-validator";
import { MapSearchQuerySchema } from "./interface/map-search-query";
import { destrucZodIssue } from "@/utils/destruc-zod-issue";
import { stDistanceSphere } from "./services";
import { jsonError } from "@/core";

const app = new Hono();

app.get("/", async (c) => {
  return c.json({});
});

app.post("/", async (c) => {
  const data = await c.req.json();
  const create = await db.insert(property).values({
    latitude: data.latitude,
    longitude: data.longitude,
    primaryImageUrl: data.primaryImageUrl,
    jsonData: data.jsonData,
  });
  return c.json({ message: "Hello webhooks", created: create });
});

app.get(
  "/map-search",
  zValidator("query", MapSearchQuerySchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        jsonError({
          status: "error",
          message: "Invalid query parameters",
          data: destrucZodIssue(result.error.errors),
        }),
        400
      );
    }
  }),
  async (c) => {
    const query = c.req.valid("query");
    const properties = await stDistanceSphere(query);
    return c.json({ properties });
  }
);

app.get("/:id", async (c) => {
  return c.json({});
});

export default app;
