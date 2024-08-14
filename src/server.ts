import app from "./app";
import { constant } from "./core";
import { getPoolConnection } from "./database";

(async () => {
  try {
    const pool = getPoolConnection();
    const connection = await pool.getConnection();

    if (connection) {
      console.info("Database connection release ✅");
      connection.release();
    }

    Bun.serve({
      fetch: app.fetch,
      port: constant.port,
    });

    console.info("Database test connection successful ✅");
    console.info("Bun hono.js API running in port: " + constant.port + " 🚀");
  } catch (error) {
    console.error("Database test connection failed 🚨", error);
  }
})();
