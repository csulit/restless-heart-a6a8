import { Hono } from "hono";
import db from "@/database";
import { property } from "@/database/schema";
import { zValidator } from "@hono/zod-validator";
import { MapSearchQuerySchema } from "./interface/map-search-query";
import { destrucZodIssue } from "@/utils/destruc-zod-issue";
import { propertyListings, propertyMapSearch } from "./services";
import { jsonError, jsonSuccess } from "@/core";
import { PropertyListingQuerySchema } from "./interface/property-listing-query";

const app = new Hono();

app.get(
  "/",
  zValidator("query", PropertyListingQuerySchema, (result, c) => {
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
    const properties = await propertyListings({
      page: query.page || 1,
      pageSize: query.pageSize || 10,
      listingType: query.listingType,
      propertyType: query.propertyType,
    });
    return c.json({ properties });
  }
);

app.post("/", async (c) => {
  const data = await c.req.json();
  const create = await db.insert(property).values({
    latitude: data.latitude,
    longitude: data.longitude,
    primaryImageUrl: data.primaryImageUrl,
    jsonData: data.jsonData,
  });
  return c.json(
    jsonSuccess({
      status: "success",
      data: { id: create[0].insertId },
    })
  );
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
    const properties = await propertyMapSearch(query);
    return c.json({ properties });
  }
);

app.get("/:id", async (c) => {
  return c.json({});
});

export default app;
