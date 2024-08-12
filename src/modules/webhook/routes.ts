import { Hono } from "hono";
import db from "@/database";

const app = new Hono();

app.get("/", async (c) => {
  return c.json({});
});

app.post("/", async (c) => {
  return c.json({});
});

export default app;
