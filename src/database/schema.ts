import type { InferSelectModel } from "drizzle-orm";
import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  float,
  json,
  index,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export type LamudiDataLayer = {
  agent_id: number;
  agent_name: string;
  attributes: {
    name: string;
    price: number;
    image_url: string;
    land_size: number;
    agent_name: string;
    agency_name: string;
    building_size?: number;
    offer_type: string;
    subcategory: string;
    project_name?: string;
    urlkey_details: string;
    price_formatted: string;
    location_latitude: string;
    location_longitude: string;
    attribute_set_name: string;
  };
  description: {
    characters: number;
    text: string;
    words: number;
  };
  location: {
    area: string;
    city: string;
    region: string;
  };
  title: string;
};

export const listingRegion = mysqlTable("listing_regions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
});

export type ListingRegion = InferSelectModel<typeof listingRegion>;

export const listingCity = mysqlTable("listing_cities", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  regionId: int("region_id")
    .references(() => listingRegion.id)
    .notNull(),
});

export type ListingCity = InferSelectModel<typeof listingCity>;

export const listingArea = mysqlTable("listing_areas", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  cityId: int("city_id")
    .references(() => listingCity.id)
    .notNull(),
});

export type ListingArea = InferSelectModel<typeof listingArea>;

export const property = mysqlTable(
  "properties",
  {
    id: int("id").primaryKey().autoincrement(),
    longitude: float("longitude").notNull(),
    latitude: float("latitude").notNull(),
    primaryImageUrl: varchar("primary_image_url", { length: 255 }),
    buildingSize: float("building_size").default(0.0),
    landSize: float("land_size").default(0.0),
    yearBuilt: int("year_built"),
    price: decimal("price", { scale: 2, precision: 13 }).default("0.00"),
    jsonData: json("json").$type<LamudiDataLayer>(),
    migrated: boolean("migrated").default(false),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => ({
    latIndex: index("lat").on(table.latitude),
    longIndex: index("long").on(table.longitude),
  })
);

export type Property = InferSelectModel<typeof property>;
