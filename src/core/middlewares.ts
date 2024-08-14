import type { Context } from "hono";
import { getAuth } from "@hono/clerk-auth";
import type { BlankEnv, Next } from "hono/types";
import { jsonResponse } from "./json-response";

export const isAuthenticated = async (
  c: Context<BlankEnv, "*", {}>,
  next: Next
) => {
  const auth = getAuth(c);

  if (!auth?.sessionId) {
    return c.json(
      jsonResponse({
        status: "error",
        message: "Unauthorized",
      }),
      401
    );
  }

  await next();
};
