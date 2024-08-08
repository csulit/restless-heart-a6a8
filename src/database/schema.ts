import type { InferSelectModel } from "drizzle-orm";
import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  float,
  json,
  index,
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

export const property = mysqlTable(
  "properties",
  {
    id: int("id").primaryKey().autoincrement(),
    longitude: float("longitude").notNull(),
    latitude: float("latitude").notNull(),
    primaryImageUrl: varchar("primary_image_url", { length: 255 }),
    jsonData: json("json").$type<LamudiDataLayer>(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => ({
    latIndex: index("lat").on(table.latitude),
    longIndex: index("long").on(table.longitude),
  })
);

export type Property = InferSelectModel<typeof property>;
