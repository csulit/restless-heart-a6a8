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

export const property = mysqlTable(
  "properties",
  {
    id: int("id").primaryKey().autoincrement(),
    longitude: float("longitude").notNull(),
    latitude: float("latitude").notNull(),
    primaryImageUrl: varchar("primary_image_url", { length: 255 }),
    jsonData: json("json").$type<{ foo: string }>(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => ({
    latIndex: index("lat").on(table.latitude),
    longIndex: index("long").on(table.longitude),
  })
);

export type Property = InferSelectModel<typeof property>;
