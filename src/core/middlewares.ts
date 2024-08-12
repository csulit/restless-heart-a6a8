import { getAuth } from "@hono/clerk-auth";
import type { Context } from "hono";
import type { BlankEnv, Next } from "hono/types";

export const isAuthenticated = async (
  c: Context<BlankEnv, "*", {}>,
  next: Next
) => {
  const auth = getAuth(c);

  if (!auth?.sessionId) {
    return c.json(
      {
        message: "Unauthorized",
      },
      401
    );
  }

  await next();
};
