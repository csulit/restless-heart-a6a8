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
