import app from "./app";
import { constant } from "./core";
import { getPoolConnection } from "./database";

(async () => {
  try {
    const pool = getPoolConnection();
    const connection = await pool.getConnection();

    connection.release();

    Bun.serve({
      fetch: app.fetch,
      port: constant.port,
    });

    console.info("Database connection successful");
    console.info("Running in port: " + constant.port);
  } catch (error) {
    console.error("Database connection failed", error);
  }
})();
