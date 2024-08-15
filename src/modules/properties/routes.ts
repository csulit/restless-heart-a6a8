import { Hono } from "hono";
import db from "@/database";
import { property } from "@/database/schema";
import { zValidator } from "@hono/zod-validator";
import { MapSearchQuerySchema } from "./interface/map-search-query";
import { destrucZodIssue } from "@/utils/destruc-zod-issue";
import { propertyListings, propertyMapSearch } from "./services";
import { PropertyListingQuerySchema } from "./interface/property-listing-query";
import { jsonResponse } from "@/core";

const route = new Hono();

route.get(
  "/",
  zValidator("query", PropertyListingQuerySchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        jsonResponse({
          status: "error",
          data: destrucZodIssue(result.error.errors),
          message: "Invalid query parameters",
        }),
        400
      );
    }
  }),
  async (c) => {
    const query = c.req.valid("query");
    const properties = await propertyListings({
      cursor: query.cursor || 1,
      pageSize: query.pageSize || 300,
      listingType: query.listingType,
      propertyType: query.propertyType,
      sortOrder: query.sortOrder || "id",
    });
    return c.json(properties);
  }
);

route.post("/", async (c) => {
  const data = await c.req.json();
  const create = await db.insert(property).values({
    latitude: data.latitude,
    longitude: data.longitude,
    primaryImageUrl: data.primaryImageUrl,
    jsonData: data.jsonData,
  });
  return c.json(
    jsonResponse({
      status: "success",
      data: { id: create[0].insertId },
    })
  );
});

route.get(
  "/map-search",
  zValidator("query", MapSearchQuerySchema, (result, c) => {
    if (result.success === false) {
      return c.json(
        jsonResponse({
          status: "error",
          data: destrucZodIssue(result.error.errors),
          message: "Invalid query parameters",
        }),
        400
      );
    }
  }),
  async (c) => {
    const query = c.req.valid("query");
    const properties = await propertyMapSearch(query);
    return c.json(properties);
  }
);

route.get("/:id", async (c) => {
  return c.json({});
});

export default route;
