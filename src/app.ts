import { Hono, type Context, type Next } from "hono";
import { logger } from "hono/logger";
import { sentry, type Options as SentryOptions } from "@hono/sentry";

import properties from "@/modules/properties/routes";
import { jsonResponse } from "./core";

const SENTRY_OPTIONS: SentryOptions = {
  dsn: Bun.env["SENTRY_DSN"],
  tracesSampleRate: 1.0,
};

const app = new Hono().basePath("/api");

const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    c.json({ message: "Internal Server Error" }, 500);
  }
};

app.use("*", sentry(SENTRY_OPTIONS));
app.use("*", errorHandler);
app.use("*", logger());

app.route("/properties", properties);

app.notFound((c) => {
  const notFound = jsonResponse({
    status: "error",
    message: "Route not found",
  });

  return c.json(notFound, 404);
});

export default app;
