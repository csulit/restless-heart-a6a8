import { Hono } from "hono";
import { logger } from "hono/logger";
import { sentry, type Options as SentryOptions } from "@hono/sentry";

import properties from "@/modules/properties/routes";

const SENTRY_OPTIONS: SentryOptions = {
  dsn: Bun.env["SENTRY_DSN"],
  tracesSampleRate: 1.0,
};

const app = new Hono().basePath("/api");
app.use("*", sentry(SENTRY_OPTIONS));
app.use("*", logger());

app.get("/", (c) => c.json({ message: "Hello world" }));

app.route("/properties", properties);

export default app;
